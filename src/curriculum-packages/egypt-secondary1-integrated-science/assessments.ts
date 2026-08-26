import type { AssessmentBlueprint } from "../../contracts/assessment";

export const integratedScienceAssessments: AssessmentBlueprint[] = [
  {
    id: "ASSESS-EGYPT-S1-READINESS",
    type: "READINESS",
    purpose: "Establish readiness across the source-mapped aquatic, atmospheric, soil, and sustainability systems.",
    eligibility: "Students beginning Egyptian First Secondary Integrated Sciences.",
    skillsAssessed: ["SK-EGYPT-S1-AQUATIC-LIFE", "SK-EGYPT-S1-ATMOSPHERE-COMPONENTS", "SK-EGYPT-S1-SOIL-PRESERVATION", "SK-EGYPT-S1-SUSTAINABILITY"],
    questionBlueprints: [
      { id: "QB-EGYPT-S1-R-WATER-01", skillId: "SK-EGYPT-S1-AQUATIC-LIFE", type: "MULTIPLE_CHOICE", difficulty: 1, expectedResponseType: "CHOICE_ID", scoringModel: "BINARY_EXACT", timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 60000, slowThreshold: 150000 }, evidenceProduced: ["Aquatic ecosystem relationship"] },
      { id: "QB-EGYPT-S1-R-ATMOSPHERE-01", skillId: "SK-EGYPT-S1-ATMOSPHERE-COMPONENTS", type: "MULTIPLE_CHOICE", difficulty: 1, expectedResponseType: "CHOICE_ID", scoringModel: "BINARY_EXACT", timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 60000, slowThreshold: 150000 }, evidenceProduced: ["Atmosphere systems relationship"] },
      { id: "QB-EGYPT-S1-R-SOIL-01", skillId: "SK-EGYPT-S1-SOIL-PRESERVATION", type: "MULTIPLE_CHOICE", difficulty: 2, expectedResponseType: "CHOICE_ID", scoringModel: "BINARY_EXACT", timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 90000, slowThreshold: 210000 }, evidenceProduced: ["Evidence-based investigation"] },
      { id: "QB-EGYPT-S1-R-SUSTAINABILITY-01", skillId: "SK-EGYPT-S1-SUSTAINABILITY", type: "MULTIPLE_CHOICE", difficulty: 2, expectedResponseType: "CHOICE_ID", scoringModel: "BINARY_EXACT", timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 90000, slowThreshold: 210000 }, evidenceProduced: ["Sustainability reasoning"] }
    ],
    timingRules: { trackingType: "SESSION_MS", expectedDuration: 300000, slowThreshold: 600000 }
  }
];

export default integratedScienceAssessments;
