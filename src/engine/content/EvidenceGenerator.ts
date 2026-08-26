import { 
  QuestionInstance, 
  TraceableEvidenceEvent 
} from "../../contracts/question-content";
import { 
  QuestionBlueprint, 
  ResponsePayload, 
  EvaluationResult, 
  TimingExpectation 
} from "../../contracts/assessment";
import crypto from "crypto";

export interface StudentSubmission {
  studentId: string;
  assessmentAttemptId: string;
  questionInstance: QuestionInstance;
  blueprint?: QuestionBlueprint;
  response: ResponsePayload;
  responseTimeMs: number;
  attemptsCount?: number;
  hintsUsedCount?: number;
}

/**
 * GENERIC EVIDENCE GENERATOR
 * 
 * Evaluates concrete student responses and emits immutable, traceable EvidenceEvents.
 */
export class EvidenceGenerator {

  public evaluateAndEmitEvidence(submission: StudentSubmission): TraceableEvidenceEvent {
    const {
      studentId,
      assessmentAttemptId,
      questionInstance,
      blueprint,
      response,
      responseTimeMs,
      attemptsCount = 1,
      hintsUsedCount = 0
    } = submission;

    // 1. Evaluate Response against Question Answer Config
    let isCorrect = false;
    let scorePercentage = 0;
    let evaluationResult: EvaluationResult;
    const flaggedMisconceptionIds: string[] = [];

    const cfg = questionInstance.answerConfig;

    if (cfg.type === "MULTIPLE_CHOICE" && response.type === "CHOICE_ID") {
      const selectedChoice = cfg.choices?.find(c => c.id === response.choiceId);
      if (selectedChoice) {
        isCorrect = selectedChoice.isCorrect;
        scorePercentage = isCorrect ? 100 : 0;
        evaluationResult = { type: "BINARY", isCorrect };

        if (!isCorrect && selectedChoice.misconceptionId) {
          flaggedMisconceptionIds.push(selectedChoice.misconceptionId);
        }
      } else {
        evaluationResult = { type: "BINARY", isCorrect: false };
      }
    } else if (cfg.type === "NUMERIC_EXACT" && response.type === "TEXT") {
      const parsedNum = parseFloat(response.textContent);
      if (!isNaN(parsedNum) && cfg.exactNumericValue !== undefined) {
        const tolerance = cfg.tolerance || 0;
        isCorrect = Math.abs(parsedNum - cfg.exactNumericValue) <= tolerance;
        scorePercentage = isCorrect ? 100 : 0;
        evaluationResult = { type: "BINARY", isCorrect };
      } else {
        evaluationResult = { type: "BINARY", isCorrect: false };
      }
    } else if (cfg.type === "RUBRIC_CRITERIA" && response.type === "COMPLEX") {
      // Rubric dimension evaluation
      const dimensions = cfg.rubricDimensions || [];
      const userScores = (response.structuredData?.dimensionScores as any[]) || [];
      
      let totalEarned = 0;
      let totalMax = 0;
      const dimScores = dimensions.map(dim => {
        const userDim = userScores.find((d: any) => d.dimensionId === dim.dimensionId);
        const earned = userDim ? Math.min(userDim.score, dim.maxPoints) : 0;
        totalEarned += earned;
        totalMax += dim.maxPoints;
        return {
          dimensionId: dim.dimensionId,
          score: earned,
          maxScore: dim.maxPoints,
          feedbackComments: userDim?.feedback
        };
      });

      scorePercentage = totalMax > 0 ? Math.round((totalEarned / totalMax) * 100) : 0;
      isCorrect = scorePercentage >= 75;
      evaluationResult = { type: "RUBRIC", dimensions: dimScores };
    } else {
      // Fallback
      isCorrect = false;
      scorePercentage = 0;
      evaluationResult = { type: "BINARY", isCorrect: false };
    }

    // 2. Classify Timing & Fluency
    const timing: TimingExpectation = blueprint?.timingExpectation || {
      trackingType: "SESSION_MS",
      expectedDuration: 60000,
      slowThreshold: 90000,
      fastThreshold: 5000
    };

    let timingClassification: TraceableEvidenceEvent["timingClassification"] = "UNCLASSIFIED";
    if (timing.trackingType === "SESSION_MS") {
      const isSlow = timing.slowThreshold ? responseTimeMs > timing.slowThreshold : false;
      const isFast = timing.fastThreshold ? responseTimeMs < timing.fastThreshold : false;

      if (isCorrect) {
        timingClassification = isSlow ? "SLOW_ACCURATE" : "FAST_ACCURATE";
      } else {
        timingClassification = isFast ? "FAST_INACCURATE" : "SLOW_INACCURATE";
      }
    }

    // 3. Compute Confidence
    let confidence: "LOW" | "MEDIUM" | "HIGH" = "HIGH";
    if (hintsUsedCount > 1 || attemptsCount > 2) {
      confidence = "LOW";
    } else if (hintsUsedCount === 1 || attemptsCount === 2) {
      confidence = "MEDIUM";
    }

    const pointsEarned = Math.round((scorePercentage / 100) * questionInstance.points);

    // 4. Emit Immutable Evidence Event
    return {
      evidenceId: crypto.randomUUID(),
      studentId,
      curriculumId: questionInstance.curriculumId,
      curriculumVersion: questionInstance.curriculumVersion,
      sourceAssessmentAttemptId: assessmentAttemptId,
      sourceQuestionId: questionInstance.id,
      blueprintId: questionInstance.blueprintId,
      skillId: questionInstance.skillId,
      source: "OBSERVED",
      responsePayload: response,
      evaluationResult,
      isCorrect,
      scorePercentage,
      pointsEarned,
      responseTimeMs,
      attemptsCount,
      hintsUsedCount,
      timingClassification,
      flaggedMisconceptionIds,
      confidence,
      timestamp: new Date().toISOString()
    };
  }
}
