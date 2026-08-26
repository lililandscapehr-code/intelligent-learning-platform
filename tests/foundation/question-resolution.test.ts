import assert from "node:assert/strict";
import test from "node:test";
import type { AssessmentRevision } from "../../src/contracts/foundation";
import { resolveQuestionVersion } from "../../src/features/diagnostic/question-resolution";

const revision: AssessmentRevision = {
  revisionId: "AR-0580-READINESS-1",
  assessmentId: "ASSESS-0580-READINESS",
  curriculumId: "cambridge-igcse-0580",
  curriculumVersion: "2025-2027",
  type: "DIAGNOSTIC",
  blueprint: {
    id: "ASSESS-0580-READINESS",
    type: "READINESS",
    purpose: "Foundation readiness assessment",
    questionBlueprints: [{
      id: "QB-0580-R-FRAC-01",
      skillId: "SK-NUM-FRAC-ADD",
      type: "MULTIPLE_CHOICE",
      difficulty: 2,
      expectedResponseType: "CHOICE_ID",
      scoringModel: "BINARY_EXACT",
      timingExpectation: { trackingType: "SESSION_MS" },
    }],
  },
  questionVersionIds: ["QI-0580-FRAC-001"],
  scoringPolicyVersion: "binary-exact-v1",
};

test("resolves only approved questions included in the assessment revision", () => {
  const question = resolveQuestionVersion(revision, "QI-0580-FRAC-001");
  assert.equal(question.blueprintId, "QB-0580-R-FRAC-01");
  assert.throws(
    () => resolveQuestionVersion(revision, "QI-0580-LCM-001"),
    /QUESTION_NOT_IN_ASSESSMENT_REVISION/,
  );
});