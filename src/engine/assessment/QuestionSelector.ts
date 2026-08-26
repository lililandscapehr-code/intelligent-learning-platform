import { AssessmentBlueprint, QuestionBlueprint } from "../../contracts/assessment";
import { QuestionInstance } from "../../contracts/question-content";
import { QuestionBank } from "../content/QuestionBank";
import { AssessmentAttempt } from "../../contracts/assessment-execution";

export interface IQuestionSelector {
  selectInitialQuestions(blueprint: AssessmentBlueprint, bank: QuestionBank): QuestionInstance[];
  selectNextQuestion?(attempt: AssessmentAttempt, blueprint: AssessmentBlueprint, bank: QuestionBank): QuestionInstance | null;
}

/**
 * Standard Fixed/Linear Question Selector
 * Selects 1 question instance from the bank per question blueprint.
 */
export class StandardQuestionSelector implements IQuestionSelector {
  public selectInitialQuestions(blueprint: AssessmentBlueprint, bank: QuestionBank): QuestionInstance[] {
    const selected: QuestionInstance[] = [];

    for (const qb of blueprint.questionBlueprints) {
      const candidates = bank.queryQuestions({
        blueprintId: qb.id,
        skillId: qb.skillId,
        difficulty: qb.difficulty,
        status: "APPROVED"
      });

      if (candidates.length > 0) {
        selected.push(candidates[0]);
      } else {
        // Fallback query by skill only
        const fallbackCandidates = bank.queryQuestions({
          skillId: qb.skillId,
          status: "APPROVED"
        });
        if (fallbackCandidates.length > 0) {
          selected.push(fallbackCandidates[0]);
        }
      }
    }

    return selected;
  }
}

/**
 * Adaptive Difficulty-Stepping Question Selector
 * Dynamically adjusts difficulty up or down based on previous item performance.
 */
export class AdaptiveQuestionSelector implements IQuestionSelector {
  public selectInitialQuestions(blueprint: AssessmentBlueprint, bank: QuestionBank): QuestionInstance[] {
    // Start with a medium difficulty (level 2 or 3) item
    const firstQb = blueprint.questionBlueprints[0];
    const initialCandidates = bank.queryQuestions({
      skillId: firstQb.skillId,
      difficulty: firstQb.difficulty,
      status: "APPROVED"
    });

    return initialCandidates.slice(0, 1);
  }

  public selectNextQuestion(attempt: AssessmentAttempt, blueprint: AssessmentBlueprint, bank: QuestionBank): QuestionInstance | null {
    const lastInteraction = attempt.interactions[attempt.interactions.length - 1];
    if (!lastInteraction) return null;

    // Check if max questions reached
    if (attempt.interactions.length >= blueprint.questionBlueprints.length) {
      return null; // Conclude assessment
    }

    const nextQb = blueprint.questionBlueprints[attempt.interactions.length];
    if (!nextQb) return null;

    // Step difficulty based on accuracy of last interaction
    const lastCorrect = lastInteraction.isCorrect;
    const currentDifficulty = nextQb.difficulty;
    const targetDifficulty = lastCorrect 
      ? Math.min(5, currentDifficulty + 1)
      : Math.max(1, currentDifficulty - 1);

    const candidates = bank.queryQuestions({
      skillId: nextQb.skillId,
      difficulty: targetDifficulty,
      status: "APPROVED"
    });

    if (candidates.length > 0) {
      // Return first unserved question
      const unserved = candidates.find(q => !attempt.selectedQuestionIds.includes(q.id));
      return unserved || candidates[0];
    }

    // Fallback: any question for this skill
    const fallback = bank.queryQuestions({
      skillId: nextQb.skillId,
      status: "APPROVED"
    }).find(q => !attempt.selectedQuestionIds.includes(q.id));

    return fallback || null;
  }
}
