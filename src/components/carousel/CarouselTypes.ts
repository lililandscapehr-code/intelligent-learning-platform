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
  timerSeconds?: number;               // Per-slide countdown timer (0 = no timer)
}

// ── Media slides ─────────────────────────────────────────────
export interface LessonTextSlide extends BaseSlide {
  type: "lesson_text";
  body: string;                        // Rich markdown-like text
  keyTerms?: string[];                 // Highlighted amber terms
  learningObjective?: string;
  theme?: "default" | "amber" | "sky" | "emerald" | "violet" | "rose"; // Background color theme
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
  endAt?: number;                      // Seconds to end clip
  maxDuration?: number;
  mandatoryWatchSeconds?: number;      // Student must watch N seconds before advancing
  autoAdvance?: boolean;               // Auto-advance when video ends
}

export interface VideoSlide extends BaseSlide {
  type: "video";
  videoUrl: string;
  autoAdvance?: boolean;               // Auto-advance when video ends
}

export interface ImageSlide extends BaseSlide {
  type: "image";
  imageUrl: string;
  imageAlt?: string;
  imageLayout?: QuestionImageLayout;
  imageSizePct?: number;
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

// ── Question alternatives & translations ──────────────────────
export interface QuestionAlternative {
  id: string;
  group: "A" | "B" | "C" | "PRE" | "HIGHER"; // A/PRE = Case Pre (10 scaffold trials), B = Case B (Standard), C/HIGHER = Case C (Higher question)
  level: number;                 // Level 1-10 within that tier
  tierName?: "Case Pre" | "Case B" | "Case C";
  questionText: string;
  placeholder?: string;
  analogy?: string;
  diagnosticTarget?: string;     // e.g. "vocabulary" | "concept" | "arithmetic" | "procedure" | "representation"
  simplificationNote?: string;   // teacher note: what was simplified and why
  challengeNote?: string;        // teacher note: what was escalated
  choices?: MCQChoice[];
  correctValue?: number;
}

export interface QuestionTranslations {
  [languageCode: string]: {
    questionText: string;
    placeholder?: string;
    alternatives?: { [altIdOrLevel: string]: string };
  };
}

// ── Teacher-authored extra slide injected into a question DNA ──
export interface TeacherAddedSlide {
  id: string;
  insertAfterCase: "PRE" | "B" | "C";
  insertAfterIndex: number;           // 0-based index within that case group
  slide: LessonTextSlide | YouTubeSlide | ImageSlide;
  addedBy: string;                    // teacher user id
  addedAt: string;                    // ISO date
  note?: string;
}

// ── Question DNA — one B question + its Pre/C ecosystem ────────
export interface QuestionDNA {
  id: string;                         // e.g. "DNA-L1-1-B1"
  lessonId: string;                   // e.g. "CAROUSEL-PHYS-EB-MECH-1-1"
  bIndex: number;                     // 1-based position in lesson (1 of 7)
  concept: string;                    // human label e.g. "Resultant of perpendicular velocities"
  bQuestion: QuestionMCQSlide | QuestionNumericSlide | QuestionTextSlide;
  preTrials: QuestionAlternative[];   // 10 scaffold trials, ordered 1→10 (simplest→harder)
  cQuestions: QuestionAlternative[];  // 5 default higher questions (teacher can add more)
  teacherExtras?: TeacherAddedSlide[];
  lastEditedBy?: string;
  lastEditedAt?: string;
}

// ── Adaptive case phase for student diagnostic engine ──────────
// Mandatory loop: B → (wrong) → Pre → B_RETRY → (correct) → C (min 1) → next B
//                              → (wrong) → Pre again → B_RETRY → …
export type CasePhase =
  | "CASE_B"           // first attempt at the B question
  | "CASE_PRE"         // sequential Pre scaffold trials (one by one)
  | "PRE_MASTERED"     // mastered a Pre trial — must retry B
  | "CASE_B_RETRY"     // B question shown again after Pre mastery
  | "CASE_C"           // mandatory C question(s) after any B pass
  | "C_SOLVED_CHOICE"  // solved C — offer: more C (optional) or next B
  | "C_EXHAUSTED"      // all C questions done — auto-advance to next B
  | "PARENT_NOTIFICATION" // student failed all Pre trials; notify parents, offer scratch restart
  | "LESSON_COMPLETE"; // all B questions passed (each with min 1 C)

export interface QuestionMCQSlide extends BaseSlide {
  type: "question_mcq";
  questionText: string;
  choices: MCQChoice[];
  allowMultiple?: boolean;
  shuffleChoices?: boolean;            // Randomize choice order for students
  points?: number;
  imageUrl?: string;
  imageAlt?: string;
  imageCaption?: string;
  diagramSvg?: string;
  imageLayout?: QuestionImageLayout; // default: "left"
  imageSizePct?: number;             // width% for left/right layouts (20-70), default 42
  alternatives?: QuestionAlternative[];
  translations?: QuestionTranslations;
}

export interface QuestionTextSlide extends BaseSlide {
  type: "question_text";
  questionText: string;
  placeholder?: string;
  sampleAnswer?: string;
  points?: number;
  alternatives?: QuestionAlternative[];
  translations?: QuestionTranslations;
}

export interface QuestionNumericSlide extends BaseSlide {
  type: "question_numeric";
  questionText: string;
  correctValue: number;
  tolerance?: number;                  // ± acceptable range
  unit?: string;
  points?: number;
  alternatives?: QuestionAlternative[];
  translations?: QuestionTranslations;
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
