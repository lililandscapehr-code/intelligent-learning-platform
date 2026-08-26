import { ResponsePayload, EvaluationResult } from "./assessment";
import { TraceableEvidenceEvent, QuestionInstance } from "./question-content";

export type AssessmentType = 
  | "READINESS"
  | "DIAGNOSTIC"
  | "CONTINUOUS"
  | "PROGRESS_REVIEW"
  | "RETENTION"
  | "STAGE_MASTERY";

export type AssessmentAttemptStatus = 
  | "IN_PROGRESS"
  | "COMPLETED"
  | "PAUSED"
  | "ABANDONED";

export interface StudentQuestionInteraction {
  questionId: string;
  blueprintId: string;
  skillId: string;
  response: ResponsePayload;
  evaluationResult: EvaluationResult;
  isCorrect: boolean;
  scorePercentage: number;
  pointsEarned: number;
  maxPoints: number;
  startedAt: string;
  submittedAt: string;
  responseTimeMs: number;
  attemptsCount: number;
  hintsUsedCount: number;
  retriesCount: number;
  flaggedMisconceptionIds: string[];
}

export interface AssessmentAttempt {
  attemptId: string;
  studentId: string;
  curriculumId: string;
  curriculumVersion: string;
  blueprintId: string;
  type: AssessmentType;
  status: AssessmentAttemptStatus;
  startedAt: string;
  finishedAt?: string;
  totalDurationMs?: number;
  selectedQuestionIds: string[];
  currentQuestionIndex: number;
  interactions: StudentQuestionInteraction[];
  evidenceEvents: TraceableEvidenceEvent[];
  rawScore: number;
  maxScore: number;
  scorePercentage: number;
}

export interface SkillPerformanceSummary {
  skillId: string;
  questionsCount: number;
  correctCount: number;
  pointsEarned: number;
  totalPoints: number;
  scorePercentage: number;
  averageResponseTimeMs: number;
  misconceptionsDetected: string[];
}

export interface AssessmentAttemptSummary {
  attemptId: string;
  studentId: string;
  blueprintId: string;
  type: AssessmentType;
  startedAt: string;
  finishedAt: string;
  totalDurationMs: number;
  rawScore: number;
  maxScore: number;
  scorePercentage: number;
  isPassing: boolean;
  skillSummaries: SkillPerformanceSummary[];
  fluencyMetrics: {
    fastAccurateCount: number;
    slowAccurateCount: number;
    fastInaccurateCount: number;
    slowInaccurateCount: number;
    averageSpeedPerItemMs: number;
  };
  recommendedPlacement?: {
    recommendedStageId: string;
    confidence: "LOW" | "MEDIUM" | "HIGH";
    rationale: string;
  };
}

export interface AssessmentSessionConfig {
  mode: "STANDARD" | "ADAPTIVE";
  allowPause?: boolean;
  maxTimeLimitMs?: number;
  allowRetries?: boolean;
  maxRetriesPerItem?: number;
}
