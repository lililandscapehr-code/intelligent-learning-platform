import type { 
  EduSlide, 
  SlideAnswerRecord, 
  CarouselEffortSummary, 
  MultiParameterDiagnosticReport,
  MisconceptionInsight 
} from "../../components/carousel/CarouselTypes";

const MISCONCEPTION_KNOWLEDGE_BASE: Record<string, { concept: string; explanation: string; rootCause: string; intervention: string }> = {
  "GAP-MATH-ADD-DENOM": {
    concept: "Fraction Addition",
    explanation: "Added numerators and denominators directly (e.g. 1/4 + 1/6 = 2/10) without finding a common denominator.",
    rootCause: "Procedural confusion between fraction addition rules and fraction multiplication rules.",
    intervention: "10-minute visual fraction grid drill with common multiple (LCM) scaffolding before algebraic fractions."
  },
  "GAP-MATH-MULT-OP": {
    concept: "Fraction Arithmetic",
    explanation: "Multiplied denominators instead of finding least common denominator.",
    rootCause: "Overgeneralization of multiplication procedures to addition operations.",
    intervention: "Equivalent fraction conversion practice using area models."
  },
  "EGYPT-ECO-ABIOTIC": {
    concept: "Ecosystem Components",
    explanation: "Treated physical environmental factors as separate from biological organism survival.",
    rootCause: "Disconnection between abiotic physical conditions and biotic cellular metabolism.",
    intervention: "Cause-and-effect chain diagrams linking temperature/clarity changes to photosynthesis and respiration."
  },
  "EGYPT-ECO-SYSTEMS-SEPARATE": {
    concept: "Hydrosphere Integration",
    explanation: "Viewed the water cycle as an isolated atmospheric process rather than an integrated Earth system.",
    rootCause: "Compartmentalized learning across discrete science disciplines.",
    intervention: "Integrated Earth science case studies on Nile basin water quality and seasonal turnover."
  },
  "PHYS-TEMP-CELSIUS-KELVIN": {
    concept: "Thermodynamic Temperature",
    explanation: "Substituted Celsius temperature directly into Boyle-Charles law (pV/T) instead of absolute temperature (Kelvin).",
    rootCause: "Overlooking that gas volume is proportional to thermal kinetic energy measured from absolute zero (-273.15 °C).",
    intervention: "Always enforce unit conversion check (T [K] = θ [°C] + 273) as an explicit pre-substitution step."
  },
  "PHYS-GAUGE-VS-ABSOLUTE": {
    concept: "Fluid Pressure in Enclosed Cylinders",
    explanation: "Ignored atmospheric pressure (p0) when calculating total gas pressure under a weighted piston (p = p0 + mg/A).",
    rootCause: "Treating the load pressure as the total pressure rather than balancing all forces on the piston.",
    intervention: "Draw a free-body diagram for every piston system showing downward atmospheric force (p0·A), weight (mg), and upward gas force (p·A)."
  },
  "PHYS-VECTOR-SCALAR-CONFUSION": {
    concept: "Two-Dimensional Mechanics",
    explanation: "Added perpendicular velocity components algebraically instead of using Pythagorean vector addition.",
    rootCause: "Failure to resolve independent horizontal and vertical reference frames.",
    intervention: "Vector component resolution drill using right-triangle trigonometry and PhET vector simulations."
  }
};

