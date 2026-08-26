import crypto from "crypto";
import type { PoolConnection, RowDataPacket } from "mysql2/promise";
import type { AssessmentBlueprint, EvaluationResult, ResponsePayload } from "../../contracts/assessment";
import type {
  AssessmentRevision,
  AssessmentAttemptRecord,
  AssessmentResponseRecord,
  EvidenceEvent,
} from "../../contracts/foundation";
import type { QuestionInstance } from "../../contracts/question-content";
import { EvidenceGenerator } from "../../engine/content/EvidenceGenerator";
import { withTransaction } from "../../core/db/transaction";

interface RevisionRow extends RowDataPacket {
  id: string;
  assessment_id: string;
  curriculum_version_id: string;
  curriculum_id: string;
  curriculum_version: string;
  blueprint: string | AssessmentBlueprint;
  question_version_ids: string | string[];
  scoring_policy_version: string;
}

interface AttemptRow extends RowDataPacket {
  id: string;
  student_id: string;
  assessment_revision_id: string;
  curriculum_id: string;
  curriculum_version: string;
  status: AssessmentAttemptRecord["status"];
  current_question_index: number;
  started_at: Date;
  finished_at: Date | null;
}

interface ReceiptRow extends RowDataPacket {
  id: string;
  request_hash: string;
  result_type: string;
  result_id: string;
}

interface StoredResponseRow extends RowDataPacket {
  id: string;
  attempt_id: string;
  question_version_id: string;
  sequence_number: number;
  response: string | ResponsePayload;
  evaluation: string;
  is_correct: boolean;
  score_percentage: number;
  points_earned: number;
  max_points: number;
  response_time_ms: number;
  attempts_count: number;
  hints_used_count: number;
  submitted_at: Date;
}

function parseJson<T>(value: string | T): T {
  return typeof value === "string" ? JSON.parse(value) as T : value;
}

