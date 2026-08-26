export * from "./question-bank/index";
import { sample0580Questions } from "./question-bank/index";

export interface ReadinessQuestionChoice {
  id: string;
  text: string;
  isCorrect: boolean;
  misconceptionId?: string;
}

export interface ReadinessQuestion {
  id: string;
  blueprintId: string;
  skillId: string;
  promptText: string;
  type: "MULTIPLE_CHOICE";
  choices: ReadinessQuestionChoice[];
}

export const readinessQuestionBank: ReadinessQuestion[] = sample0580Questions.map(q => ({
  id: q.id,
  blueprintId: q.blueprintId,
  skillId: q.skillId,
  promptText: q.promptText,
  type: "MULTIPLE_CHOICE" as const,
  choices: (q.answerConfig.choices || []).map(c => ({
    id: c.id,
    text: c.text,
    isCorrect: c.isCorrect,
    misconceptionId: c.misconceptionId
  }))
}));
