import { AssessmentBlueprint } from "../../contracts/assessment";
import { 
  AssessmentAttempt, 
  AssessmentSessionConfig, 
  AssessmentAttemptSummary, 
  StudentQuestionInteraction,
  SkillPerformanceSummary
} from "../../contracts/assessment-execution";
import { ResponsePayload } from "../../contracts/assessment";
import { QuestionBank } from "../content/QuestionBank";
import { EvidenceGenerator } from "../content/EvidenceGenerator";
import { 
  StandardQuestionSelector, 
  AdaptiveQuestionSelector, 
  IQuestionSelector 
} from "./QuestionSelector";
import crypto from "crypto";

export interface ResponseSubmissionMetrics {
  responseTimeMs: number;
  attemptsCount?: number;
  hintsUsedCount?: number;
  retriesCount?: number;
}

/**
 * GENERIC ASSESSMENT EXECUTION ENGINE
 * 
 * Supports all 6 assessment types:
 * 1. Readiness
 * 2. Diagnostic
 * 3. Continuous
 * 4. Progress Review
 * 5. Retention
 * 6. Stage Mastery
 */
export class AssessmentEngine {
  private bank: QuestionBank;
  private evidenceGen: EvidenceGenerator;
  private attempts: Map<string, AssessmentAttempt> = new Map();
  private selectors: {
    standard: StandardQuestionSelector;
    adaptive: AdaptiveQuestionSelector;
  };

  constructor(bank: QuestionBank, evidenceGen?: EvidenceGenerator) {
    this.bank = bank;
    this.evidenceGen = evidenceGen || new EvidenceGenerator();
    this.selectors = {
      standard: new StandardQuestionSelector(),
      adaptive: new AdaptiveQuestionSelector()
    };
  }

