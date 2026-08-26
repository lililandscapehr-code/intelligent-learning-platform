import type { QuestionInstance } from "../../contracts/question-content";

const curriculumId = "egypt-secondary1-integrated-science";
const curriculumVersion = "2024-2025";
const approval = { status: "APPROVED" as const, reviewedBy: "EDU-INTEGRATED-SCIENCE-LEAD", reviewedAt: "2026-08-25T00:00:00.000Z", reviewerComments: "Source-mapped to the supplied Integrated Sciences PDF and educator-reviewed for readiness use.", version: 1 };

export const integratedScienceDiagnosticQuestions: QuestionInstance[] = [
  {
    id: "QI-EGYPT-S1-READINESS-WATER-001", blueprintId: "QB-EGYPT-S1-R-WATER-01", skillId: "SK-EGYPT-S1-AQUATIC-LIFE", curriculumId, curriculumVersion,
    promptText: "Why can a change in water temperature affect aquatic organisms?", difficulty: 1, points: 1,
    answerConfig: { type: "MULTIPLE_CHOICE", choices: [
      { id: "A", text: "Temperature is an abiotic condition that can change living-system responses.", isCorrect: true },
      { id: "B", text: "Temperature changes only the name of the habitat.", isCorrect: false, misconceptionId: "EGYPT-ECO-ABIOTIC-IRRELEVANT" },
      { id: "C", text: "Aquatic organisms are not affected by physical conditions.", isCorrect: false, misconceptionId: "EGYPT-ECO-LIVING-SEPARATE" }
    ] },
    explanationText: "The source treats temperature as a non-living environmental condition that interacts with aquatic life and ecosystem balance.", origin: "MANUAL_EDUCATOR", provenance: { sourcePaper: "Integrated Sciences First Secondary Grade PDF, Chapter One, pages 8-40", generatedAt: "2026-08-25T00:00:00.000Z" }, approval, tags: ["Aquatic ecosystem", "Abiotic factors"]
  },
  {
    id: "QI-EGYPT-S1-READINESS-ATMOSPHERE-001", blueprintId: "QB-EGYPT-S1-R-ATMOSPHERE-01", skillId: "SK-EGYPT-S1-ATMOSPHERE-COMPONENTS", curriculumId, curriculumVersion,
    promptText: "Which statement best describes an integrated science study of the atmosphere?", difficulty: 1, points: 1,
    answerConfig: { type: "MULTIPLE_CHOICE", choices: [
      { id: "A", text: "It connects atmospheric components and reactions to environmental effects.", isCorrect: true },
      { id: "B", text: "It studies air without considering chemical change or Earth systems.", isCorrect: false, misconceptionId: "EGYPT-ATMOSPHERE-ISOLATED" },
      { id: "C", text: "It concerns only the weather forecast for one day.", isCorrect: false }
    ] },
    explanationText: "The source maps atmosphere layers and components together with atmospheric reactions, changes, and environmental impacts.", origin: "MANUAL_EDUCATOR", provenance: { sourcePaper: "Integrated Sciences First Secondary Grade PDF, Chapter Two, pages 41-59", generatedAt: "2026-08-25T00:00:00.000Z" }, approval, tags: ["Atmosphere", "Earth systems"]
  },
  {
    id: "QI-EGYPT-S1-READINESS-SOIL-001", blueprintId: "QB-EGYPT-S1-R-SOIL-01", skillId: "SK-EGYPT-S1-SOIL-PRESERVATION", curriculumId, curriculumVersion,
    promptText: "What makes an investigation of soil preservation scientifically useful?", difficulty: 2, points: 1,
    answerConfig: { type: "MULTIPLE_CHOICE", choices: [
      { id: "A", text: "It measures a condition, records evidence, and uses the evidence to evaluate preservation strategies.", isCorrect: true },
      { id: "B", text: "It selects a conclusion before collecting any measurements.", isCorrect: false, misconceptionId: "EGYPT-SOIL-CONCLUSION-FIRST" },
      { id: "C", text: "It avoids measurements because soil cannot change.", isCorrect: false }
    ] },
    explanationText: "The source links acid-rain effects, soil measurement, and preservation strategies, so evidence must guide the evaluation.", origin: "MANUAL_EDUCATOR", provenance: { sourcePaper: "Integrated Sciences First Secondary Grade PDF, Chapter Three, pages 60-76", generatedAt: "2026-08-25T00:00:00.000Z" }, approval, tags: ["Soil", "Measurement", "Evidence"]
  },
  {
    id: "QI-EGYPT-S1-READINESS-SUSTAINABILITY-001", blueprintId: "QB-EGYPT-S1-R-SUSTAINABILITY-01", skillId: "SK-EGYPT-S1-SUSTAINABILITY", curriculumId, curriculumVersion,
    promptText: "Which plan best reflects environmental sustainability?", difficulty: 2, points: 1,
    answerConfig: { type: "MULTIPLE_CHOICE", choices: [
      { id: "A", text: "Use evidence to reduce harm, protect biodiversity, and review whether the solution works.", isCorrect: true },
      { id: "B", text: "Solve one environmental problem by ignoring effects on other parts of the system.", isCorrect: false, misconceptionId: "EGYPT-SUSTAINABILITY-ONE-FACTOR" },
      { id: "C", text: "Protect one species without considering habitat or human impact.", isCorrect: false }
    ] },
    explanationText: "The source connects sustainability with pollution, biodiversity, protection strategies, and ecosystem restoration projects.", origin: "MANUAL_EDUCATOR", provenance: { sourcePaper: "Integrated Sciences First Secondary Grade PDF, Chapter Four, pages 77-96", generatedAt: "2026-08-25T00:00:00.000Z" }, approval, tags: ["Sustainability", "Pollution", "Biodiversity"]
  }
];

export default integratedScienceDiagnosticQuestions;
