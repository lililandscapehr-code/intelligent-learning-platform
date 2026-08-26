export type TimingTrackingType = "SESSION_MS" | "DEADLINE_DAYS" | "NONE";

export interface TimingExpectation {
  trackingType: TimingTrackingType;
  expectedDuration?: number;
  slowThreshold?: number;
  fastThreshold?: number;
  context?: string;
  unit?: string;
}

export interface QuestionBlueprint {
  id: string;
  skillId: string;
  type: string;
  difficulty: number;
  expectedResponseType: string;
  scoringModel: string;
  timingExpectation: TimingExpectation;
  cognitiveDemand?: string;
  prerequisiteEvidence?: string[];
  evidenceProduced?: string[];
  misconceptionMapping?: string[];
  validationRequirements?: string[];
}

export interface AssessmentBlueprint {
  id: string;
  type: "READINESS" | "DIAGNOSTIC" | "CONTINUOUS" | "RETENTION" | "STAGE_MASTERY" | "PROGRESS_REVIEW";
  purpose: string;
  eligibility?: string;
  skillsAssessed?: string[];
  questionBlueprints: QuestionBlueprint[];
  timingRules?: TimingExpectation;
}

export type ResponsePayload =
  | { type: "CHOICE_ID"; choiceId: string }
  | { type: "TEXT"; textContent: string }
  | { type: "FILE"; fileUrl: string; mimeType: string }
  | { type: "COMPLEX"; structuredData: Record<string, unknown> };

export interface RubricDimensionScore {
  dimensionId: string;
  score: number;
  maxScore: number;
  feedbackComments?: string;
}

export type EvaluationResult =
  | { type: "BINARY"; isCorrect: boolean }
  | { type: "PERCENTAGE"; percentage: number }
  | { type: "RUBRIC"; dimensions: RubricDimensionScore[] };
