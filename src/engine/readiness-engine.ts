/**
 * Readiness Assessment Scoring Engine
 * 
 * This engine belongs to the EDUCATIONAL ENGINE layer.
 * It consumes the curriculum package's assessment rules and question bank
 * and produces a structured ReadinessResult.
 * 
 * It does NOT contain 0580-specific logic. It reads config from the package.
 */

export type ReadinessOutcome =
  | "READY"
  | "READY_WITH_SUPPORT"
  | "BRIDGING_RECOMMENDED"
  | "FOUNDATION_REQUIRED"
  | "PENDING";

export interface SkillReadinessSummary {
  skillId: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  averageResponseMs: number;
  fluencyClassification: "FAST_ACCURATE" | "SLOW_ACCURATE" | "FAST_INACCURATE" | "SLOW_INACCURATE" | "N/A";
  misconceptionsDetected: string[];
}

export interface ReadinessResult {
  assessmentId: string;
  studentId: string;
  outcome: ReadinessOutcome;
  overallScore: number;
  skillSummaries: SkillReadinessSummary[];
  primaryGapRisk: string | null;
  recommendedAction: string;
  confidence: "LOW" | "MEDIUM" | "HIGH";
  evidenceCount: number;
}

export interface QuestionResponse {
  questionInstanceId: string;
  skillId: string;
  blueprintId: string;
  selectedChoiceId: string;
  isCorrect: boolean;
  misconceptionId?: string;
  responseTimeMs: number;
}

export function scoreReadinessAssessment(
  assessmentId: string,
  studentId: string,
  responses: QuestionResponse[],
  slowThresholdMs: number = 60000,
  curriculumName?: string
): ReadinessResult {
  // Group responses by skill
  const bySkill: Record<string, QuestionResponse[]> = {};
  for (const r of responses) {
    if (!bySkill[r.skillId]) bySkill[r.skillId] = [];
    bySkill[r.skillId].push(r);
  }

  const skillSummaries: SkillReadinessSummary[] = Object.entries(bySkill).map(([skillId, skillResponses]) => {
    const correct = skillResponses.filter((r) => r.isCorrect).length;
    const total = skillResponses.length;
    const scorePercentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const avgMs = total > 0 ? skillResponses.reduce((sum, r) => sum + r.responseTimeMs, 0) / total : 0;
    const isSlow = avgMs > slowThresholdMs;
    const isAccurate = scorePercentage >= 70;
    const misconceptions = skillResponses
      .filter((r) => !r.isCorrect && r.misconceptionId)
      .map((r) => r.misconceptionId as string);

    const fluencyClassification =
      !isSlow && isAccurate ? "FAST_ACCURATE" :
      isSlow && isAccurate ? "SLOW_ACCURATE" :
      !isSlow && !isAccurate ? "FAST_INACCURATE" :
      "SLOW_INACCURATE";

    return {
      skillId,
      totalQuestions: total,
      correctAnswers: correct,
      scorePercentage,
      averageResponseMs: Math.round(avgMs),
      fluencyClassification,
      misconceptionsDetected: [...new Set(misconceptions)]
    };
  });

  // Overall score
  const totalCorrect = responses.filter((r) => r.isCorrect).length;
  const overallScore = responses.length > 0 ? Math.round((totalCorrect / responses.length) * 100) : 0;

  // Detect most critical gap risk
  const worstSkill = skillSummaries.sort((a, b) => a.scorePercentage - b.scorePercentage)[0];
  const primaryGapRisk = worstSkill && worstSkill.scorePercentage < 70 ? worstSkill.skillId : null;

  // Determine outcome
  let outcome: ReadinessOutcome;
  let recommendedAction: string;

  const subjectContext = curriculumName ? `${curriculumName} ` : "";

  if (overallScore >= 85) {
    outcome = "READY";
    recommendedAction = `Proceed directly to ${subjectContext}Stage 1. No bridging required.`;
  } else if (overallScore >= 65) {
    outcome = "READY_WITH_SUPPORT";
    recommendedAction = `Proceed to ${subjectContext}Stage 1 with targeted support on: ${primaryGapRisk ?? "identified skills"}.`;
  } else if (overallScore >= 40) {
    outcome = "BRIDGING_RECOMMENDED";
    recommendedAction = `Complete bridging program focusing on: ${primaryGapRisk ?? "prerequisite skills"} before beginning ${subjectContext}Stage 1.`;
  } else {
    outcome = "FOUNDATION_REQUIRED";
    recommendedAction = `Foundation-level support required. Primary gap in: ${primaryGapRisk ?? "core prerequisites"}. Cannot begin ${subjectContext}Stage 1 yet.`;
  }

  // Confidence based on evidence volume
  const confidence: "LOW" | "MEDIUM" | "HIGH" =
    responses.length >= 4 ? "HIGH" :
    responses.length >= 2 ? "MEDIUM" :
    "LOW";

  return {
    assessmentId,
    studentId,
    outcome,
    overallScore,
    skillSummaries,
    primaryGapRisk,
    recommendedAction,
    confidence,
    evidenceCount: responses.length
  };
}
