import { query } from "../db/connection";

export interface AuditLogParams {
  userId?: string | null;
  action: string;
  targetEntity: string;
  targetId?: string | null;
  details?: Record<string, any>;
}

export async function logAudit(params: AuditLogParams): Promise<void> {
  const { userId = null, action, targetEntity, targetId = null, details = {} } = params;
  
  // Use crypto to generate UUIDs in Node.js
  const id = require("crypto").randomUUID();
  const detailsJson = JSON.stringify(details);

  try {
    await query(
      "INSERT INTO audit_logs (id, user_id, action, target_entity, target_id, details) VALUES (?, ?, ?, ?, ?, ?)",
      [id, userId, action, targetEntity, targetId, detailsJson]
    );
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}