function hashRequest(value: unknown): string {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function toIso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toAttempt(row: AttemptRow): AssessmentAttemptRecord {
  return {
    attemptId: row.id,
    studentId: row.student_id,
    curriculumId: row.curriculum_id,
    curriculumVersion: row.curriculum_version,
    assessmentRevisionId: row.assessment_revision_id,
    status: row.status,
    startedAt: toIso(row.started_at),
    ...(row.finished_at ? { finishedAt: toIso(row.finished_at) } : {}),
    currentQuestionIndex: row.current_question_index,
  };
}

function toResponse(row: StoredResponseRow): AssessmentResponseRecord {
  return {
    responseId: row.id,
    attemptId: row.attempt_id,
    questionVersionId: row.question_version_id,
    sequenceNumber: row.sequence_number,
    response: parseJson<ResponsePayload>(row.response),
    evaluationResult: parseJson<EvaluationResult>(row.evaluation),
    isCorrect: Boolean(row.is_correct),
    scorePercentage: Number(row.score_percentage),
    pointsEarned: Number(row.points_earned),
    maxPoints: Number(row.max_points),
    responseTimeMs: row.response_time_ms,
    attemptsCount: row.attempts_count,
    hintsUsedCount: row.hints_used_count,
    submittedAt: toIso(row.submitted_at),
  };
}
async function getRevision(connection: PoolConnection, revisionId: string): Promise<RevisionRow> {
  const [rows] = await connection.execute<RevisionRow[]>(
        `SELECT ar.id, ar.assessment_id, ar.curriculum_version_id, cv.curriculum_id,
          JSON_UNQUOTE(JSON_EXTRACT(cv.raw_package, '$.version.curriculumVersion')) AS curriculum_version,
          ar.blueprint,
            ar.question_version_ids, ar.scoring_policy_version
       FROM assessment_revisions ar
       INNER JOIN curriculum_versions cv ON cv.id = ar.curriculum_version_id
      WHERE ar.id = ? LIMIT 1`,
    [revisionId]
  );
  const revision = rows[0];
  if (!revision) throw new Error("ASSESSMENT_REVISION_NOT_FOUND");
  return revision;
}

async function writeAudit(connection: PoolConnection, userId: string, action: string, targetId: string, details: Record<string, unknown>): Promise<void> {
  await connection.execute(
    "INSERT INTO audit_logs (id, user_id, action, target_entity, target_id, details) VALUES (?, ?, ?, ?, ?, ?)",
    [crypto.randomUUID(), userId, action, "LEARNER_FOUNDATION", targetId, JSON.stringify(details)]
  );
}

export async function startDiagnostic(
  studentId: string,
  revisionId: string,
  idempotencyKey: string,
): Promise<AssessmentAttemptRecord> {
  if (!idempotencyKey.trim()) throw new Error("IDEMPOTENCY_KEY_REQUIRED");
  const requestHash = hashRequest({ revisionId });
  return withTransaction(async (connection) => {
    const [existing] = await connection.execute<ReceiptRow[]>(
      "SELECT id, request_hash, result_type, result_id FROM idempotency_receipts WHERE student_id = ? AND operation = ? AND idempotency_key = ? LIMIT 1 FOR UPDATE",
      [studentId, "START_DIAGNOSTIC", idempotencyKey]
    );
    if (existing[0]) {
      if (existing[0].request_hash !== requestHash) throw new Error("IDEMPOTENCY_KEY_REUSED");
      const [attemptRows] = await connection.execute<AttemptRow[]>("SELECT * FROM assessment_attempts WHERE id = ? LIMIT 1", [existing[0].result_id]);
      if (!attemptRows[0]) throw new Error("IDEMPOTENCY_RESULT_NOT_FOUND");
      return toAttempt(attemptRows[0]);
    }

    const revision = await getRevision(connection, revisionId);
    const questionIds = parseJson<string[]>(revision.question_version_ids);
    if (questionIds.length === 0) throw new Error("ASSESSMENT_HAS_NO_QUESTIONS");
    const attemptId = crypto.randomUUID();
    const startedAt = new Date();
    await connection.execute(
      `INSERT INTO assessment_attempts
        (id, student_id, assessment_revision_id, curriculum_id, curriculum_version, status, current_question_index, started_at, idempotency_key)
       VALUES (?, ?, ?, ?, ?, 'IN_PROGRESS', 0, ?, ?)`,
      [attemptId, studentId, revisionId, revision.curriculum_id, revision.curriculum_version, startedAt, idempotencyKey]
    );
    await connection.execute(
      `INSERT INTO idempotency_receipts
        (id, student_id, operation, idempotency_key, request_hash, result_type, result_id)
       VALUES (?, ?, 'START_DIAGNOSTIC', ?, ?, 'ASSESSMENT_ATTEMPT', ?)`,
      [crypto.randomUUID(), studentId, idempotencyKey, requestHash, attemptId]
    );
    await writeAudit(connection, studentId, "DIAGNOSTIC_STARTED", attemptId, { revisionId });
    return {
      attemptId,
      studentId,
      curriculumId: revision.curriculum_id,
      curriculumVersion: revision.curriculum_version,
      assessmentRevisionId: revisionId,
      status: "IN_PROGRESS",
      startedAt: startedAt.toISOString(),
      currentQuestionIndex: 0,
    };
  });
}

export async function submitDiagnosticResponse(
  studentId: string,
  attemptId: string,
  question: QuestionInstance,
  blueprint: AssessmentBlueprint,
  response: ResponsePayload,
  responseTimeMs: number,
  idempotencyKey: string,
): Promise<{ response: AssessmentResponseRecord; evidence: EvidenceEvent }> {
  if (!idempotencyKey.trim()) throw new Error("IDEMPOTENCY_KEY_REQUIRED");
  if (!Number.isFinite(responseTimeMs) || responseTimeMs < 0) throw new Error("INVALID_RESPONSE_TIME");
  const requestHash = hashRequest({ attemptId, questionId: question.id, response, responseTimeMs });
  return withTransaction(async (connection) => {
    const operation = `SUBMIT_DIAGNOSTIC:${attemptId}`;
    const [existing] = await connection.execute<ReceiptRow[]>(
      "SELECT id, request_hash, result_type, result_id FROM idempotency_receipts WHERE student_id = ? AND operation = ? AND idempotency_key = ? LIMIT 1 FOR UPDATE",
      [studentId, operation, idempotencyKey]
    );
    if (existing[0]) {
      if (existing[0].request_hash !== requestHash) throw new Error("IDEMPOTENCY_KEY_REUSED");
      const [rows] = await connection.execute<StoredResponseRow[]>("SELECT * FROM assessment_responses WHERE id = ? LIMIT 1", [existing[0].result_id]);
      const stored = rows[0];
      if (!stored) throw new Error("IDEMPOTENCY_RESULT_NOT_FOUND");
      const responseRecord = toResponse(stored);
      const [evidenceRows] = await connection.execute<any[]>("SELECT * FROM evidence_events WHERE response_id = ? LIMIT 1", [stored.id]);
      const evidenceRow = evidenceRows[0];
      if (!evidenceRow) throw new Error("EVIDENCE_NOT_FOUND");
      return { response: responseRecord, evidence: mapEvidenceRow(evidenceRow) };
    }

    const [attemptRows] = await connection.execute<AttemptRow[]>("SELECT * FROM assessment_attempts WHERE id = ? AND student_id = ? LIMIT 1 FOR UPDATE", [attemptId, studentId]);
    const attempt = attemptRows[0];
    if (!attempt) throw new Error("ASSESSMENT_ATTEMPT_NOT_FOUND");
    if (attempt.status !== "IN_PROGRESS") throw new Error("ASSESSMENT_ATTEMPT_NOT_IN_PROGRESS");
    const [revisionRows] = await connection.execute<RevisionRow[]>("SELECT * FROM assessment_revisions WHERE id = ? LIMIT 1", [attempt.assessment_revision_id]);
    const revision = revisionRows[0];
    if (!revision) throw new Error("ASSESSMENT_REVISION_NOT_FOUND");
    const questionIds = parseJson<string[]>(revision.question_version_ids);
    if (questionIds[attempt.current_question_index] !== question.id) throw new Error("QUESTION_SEQUENCE_MISMATCH");
    if (question.curriculumId !== attempt.curriculum_id || question.curriculumVersion !== attempt.curriculum_version) throw new Error("QUESTION_VERSION_MISMATCH");
    const questionBlueprint = blueprint.questionBlueprints.find((item) => item.id === question.blueprintId);
    if (!questionBlueprint) throw new Error("QUESTION_BLUEPRINT_NOT_FOUND");

    const generated = new EvidenceGenerator().evaluateAndEmitEvidence({
      studentId,
      assessmentAttemptId: attemptId,
      questionInstance: question,
      blueprint: questionBlueprint,
      response,
      responseTimeMs,
    });
    const responseId = crypto.randomUUID();
    const occurredAt = new Date(generated.timestamp);
    const payload = {
      response,
      evaluationResult: generated.evaluationResult,
      isCorrect: generated.isCorrect,
      scorePercentage: generated.scorePercentage,
      pointsEarned: generated.pointsEarned,
      maxPoints: question.points || 1,
      responseTimeMs,
      attemptsCount: generated.attemptsCount,
      hintsUsedCount: generated.hintsUsedCount,
      submittedAt: generated.timestamp,
    };
    const payloadHash = crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
    await connection.execute(
      `INSERT INTO assessment_responses
        (id, attempt_id, question_version_id, sequence_number, response, evaluation, is_correct, score_percentage, points_earned, max_points, response_time_ms, attempts_count, hints_used_count, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [responseId, attemptId, question.id, attempt.current_question_index, JSON.stringify(response), JSON.stringify(generated.evaluationResult), generated.isCorrect, generated.scorePercentage, generated.pointsEarned, question.points || 1, responseTimeMs, generated.attemptsCount, generated.hintsUsedCount, occurredAt]
    );
    await connection.execute(
      `INSERT INTO evidence_events
        (id, student_id, attempt_id, response_id, curriculum_id, curriculum_version, assessment_revision_id, question_version_id, skill_id, response, evaluation, is_correct, score_percentage, points_earned, response_time_ms, attempts_count, hints_used_count, misconception_ids, confidence, scoring_policy_version, occurred_at, correlation_id, idempotency_key, payload_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [generated.evidenceId, studentId, attemptId, responseId, attempt.curriculum_id, attempt.curriculum_version, attempt.assessment_revision_id, question.id, question.skillId, JSON.stringify(response), JSON.stringify(generated.evaluationResult), generated.isCorrect, generated.scorePercentage, generated.pointsEarned, responseTimeMs, generated.attemptsCount, generated.hintsUsedCount, JSON.stringify(generated.flaggedMisconceptionIds), generated.confidence, revision.scoring_policy_version, occurredAt, crypto.randomUUID(), idempotencyKey, payloadHash]
    );
    const nextIndex = attempt.current_question_index + 1;
    const completed = nextIndex >= questionIds.length;
    await connection.execute(
      "UPDATE assessment_attempts SET current_question_index = ?, status = IF(?, 'COMPLETED', status), finished_at = IF(?, ?, finished_at) WHERE id = ? AND status = 'IN_PROGRESS'",
      [nextIndex, completed, completed, occurredAt, attemptId]
    );
    await connection.execute(
      `INSERT INTO idempotency_receipts
        (id, student_id, operation, attempt_id, idempotency_key, request_hash, result_type, result_id)
       VALUES (?, ?, ?, ?, ?, ?, 'ASSESSMENT_RESPONSE', ?)`,
      [crypto.randomUUID(), studentId, operation, attemptId, idempotencyKey, requestHash, responseId]
    );
    await writeAudit(connection, studentId, "DIAGNOSTIC_RESPONSE_ACCEPTED", attemptId, { responseId, evidenceId: generated.evidenceId, questionId: question.id });
    const responseRecord: AssessmentResponseRecord = { responseId, attemptId, questionVersionId: question.id, sequenceNumber: attempt.current_question_index, ...payload };
    const evidence: EvidenceEvent = {
      evidenceId: generated.evidenceId,
      studentId,
      attemptId,
      responseId,
      curriculumId: attempt.curriculum_id,
      curriculumVersion: attempt.curriculum_version,
      assessmentRevisionId: attempt.assessment_revision_id,
      questionVersionId: question.id,
      skillId: question.skillId,
      response,
      evaluationResult: generated.evaluationResult,
      isCorrect: generated.isCorrect,
      scorePercentage: generated.scorePercentage,
      pointsEarned: generated.pointsEarned,
      responseTimeMs,
      attemptsCount: generated.attemptsCount,
      hintsUsedCount: generated.hintsUsedCount,
      flaggedMisconceptionIds: generated.flaggedMisconceptionIds,
      confidence: generated.confidence,
      scoringPolicyVersion: revision.scoring_policy_version,
      occurredAt: generated.timestamp,
      correlationId: "",
      payloadHash,
    };
    return { response: responseRecord, evidence };
  });
}

function mapEvidenceRow(row: any): EvidenceEvent {
  return {
    evidenceId: row.id,
    studentId: row.student_id,
    attemptId: row.attempt_id,
    responseId: row.response_id,
    curriculumId: row.curriculum_id,
    curriculumVersion: row.curriculum_version,
    assessmentRevisionId: row.assessment_revision_id,
    questionVersionId: row.question_version_id,
    skillId: row.skill_id,
    response: parseJson(row.response),
    evaluationResult: parseJson(row.evaluation),
    isCorrect: Boolean(row.is_correct),
    scorePercentage: Number(row.score_percentage),
    pointsEarned: Number(row.points_earned),
    responseTimeMs: row.response_time_ms,
    attemptsCount: row.attempts_count,
    hintsUsedCount: row.hints_used_count,
    flaggedMisconceptionIds: parseJson(row.misconception_ids),
    confidence: row.confidence,
    scoringPolicyVersion: row.scoring_policy_version,
    occurredAt: toIso(row.occurred_at),
    correlationId: row.correlation_id,
    payloadHash: row.payload_hash,
  };
}

export async function getDiagnosticAttempt(studentId: string, attemptId: string): Promise<AssessmentAttemptRecord & { responses: AssessmentResponseRecord[]; evidence: EvidenceEvent[] }> {
  const pool = (await import("../../core/db/connection")).getDbPool();
  const [attemptRows] = await pool.execute<AttemptRow[]>("SELECT * FROM assessment_attempts WHERE id = ? AND student_id = ? LIMIT 1", [attemptId, studentId]);
  const attempt = attemptRows[0];
  if (!attempt) throw new Error("ASSESSMENT_ATTEMPT_NOT_FOUND");
  const [responseRows] = await pool.execute<StoredResponseRow[]>("SELECT * FROM assessment_responses WHERE attempt_id = ? ORDER BY sequence_number", [attemptId]);
  const [evidenceRows] = await pool.execute<any[]>("SELECT * FROM evidence_events WHERE attempt_id = ? ORDER BY occurred_at, id", [attemptId]);
  return { ...toAttempt(attempt), responses: responseRows.map(toResponse), evidence: evidenceRows.map(mapEvidenceRow) };
}

export async function getDiagnosticRevision(revisionId: string): Promise<{ revision: AssessmentRevision; blueprint: AssessmentBlueprint }> {
  const pool = (await import("../../core/db/connection")).getDbPool();
  const [rows] = await pool.execute<RevisionRow[]>(
        `SELECT ar.id, ar.assessment_id, ar.curriculum_version_id, cv.curriculum_id,
          JSON_UNQUOTE(JSON_EXTRACT(cv.raw_package, '$.version.curriculumVersion')) AS curriculum_version,
          ar.blueprint,
            ar.question_version_ids, ar.scoring_policy_version
       FROM assessment_revisions ar
       INNER JOIN curriculum_versions cv ON cv.id = ar.curriculum_version_id
      WHERE ar.id = ? LIMIT 1`,
    [revisionId]
  );
  const row = rows[0];
  if (!row) throw new Error("ASSESSMENT_REVISION_NOT_FOUND");
  return {
    revision: {
      revisionId: row.id,
      assessmentId: row.assessment_id,
      curriculumId: row.curriculum_id,
      curriculumVersion: row.curriculum_version,
      type: "DIAGNOSTIC",
      blueprint: parseJson<AssessmentBlueprint>(row.blueprint),
      questionVersionIds: parseJson<string[]>(row.question_version_ids),
      scoringPolicyVersion: row.scoring_policy_version,
    },
    blueprint: parseJson<AssessmentBlueprint>(row.blueprint),
  };
}