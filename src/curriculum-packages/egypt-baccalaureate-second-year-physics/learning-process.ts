export const secondSecondaryPhysicsLearningProcess = {
  sourceParts: [
    { partId: "PART-1", title: "Space, Time and Motion", fileName: "Physics-En-EB-Part1.pdf", pageCount: 154 },
    { partId: "PART-2", title: "Particulate Nature of Matter, Fields, and Quantum Physics", fileName: "Physics-En-EB-Part2.pdf", pageCount: 157 }
  ],
  inquiryLoop: ["OBSERVE", "PREDICT", "MEASURE", "NAME"],
  inquiryCycle: ["EXPLORING_AND_DESIGNING", "COLLECTING_AND_PROCESSING", "CONCLUDING_AND_EVALUATING"],
  lessonBlocks: [
    "LESSON_QUESTION",
    "LEARNING_OUTCOMES",
    "PHENOMENON_AND_WRITTEN_PREDICTION",
    "EXPLORE",
    "OBSERVATION_TO_MODEL",
    "EQUATION_OR_KEY_FACT",
    "WORKED_EXAMPLE",
    "GUIDED_PRACTICE",
    "TRANSFER_TO_NEW_CONTEXT",
    "NATURE_OF_SCIENCE",
    "LESSON_QUESTION_ANSWERED",
    "EXERCISE"
  ],
  slideRules: {
    predictionBeforeExplanation: true,
    measurementBeforeFormalNaming: true,
    requireStudentOwnedPrediction: true,
    requireSourceCitationForResearch: true,
    requireOwnWorkDeclaration: true,
    useEquationsAfterModel: true,
    requireReasonablenessCheck: true,
    projectIsOptionalExtension: true
  },
  evidenceContract: {
    observe: "Record what happened without explaining it yet.",
    predict: "Commit a written prediction before the explanation.",
    measure: "Collect values, units, method, and conditions.",
    name: "Introduce the formal concept only after evidence exists.",
    evaluate: "Compare prediction with evidence, state limits, and identify the next question."
  }
} as const;

export default secondSecondaryPhysicsLearningProcess;
