import fs from "fs";
import path from "path";
import crypto from "crypto";
import { loadEnvConfig } from "@next/env";

// Load Next.js environment variables before database helpers get imported
loadEnvConfig(process.cwd());

import { getDbPool, query } from "./connection";
import { hashPassword } from "../services/auth";
import { registerPackageVersion } from "../services/registry";
import { curriculum0580 } from "../../curriculum-packages/0580";

const SEED_IDS = {
  admin: "00000000-0000-4000-8000-000000000001",
  teacher: "00000000-0000-4000-8000-000000000002",
  student: "00000000-0000-4000-8000-000000000003",
  parent: "00000000-0000-4000-8000-000000000005",
  class: "00000000-0000-4000-8000-000000000004"
};

async function seedUser(user: { id: string; email: string; password: string; firstName: string; lastName: string; role: string }) {
  await query(
    `INSERT INTO users (id, email, password_hash, first_name, last_name, role)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE first_name = ?, last_name = ?, role = ?`,
    [user.id, user.email, await hashPassword(user.password), user.firstName, user.lastName, user.role, user.firstName, user.lastName, user.role]
  );
}

async function main() {
  console.log("Initializing database connection...");
  const pool = getDbPool();

  try {
    // 1. Read and split SQL schema file
    const schemaPath = path.join(process.cwd(), "src/core/db/schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf-8");
    
    // Split on semicolon, filtering out empty entries
    const statements = schemaSql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    console.log(`Running ${statements.length} schema statements...`);
    for (const stmt of statements) {
      await pool.query(stmt);
    }
    await pool.query("ALTER TABLE source_snapshots MODIFY source_type ENUM('PDF', 'DOCX', 'WEBPAGE', 'TEXT', 'IMAGE') NOT NULL");
    console.log("Database schema applied successfully.");

    // 2. Seed deterministic development identities and relationships.
    await seedUser({ id: SEED_IDS.admin, email: "admin@platform.com", password: "admin123", firstName: "System", lastName: "Admin", role: "ADMIN" });
    await seedUser({ id: SEED_IDS.teacher, email: "teacher@platform.com", password: "teacher123", firstName: "Alex", lastName: "Carter", role: "TEACHER" });
    await seedUser({ id: SEED_IDS.student, email: "student@platform.com", password: "student123", firstName: "Daniel", lastName: "Morgan", role: "STUDENT" });
    await seedUser({ id: SEED_IDS.parent, email: "parent@platform.com", password: "parent123", firstName: "Jordan", lastName: "Morgan", role: "PARENT" });

    await query(
      "INSERT INTO curriculums (id, name, publisher) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = ?, publisher = ?",
      ["cambridge-igcse-0580", "Cambridge IGCSE Mathematics 0580", "Cambridge Assessment International Education", "Cambridge IGCSE Mathematics 0580", "Cambridge Assessment International Education"]
    );
    const existingVersion = await query<any[]>(
      "SELECT id FROM curriculum_versions WHERE curriculum_id = ? AND package_version = ? LIMIT 1",
      [curriculum0580.identity.id, curriculum0580.version.packageVersion]
    );
    if (existingVersion.length === 0) {
      const versionResult = await registerPackageVersion(SEED_IDS.admin, curriculum0580.identity.id, curriculum0580);
      if (!versionResult.success) throw new Error(versionResult.errors.join("; "));
    }
    await query(
      `INSERT INTO classes (id, name, curriculum_id, teacher_id) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = ?, curriculum_id = ?, teacher_id = ?`,
      [SEED_IDS.class, "Year 10 Mathematics", "cambridge-igcse-0580", SEED_IDS.teacher, "Year 10 Mathematics", "cambridge-igcse-0580", SEED_IDS.teacher]
    );
    await query(
      "INSERT IGNORE INTO class_enrollments (class_id, student_id) VALUES (?, ?)",
      [SEED_IDS.class, SEED_IDS.student]
    );
    await query(
      "INSERT IGNORE INTO parent_student_links (parent_id, student_id) VALUES (?, ?)",
      [SEED_IDS.parent, SEED_IDS.student]
    );
    await query(
      "INSERT INTO audit_logs (id, user_id, action, target_entity, target_id, details) VALUES (?, ?, 'SYSTEM_SEED', 'users', ?, ?) ",
      [crypto.randomUUID(), SEED_IDS.admin, SEED_IDS.admin, JSON.stringify({ seededRoles: ["ADMIN", "TEACHER", "STUDENT"], classId: SEED_IDS.class })]
    );
    console.log("Development identities and class enrollment seeded.");
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
    console.log("Connection closed.");
  }
}

main();
