import { 
  CurriculumPackage, 
  Skill, 
  Stage, 
  CurriculumCapabilities,
  MasteryLevel 
} from "../../contracts/curriculum";
import { 
  AssessmentBlueprint, 
  QuestionBlueprint, 
  TimingExpectation 
} from "../../contracts/assessment";
import { validatePackageAgainstSchema } from "../../core/services/validation";
import { validateCurriculumPackage } from "../../curriculum-packages/validator";

export interface SkillNode {
  skill: Skill;
  prerequisites: string[];
  dependents: string[];
}

export interface StudentSkillEvidence {
  scorePercentage: number;
  evidenceCount: number;
  responseTimeMs?: number;
  misconceptionsDetected?: string[];
}

export interface MasteryEvaluation {
  skillId: string;
  level: number;
  label: string;
  isPassing: boolean;
  reassessmentDays?: number;
}

export interface StageProgressionEvaluation {
  stageId: string;
  isEligibleToPass: boolean;
  blockers: string[];
  averageScorePercentage: number;
  autoUnlockNextStage: boolean;
  requiresTeacherSignoff: boolean;
}

export interface GapDiagnosis {
  skillId: string;
  classification: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidence: "LOW" | "MEDIUM" | "HIGH";
  rootCauseCandidate?: string;
  triggerMisconception?: string;
}

/**
 * GENERIC CURRICULUM RUNTIME ENGINE
 * 
 * Virtual Machine responsible for loading, validating, querying,
 * and executing any CurriculumPackage regardless of subject.
 * 
 * STRICT RULE: ZERO curriculum-specific logic or branching.
 */
export class CurriculumRuntime {
  private pkg: CurriculumPackage;
  private skillGraph: Map<string, SkillNode> = new Map();
  private stageMap: Map<string, Stage> = new Map();
  private blueprintMap: Map<string, AssessmentBlueprint> = new Map();
  private questionBlueprintMap: Map<string, QuestionBlueprint> = new Map();

  constructor(curriculumPackage: CurriculumPackage) {
    // 1. Structural & Schema Validation at load boundary
    const schemaCheck = validatePackageAgainstSchema(curriculumPackage);
    if (!schemaCheck.isValid) {
      throw new Error(`CurriculumRuntime Error: Schema validation failed -> ${schemaCheck.errors.join("; ")}`);
    }

    const structuralCheck = validateCurriculumPackage(curriculumPackage);
    if (!structuralCheck.isValid) {
      throw new Error(`CurriculumRuntime Error: Circular dependency or reference check failed -> ${structuralCheck.errors.join("; ")}`);
    }

    this.pkg = curriculumPackage;
    this.compileKnowledgeGraph();
    this.indexEntities();
  }

  /**
   * Compiles flat skills into an in-memory Directed Acyclic Graph (DAG)
   */
  private compileKnowledgeGraph(): void {
    // Initialize nodes
    for (const skill of this.pkg.skills) {
      this.skillGraph.set(skill.id, {
        skill,
        prerequisites: [],
        dependents: []
      });
    }

    // Populate relations
    for (const skill of this.pkg.skills) {
      for (const rel of skill.relations) {
        if (rel.relationType === "PREREQUISITE") {
          // targetSkillId is required BEFORE skill.id
          const targetNode = this.skillGraph.get(rel.targetSkillId);
          const currentNode = this.skillGraph.get(skill.id);

          if (currentNode && targetNode) {
            currentNode.prerequisites.push(rel.targetSkillId);
            targetNode.dependents.push(skill.id);
          }
        }
      }
    }
  }

  /**
   * Indexes stages and blueprints for O(1) retrieval
   */
  private indexEntities(): void {
    for (const stage of this.pkg.stages) {
      this.stageMap.set(stage.id, stage);
    }

    if (this.pkg.assessmentBlueprints) {
      for (const ab of this.pkg.assessmentBlueprints) {
        this.blueprintMap.set(ab.id, ab);
        if (ab.questionBlueprints) {
          for (const qb of ab.questionBlueprints) {
            this.questionBlueprintMap.set(qb.id, qb);
          }
        }
      }
    }
  }

  // ==========================================
  // IDENTITY & CAPABILITY QUERIES
  // ==========================================

  public getIdentity() {
    return this.pkg.identity;
  }

  public getVersion() {
    return this.pkg.version;
  }

  public getCapabilities(): CurriculumCapabilities {
    return this.pkg.capabilities;
  }

  // ==========================================
  // GRAPH & TOPOLOGICAL QUERIES
  // ==========================================

  public getSkill(skillId: string): Skill | undefined {
    return this.skillGraph.get(skillId)?.skill;
  }

  public getAllSkills(): Skill[] {
    return this.pkg.skills;
  }

  public getPrerequisites(skillId: string): string[] {
    return this.skillGraph.get(skillId)?.prerequisites || [];
  }

  public getDependents(skillId: string): string[] {
    return this.skillGraph.get(skillId)?.dependents || [];
  }

  public getStages(): Stage[] {
    return this.pkg.stages;
  }

  public getStage(stageId: string): Stage | undefined {
    return this.stageMap.get(stageId);
  }

  public getStageForSkill(skillId: string): Stage | undefined {
    for (const stage of this.pkg.stages) {
      if (stage.includedSkills.includes(skillId)) {
        return stage;
      }
    }
    return undefined;
  }

  // ==========================================
  // TIMING RESOLUTION
  // ==========================================

