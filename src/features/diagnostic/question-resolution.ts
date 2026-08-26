import type { AssessmentBlueprint } from "../../contracts/assessment";
import type { AssessmentRevision } from "../../contracts/foundation";
import type { QuestionInstance } from "../../contracts/question-content";
import { sample0580Questions } from "../../curriculum-packages/0580/question-bank";
import { integratedScienceDiagnosticQuestions } from "../../curriculum-packages/egypt-secondary1-integrated-science/question-bank";

const questionCatalogs: Record<string, QuestionInstance[]> = {
  "cambridge-igcse-0580": sample0580Questions,
  "egypt-secondary1-integrated-science": integratedScienceDiagnosticQuestions,
};

export function resolveQuestionVersion(
  revision: AssessmentRevision,
  questionVersionId: string,
): QuestionInstance {
  if (!revision.questionVersionIds.includes(questionVersionId)) {
    throw new Error("QUESTION_NOT_IN_ASSESSMENT_REVISION");
  }

  const question = questionCatalogs[revision.curriculumId]?.find(
    (candidate) => candidate.id === questionVersionId,
  );
  if (!question) throw new Error("QUESTION_VERSION_NOT_FOUND");
  if (question.curriculumVersion !== revision.curriculumVersion) {
    throw new Error("QUESTION_VERSION_MISMATCH");
  }
  if (question.approval.status !== "APPROVED") {
    throw new Error("QUESTION_NOT_APPROVED");
  }
  return question;
}

export function resolveQuestionBlueprint(
  blueprint: AssessmentBlueprint,
  question: QuestionInstance,
) {
  const questionBlueprint = blueprint.questionBlueprints.find(
    (candidate) => candidate.id === question.blueprintId,
  );
  if (!questionBlueprint) throw new Error("QUESTION_BLUEPRINT_NOT_FOUND");
  return questionBlueprint;
}