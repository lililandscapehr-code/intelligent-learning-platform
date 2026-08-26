import { 
  QuestionInstance, 
  QuestionApprovalStatus 
} from "../../contracts/question-content";
import { 
  QuestionBlueprint 
} from "../../contracts/assessment";
import { Skill } from "../../contracts/curriculum";
import { QuestionBank } from "./QuestionBank";
import crypto from "crypto";

export interface AIDraftParams {
  curriculumId: string;
  curriculumVersion: string;
  promptText: string;
  choices: { id: string; text: string; isCorrect: boolean; misconceptionId?: string; rationale?: string }[];
  explanationText: string;
  modelIdentifier?: string;
}

/**
 * QUESTION AUTHORING & GOVERNANCE SERVICE
 * 
 * Manages the lifecycle of content from AI Draft -> Educator Review -> Approved.
 */
export class QuestionAuthoringService {
  private bank: QuestionBank;

  constructor(bank: QuestionBank) {
    this.bank = bank;
  }

  /**
   * AI drafts a question instance based on a blueprint and skill
   * STRICT GOVERNANCE RULE: Question is created with status 'AI_DRAFT'
   */
  public generateAIDraft(
    blueprint: QuestionBlueprint,
    skill: Skill,
    params: AIDraftParams
  ): QuestionInstance {
    const questionId = `QI-AI-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    const draftQuestion: QuestionInstance = {
      id: questionId,
      blueprintId: blueprint.id,
      skillId: skill.id,
      curriculumId: params.curriculumId,
      curriculumVersion: params.curriculumVersion,
      promptText: params.promptText,
      difficulty: blueprint.difficulty,
      points: blueprint.difficulty,
      answerConfig: {
        type: "MULTIPLE_CHOICE",
        choices: params.choices.map(c => ({
          id: c.id,
          text: c.text,
          isCorrect: c.isCorrect,
          misconceptionId: c.misconceptionId,
          distractorRationale: c.rationale
        }))
      },
      explanationText: params.explanationText,
      origin: "AI_GENERATED",
      provenance: {
        generatorModel: params.modelIdentifier || "educational-ai-author-v1",
        generatedAt: new Date().toISOString()
      },
      approval: {
        status: "AI_DRAFT",
        version: 1
      },
      tags: [skill.id, `difficulty-${blueprint.difficulty}`]
    };

    this.bank.registerQuestion(draftQuestion);
    return draftQuestion;
  }

  /**
   * Educator reviews and approves a question for student deployment
   */
  public approveQuestion(
    questionId: string,
    educatorId: string,
    reviewComments?: string
  ): QuestionInstance {
    const q = this.bank.getQuestion(questionId);
    if (!q) {
      throw new Error(`Cannot approve non-existent question: ${questionId}`);
    }

    return this.bank.updateApproval(questionId, "APPROVED", educatorId, reviewComments || "Verified for curriculum syllabus compliance.");
  }

  /**
   * Rejects a question with feedback
   */
  public rejectQuestion(
    questionId: string,
    educatorId: string,
    rejectionReason: string
  ): QuestionInstance {
    return this.bank.updateApproval(questionId, "REJECTED", educatorId, rejectionReason);
  }
}
