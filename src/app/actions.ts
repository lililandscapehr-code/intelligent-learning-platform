"use server";

import { query, getDbPool } from "../core/db/connection";
import { registerCurriculum, registerPackageVersion } from "../core/services/registry";
import { approveContentDraft, publishContentEntry, registerContentDraft } from "../core/services/content-registry";
import { comparePassword, getCurrentUser, requireRole, SESSION_COOKIE, signToken } from "../core/services/auth";
import { cookies } from "next/headers";
import {
  getDiagnosticAttempt,
  getDiagnosticRevision,
  startDiagnostic as startDiagnosticAttempt,
  submitDiagnosticResponse as submitDiagnosticResponseRecord,
} from "../features/diagnostic/diagnostic-service";
import type { ResponsePayload } from "../contracts/assessment";
import { resolveQuestionVersion } from "../features/diagnostic/question-resolution";

export interface ServerActionResponse<T = any> {
  success: boolean;
  errors: string[];
  data?: T;
}

export async function login(email: string, password: string): Promise<ServerActionResponse<{ role: string }>> {
  try {
    const users = await query<any[]>("SELECT id, email, password_hash, role FROM users WHERE email = ? LIMIT 1", [email.trim().toLowerCase()]);
    const user = users[0];
    if (!user || !(await comparePassword(password, user.password_hash))) {
      return { success: false, errors: ["Invalid email or password."] };
    }

    const token = await signToken({ userId: user.id, email: user.email, role: user.role });
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 2,
      path: "/"
    });
    return { success: true, errors: [], data: { role: user.role } };
  } catch (error: any) {
    return { success: false, errors: [error.message || "Login failed."] };
  }
}

export async function logout(): Promise<ServerActionResponse> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  return { success: true, errors: [] };
}

export async function getSession(): Promise<ServerActionResponse<{ userId: string; email: string; role: string }>> {
  const user = await getCurrentUser();
  return user
    ? { success: true, errors: [], data: user }
    : { success: false, errors: ["AUTHORIZATION_REQUIRED"] };
}

export async function fetchTeacherDashboard(): Promise<ServerActionResponse<any>> {
  try {
    const teacher = await requireRole(["TEACHER", "ADMIN"]);
    const classes = await query<any[]>(
      "SELECT id, name, curriculum_id AS curriculumId FROM classes WHERE teacher_id = ? ORDER BY name",
      [teacher.userId]
    );
    const classIds = classes.map((classItem) => classItem.id);
    const students = classIds.length === 0
      ? []
      : await query<any[]>(
        `SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) AS name, c.name AS className
         FROM class_enrollments ce
         INNER JOIN users u ON u.id = ce.student_id
         INNER JOIN classes c ON c.id = ce.class_id
         WHERE ce.class_id IN (${classIds.map(() => "?").join(",")})
         ORDER BY u.last_name, u.first_name`,
        classIds
      );
    const assignments = classIds.length === 0
      ? []
      : await query<any[]>(
        `SELECT a.id, a.title, c.name AS className, a.due_at AS dueAt, a.status
         FROM assignments a INNER JOIN classes c ON c.id = a.class_id
         WHERE a.class_id IN (${classIds.map(() => "?").join(",")})
         ORDER BY a.due_at IS NULL, a.due_at`,
        classIds
      );
    const parentRows = classIds.length === 0
      ? []
      : await query<any[]>(
        `SELECT COUNT(DISTINCT psl.parent_id) AS parentCount
         FROM parent_student_links psl
         INNER JOIN class_enrollments ce ON ce.student_id = psl.student_id
         WHERE ce.class_id IN (${classIds.map(() => "?").join(",")})`,
        classIds
      );

    return {
      success: true,
      errors: [],
      data: {
        classes,
        students: students.map((student) => ({ ...student, progress: 0, stage: "Not assessed", lastActive: "Not available", gap: "Not assessed", status: "ON_TRACK" })),
        assignments: assignments.map((assignment) => ({ ...assignment, due: assignment.dueAt ? new Date(assignment.dueAt).toLocaleDateString() : "No deadline", submitted: "0", state: assignment.status })),
        parentCount: Number(parentRows[0]?.parentCount || 0)
      }
    };
  } catch (error: any) {
    return { success: false, errors: [error.message === "AUTHORIZATION_REQUIRED" ? "Teacher access required." : error.message || "Failed to load teacher dashboard"] };
  }
}

