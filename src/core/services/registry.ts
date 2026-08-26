import crypto from "crypto";
import { query } from "../db/connection";
import { logAudit } from "./audit";
import { validatePackageAgainstSchema } from "./validation";
import { validateCurriculumPackage } from "../../curriculum-packages/validator";
import { CurriculumPackage } from "../../contracts/curriculum";
import { sample0580Questions } from "../../curriculum-packages/0580/question-bank";
import { integratedScienceDiagnosticQuestions } from "../../curriculum-packages/egypt-secondary1-integrated-science/question-bank";

export function computeChecksum(data: any): string {
  const content = typeof data === "string" ? data : JSON.stringify(data);
  return crypto.createHash("sha256").update(content).digest("hex");
}

export interface RegistryResult<T = any> {
  success: boolean;
  errors: string[];
  data?: T;
}

function questionCatalog(curriculumId: string) {
  if (curriculumId === "cambridge-igcse-0580") return sample0580Questions;
  if (curriculumId === "egypt-secondary1-integrated-science") return integratedScienceDiagnosticQuestions;
  return [];
}

async function registerAssessmentRevisions(userId: string, versionId: string, pkg: CurriculumPackage): Promise<void> {
  const questions = questionCatalog(pkg.identity.id).filter((question) => question.curriculumVersion === pkg.version.curriculumVersion && question.approval.status === "APPROVED");
  for (const blueprint of pkg.assessmentBlueprints.filter((item) => item.type === "READINESS" || item.type === "DIAGNOSTIC")) {
    const questionVersionIds = blueprint.questionBlueprints
      .map((questionBlueprint) => questions.find((question) => question.blueprintId === questionBlueprint.id)?.id)
      .filter((questionId): questionId is string => Boolean(questionId));
    if (questionVersionIds.length !== blueprint.questionBlueprints.length) {
      throw new Error(`MISSING_AUTHORITATIVE_INPUT: assessment ${blueprint.id} is missing approved question versions`);
    }

    const revisionId = crypto.createHash("sha256").update(`${versionId}:${blueprint.id}`).digest("hex").slice(0, 36);
    await query(
      `INSERT INTO assessment_revisions
        (id, assessment_id, curriculum_version_id, assessment_type, blueprint, question_version_ids, scoring_policy_version)
       VALUES (?, ?, ?, 'DIAGNOSTIC', ?, ?, ?)
       ON DUPLICATE KEY UPDATE blueprint = VALUES(blueprint), question_version_ids = VALUES(question_version_ids), scoring_policy_version = VALUES(scoring_policy_version)`,
      [revisionId, blueprint.id, versionId, JSON.stringify(blueprint), JSON.stringify(questionVersionIds), `${pkg.version.packageVersion}:BINARY_EXACT:v1`]
    );
    await logAudit({ userId, action: "REGISTER_ASSESSMENT_REVISION", targetEntity: "assessment_revisions", targetId: revisionId, details: { assessmentId: blueprint.id, questionVersionIds } });
  }
}

// --- Curriculum Registry ---
export async function registerCurriculum(
  userId: string,
  id: string,
  name: string,
  publisher: string
): Promise<RegistryResult> {
  try {
    // Audit check & log
    await query(
      "INSERT INTO curriculums (id, name, publisher) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = ?, publisher = ?",
      [id, name, publisher, name, publisher]
    );

    await logAudit({
      userId,
      action: "REGISTER_CURRICULUM",
      targetEntity: "curriculums",
      targetId: id,
      details: { name, publisher }
    });

    return { success: true, errors: [] };
  } catch (error: any) {
    return { success: false, errors: [error.message || "Failed to register curriculum"] };
  }
}

// --- Version & Service Registry ---
export async function registerPackageVersion(
  userId: string,
  curriculumId: string,
  rawPackage: any
): Promise<RegistryResult> {
  const errors: string[] = [];

  // 1. Run Schema validation
  const schemaCheck = validatePackageAgainstSchema(rawPackage);
  if (!schemaCheck.isValid) {
    errors.push(...schemaCheck.errors);
    return { success: false, errors };
  }

  // 2. Run structural and cycle validation
  const typedPkg = rawPackage as CurriculumPackage;
  const structuralCheck = validateCurriculumPackage(typedPkg);
  if (!structuralCheck.isValid) {
    errors.push(...structuralCheck.errors);
    return { success: false, errors };
  }

  // Ensure curriculum matching
  if (typedPkg.identity.id !== curriculumId) {
    errors.push(`Curriculum identity ID mismatch: expected "${curriculumId}", got "${typedPkg.identity.id}"`);
    return { success: false, errors };
  }

  try {
    const computedHash = computeChecksum(rawPackage);
    const versionId = crypto.randomUUID();

    // 3. Insert Version
    await query(
      "INSERT INTO curriculum_versions (id, curriculum_id, package_version, status, effective_date, checksum, raw_package) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        versionId,
        curriculumId,
        typedPkg.version.packageVersion,
        typedPkg.version.status,
        new Date(typedPkg.version.effectiveDate),
        computedHash,
        JSON.stringify(rawPackage)
      ]
    );

    // 4. Register Services in Service Registry
    const services = typedPkg.capabilities.educationalServices || (typedPkg.capabilities as any).supportedServices || [];
    for (const service of services) {
      const serviceId = crypto.randomUUID();
      await query(
        "INSERT INTO educational_services (id, curriculum_version_id, service_name) VALUES (?, ?, ?)",
        [serviceId, versionId, service]
      );
    }

    await registerAssessmentRevisions(userId, versionId, typedPkg);

    await logAudit({
      userId,
      action: "REGISTER_VERSION",
      targetEntity: "curriculum_versions",
      targetId: versionId,
      details: {
        curriculumId,
        packageVersion: typedPkg.version.packageVersion,
        checksum: computedHash,
        servicesRegistered: services
      }
    });

    return { success: true, errors: [], data: { versionId, checksum: computedHash } };
  } catch (error: any) {
    return { success: false, errors: [error.message || "Failed to register package version"] };
  }
}

export async function getActivePackageVersion(curriculumId: string): Promise<CurriculumPackage | null> {
  const rows = await query<any[]>(
    "SELECT raw_package FROM curriculum_versions WHERE curriculum_id = ? AND status = 'ACTIVE' ORDER BY effective_date DESC LIMIT 1",
    [curriculumId]
  );
  
  if (rows.length === 0) return null;
  return rows[0].raw_package as CurriculumPackage;
}
