import { CurriculumPackage } from "../contracts/curriculum";

export interface ValidationReport {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateCurriculumPackage(pkg: CurriculumPackage): ValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Gather all defined Skill IDs
  const skillIds = new Set(pkg.skills.map((s) => s.id));

  // 2. Validate Stages
  pkg.stages.forEach((stage) => {
    stage.includedSkills.forEach((skillId) => {
      if (!skillIds.has(skillId)) {
        errors.push(`Stage "${stage.id}" references undefined skill: "${skillId}"`);
      }
    });
  });

  // 3. Validate Skill Relations & Build Adjacency Graph for circular check
  const graph: Record<string, string[]> = {};
  pkg.skills.forEach((skill) => {
    graph[skill.id] = [];
    skill.relations.forEach((rel) => {
      if (!skillIds.has(rel.targetSkillId)) {
        errors.push(`Skill "${skill.id}" relation targets undefined skill: "${rel.targetSkillId}"`);
      } else if (rel.relationType === "PREREQUISITE") {
        graph[skill.id].push(rel.targetSkillId); // directed edge: skill depends on target
      }
    });
  });

  // 4. Circular Dependency Check (DFS topological cycle finder)
  const visited: Record<string, "UNVISITED" | "VISITING" | "VISITED"> = {};
  pkg.skills.forEach((s) => {
    visited[s.id] = "UNVISITED";
  });

  function hasCycle(nodeId: string, path: string[]): boolean {
    visited[nodeId] = "VISITING";
    path.push(nodeId);

    const neighbors = graph[nodeId] || [];
    for (const neighbor of neighbors) {
      if (visited[neighbor] === "VISITING") {
        errors.push(`Circular dependency detected: ${path.join(" -> ")} -> ${neighbor}`);
        return true;
      }
      if (visited[neighbor] === "UNVISITED") {
        if (hasCycle(neighbor, [...path])) return true;
      }
    }

    visited[nodeId] = "VISITED";
    return false;
  }

  pkg.skills.forEach((skill) => {
    if (visited[skill.id] === "UNVISITED") {
      hasCycle(skill.id, []);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
