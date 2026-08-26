import { CurriculumPackage } from "../../contracts/curriculum";
import { metadata } from "./metadata";
import { topics } from "./topics";
import { skills } from "./skills";
import { stages } from "./stages";
import { assessments } from "./assessments";
import { gapModel } from "./gap-model";
import { rootCauseModel } from "./root-cause-model";
import { reportingRequirements } from "./reporting";

export const curriculum0580: CurriculumPackage = {
  ...metadata,
  topics,
  skills,
  stages,
  assessmentBlueprints: assessments,
  masteryModel: {
    levels: [
      { value: 0, label: "Gap", isPassing: false, evidenceThreshold: 1, reassessmentDays: 3 },
      { value: 1, label: "Emerging", isPassing: false, evidenceThreshold: 2, reassessmentDays: 7 },
      { value: 2, label: "Developing", isPassing: false, evidenceThreshold: 3, reassessmentDays: 14 },
      { value: 3, label: "Secure", isPassing: true, evidenceThreshold: 4, reassessmentDays: 30 },
      { value: 4, label: "Mastered", isPassing: true, evidenceThreshold: 5, reassessmentDays: 60 }
    ]
  },
  gapModel,
  rootCauseModel,
  reportingRequirements
};

export { metadata, topics, skills, stages, assessments, gapModel, rootCauseModel, reportingRequirements };
export default curriculum0580;
