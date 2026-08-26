export type ContentRegistryContentType = "LESSON" | "QUESTION" | "CAROUSEL" | "ASSESSMENT" | "RESOURCE";
export type ContentRegistryStatus = "DRAFT" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "PUBLISHED" | "ARCHIVED";
export type ContentRegistrySourceKind = "MANUAL" | "IMPORT" | "AI_ASSISTED";
export type ContentRegistryDecision = "APPROVE" | "REJECT" | "REQUEST_CHANGES";

export type ContentRegistryApprovalState = "AI_SUGGESTED" | "TEACHER_DRAFT" | "APPROVED" | "REJECTED";

export interface ContentRegistrySource {
  kind: ContentRegistrySourceKind;
  reference?: string;
  provenance?: string;
}

export interface ContentRegistryDraft {
  id: string;
  curriculumId: string;
  title: string;
  contentType: ContentRegistryContentType;
  createdBy: string;
  createdAt: string;
  status: ContentRegistryStatus;
  approvalState: ContentRegistryApprovalState;
  source: ContentRegistrySource;
  payload: Record<string, unknown>;
  checksum: string;
}

export interface ContentRegistryApproval {
  id: string;
  contentId: string;
  reviewerId: string;
  decision: ContentRegistryDecision;
  note?: string;
  createdAt: string;
}

export interface ContentRegistryVersion {
  id: string;
  contentId: string;
  versionNumber: number;
  versionLabel: string;
  checksum: string;
  status: ContentRegistryStatus;
  createdBy: string;
  createdAt: string;
  publishedBy?: string;
  publishedAt?: string;
}
