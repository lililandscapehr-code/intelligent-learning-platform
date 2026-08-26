import assert from "node:assert/strict";
import test from "node:test";
import { applyContentApproval, buildContentDraft, publishContentDraft } from "../../src/core/services/content-registry";

test("approved content can be published after review", () => {
  const draft = buildContentDraft({
    curriculumId: "cambridge-igcse-0580",
    contentType: "LESSON",
    title: "Ratio lesson",
    createdBy: "teacher-1",
    payload: { slides: [{ id: "intro", type: "lesson_text" }] },
  });

  const result = applyContentApproval(draft, {
    reviewerId: "teacher-2",
    decision: "APPROVE",
    note: "Clear and aligned to the stage skill map.",
  });

  assert.equal(result.content.status, "APPROVED");
  assert.equal(result.content.approvalState, "APPROVED");

  const published = publishContentDraft(result.content, "admin-1");
  assert.equal(published.status, "PUBLISHED");
});

test("rejected content cannot be published", () => {
  const draft = buildContentDraft({
    curriculumId: "cambridge-igcse-0580",
    contentType: "QUESTION",
    title: "Algebra practice",
    createdBy: "teacher-1",
    payload: { questionText: "Solve x + 2 = 5" },
  });

  const result = applyContentApproval(draft, {
    reviewerId: "admin-1",
    decision: "REJECT",
    note: "The distractor set is not aligned to the skill map.",
  });

  assert.equal(result.content.status, "REJECTED");
  assert.throws(() => publishContentDraft(result.content, "admin-1"), /CONTENT_NOT_APPROVED/);
});