export async function checkDbConnection(): Promise<ServerActionResponse<{ status: string; config: any }>> {
  try {
    const pool = getDbPool();
    // Simple ping query
    await pool.query("SELECT 1");
    
    return {
      success: true,
      errors: [],
      data: {
        status: "CONNECTED",
        config: {
          host: process.env.DB_HOST || "localhost",
          database: process.env.DB_NAME || "educational_platform",
          user: process.env.DB_USER || "root"
        }
      }
    };
  } catch (error: any) {
    return {
      success: false,
      errors: [error.message || "Failed to connect to database."],
      data: {
        status: "DISCONNECTED",
        config: {
          host: process.env.DB_HOST || "localhost",
          database: process.env.DB_NAME || "educational_platform"
        }
      }
    };
  }
}

export async function fetchAuditLogs(): Promise<ServerActionResponse<any[]>> {
  try {
    await requireRole(["ADMIN"]);
    const logs = await query<any[]>("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 20");
    return { success: true, errors: [], data: logs };
  } catch (error: any) {
    return { success: false, errors: [error.message === "AUTHORIZATION_REQUIRED" ? "Administrator access required." : error.message || "Failed to fetch audit logs"] };
  }
}

export async function fetchCurriculums(): Promise<ServerActionResponse<any[]>> {
  try {
    await requireRole(["TEACHER", "ADMIN"]);
    const list = await query<any[]>("SELECT * FROM curriculums ORDER BY id");
    return { success: true, errors: [], data: list };
  } catch (error: any) {
    return { success: false, errors: [error.message || "Failed to fetch curriculums"] };
  }
}

export async function uploadCurriculumPackage(rawPackage: any): Promise<ServerActionResponse> {
  try {
    const user = await requireRole(["ADMIN"]);
    const typedPkg = rawPackage;
    const curriculumId = typedPkg?.identity?.id;
    if (!curriculumId) {
      return { success: false, errors: ["Missing curriculum ID in package identity."] };
    }

    // 1. Register curriculum if not exists
    await registerCurriculum(
      user.userId,
      curriculumId,
      typedPkg.identity.name,
      typedPkg.identity.publisher
    );

    // 2. Register version
    const res = await registerPackageVersion(user.userId, curriculumId, typedPkg);
    return res;
  } catch (error: any) {
    return { success: false, errors: [error.message === "AUTHORIZATION_REQUIRED" ? "Administrator access required." : error.message || "Upload failed."] };
  }
}

export async function createContentDraft(
  curriculumId: string,
  contentType: "LESSON" | "QUESTION" | "CAROUSEL" | "ASSESSMENT" | "RESOURCE",
  title: string,
  payload: Record<string, unknown>,
  source?: { kind: "MANUAL" | "IMPORT" | "AI_ASSISTED"; reference?: string; provenance?: string },
): Promise<ServerActionResponse<any>> {
  try {
    const user = await requireRole(["TEACHER", "ADMIN"]);
    return await registerContentDraft({ curriculumId, contentType, title, payload, source, createdBy: user.userId });
  } catch (error: any) {
    return { success: false, errors: [error.message === "AUTHORIZATION_REQUIRED" ? "Teacher access required." : error.message || "Failed to create content draft."] };
  }
}

export async function approveContentDraftAction(
  contentId: string,
  decision: "APPROVE" | "REJECT" | "REQUEST_CHANGES",
  note?: string,
): Promise<ServerActionResponse<any>> {
  try {
    const user = await requireRole(["TEACHER", "ADMIN"]);
    return await approveContentDraft({ contentId, reviewerId: user.userId, decision, note });
  } catch (error: any) {
    return { success: false, errors: [error.message === "AUTHORIZATION_REQUIRED" ? "Teacher access required." : error.message || "Failed to review content draft."] };
  }
}

export async function publishContentDraftAction(contentId: string): Promise<ServerActionResponse<any>> {
  try {
    const user = await requireRole(["ADMIN"]);
    return await publishContentEntry(contentId, user.userId);
  } catch (error: any) {
    return { success: false, errors: [error.message === "AUTHORIZATION_REQUIRED" ? "Administrator access required." : error.message || "Failed to publish content draft."] };
  }
}