  /**
   * Initializes a new assessment attempt session
   */
  public startAttempt(
    blueprint: AssessmentBlueprint,
    studentId: string,
    curriculumId: string,
    curriculumVersion: string,
    config: AssessmentSessionConfig = { mode: "STANDARD" }
  ): AssessmentAttempt {
    const attemptId = `ATT-${blueprint.type}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    const selector: IQuestionSelector = config.mode === "ADAPTIVE"
      ? this.selectors.adaptive
      : this.selectors.standard;

    const initialQuestions = selector.selectInitialQuestions(blueprint, this.bank);

    const attempt: AssessmentAttempt = {
      attemptId,
      studentId,
      curriculumId,
      curriculumVersion,
      blueprintId: blueprint.id,
      type: blueprint.type,
      status: "IN_PROGRESS",
      startedAt: new Date().toISOString(),
      selectedQuestionIds: initialQuestions.map(q => q.id),
      currentQuestionIndex: 0,
      interactions: [],
      evidenceEvents: [],
      rawScore: 0,
      maxScore: 0,
      scorePercentage: 0
    };

    this.attempts.set(attemptId, attempt);
    return attempt;
  }

  public getAttempt(attemptId: string): AssessmentAttempt | undefined {
    return this.attempts.get(attemptId);
  }

  /**
   * Submits a learner response for the current question
   */
  public submitResponse(
    attemptId: string,
    questionId: string,
    blueprint: AssessmentBlueprint,
    response: ResponsePayload,
    metrics: ResponseSubmissionMetrics,
    config: AssessmentSessionConfig = { mode: "STANDARD" }
  ): { attempt: AssessmentAttempt; interaction: StudentQuestionInteraction } {
    const attempt = this.attempts.get(attemptId);
    if (!attempt) {
      throw new Error(`Assessment attempt not found: ${attemptId}`);
    }

    if (attempt.status !== "IN_PROGRESS") {
      throw new Error(`Cannot submit response to assessment attempt with status: ${attempt.status}`);
    }

    if (attempt.blueprintId !== blueprint.id) {
      throw new Error("Assessment blueprint does not match the active attempt");
    }

    const expectedQuestionId = attempt.selectedQuestionIds[attempt.currentQuestionIndex];
    if (questionId !== expectedQuestionId) {
      throw new Error("Question does not match the current assessment step");
    }

    if (attempt.interactions.some((interaction) => interaction.questionId === questionId)) {
      throw new Error("Question has already been answered in this attempt");
    }

    if (!Number.isFinite(metrics.responseTimeMs) || metrics.responseTimeMs < 0) {
      throw new Error("Response time must be a non-negative finite number");
    }

    const question = this.bank.getQuestion(questionId);
    if (!question) {
      throw new Error(`Question instance not found in bank: ${questionId}`);
    }

    if (
      question.curriculumId !== attempt.curriculumId ||
      question.curriculumVersion !== attempt.curriculumVersion
    ) {
      throw new Error("Question curriculum does not match the active attempt");
    }

    const qb = blueprint.questionBlueprints.find((b) => b.id === question.blueprintId);
    if (!qb) {
      throw new Error("Question blueprint was not found in the active assessment");
    }

    // 1. Evaluate & Generate Evidence Event
    const evidence = this.evidenceGen.evaluateAndEmitEvidence({
      studentId: attempt.studentId,
      assessmentAttemptId: attempt.attemptId,
      questionInstance: question,
      blueprint: qb,
      response,
      responseTimeMs: metrics.responseTimeMs,
      attemptsCount: metrics.attemptsCount || 1,
      hintsUsedCount: metrics.hintsUsedCount || 0
    });

    attempt.evidenceEvents.push(evidence);

    // 2. Record Interaction
    const maxPoints = question.points || 1;
    const pointsEarned = evidence.pointsEarned;

    const interaction: StudentQuestionInteraction = {
      questionId: question.id,
      blueprintId: question.blueprintId,
      skillId: question.skillId,
      response,
      evaluationResult: evidence.evaluationResult,
      isCorrect: evidence.isCorrect,
      scorePercentage: evidence.scorePercentage,
      pointsEarned,
      maxPoints,
      startedAt: new Date(Date.now() - metrics.responseTimeMs).toISOString(),
      submittedAt: new Date().toISOString(),
      responseTimeMs: metrics.responseTimeMs,
      attemptsCount: metrics.attemptsCount || 1,
      hintsUsedCount: metrics.hintsUsedCount || 0,
      retriesCount: metrics.retriesCount || 0,
      flaggedMisconceptionIds: evidence.flaggedMisconceptionIds
    };

    attempt.interactions.push(interaction);
    attempt.rawScore += pointsEarned;
    attempt.maxScore += maxPoints;
    attempt.scorePercentage = attempt.maxScore > 0 
      ? Math.round((attempt.rawScore / attempt.maxScore) * 100) 
      : 0;

    // 3. Step forward or Adaptive Item Selection
    if (config.mode === "ADAPTIVE") {
      const nextQ = this.selectors.adaptive.selectNextQuestion(attempt, blueprint, this.bank);
      if (nextQ) {
        attempt.selectedQuestionIds.push(nextQ.id);
        attempt.currentQuestionIndex++;
      } else {
        this.completeAttempt(attemptId);
      }
    } else {
      attempt.currentQuestionIndex++;
      if (attempt.currentQuestionIndex >= attempt.selectedQuestionIds.length) {
        this.completeAttempt(attemptId);
      }
    }

    return { attempt, interaction };
  }

  /**
   * Concludes the attempt session and compiles the final summary
   */
  public completeAttempt(attemptId: string): AssessmentAttemptSummary {
    const attempt = this.attempts.get(attemptId);
    if (!attempt) {
      throw new Error(`Assessment attempt not found: ${attemptId}`);
    }

    attempt.status = "COMPLETED";
    attempt.finishedAt = new Date().toISOString();
    attempt.totalDurationMs = new Date(attempt.finishedAt).getTime() - new Date(attempt.startedAt).getTime();

    // 1. Calculate Skill Performance Summaries
    const skillMap: Map<string, {
      count: number;
      correct: number;
      earned: number;
      total: number;
      durations: number[];
      misconceptions: Set<string>;
    }> = new Map();

    for (const inter of attempt.interactions) {
      if (!skillMap.has(inter.skillId)) {
        skillMap.set(inter.skillId, {
          count: 0,
          correct: 0,
          earned: 0,
          total: 0,
          durations: [],
          misconceptions: new Set()
        });
      }
      const s = skillMap.get(inter.skillId)!;
      s.count++;
      if (inter.isCorrect) s.correct++;
      s.earned += inter.pointsEarned;
      s.total += inter.maxPoints;
      s.durations.push(inter.responseTimeMs);
      inter.flaggedMisconceptionIds.forEach(m => s.misconceptions.add(m));
    }

    const skillSummaries: SkillPerformanceSummary[] = Array.from(skillMap.entries()).map(([skillId, data]) => ({
      skillId,
      questionsCount: data.count,
      correctCount: data.correct,
      pointsEarned: data.earned,
      totalPoints: data.total,
      scorePercentage: data.total > 0 ? Math.round((data.earned / data.total) * 100) : 0,
      averageResponseTimeMs: Math.round(data.durations.reduce((a, b) => a + b, 0) / data.durations.length),
      misconceptionsDetected: Array.from(data.misconceptions)
    }));

    // 2. Fluency Metrics
    let fastAccurate = 0;
    let slowAccurate = 0;
    let fastInaccurate = 0;
    let slowInaccurate = 0;
    let totalTime = 0;

    for (const ev of attempt.evidenceEvents) {
      totalTime += ev.responseTimeMs;
      if (ev.timingClassification === "FAST_ACCURATE") fastAccurate++;
      else if (ev.timingClassification === "SLOW_ACCURATE") slowAccurate++;
      else if (ev.timingClassification === "FAST_INACCURATE") fastInaccurate++;
      else if (ev.timingClassification === "SLOW_INACCURATE") slowInaccurate++;
    }

    const avgSpeed = attempt.evidenceEvents.length > 0
      ? Math.round(totalTime / attempt.evidenceEvents.length)
      : 0;

    // 3. Recommended Placement (for Diagnostic)
    let recommendedPlacement: AssessmentAttemptSummary["recommendedPlacement"];
    if (attempt.type === "DIAGNOSTIC") {
      const pct = attempt.scorePercentage;
      const confidence = pct >= 40 && pct < 70 ? "MEDIUM" : "HIGH";
      const stageLevel = pct >= 85 ? 4 : pct >= 70 ? 3 : pct >= 40 ? 2 : 1;
      recommendedPlacement = {
        recommendedStageId: `STAGE-${stageLevel}`,
        confidence,
        rationale: pct >= 85 
          ? "Exhibited comprehensive mastery across advanced curriculum competencies."
          : pct >= 70
          ? "Secure in intermediate competencies. Ready for advanced stage progression."
          : pct >= 40
          ? "Developing baseline competencies, but core foundations need targeted reinforcement."
          : "Prerequisite foundation gaps detected. Remediation and stage 1 grounding recommended."
      };
    }

    return {
      attemptId: attempt.attemptId,
      studentId: attempt.studentId,
      blueprintId: attempt.blueprintId,
      type: attempt.type,
      startedAt: attempt.startedAt,
      finishedAt: attempt.finishedAt,
      totalDurationMs: attempt.totalDurationMs,
      rawScore: attempt.rawScore,
      maxScore: attempt.maxScore,
      scorePercentage: attempt.scorePercentage,
      isPassing: attempt.scorePercentage >= 75,
      skillSummaries,
      fluencyMetrics: {
        fastAccurateCount: fastAccurate,
        slowAccurateCount: slowAccurate,
        fastInaccurateCount: fastInaccurate,
        slowInaccurateCount: slowInaccurate,
        averageSpeedPerItemMs: avgSpeed
      },
      recommendedPlacement
    };
  }
}
