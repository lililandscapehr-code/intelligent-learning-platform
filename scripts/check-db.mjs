import nextEnv from "@next/env";
import mysql from "mysql2/promise";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const required = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
const missing = required.filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error(`Missing environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : undefined,
});

try {
  await connection.query("SELECT 1");
  const [rows] = await connection.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = ?",
    [process.env.DB_NAME]
  );
  const tables = new Set(rows.map((row) => row.TABLE_NAME || row.table_name));
  const requiredTables = ["users", "curriculums", "curriculum_versions", "assessment_attempts", "assessment_responses", "evidence_events", "audit_logs"];
  const missingTables = requiredTables.filter((table) => !tables.has(table));
  if (missingTables.length > 0) {
    console.error(`Database is reachable but missing tables: ${missingTables.join(", ")}`);
    process.exitCode = 1;
  } else {
    console.log(`Database health check passed: ${requiredTables.length} required tables are present.`);
  }
} finally {
  await connection.end();
}