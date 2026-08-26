import { NextResponse } from "next/server";
import { requireRole } from "@/core/services/auth";
import { query } from "@/core/db/connection";
import { generateText } from "@/core/services/ai-provider";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await requireRole(["TEACHER", "ADMIN"]);

    const { searchParams } = new URL(request.url);
    const carouselId = searchParams.get("carouselId");
    const classId = searchParams.get("classId");

    let sql = `
      SELECT 
        l.id,
        l.student_id,
        l.class_id,
        l.carousel_id,
        l.slide_id,
        l.alternative_group,
        l.alternative_level,
        l.language_used,
        l.answer_text,
        l.is_correct,
        l.diagnostic_target,
        l.time_spent_seconds,
        l.attempt_number,
        l.created_at,
        u.first_name,
        u.last_name,
        u.email
      FROM question_attempt_logs l
      LEFT JOIN users u ON l.student_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (carouselId) {
      sql += " AND l.carousel_id = ?";
      params.push(carouselId);
    }
    if (classId) {
      sql += " AND l.class_id = ?";
      params.push(classId);
    }

    sql += " ORDER BY l.created_at DESC LIMIT 500";

    const logs: any[] = await query(sql, params);

    // Group logs by student
    const studentMap = new Map<string, {
      id: string;
      name: string;
      email: string;
      totalAttempts: number;
      correctCount: number;
      wrongCount: number;
      maxAltLevel: number;
      diagnosticHits: Record<string, number>;
      failedQuestions: Array<{ slideId: string; attempts: number; lastAnswer: string; maxLevel: number; target?: string }>;
    }>();

    // Group logs by question (slide_id)
    const questionMap = new Map<string, {
      slideId: string;
      carouselId: string;
      totalAttempts: number;
      correctCount: number;
      wrongCount: number;
      uniqueStudents: Set<string>;
      failingStudents: Set<string>;
      highestAltUsed: number;
      diagnosticCounts: Record<string, number>;
      commonWrongAnswers: string[];
    }>();

    for (const row of logs) {
      const studentKey = row.student_id;
      if (!studentMap.has(studentKey)) {
        studentMap.set(studentKey, {
          id: row.student_id,
          name: `${row.first_name || ""} ${row.last_name || ""}`.trim() || row.email || "Student",
          email: row.email,
          totalAttempts: 0,
          correctCount: 0,
          wrongCount: 0,
          maxAltLevel: 1,
          diagnosticHits: {},
          failedQuestions: [],
        });
      }
      const s = studentMap.get(studentKey)!;
      s.totalAttempts++;
      if (row.is_correct) s.correctCount++;
      else s.wrongCount++;
      if (row.alternative_level > s.maxAltLevel) s.maxAltLevel = row.alternative_level;
      if (row.diagnostic_target) {
        s.diagnosticHits[row.diagnostic_target] = (s.diagnosticHits[row.diagnostic_target] || 0) + 1;
      }

      // Question map
      const qKey = row.slide_id;
      if (!questionMap.has(qKey)) {
        questionMap.set(qKey, {
          slideId: row.slide_id,
          carouselId: row.carousel_id,
          totalAttempts: 0,
          correctCount: 0,
          wrongCount: 0,
          uniqueStudents: new Set(),
          failingStudents: new Set(),
          highestAltUsed: 1,
          diagnosticCounts: {},
          commonWrongAnswers: [],
        });
      }
      const q = questionMap.get(qKey)!;
      q.totalAttempts++;
      q.uniqueStudents.add(row.student_id);
      if (row.is_correct) {
        q.correctCount++;
      } else {
        q.wrongCount++;
        q.failingStudents.add(row.student_id);
        if (row.answer_text && q.commonWrongAnswers.length < 5 && !q.commonWrongAnswers.includes(row.answer_text)) {
          q.commonWrongAnswers.push(row.answer_text);
        }
      }
      if (row.alternative_level > q.highestAltUsed) q.highestAltUsed = row.alternative_level;
      if (row.diagnostic_target) {
        q.diagnosticCounts[row.diagnostic_target] = (q.diagnosticCounts[row.diagnostic_target] || 0) + 1;
      }
    }

    // Build question summaries
    const questionSummaries = Array.from(questionMap.values()).map((q) => ({
      slideId: q.slideId,
      carouselId: q.carouselId,
      totalAttempts: q.totalAttempts,
      uniqueStudentCount: q.uniqueStudents.size,
      failingStudentCount: q.failingStudents.size,
      passRate: q.totalAttempts > 0 ? Math.round((q.correctCount / q.totalAttempts) * 100) : 100,
      highestAltUsed: q.highestAltUsed,
      diagnosticCounts: q.diagnosticCounts,
      commonWrongAnswers: q.commonWrongAnswers,
    }));

    // Find struggling students (maxAltLevel >= 3 or wrongCount >= 3)
    const strugglingStudents = Array.from(studentMap.values()).filter(
      (s) => s.wrongCount > 0 || s.maxAltLevel >= 2
    );

    // AI Root Cause Analysis if we have failure logs
    let aiInsight = "";
    if (logs.filter((l) => !l.is_correct).length > 0) {
      try {
        const failureSample = logs
          .filter((l) => !l.is_correct)
          .slice(0, 15)
          .map((l) => `Student ${l.first_name || l.student_id.slice(0, 6)}: Q=${l.slide_id}, AltLevel=${l.alternative_level}, Target=${l.diagnostic_target || "none"}, Answer="${l.answer_text}"`)
          .join("\n");

        aiInsight = await generateText({
          instruction: `You are an educational diagnostician. Analyze these student failure attempts from learning carousels.
Provide a concise, highly actionable teacher diagnosis in 3 bullet points:
1. Primary Root Cause (e.g. Vocabulary vs Calculation vs Prerequisite Concept)
2. Most Vulnerable Question/Skill area
3. Exact Remediation Action for the Teacher.`,
          context: `STUDENT FAILURE LOGS:\n${failureSample}`,
        });
      } catch (err) {
        console.warn("AI diagnostic insight failed:", err);
      }
    }

    return NextResponse.json({
      totalLogs: logs.length,
      students: Array.from(studentMap.values()),
      questionSummaries,
      strugglingCount: strugglingStudents.length,
      aiDiagnosticInsight: aiInsight,
    });
  } catch (error: any) {
    if (error?.message === "AUTHORIZATION_REQUIRED") {
      return NextResponse.json({ error: "Teacher access required." }, { status: 403 });
    }
    console.error("Diagnostic report API error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