export function generateMultiParameterDiagnosticReport(params: {
  studentId: string;
  curriculumName: string;
  lessonTitle: string;
  carouselId: string;
  slides: EduSlide[];
  answers: SlideAnswerRecord[];
  effort: CarouselEffortSummary;
}): MultiParameterDiagnosticReport {
  const { studentId, curriculumName, lessonTitle, carouselId, slides, answers, effort } = params;

  const totalQuestions = answers.length;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const overallScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // 1. Parameter Breakdown
  let readinessTotal = 0, readinessEarned = 0;
  let conceptualTotal = 0, conceptualEarned = 0;
  let mathTotal = 0, mathEarned = 0;
  let inquiryTotal = 0, inquiryEarned = 0;
  let transferTotal = 0, transferEarned = 0;

  slides.forEach((slide) => {
    const ans = answers.find((a) => a.slideId === slide.id);
    const maxPts = slide.points || 1;
    const earned = ans?.isCorrect ? maxPts : 0;

    const purpose = slide.step?.purpose;
    const titleOrText = `${slide.title || ""} ${slide.caption || ""}`.toLowerCase();

    if (purpose === "READINESS" || titleOrText.includes("prereq") || titleOrText.includes("readiness")) {
      readinessTotal += maxPts;
      readinessEarned += earned;
    }
    if (purpose === "EXPLAIN" || purpose === "EVALUATE" || slide.type === "question_mcq") {
      conceptualTotal += maxPts;
      conceptualEarned += earned;
    }
    if (slide.type === "question_numeric" || titleOrText.includes("calculate") || titleOrText.includes("equation")) {
      mathTotal += maxPts;
      mathEarned += earned;
    }
    if (purpose === "CONNECT" || titleOrText.includes("predict") || titleOrText.includes("phenomenon")) {
      inquiryTotal += maxPts;
      inquiryEarned += earned;
    }
    if (titleOrText.includes("context") || titleOrText.includes("transfer") || titleOrText.includes("investigation")) {
      transferTotal += maxPts;
      transferEarned += earned;
    }
  });

  const calcParam = (earned: number, total: number, fallback: number) =>
    total > 0 ? Math.round((earned / total) * 100) : fallback;

  const prerequisiteReadiness = calcParam(readinessEarned, readinessTotal, overallScore);
  const conceptualDepth = calcParam(conceptualEarned, conceptualTotal, Math.max(overallScore, 75));
  const mathematicalExecution = calcParam(mathEarned, mathTotal, Math.min(overallScore, 80));
  const inquiryPrediction = calcParam(inquiryEarned, inquiryTotal, 85);
  const realWorldTransfer = calcParam(transferEarned, transferTotal, Math.max(overallScore - 10, 65));

  // 2. Cognitive Fluency & Speed
  const avgResponseMs = effort.questionsAnswered > 0
    ? Math.round(effort.activeTimeMs / effort.questionsAnswered)
    : 45000;

  const isFast = effort.timingSignals.fast >= effort.timingSignals.slow;
  const isAccurate = overallScore >= 70;

  const fluencyClassification: MultiParameterDiagnosticReport["fluencyClassification"] =
    isFast && isAccurate ? "FAST_ACCURATE" :
    !isFast && isAccurate ? "SLOW_ACCURATE" :
    isFast && !isAccurate ? "FAST_INACCURATE" : "SLOW_INACCURATE";

  const cognitiveFluency = Math.round(
    (isAccurate ? 50 : 20) + (isFast ? 40 : 20) + Math.min(10, Math.max(0, 60000 - avgResponseMs) / 6000)
  );

  // 3. Trial Metrics & Scaffolding Dependency
  const retries = effort.retriesUsed;
  const firstAttemptSuccessCount = answers.filter((a) => a.isCorrect && retries === 0).length;
  const scaffoldedSuccessCount = answers.filter((a) => a.isCorrect && retries > 0).length;
  const failedItemsCount = answers.filter((a) => !a.isCorrect).length;

  let scaffoldingDependencyIndex: "INDEPENDENT" | "LOW" | "MEDIUM" | "HIGH" = "INDEPENDENT";
  if (retries > 3 || failedItemsCount > 2) {
    scaffoldingDependencyIndex = "HIGH";
  } else if (retries > 1 || failedItemsCount === 1) {
    scaffoldingDependencyIndex = "MEDIUM";
  } else if (retries === 1) {
    scaffoldingDependencyIndex = "LOW";
  }

  // 4. Misconceptions Detection
  const detectedMisconceptions: MisconceptionInsight[] = [];
  const recordedMisconceptionIds = new Set<string>();

  answers.forEach((ans) => {
    if (!ans.isCorrect && ans.misconceptionId) {
      recordedMisconceptionIds.add(ans.misconceptionId);
    }
  });

  recordedMisconceptionIds.forEach((id) => {
    const entry = MISCONCEPTION_KNOWLEDGE_BASE[id] || {
      concept: "Core Concept",
      explanation: `Specific misconception identified: ${id}`,
      rootCause: "Conceptual ambiguity during question resolution.",
      intervention: "Targeted concept review and parallel practice problem."
    };

    detectedMisconceptions.push({
      misconceptionId: id,
      concept: entry.concept,
      observedExplanation: entry.explanation,
      rootCause: entry.rootCause,
      recommendedIntervention: entry.intervention,
      frequency: 1
    });
  });

  // 5. Parent-Safe Guidance & Teacher Action Plan
  let parentSafeGuidance = "";
  let teacherActionPlan = "";

  if (overallScore >= 85) {
    parentSafeGuidance = `${studentId.split("@")[0]} demonstrated strong independent mastery in ${lessonTitle}. Scientific reasoning and conceptual transfer are well above average.`;
    teacherActionPlan = "Advance to next chapter extension and assign open-ended inquiry challenge.";
  } else if (overallScore >= 65) {
    parentSafeGuidance = `${studentId.split("@")[0]} has a solid grasp of core principles in ${lessonTitle}, with good intuition. Some hesitation was observed in formal calculations or unit conversions.`;
    teacherActionPlan = `Reinforce with 1-2 targeted calculation exercises focusing on: ${detectedMisconceptions.map((m) => m.concept).join(", ") || "unit consistency"}.`;
  } else {
    parentSafeGuidance = `${studentId.split("@")[0]} needs support to secure the foundations of ${lessonTitle}. We observed gaps in foundational prerequisite concepts and unit definitions.`;
    teacherActionPlan = "Schedule a 15-minute educator-guided review session with visual free-body diagrams before advancing.";
  }

  return {
    reportId: `EVAL-${Date.now().toString(36).toUpperCase()}`,
    generatedAt: new Date().toISOString(),
    studentId,
    curriculumName,
    lessonTitle: lessonTitle || "Inquiry Learning Module",
    overallScore,
    parameters: {
      prerequisiteReadiness,
      conceptualDepth,
      mathematicalExecution,
      inquiryPrediction,
      realWorldTransfer,
      cognitiveFluency
    },
    fluencyClassification,
    averageResponseMs: avgResponseMs,
    trialMetrics: {
      totalTrials: totalQuestions + retries,
      firstAttemptSuccessCount,
      scaffoldedSuccessCount,
      failedItemsCount,
      hintsUsedCount: 0,
      remediationExamplesViewed: retries,
      scaffoldingDependencyIndex
    },
    detectedMisconceptions,
    remediationSummary: detectedMisconceptions.length > 0
      ? `Identified ${detectedMisconceptions.length} specific conceptual points requiring targeted review.`
      : "No critical misconceptions detected. Foundations are solid.",
    parentSafeGuidance,
    teacherActionPlan
  };
}
