import crypto from "crypto";
import { query } from "../db/connection";
import { logAudit } from "./audit";
import type { SourceAnalysisRecord, SourceSnapshotRecord, SourceType } from "../../contracts/source-governance";

function hash(value: string | Buffer): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function recordSourceAnalysis(input: {
  sourceType: SourceType;
  sourceReference: string;
  title: string;
  sourceVersion?: string;
  sourceBytes?: Buffer;
  extractedText: string;
  scope: string;
  locator: Record<string, string>;
  analysis: string;
  capturedBy: string;
}): Promise<{ snapshot: SourceSnapshotRecord; analysis: SourceAnalysisRecord }> {
  const capturedAt = new Date().toISOString();
  const contentHash = hash(input.sourceBytes ?? input.sourceReference);
  const extractedTextHash = hash(input.extractedText);
  const snapshotId = crypto.randomUUID();
  const analysisId = crypto.randomUUID();

  await query(
    `INSERT INTO source_snapshots
      (id, source_type, source_reference, title, source_version, captured_at, content_hash, extracted_text_hash, license_status, verification_status, captured_by, metadata)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'REVIEW_REQUIRED', 'UNVERIFIED', ?, ?)`,
    [snapshotId, input.sourceType, input.sourceReference, input.title, input.sourceVersion ?? null, capturedAt, contentHash, extractedTextHash, input.capturedBy, JSON.stringify({ extractedCharacters: input.extractedText.length })]
  );
  await query(
    `INSERT INTO source_analysis_records
      (id, source_snapshot_id, scope, locator, analysis, status, created_by, created_at)
     VALUES (?, ?, ?, ?, ?, 'UNDER_REVIEW', ?, ?)`,
    [analysisId, snapshotId, input.scope, JSON.stringify(input.locator), input.analysis, input.capturedBy, capturedAt]
  );
  await logAudit({ userId: input.capturedBy, action: "RECORD_SOURCE_ANALYSIS", targetEntity: "source_analysis_records", targetId: analysisId, details: { snapshotId, sourceType: input.sourceType, scope: input.scope } });

  return {
    snapshot: { snapshotId, sourceType: input.sourceType, sourceReference: input.sourceReference, title: input.title, ...(input.sourceVersion ? { sourceVersion: input.sourceVersion } : {}), capturedAt, contentHash, extractedTextHash, licenseStatus: "REVIEW_REQUIRED", verificationStatus: "UNVERIFIED" },
    analysis: { analysisId, snapshotId, scope: input.scope, locator: input.locator, analysis: input.analysis, status: "UNDER_REVIEW", createdBy: input.capturedBy, createdAt: capturedAt }
  };
}
