import crypto from "crypto";
import { query } from "../db/connection";
import { logAudit } from "./audit";
import type {
  ContentRegistryApproval,
  ContentRegistryDecision,
  ContentRegistryDraft,
  ContentRegistrySource,
  ContentRegistryStatus,
  ContentRegistryApprovalState,
  ContentRegistryContentType,
} from "../../contracts/content-registry";

export interface CreateContentDraftInput {
  curriculumId: string;
  contentType: ContentRegistryContentType;
  title: string;
  createdBy: string;
  payload: Record<string, unknown>;
  source?: ContentRegistrySource;
}

export interface ContentApprovalInput {
  contentId: string;
  reviewerId: string;
  decision: ContentRegistryDecision;
  note?: string;
}

export function computeContentChecksum(payload: Record<string, unknown>): string {
  return crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

export function buildContentDraft(input: CreateContentDraftInput): ContentRegistryDraft {
  const source = input.source ?? { kind: "MANUAL" };
  const approvalState: ContentRegistryApprovalState = source.kind === "AI_ASSISTED" ? "AI_SUGGESTED" : "TEACHER_DRAFT";

  return {
    id: crypto.randomUUID(),
    curriculumId: input.curriculumId,
    title: input.title,
    contentType: input.contentType,
    createdBy: input.createdBy,
    createdAt: new Date().toISOString(),
    status: "DRAFT",
    approvalState,
    source,
    payload: input.payload,
    checksum: computeContentChecksum(input.payload),
  };
}

export function applyContentApproval(
  content: ContentRegistryDraft,
  approval: Pick<ContentRegistryApproval, "reviewerId" | "decision" | "note">,
): { content: ContentRegistryDraft; approval: ContentRegistryApproval } {
  const nextStatus: ContentRegistryStatus =
    approval.decision === "APPROVE"
      ? "APPROVED"
      : approval.decision === "REJECT"
        ? "REJECTED"
        : "UNDER_REVIEW";

  const nextApprovalState: ContentRegistryApprovalState =
    approval.decision === "APPROVE"
      ? "APPROVED"
      : approval.decision === "REJECT"
        ? "REJECTED"
        : "TEACHER_DRAFT";

  const nextContent: ContentRegistryDraft = {
    ...content,
    status: nextStatus,
    approvalState: nextApprovalState,
  };

  const nextRecord: ContentRegistryApproval = {
    id: crypto.randomUUID(),
    contentId: content.id,
    reviewerId: approval.reviewerId,
    decision: approval.decision,
    note: approval.note,
    createdAt: new Date().toISOString(),
  };

  return { content: nextContent, approval: nextRecord };
}

export function publishContentDraft(content: ContentRegistryDraft, publisherId: string): ContentRegistryDraft {
  if (content.status !== "APPROVED") {
    throw new Error("CONTENT_NOT_APPROVED");
  }

  return {
    ...content,
    status: "PUBLISHED",
    approvalState: "APPROVED",
  };
}

export async function registerContentDraft(input: CreateContentDraftInput): Promise<{ success: boolean; errors: string[]; data?: ContentRegistryDraft }> {
  try {
    const draft = buildContentDraft(input);
    await query(
      `INSERT INTO content_registry_entries
        (id, curriculum_id, content_type, title, created_by, status, approval_state, source_kind, source_reference, payload, checksum)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        draft.id,
        draft.curriculumId,
        draft.contentType,
        draft.title,
        draft.createdBy,
        draft.status,
        draft.approvalState,
        draft.source.kind,
        draft.source.reference ?? null,
        JSON.stringify(draft.payload),
        draft.checksum,
      ]
    );

    await query(
      `INSERT INTO content_registry_versions
        (id, content_id, version_number, version_label, checksum, status, created_by)
       VALUES (?, ?, 1, 'v1', ?, ?, ?)`,
      [crypto.randomUUID(), draft.id, draft.checksum, draft.createdBy]
    );

    await logAudit({
      userId: draft.createdBy,
      action: "REGISTER_CONTENT_DRAFT",
      targetEntity: "content_registry_entries",
      targetId: draft.id,
      details: { curriculumId: draft.curriculumId, contentType: draft.contentType, title: draft.title },
    });

    return { success: true, errors: [], data: draft };
  } catch (error: any) {
    return { success: false, errors: [error.message || "Failed to register content draft"], data: undefined };
  }
}

export async function approveContentDraft(input: ContentApprovalInput): Promise<{ success: boolean; errors: string[]; data?: { content: ContentRegistryDraft; approval: ContentRegistryApproval } }> {
  try {
    const [row] = await query<any[]>(
      "SELECT * FROM content_registry_entries WHERE id = ? LIMIT 1",
      [input.contentId]
    );
    if (!row) {
      return { success: false, errors: ["CONTENT_NOT_FOUND"], data: undefined };
    }

    const content: ContentRegistryDraft = {
      id: row.id,
      curriculumId: row.curriculum_id,
      title: row.title,
      contentType: row.content_type,
      createdBy: row.created_by,
      createdAt: row.created_at,
      status: row.status,
      approvalState: row.approval_state,
      source: { kind: row.source_kind, reference: row.source_reference ?? undefined },
      payload: JSON.parse(row.payload),
      checksum: row.checksum,
    };

    const result = applyContentApproval(content, {
      reviewerId: input.reviewerId,
      decision: input.decision,
      note: input.note,
    });

    await query(
      `UPDATE content_registry_entries
       SET status = ?, approval_state = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [result.content.status, result.content.approvalState, input.contentId]
    );

    await query(
      `INSERT INTO content_registry_approvals (id, content_id, reviewer_id, decision, decision_note)
       VALUES (?, ?, ?, ?, ?)`,
      [result.approval.id, input.contentId, input.reviewerId, input.decision, input.note ?? null]
    );

    await logAudit({
      userId: input.reviewerId,
      action: "APPROVE_CONTENT_DRAFT",
      targetEntity: "content_registry_entries",
      targetId: input.contentId,
      details: { decision: input.decision, note: input.note ?? null },
    });

    return { success: true, errors: [], data: result };
  } catch (error: any) {
    return { success: false, errors: [error.message || "Failed to approve content draft"], data: undefined };
  }
}

export async function publishContentEntry(contentId: string, publisherId: string): Promise<{ success: boolean; errors: string[]; data?: ContentRegistryDraft }> {
  try {
    const [row] = await query<any[]>(
      "SELECT * FROM content_registry_entries WHERE id = ? LIMIT 1",
      [contentId]
    );
    if (!row) {
      return { success: false, errors: ["CONTENT_NOT_FOUND"], data: undefined };
    }

    const current: ContentRegistryDraft = {
      id: row.id,
      curriculumId: row.curriculum_id,
      title: row.title,
      contentType: row.content_type,
      createdBy: row.created_by,
      createdAt: row.created_at,
      status: row.status,
      approvalState: row.approval_state,
      source: { kind: row.source_kind, reference: row.source_reference ?? undefined },
      payload: JSON.parse(row.payload),
      checksum: row.checksum,
    };

    const published = publishContentDraft(current, publisherId);

    await query(
      `UPDATE content_registry_entries
       SET status = ?, approval_state = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [published.status, published.approvalState, contentId]
    );

    await query(
      `UPDATE content_registry_versions
       SET status = 'PUBLISHED', published_by = ?, published_at = CURRENT_TIMESTAMP
       WHERE content_id = ? ORDER BY version_number DESC LIMIT 1`,
      [publisherId, contentId]
    );

    await logAudit({
      userId: publisherId,
      action: "PUBLISH_CONTENT_DRAFT",
      targetEntity: "content_registry_entries",
      targetId: contentId,
      details: { status: published.status },
    });

    return { success: true, errors: [], data: published };
  } catch (error: any) {
    return { success: false, errors: [error.message || "Failed to publish content draft"], data: undefined };
  }
}
