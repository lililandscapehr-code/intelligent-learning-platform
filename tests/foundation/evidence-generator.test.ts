import assert from "node:assert/strict";
import test from "node:test";
import { EvidenceGenerator } from "../../src/engine/content/EvidenceGenerator";
import { sample0580Questions } from "../../src/curriculum-packages/0580/question-bank";
import { assessments } from "../../src/curriculum-packages/0580/assessments";

test("new evidence does not mutate an earlier evidence event", () => {
  const generator = new EvidenceGenerator();
  const question = sample0580Questions[0];
  const blueprint = assessments.find((item) => item.id === "ASSESS-0580-READINESS")!.questionBlueprints[0];
  const first = generator.evaluateAndEmitEvidence({
    studentId: "student-a",
    assessmentAttemptId: "attempt-a",
    questionInstance: question,
    blueprint,
    response: { type: "CHOICE_ID", choiceId: "A" },
    responseTimeMs: 10000,
  });
  const before = structuredClone(first);
  const second = generator.evaluateAndEmitEvidence({
    studentId: "student-a",
    assessmentAttemptId: "attempt-b",
    questionInstance: question,
    blueprint,
    response: { type: "CHOICE_ID", choiceId: "B" },
    responseTimeMs: 12000,
  });

  assert.deepEqual(first, before);
  assert.notEqual(first.evidenceId, second.evidenceId);
  assert.notEqual(first.sourceAssessmentAttemptId, second.sourceAssessmentAttemptId);
});