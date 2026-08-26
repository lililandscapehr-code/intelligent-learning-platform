import { AssessmentBlueprint, TimingExpectation } from "./assessment";

export type CapabilityStatus = "SUPPORTED" | "OPTIONAL" | "NOT_SUPPORTED";

export interface ExaminationRequirements {
  hasWrittenExam: boolean;
  hasPracticalExam: boolean;
  hasProjectComponent: boolean;
  hasCoursework: boolean;
}

export interface CurriculumCapabilities {
  stem: CapabilityStatus;
  educationalServices: string[];
  aiCapabilities?: string[];
  examinationRequirements?: ExaminationRequirements;
}

export interface StageMasteryRequirements {
  minimumSkillMasteryLevel: number;
  requiredScorePercentage: number;
  mustClearCriticalGaps: boolean;
}

export interface RemediationRules {
  maxAttempts: number;
  interventionType: "RETEACH" | "PRACTICE" | "PREREQUISITE_REVIEW" | "TEACHER_REFERRAL";
  triggerSeverity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface ProgressionRules {
  requireTeacherSignoff: boolean;
  autoUnlockNextStage: boolean;
}

export interface Stage {
  id: string;
  name: string;
  sequence: number;
  objectives: string[];
  includedSkills: string[];
  prerequisiteRequirements: string[];
  lessons: string[];
  assessments: string[]; // Blueprint IDs
  masteryRequirements: StageMasteryRequirements;
  remediationRules: RemediationRules;
  progressionRules: ProgressionRules;
  optionalExtensions: string[];
  stemOpportunities: string[];
}

export type SkillRelationType = "PREREQUISITE" | "REINFORCES" | "CO_REQUISITE";

export interface SkillRelation {
  targetSkillId: string;
  relationType: SkillRelationType;
  metadata?: Record<string, string>;
}

export interface Skill {
  id: string;
  name: string;
  learningObjectives: string[];
  relations: SkillRelation[];
  timingExpectation?: TimingExpectation;
}

export interface Subtopic {
  id: string;
  name: string;
  skillIds: string[];
}

export interface Topic {
  id: string;
  name: string;
  subtopics: Subtopic[];
}

export interface MasteryLevel {
  value: number;
  label: string;
  isPassing: boolean;
  evidenceThreshold?: number;
  reassessmentDays?: number;
}

export interface MasteryModel {
  levels: MasteryLevel[];
}

export interface GapModel {
  categories: string[];
  severities: string[];
  confidenceLevels: string[];
  rules?: {
    gapId: string;
    classification: string;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    confidenceThreshold: number;
  }[];
}

export interface RootCauseRule {
  rootCauseId: string;
  description: string;
  triggerGapIds: string[];
  requiredEvidenceCount: number;
  verificationMethod?: string;
}

export interface RootCauseModel {
  rules: RootCauseRule[];
}

export interface ReportingRequirements {
  student: string[];
  parent: string[];
  teacher: string[];
}

export interface CurriculumPackage {
  identity: {
    id: string;
    name: string;
    publisher: string;
  };
  version: {
    packageVersion: string;
    curriculumVersion: string;
    status: "DRAFT" | "REVIEW" | "ACTIVE" | "DEPRECATED" | "ARCHIVED";
    effectiveDate: string;
    expiryDate?: string;
    predecessorVersion?: string;
    successorVersion?: string;
    changeSummary?: string;
    checksum: string;
  };
  provenance: {
    sourceId: string;
    title: string;
    sourceVersion: string;
    locationUrl?: string;
    retrievedDate?: string;
    sectionReference?: string;
  };
  approvalStatus: "AI_GENERATED_DRAFT" | "TEACHER_CREATED" | "UNDER_REVIEW" | "EDUCATOR_APPROVED";
  capabilities: CurriculumCapabilities;
  topics: Topic[];
  skills: Skill[];
  stages: Stage[];
  assessmentBlueprints: AssessmentBlueprint[];
  masteryModel: MasteryModel;
  gapModel: GapModel;
  rootCauseModel: RootCauseModel;
  reportingRequirements: ReportingRequirements;
  extensions?: {
    namespace: string;
    version: string;
    data: Record<string, unknown>;
  }[];
}