  /**
   * Resolves timing using specificity fallback:
   * 1. QuestionBlueprint timing
   * 2. Skill timing
   * 3. AssessmentBlueprint timing
   * 4. Default fallback
   */
  public resolveTiming(blueprintId?: string, skillId?: string): TimingExpectation {
    if (blueprintId) {
      const qb = this.questionBlueprintMap.get(blueprintId);
      if (qb?.timingExpectation) return qb.timingExpectation;
    }

    if (skillId) {
      const skill = this.getSkill(skillId);
      if (skill?.timingExpectation) return skill.timingExpectation;
    }

    return {
      trackingType: "SESSION_MS",
      expectedDuration: 60000,
      slowThreshold: 120000
    };
  }

  // ==========================================
  // DYNAMIC MASTERY EVALUATION
  // ==========================================

  /**
   * Evaluates student evidence against the package's configured MasteryModel
   */
  public calculateMastery(skillId: string, evidence: StudentSkillEvidence): MasteryEvaluation {
    const masteryModel = this.pkg.masteryModel;
    if (!masteryModel || !masteryModel.levels || masteryModel.levels.length === 0) {
      // Fallback if not configured
      return {
        skillId,
        level: evidence.scorePercentage >= 70 ? 3 : 0,
        label: evidence.scorePercentage >= 70 ? "Mastered" : "Gap",
        isPassing: evidence.scorePercentage >= 70
      };
    }

    // Sort levels ascending by value
    const levels = [...masteryModel.levels].sort((a, b) => a.value - b.value);
    
    // Map score percentage across the discrete levels
    const levelCount = levels.length;
    const step = 100 / levelCount;
    const computedIndex = Math.min(
      Math.floor(evidence.scorePercentage / step),
      levelCount - 1
    );

    const selectedLevel: MasteryLevel = levels[computedIndex] || levels[0];

    return {
      skillId,
      level: selectedLevel.value,
      label: selectedLevel.label,
      isPassing: selectedLevel.isPassing,
      reassessmentDays: selectedLevel.reassessmentDays
    };
  }

  // ==========================================
  // DYNAMIC GAP & ROOT CAUSE DIAGNOSIS
  // ==========================================

  public diagnoseGaps(evidenceList: { skillId: string; scorePercentage: number; misconceptions?: string[] }[]): GapDiagnosis[] {
    const diagnoses: GapDiagnosis[] = [];
    const gapCategories = this.pkg.gapModel?.categories || ["CONCEPTUAL", "PREREQUISITE", "PROCEDURAL"];

    for (const ev of evidenceList) {
      if (ev.scorePercentage < 70) {
        const hasMisconception = ev.misconceptions && ev.misconceptions.length > 0;
        const prereqs = this.getPrerequisites(ev.skillId);

        let classification = gapCategories[0];
        if (prereqs.length > 0) {
          classification = gapCategories.find(c => c.includes("PREREQUISITE")) || gapCategories[0];
        } else if (hasMisconception) {
          classification = gapCategories.find(c => c.includes("PROCEDURAL") || c.includes("CONCEPTUAL")) || gapCategories[0];
        }

        const severity = ev.scorePercentage < 40 ? "HIGH" : "MEDIUM";
        const triggerMisconception = hasMisconception ? ev.misconceptions![0] : undefined;

        // Root cause mapping from package rules
        let rootCauseCandidate: string | undefined;
        if (this.pkg.rootCauseModel?.rules) {
          const rule = this.pkg.rootCauseModel.rules.find(r => 
            triggerMisconception ? r.triggerGapIds.includes(triggerMisconception) : false
          );
          if (rule) {
            rootCauseCandidate = rule.description;
          }
        }

        if (!rootCauseCandidate && prereqs.length > 0) {
          rootCauseCandidate = `Prerequisite foundation skill required: ${prereqs.join(", ")}`;
        }

        diagnoses.push({
          skillId: ev.skillId,
          classification,
          severity,
          confidence: "HIGH",
          rootCauseCandidate,
          triggerMisconception
        });
      }
    }

    return diagnoses;
  }

  // ==========================================
  // STAGE PROGRESSION EVALUATION
  // ==========================================

  /**
   * Evaluates if a student satisfies stage requirements to unlock the next stage
   */
  public evaluateStageProgression(
    stageId: string, 
    skillMasteries: Record<string, number>,
    assessmentScores: Record<string, number>,
    activeCriticalGaps: string[] = []
  ): StageProgressionEvaluation {
    const stage = this.getStage(stageId);
    if (!stage) {
      throw new Error(`Stage not found: ${stageId}`);
    }

    const blockers: string[] = [];
    const reqs = stage.masteryRequirements;

    // 1. Check all included skills meet minimum mastery
    for (const skillId of stage.includedSkills) {
      const studentMastery = skillMasteries[skillId] ?? 0;
      if (studentMastery < reqs.minimumSkillMasteryLevel) {
        blockers.push(`Skill ${skillId} mastery level (${studentMastery}) is below minimum (${reqs.minimumSkillMasteryLevel})`);
      }
    }

    // 2. Check assessment average
    const scores = Object.values(assessmentScores);
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    if (avgScore < reqs.requiredScorePercentage) {
      blockers.push(`Average assessment score (${avgScore.toFixed(1)}%) is below required threshold (${reqs.requiredScorePercentage}%)`);
    }

    // 3. Check critical gaps
    if (reqs.mustClearCriticalGaps && activeCriticalGaps.length > 0) {
      blockers.push(`Must resolve all active critical gaps before advancing: ${activeCriticalGaps.join(", ")}`);
    }

    return {
      stageId,
      isEligibleToPass: blockers.length === 0,
      blockers,
      averageScorePercentage: Math.round(avgScore),
      autoUnlockNextStage: stage.progressionRules.autoUnlockNextStage,
      requiresTeacherSignoff: stage.progressionRules.requireTeacherSignoff
    };
  }
}