export async function startDiagnostic(revisionId: string, idempotencyKey: string): Promise<ServerActionResponse<any>> {
  try {
    const student = await requireRole(["STUDENT"]);
    const attempt = await startDiagnosticAttempt(student.userId, revisionId, idempotencyKey);
    return { success: true, errors: [], data: attempt };
  } catch (error: any) {
    return { success: false, errors: [error.message || "Failed to start diagnostic."] };
  }
}

export async function getActiveStudentDiagnostic(curriculumId?: string): Promise<ServerActionResponse<any>> {
  try {
    await requireRole(["STUDENT"]);
    if (!curriculumId) {
      return { success: false, errors: ["A curriculum ID is required to fetch active diagnostics."] };
    }
    const revisions = await query<any[]>(
      `SELECT ar.id AS revisionId
       FROM assessment_revisions ar
       INNER JOIN curriculum_versions cv ON cv.id = ar.curriculum_version_id
      WHERE cv.curriculum_id = ? AND cv.status = 'ACTIVE'
       ORDER BY cv.effective_date DESC, ar.created_at DESC LIMIT 1`,
      [curriculumId]
    );
    const revisionId = revisions[0]?.revisionId;
    if (!revisionId) return { success: false, errors: [`No active diagnostic is configured for curriculum '${curriculumId}'.`] };
    const context = await getDiagnosticRevision(revisionId);
    return { success: true, errors: [], data: { revisionId, revision: context.revision, blueprint: context.blueprint } };
  } catch (error: any) {
    return { success: false, errors: [error.message === "AUTHORIZATION_REQUIRED" ? "Student access required." : error.message || "Failed to load student diagnostic."] };
  }
}

export async function submitDiagnosticResponse(
  attemptId: string,
  questionId: string,
  response: ResponsePayload,
  responseTimeMs: number,
  idempotencyKey: string,
): Promise<ServerActionResponse<any>> {
  try {
    const student = await requireRole(["STUDENT"]);
    const attempt = await getDiagnosticAttempt(student.userId, attemptId);
    const context = await getDiagnosticRevision(attempt.assessmentRevisionId);
    const question = resolveQuestionVersion(context.revision, questionId);
    const result = await submitDiagnosticResponseRecord(student.userId, attemptId, question, context.blueprint, response, responseTimeMs, idempotencyKey);
    return { success: true, errors: [], data: result };
  } catch (error: any) {
    return { success: false, errors: [error.message || "Failed to submit diagnostic response."] };
  }
}

export async function getDiagnosticAttemptForStudent(attemptId: string): Promise<ServerActionResponse<any>> {
  try {
    const student = await requireRole(["STUDENT"]);
    const attempt = await getDiagnosticAttempt(student.userId, attemptId);
    return { success: true, errors: [], data: attempt };
  } catch (error: any) {
    return { success: false, errors: [error.message || "Failed to load diagnostic attempt."] };
  }
}

// ── Admin AI & Ollama Configuration Actions ─────────────────
export async function getAIConfigAction(): Promise<ServerActionResponse<any>> {
  try {
    const { getAIConfiguration } = await import("../core/services/ai-provider");
    const config = getAIConfiguration();
    return { success: true, errors: [], data: config };
  } catch (error: any) {
    return { success: false, errors: [error.message || "Failed to load AI configuration."] };
  }
}

export async function saveAIConfigAction(config: any): Promise<ServerActionResponse<any>> {
  try {
    const { updateAIConfiguration } = await import("../core/services/ai-provider");
    const updated = updateAIConfiguration(config);
    return { success: true, errors: [], data: updated };
  } catch (error: any) {
    return { success: false, errors: [error.message || "Failed to save AI configuration."] };
  }
}

export async function testAIConnectionAction(config?: any): Promise<ServerActionResponse<any>> {
  try {
    const { testAIConnection } = await import("../core/services/ai-provider");
    const result = await testAIConnection(config);
    return { success: result.success, errors: result.success ? [] : [result.message], data: result };
  } catch (error: any) {
    return { success: false, errors: [error.message || "AI connection test failed."] };
  }
}

