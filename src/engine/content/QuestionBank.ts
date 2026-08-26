import { 
  QuestionInstance, 
  QuestionBankFilter, 
  QuestionApprovalStatus 
} from "../../contracts/question-content";

/**
 * GENERIC QUESTION BANK REPOSITORY
 * 
 * Manages, indexes, and queries concrete Question Instances.
 * Strictly decoupled from Curriculum Packages.
 */
export class QuestionBank {
  private questions: Map<string, QuestionInstance> = new Map();
  private bySkill: Map<string, Set<string>> = new Map();
  private byBlueprint: Map<string, Set<string>> = new Map();

  constructor(initialQuestions: QuestionInstance[] = []) {
    for (const q of initialQuestions) {
      this.registerQuestion(q);
    }
  }

  /**
   * Registers or updates a Question Instance in the bank
   */
  public registerQuestion(question: QuestionInstance): void {
    this.questions.set(question.id, question);

    // Index by skill
    if (!this.bySkill.has(question.skillId)) {
      this.bySkill.set(question.skillId, new Set());
    }
    this.bySkill.get(question.skillId)!.add(question.id);

    // Index by blueprint
    if (!this.byBlueprint.has(question.blueprintId)) {
      this.byBlueprint.set(question.blueprintId, new Set());
    }
    this.byBlueprint.get(question.blueprintId)!.add(question.id);
  }

  public getQuestion(id: string): QuestionInstance | undefined {
    return this.questions.get(id);
  }

  public getAllQuestions(): QuestionInstance[] {
    return Array.from(this.questions.values());
  }

  /**
   * Query the question bank with specific educational filters.
   * Default rule: returns only APPROVED questions unless explicit status requested.
   */
  public queryQuestions(filter: QuestionBankFilter = {}): QuestionInstance[] {
    const {
      skillId,
      blueprintId,
      curriculumId,
      difficulty,
      status = "APPROVED", // Default to APPROVED questions for safety
      origin,
      limit
    } = filter;

    let candidateIds: string[] | null = null;

    if (blueprintId && this.byBlueprint.has(blueprintId)) {
      candidateIds = Array.from(this.byBlueprint.get(blueprintId)!);
    } else if (skillId && this.bySkill.has(skillId)) {
      candidateIds = Array.from(this.bySkill.get(skillId)!);
    }

    const pool = candidateIds 
      ? candidateIds.map(id => this.questions.get(id)!).filter(Boolean)
      : Array.from(this.questions.values());

    const filtered = pool.filter(q => {
      if (skillId && q.skillId !== skillId) return false;
      if (blueprintId && q.blueprintId !== blueprintId) return false;
      if (curriculumId && q.curriculumId !== curriculumId) return false;
      if (difficulty !== undefined && q.difficulty !== difficulty) return false;
      if (status !== undefined && q.approval.status !== status) return false;
      if (origin !== undefined && q.origin !== origin) return false;
      return true;
    });

    if (limit && limit > 0) {
      return filtered.slice(0, limit);
    }

    return filtered;
  }

  /**
   * Updates question approval governance record
   */
  public updateApproval(
    questionId: string,
    status: QuestionApprovalStatus,
    educatorId: string,
    comments?: string
  ): QuestionInstance {
    const question = this.questions.get(questionId);
    if (!question) {
      throw new Error(`Question not found: ${questionId}`);
    }

    question.approval = {
      status,
      reviewedBy: educatorId,
      reviewedAt: new Date().toISOString(),
      reviewerComments: comments,
      version: question.approval.version + 1
    };

    return question;
  }
}
