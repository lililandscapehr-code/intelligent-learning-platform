// ============================================================
// EDUCATIONAL CAROUSEL — TYPED SLIDE CONTRACTS
// ============================================================
// These types extend the curriculum contract (QuestionBlueprint)
// and map directly onto the EducationalCarousel slide engine.

export type EduSlideType =
  | "lesson_text"
  | "lesson_image"
  | "youtube"
  | "video"
  | "image"
  | "question_mcq"
  | "question_text"
  | "question_numeric"
  | "evaluation"
  | "upload_zone";

export type CarouselStepPurpose = "CONNECT" | "RELAX" | "EXPLAIN" | "DEMONSTRATE" | "PRACTICE" | "EVALUATE" | "READINESS" | "REFLECT";
export type CarouselAdvanceRule = "OPEN_NEXT" | "SUPPORT_AND_RETRY" | "TEACHER_REVIEW";
export type CarouselTimingStatus = "FAST" | "EXPECTED" | "SLOW" | "NOT_TRACKED";
export type CarouselAccessScope = "ALL_ENROLLED" | "SELECTED_STUDENTS" | "SELECTED_SUBSCRIPTION";

export interface CarouselAccessPolicy {
  scope: CarouselAccessScope;
  studentIds?: string[];
  subscriptionIds?: string[];
  minimumScorePercentage: number;
  showCorrectAnswers: boolean;
  showMarks: boolean;
  trackTiming: boolean;
}

export interface CarouselStepSpec {
  purpose: CarouselStepPurpose;
  targetPoints: string[];
  completionEvidence: string[];
  advanceRule: CarouselAdvanceRule;
  supportAction?: string;
  supportExamples?: string[];
  supportDemonstration?: string;
  retryEvaluation?: string;
  timing?: { expectedMs: number; fastThresholdMs?: number; slowThresholdMs: number };
}

export interface CarouselProcessStep {
  id: string;
  title: string;
  subtitle: string;
  mission: string;
  brief: string;
  studentOutcome: string;
  parentHint: string;
  preparationStages: string[];
  evaluationStages: string[];
  successSignal: string;
  supportDecision: string;
}

export interface CarouselPlan {
  scenario: string;
  mission: string;
  planningPoints: string[];
  studentPromise: string;
  evaluationSummary: string;
  nextStepRule: string;
  sourcePageRange?: string;
  sourceAims?: string[];
  learningMethod?: {
    inquiryLoop: string[];
    inquiryCycle: string[];
    lessonBlocks: string[];
  };
}

export interface CarouselEffortSummary {
  slidesCompleted: number;
  questionsAnswered: number;
  retriesUsed: number;
  evidenceActivities: number;
  activeTimeMs: number;
  timingSignals: { fast: number; expected: number; slow: number };
}

// ── Shared base ──────────────────────────────────────────────
export interface BaseSlide {
  id: string;
  type: EduSlideType;
  sequenceNumber?: number;
  points?: number;
  open?: boolean;
  step?: CarouselStepSpec;
  processStepId?: string;
  title?: string;
  subtitle?: string;
  caption?: string;
  skillId?: string;
  blueprintId?: string;
  sourceReferences?: string[];
}

// ── Media slides ─────────────────────────────────────────────
export interface LessonTextSlide extends BaseSlide {
  type: "lesson_text";
  body: string;                        // Rich markdown-like text
  keyTerms?: string[];                 // Highlighted amber terms
  learningObjective?: string;
}

export interface LessonImageSlide extends BaseSlide {
  type: "lesson_image";
  imageUrl: string;
  annotations?: { x: number; y: number; text: string }[];
}

export interface YouTubeSlide extends BaseSlide {
  type: "youtube";
  youtubeUrl: string;
  startAt?: number;                    // Seconds to start at
  maxDuration?: number;
}

export interface VideoSlide extends BaseSlide {
  type: "video";
  videoUrl: string;
}

export interface ImageSlide extends BaseSlide {
  type: "image";
  imageUrl: string;
}

// ── Question slides ───────────────────────────────────────────
export interface MCQChoice {
  id: string;
  text: string;
  isCorrect: boolean;
  misconceptionId?: string;
  explanation?: string;
}

// Layout modes for question visual panels
export type QuestionImageLayout =
  | "left"          // Image left (40%) | Question right (60%)
  | "right"         // Question left (60%) | Image right (40%)
  | "top"           // Image full-width on top, question below
  | "bottom"        // Question above, image full-width below
  | "fullscreen";   // Image fills slide background, question overlaid

