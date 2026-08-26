import { ResponsePayload, EvaluationResult } from "./assessment";

export interface StudentEvidenceEvent {
  eventId: string;
  studentId: string;
  curriculumId: string;
  curriculumVersion: string;
  assessmentAttemptId: string;
  questionInstanceId: string;
  skillId: string;
  response: ResponsePayload;
  evaluation: EvaluationResult;
  responseTimeMs: number;
  attempts: number;
  hintsUsed: number;
  observedEvidenceFlags: string[];
  timestamp: string;
}

export interface CandidateRootCauseEvaluation {
  rootCauseId: string;
  description: string;
  confidence: "LOW" | "MEDIUM" | "HIGH" | "CONFIRMED" | "REJECTED";
  supportingEvidenceIds: string[];
  contradictingEvidenceIds: string[];
  verificationActionQueued?: string;
}

export interface ActiveGap {
  gapInstanceId: string;
  studentId: string;
  observedGapDefinitionId: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "IDENTIFIED" | "VERIFYING" | "CONFIRMED" | "RESOLVED";
  candidateRootCauses: CandidateRootCauseEvaluation[];
  confirmedRootCauseId?: string;
  recommendedIntervention?: string;
  evidenceEventIds: string[];
}

export interface StudentLearningState {
  studentId: string;
  curriculumId: string;
  curriculumVersion: string;
  currentStageId: string;
  skillStates: Record<string, {
    masteryLevel: number;
    evidenceLog: StudentEvidenceEvent[];
  }>;
  activeGaps: ActiveGap[];
  progressHistory: string[];
  assessmentHistory: string[];
  nextRecommendedAction: {
    actionType: string;
    targetId: string;
  };
}
