import { ResponsePayload, EvaluationResult, RubricDimensionScore, TimingExpectation } from "./assessment";

export type QuestionOrigin = "MANUAL_EDUCATOR" | "AI_GENERATED" | "PAST_PAPER_OFFICIAL";
export type QuestionApprovalStatus = "AI_DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "ARCHIVED";

export interface QuestionDistractor {
  id: string;
  text: string;
  isCorrect: boolean;
  misconceptionId?: string;
  distractorRationale?: string;
}

export interface QuestionRubricDimension {
  dimensionId: string;
  criteria: string;
  maxPoints: number;
}

export interface QuestionAnswerConfig {
  type: "MULTIPLE_CHOICE" | "NUMERIC_EXACT" | "NUMERIC_RANGE" | "TEXT_KEYWORD" | "RUBRIC_CRITERIA" | "FILE_SUBMISSION";
  choices?: QuestionDistractor[];
  exactNumericValue?: number;
  tolerance?: number;
  unit?: string;
  acceptableKeywords?: string[];
  rubricDimensions?: QuestionRubricDimension[];
}

export interface QuestionApprovalRecord {
  status: QuestionApprovalStatus;
  reviewedBy?: string; // Educator ID
  reviewedAt?: string;
  reviewerComments?: string;
  version: number;
}

/**
 * CONCRETE QUESTION INSTANCE
 * 
 * Decoupled from the Curriculum Package.
 * Contains actual learner-facing content and traceability links.
 */
export interface QuestionInstance {
  id: string;
  blueprintId: string;
  skillId: string;
  curriculumId: string;
  curriculumVersion: string;
  promptText: string;
  promptMediaUrl?: string;
  promptMediaType?: "IMAGE" | "VIDEO" | "AUDIO" | "DIAGRAM";
  difficulty: number; // 1-5
  points: number;
  answerConfig: QuestionAnswerConfig;
  explanationText: string;
  workedSolutionUrl?: string;
  origin: QuestionOrigin;
  provenance: {
    sourcePaper?: string;
    generatorModel?: string;
    generatedAt: string;
  };
  approval: QuestionApprovalRecord;
  tags?: string[];
}

/**
 * IMMUTABLE TRACEABLE EVIDENCE EVENT
 * 
 * Emitted by the engine whenever a learner interacts with a QuestionInstance.
 */
export interface TraceableEvidenceEvent {
  evidenceId: string;
  studentId: string;
  curriculumId: string;
  curriculumVersion: string;
  sourceAssessmentAttemptId: string;
  sourceQuestionId: string;
  blueprintId: string;
  skillId: string;
  source: "OBSERVED" | "AI_INFERRED";
  responsePayload: ResponsePayload;
  evaluationResult: EvaluationResult;
  isCorrect: boolean;
  scorePercentage: number;
  pointsEarned: number;
  responseTimeMs: number;
  attemptsCount: number;
  hintsUsedCount: number;
  timingClassification: "FAST_ACCURATE" | "SLOW_ACCURATE" | "FAST_INACCURATE" | "SLOW_INACCURATE" | "UNCLASSIFIED";
  flaggedMisconceptionIds: string[];
  confidence: "LOW" | "MEDIUM" | "HIGH";
  timestamp: string;
}

export interface QuestionBankFilter {
  skillId?: string;
  blueprintId?: string;
  curriculumId?: string;
  difficulty?: number;
  status?: QuestionApprovalStatus;
  origin?: QuestionOrigin;
  limit?: number;
}
