import type { CurriculumPackage, Stage, Skill } from "../../contracts/curriculum";
import type { AssessmentBlueprint } from "../../contracts/assessment";

export interface DynamicStudentCase {
  key: string;
  label: string;
  mastery: Record<string, number>;
}

/**
 * Extracts mastery level labels dynamically from the package's MasteryModel.
 */
export function getMasteryLabels(pkg: CurriculumPackage): Record<number, string> {
  const labels: Record<number, string> = {};
  if (pkg.masteryModel?.levels?.length) {
    pkg.masteryModel.levels.forEach((lvl) => {
      labels[lvl.value] = `${lvl.label} (${lvl.value})`;
    });
  } else {
    // Default fallback if not defined
    labels[0] = "Gap (0)";
    labels[1] = "Developing (1)";
    labels[2] = "Competent (2)";
    labels[3] = "Mastered (3)";
  }
  return labels;
}

/**
 * Retrieves the first readiness assessment blueprint in the curriculum package.
 */
export function getReadinessBlueprint(pkg: CurriculumPackage): AssessmentBlueprint | undefined {
  return pkg.assessmentBlueprints?.find((b) => b.type === "READINESS");
}

/**
 * Dynamically generates 3 simulated student diagnostic cases for any curriculum package
 * based on its actual registered skills.
 */
export function getDynamicStudentCases(pkg: CurriculumPackage): Record<string, DynamicStudentCase> {
  const skills = pkg.skills || [];
  const skillIds = skills.map((s) => s.id);
  const maxLevel = pkg.masteryModel?.levels?.length 
    ? Math.max(...pkg.masteryModel.levels.map((l) => l.value))
    : 4;

  const caseA: Record<string, number> = {};
  const caseB: Record<string, number> = {};
  const caseC: Record<string, number> = {};

  skillIds.forEach((id, index) => {
    // Case A: Beginner / Never studied (all 0)
    caseA[id] = 0;
    
    // Case B: Partial / Prerequisite Gap (alternating early skills gap, others moderate)
    if (index === 0 || index % 2 === 0) {
      caseB[id] = 0;
    } else {
      caseB[id] = Math.max(1, Math.floor(maxLevel * 0.75));
    }

    // Case C: Fluency Issue / Developing (mostly high / moderate)
    caseC[id] = Math.max(1, Math.min(maxLevel, Math.floor(maxLevel * 0.8)));
  });

  return {
    A: {
      key: "A",
      label: `Case A: New to ${pkg.identity.name}`,
      mastery: caseA
    },
    B: {
      key: "B",
      label: "Case B: Prerequisite Foundation Gap",
      mastery: caseB
    },
    C: {
      key: "C",
      label: "Case C: Moderate / Fluency Issue",
      mastery: caseC
    }
  };
}

/**
 * Determines stage placement recommendation based on percentage score and stages defined in package.
 */
export function getStagePlacementForScore(
  stages: Stage[],
  scorePercentage: number
): { recommendedStageId: string; confidence: "LOW" | "MEDIUM" | "HIGH"; rationale: string } {
  if (!stages || stages.length === 0) {
    return {
      recommendedStageId: "STAGE-1",
      confidence: "LOW",
      rationale: "No specific stages configured in curriculum package."
    };
  }

  const sortedStages = [...stages].sort((a, b) => a.sequence - b.sequence);
  const stageCount = sortedStages.length;
  
  // Calculate target stage index based on score ratio
  const ratio = Math.min(1, Math.max(0, scorePercentage / 100));
  const targetIndex = Math.min(stageCount - 1, Math.floor(ratio * stageCount));
  const selectedStage = sortedStages[targetIndex];

  let confidence: "LOW" | "MEDIUM" | "HIGH" = "HIGH";
  if (scorePercentage >= 40 && scorePercentage < 70) {
    confidence = "MEDIUM";
  }

  return {
    recommendedStageId: selectedStage.id,
    confidence,
    rationale: `Based on score (${scorePercentage}%), student placed into ${selectedStage.name}.`
  };
}
