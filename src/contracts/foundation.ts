import { AssessmentBlueprint, EvaluationResult, ResponsePayload } from "./assessment";

export type FoundationAttemptStatus = "IN_PROGRESS" | "COMPLETED" | "PAUSED" | "ABANDONED";

export interface AssessmentRevision {
  revisionId: string;
  assessmentId: string;
  curriculumId: string;
  curriculumVersion: string;
  type: "DIAGNOSTIC";
  blueprint: AssessmentBlueprint;
  questionVersionIds: string[];
  scoringPolicyVersion: string;
}

export interface AssessmentAttemptRecord {
  attemptId: string;
  studentId: string;
  curriculumId: string;
  curriculumVersion: string;
  assessmentRevisionId: string;
  status: FoundationAttemptStatus;
  startedAt: string;
  finishedAt?: string;
  currentQuestionIndex: number;
}

export interface AssessmentResponseRecord {
  responseId: string;
  attemptId: string;
  questionVersionId: string;
  sequenceNumber: number;
  response: ResponsePayload;
  evaluationResult: EvaluationResult;
  isCorrect: boolean;
  scorePercentage: number;
  pointsEarned: number;
  maxPoints: number;
  responseTimeMs: number;
  attemptsCount: number;
  hintsUsedCount: number;
  submittedAt: string;
}

export interface EvidenceEvent {
  evidenceId: string;
  studentId: string;
  attemptId: string;
  responseId: string;
  curriculumId: string;
  curriculumVersion: string;
  assessmentRevisionId: string;
  questionVersionId: string;
  skillId: string;
  response: ResponsePayload;
  evaluationResult: EvaluationResult;
  isCorrect: boolean;
  scorePercentage: number;
  pointsEarned: number;
  responseTimeMs: number;
  attemptsCount: number;
  hintsUsedCount: number;
  flaggedMisconceptionIds: string[];
  confidence: "LOW" | "MEDIUM" | "HIGH";
  scoringPolicyVersion: string;
  occurredAt: string;
  correlationId: string;
  payloadHash: string;
}

export interface IdempotencyReceipt {
  receiptId: string;
  studentId: string;
  operation: string;
  attemptId?: string;
  idempotencyKey: string;
  requestHash: string;
  resultType: string;
  resultId: string;
}

export interface AuditEvent {
  auditId: string;
  userId: string;
  action: string;
  targetEntity: string;
  targetId: string;
  details: Record<string, unknown>;
  occurredAt: string;
}