export type SourceType = "PDF" | "DOCX" | "WEBPAGE" | "TEXT" | "IMAGE";
export type SourceAnalysisStatus = "UNDER_REVIEW" | "APPROVED" | "REJECTED";

export interface SourceSnapshotRecord {
  snapshotId: string;
  sourceType: SourceType;
  sourceReference: string;
  title: string;
  sourceVersion?: string;
  capturedAt: string;
  contentHash: string;
  extractedTextHash: string;
  licenseStatus: "UNVERIFIED" | "REVIEW_REQUIRED" | "CLEARED";
  verificationStatus: "UNVERIFIED" | "SOURCE_MAPPED" | "VERIFIED";
}

export interface SourceAnalysisRecord {
  analysisId: string;
  snapshotId: string;
  scope: string;
  locator: Record<string, string>;
  analysis: string;
  status: SourceAnalysisStatus;
  createdBy: string;
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
}
