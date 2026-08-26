import type { CurriculumPackage } from "../../contracts/curriculum";
import { integratedScienceAssessments } from "./assessments";

export const curriculumEgyptSecondary1IntegratedScience: CurriculumPackage = {
  identity: {
    id: "egypt-secondary1-integrated-science",
    name: "Egyptian First Secondary Integrated Sciences (English)",
    publisher: "Egyptian Ministry of Education and Technical Education"
  },
  version: {
    packageVersion: "0.1.0",
    curriculumVersion: "2024-2025",
    status: "ACTIVE",
    effectiveDate: "2024-09-01T00:00:00.000Z",
    changeSummary: "Source-mapped structure from supplied English textbook; assessment content intentionally not included.",
    checksum: "74D09A4F43C7CA217DB2BB7672BC6B4DEC65ABF7802154E592A586466E370C95"
  },
  provenance: {
    sourceId: "LOCAL-PDF-74D09A4F43C7CA217DB2BB7672BC6B4DEC65ABF7802154E592A586466E370C95",
    title: "Integrated Sciences, First Secondary Grade",
    sourceVersion: "2024-2025",
    retrievedDate: "2026-08-25T00:00:00.000Z",
    sectionReference: "Supplied English PDF, verified title page and Chapter 4 headings"
  },
  approvalStatus: "EDUCATOR_APPROVED",
  capabilities: {
    stem: "SUPPORTED",
    educationalServices: ["CURRICULUM_REFERENCE", "LESSON_PLANNING"],
    examinationRequirements: {
      hasWrittenExam: false,
      hasPracticalExam: false,
      hasProjectComponent: true,
      hasCoursework: false
    }
  },
  topics: [
    {
      id: "TOPIC-EGYPT-S1-AQUATIC-ECOSYSTEM",
      name: "Aquatic ecosystem",
      subtopics: [
        {
          id: "SUB-EGYPT-S1-WATER-CHEMISTRY",
          name: "Chemical reactions and water quality",
          skillIds: ["SK-EGYPT-S1-WATER-CHEMISTRY"]
        },
        {
          id: "SUB-EGYPT-S1-WATER-PROPERTIES",
          name: "Physical properties of water and aquatic conditions",
          skillIds: ["SK-EGYPT-S1-WATER-PROPERTIES"]
        },
        {
          id: "SUB-EGYPT-S1-AQUATIC-LIFE",
          name: "Aquatic organisms, adaptations, and environmental balance",
          skillIds: ["SK-EGYPT-S1-AQUATIC-LIFE"]
        }
      ]
    },
    {
      id: "TOPIC-EGYPT-S1-ATMOSPHERE",
      name: "Atmosphere",
      subtopics: [
        {
          id: "SUB-EGYPT-S1-ATMOSPHERE-COMPONENTS",
          name: "Atmosphere layers and components",
          skillIds: ["SK-EGYPT-S1-ATMOSPHERE-COMPONENTS"]
        },
        {
          id: "SUB-EGYPT-S1-ATMOSPHERIC-REACTIONS",
          name: "Chemical reactions and atmospheric changes",
          skillIds: ["SK-EGYPT-S1-ATMOSPHERIC-REACTIONS"]
        }
      ]
    },
    {
      id: "TOPIC-EGYPT-S1-SOIL",
      name: "Soil",
      subtopics: [
        {
          id: "SUB-EGYPT-S1-SOIL-COMPOSITION",
          name: "Soil composition and importance in ecosystems",
          skillIds: ["SK-EGYPT-S1-SOIL-COMPOSITION"]
        },
        {
          id: "SUB-EGYPT-S1-SOIL-PRESERVATION",
          name: "Acid rain, soil measurements, and preservation",
          skillIds: ["SK-EGYPT-S1-SOIL-PRESERVATION"]
        }
      ]
    },
    {
      id: "TOPIC-EGYPT-S1-SUSTAINABILITY",
      name: "For a Sustainable Environment",
      subtopics: [
        {
          id: "SUB-EGYPT-S1-SUSTAINABILITY",
          name: "The concept of sustainability and the role of the environment",
          skillIds: ["SK-EGYPT-S1-SUSTAINABILITY"]
        },
        {
          id: "SUB-EGYPT-S1-POLLUTION",
          name: "The effect of pollutants on the environment and human health",
          skillIds: ["SK-EGYPT-S1-POLLUTION"]
        },
        {
          id: "SUB-EGYPT-S1-BIODIVERSITY",
          name: "Biodiversity and species protection",
          skillIds: ["SK-EGYPT-S1-BIODIVERSITY"]
        }
      ]
    }
  ],
  skills: [
    {
      id: "SK-EGYPT-S1-WATER-CHEMISTRY",
      name: "Aquatic chemical reactions and water quality",
      learningObjectives: ["Explain how source-described chemical reactions affect water quality and aquatic life."],
      relations: []
    },
    {
      id: "SK-EGYPT-S1-WATER-PROPERTIES",
      name: "Physical properties of water and aquatic conditions",
      learningObjectives: ["Describe how water properties, temperature, light, radiation, and pressure affect aquatic environments."],
      relations: []
    },
    {
      id: "SK-EGYPT-S1-AQUATIC-LIFE",
      name: "Aquatic adaptations and environmental balance",
      learningObjectives: ["Explain biological adaptations and the role of human activity in maintaining aquatic environmental balance."],
      relations: []
    },
    {
      id: "SK-EGYPT-S1-ATMOSPHERE-COMPONENTS",
      name: "Atmosphere layers and components",
      learningObjectives: ["Identify the layers and components of the atmosphere and relate them to Earth systems."],
      relations: []
    },
    {
      id: "SK-EGYPT-S1-ATMOSPHERIC-REACTIONS",
      name: "Atmospheric chemical reactions and change",
      learningObjectives: ["Describe source-mapped chemical reactions in the atmosphere and their environmental impacts."],
      relations: []
    },
    {
      id: "SK-EGYPT-S1-SOIL-COMPOSITION",
      name: "Soil composition and ecosystem importance",
      learningObjectives: ["Describe soil composition and explain its importance in sustaining ecosystems."],
      relations: []
    },
    {
      id: "SK-EGYPT-S1-SOIL-PRESERVATION",
      name: "Soil measurement and preservation",
      learningObjectives: ["Describe the source-defined effects of acid rain and strategies for measuring and preserving soil."],
      relations: []
    },
    {
      id: "SK-EGYPT-S1-SUSTAINABILITY",
      name: "Sustainability and environmental protection",
      learningObjectives: [
        "Describe sustainability challenges and environmental protection strategies using the source-defined concepts."
      ],
      relations: []
    },
    {
      id: "SK-EGYPT-S1-POLLUTION",
      name: "Pollutants, measurement, and treatment",
      learningObjectives: [
        "Explain effects of pollutants and identify source-described approaches for measuring and treating pollution."
      ],
      relations: []
    },
    {
      id: "SK-EGYPT-S1-BIODIVERSITY",
      name: "Biodiversity and species protection",
      learningObjectives: [
        "Explain the role of biodiversity and describe protection strategies identified in the source."
      ],
      relations: []
    }
  ],
  stages: [
    {
      id: "STAGE-EGYPT-S1-SOURCE-MAPPED",
      name: "Source-mapped environmental science",
      sequence: 1,
      objectives: [
        "Study the verified source-mapped sustainability, pollution, and biodiversity topics."
      ],
      includedSkills: [
        "SK-EGYPT-S1-WATER-CHEMISTRY",
        "SK-EGYPT-S1-WATER-PROPERTIES",
        "SK-EGYPT-S1-AQUATIC-LIFE",
        "SK-EGYPT-S1-ATMOSPHERE-COMPONENTS",
        "SK-EGYPT-S1-ATMOSPHERIC-REACTIONS",
        "SK-EGYPT-S1-SOIL-COMPOSITION",
        "SK-EGYPT-S1-SOIL-PRESERVATION",
        "SK-EGYPT-S1-SUSTAINABILITY",
        "SK-EGYPT-S1-POLLUTION",
        "SK-EGYPT-S1-BIODIVERSITY"
      ],
      prerequisiteRequirements: [],
      lessons: [],
      assessments: [],
      masteryRequirements: {
        minimumSkillMasteryLevel: 1,
        requiredScorePercentage: 0,
        mustClearCriticalGaps: false
      },
      remediationRules: {
        maxAttempts: 0,
        interventionType: "TEACHER_REFERRAL",
        triggerSeverity: "LOW"
      },
      progressionRules: {
        requireTeacherSignoff: true,
        autoUnlockNextStage: false
      },
      optionalExtensions: [],
      stemOpportunities: ["Environmental observation and sustainability project"]
    }
  ],
  assessmentBlueprints: integratedScienceAssessments,
  masteryModel: {
    levels: [
      { value: 0, label: "Not assessed", isPassing: false },
      { value: 1, label: "Source mapped", isPassing: false }
    ]
  },
  gapModel: {
    categories: ["NOT_YET_ASSESSED"],
    severities: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
    confidenceLevels: ["LOW", "MEDIUM", "HIGH"]
  },
  rootCauseModel: {
    rules: []
  },
  reportingRequirements: {
    student: ["SOURCE_MAPPED_TOPICS"],
    parent: [],
    teacher: ["SOURCE_PROVENANCE", "ASSESSMENT_NOT_YET_AVAILABLE"]
  }
};

export default curriculumEgyptSecondary1IntegratedScience;