export interface QuestionMCQSlide extends BaseSlide {
  type: "question_mcq";
  questionText: string;
  choices: MCQChoice[];
  allowMultiple?: boolean;
  points?: number;
  imageUrl?: string;
  imageAlt?: string;
  imageCaption?: string;
  diagramSvg?: string;
  imageLayout?: QuestionImageLayout; // default: "left"
  imageSizePct?: number;             // width% for left/right layouts (20-70), default 42
}

export interface QuestionTextSlide extends BaseSlide {
  type: "question_text";
  questionText: string;
  placeholder?: string;
  sampleAnswer?: string;
  points?: number;
}

export interface QuestionNumericSlide extends BaseSlide {
  type: "question_numeric";
  questionText: string;
  correctValue: number;
  tolerance?: number;                  // ± acceptable range
  unit?: string;
  points?: number;
}

// ── Evaluation slide ─────────────────────────────────────────
export interface EvaluationSlide extends BaseSlide {
  type: "evaluation";
  questionRef: string;                 // ID of the question this evaluates
  correctAnswerText: string;
  explanation: string;
  misconceptionNote?: string;
  masteryImplication?: string;
  rubricPoints?: { label: string; earned: boolean }[];
}

// ── Authoring upload zone ─────────────────────────────────────
export interface UploadZoneSlide extends BaseSlide {
  type: "upload_zone";
  prompt?: string;
}

// ── Union type ───────────────────────────────────────────────
export type EduSlide =
  | LessonTextSlide
  | LessonImageSlide
  | YouTubeSlide
  | VideoSlide
  | ImageSlide
  | QuestionMCQSlide
  | QuestionTextSlide
  | QuestionNumericSlide
  | EvaluationSlide
  | UploadZoneSlide;

// ── Answer state tracked by the carousel engine ───────────────
export interface SlideAnswerRecord {
  slideId: string;
  sequenceNumber: number;
  type: "mcq" | "text" | "numeric";
  value: string | string[] | number;
  isCorrect: boolean;
  responseTimeMs: number;
  misconceptionId?: string;
  points: number;
  timingStatus?: CarouselTimingStatus;
}

// ── Carousel-level config ─────────────────────────────────────
export interface EduCarouselConfig {
  id: string;
  title?: string;
  skillId?: string;
  blueprintId?: string;
  slides: EduSlide[];
  autoAdvanceMs?: number;              // ms between non-interactive slides
  allowSkipQuestions?: boolean;
  showProgressBar?: boolean;
  showScoreTally?: boolean;
  sequenceMode?: "OPEN" | "SEQUENTIAL";
  processSteps?: CarouselProcessStep[];
  plan?: CarouselPlan;
  accessPolicy?: CarouselAccessPolicy;
}

// ── Multi-Parameter Diagnostic Evaluation for Paid Parent Reports ───────
export interface MisconceptionInsight {
  misconceptionId: string;
  concept: string;
  observedExplanation: string;
  rootCause: string;
  recommendedIntervention: string;
  frequency: number;
}

export interface MultiParameterDiagnosticReport {
  reportId: string;
  generatedAt: string;
  studentId: string;
  curriculumName: string;
  lessonTitle: string;
  overallScore: number;
  parameters: {
    prerequisiteReadiness: number; // 0 - 100
    conceptualDepth: number;       // 0 - 100
    mathematicalExecution: number; // 0 - 100
    inquiryPrediction: number;     // 0 - 100
    realWorldTransfer: number;     // 0 - 100
    cognitiveFluency: number;      // 0 - 100
  };
  fluencyClassification: "FAST_ACCURATE" | "SLOW_ACCURATE" | "FAST_INACCURATE" | "SLOW_INACCURATE";
  averageResponseMs: number;
  trialMetrics: {
    totalTrials: number;
    firstAttemptSuccessCount: number;
    scaffoldedSuccessCount: number;
    failedItemsCount: number;
    hintsUsedCount: number;
    remediationExamplesViewed: number;
    scaffoldingDependencyIndex: "INDEPENDENT" | "LOW" | "MEDIUM" | "HIGH";
  };
  detectedMisconceptions: MisconceptionInsight[];
  remediationSummary: string;
  parentSafeGuidance: string;
  teacherActionPlan: string;
}

// ── Session result emitted at carousel completion ─────────────
export interface CarouselSessionResult {
  carouselId: string;
  completedAt: string;
  answers: SlideAnswerRecord[];
  totalPoints: number;
  earnedPoints: number;
  scorePercentage: number;
  skillId?: string;
  scoreLedger: Array<{
    slideId: string;
    sequenceNumber: number;
    points: number;
    earnedPoints: number;
    isCorrect: boolean;
    timingStatus: CarouselTimingStatus;
  }>;
  effort: CarouselEffortSummary;
  diagnosticReport?: MultiParameterDiagnosticReport;
}
