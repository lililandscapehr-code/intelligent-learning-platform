import type { EduCarouselConfig } from "../../components/carousel/CarouselTypes";

export const aquaticEcosystemCarousel: EduCarouselConfig = {
  id: "CAROUSEL-EGYPT-S1-AQUATIC-ECOSYSTEM-INTRO",
  title: "How does an aquatic ecosystem stay balanced?",
  skillId: "SK-EGYPT-S1-AQUATIC-LIFE",
  showProgressBar: true,
  showScoreTally: true,
  allowSkipQuestions: false,
  sequenceMode: "SEQUENTIAL",
  plan: {
    scenario: "A pond or river can change when temperature, clarity, light, or human activity changes.",
    mission: "Explain how living and non-living parts of an aquatic ecosystem affect one another.",
    planningPoints: ["Make a prediction", "Watch a human-impact demonstration", "Build a cause-and-effect model", "Use safe local evidence", "Check whether the explanation is supported"],
    studentPromise: "You will be able to explain one ecosystem change in your own words.",
    evaluationSummary: "We check the prediction, evidence, explanation, correctness, independence, and timing.",
    nextStepRule: "You move to a wider ecosystem relationship or receive a short bridge and retry.",
    sourcePageRange: "Integrated Sciences PDF, Chapter One pages 8-40; combined sustainability analysis pages 8-96",
    sourceAims: [
      "Recognize the hydrosphere and explain the water cycle as a system that changes Earth physically, chemically, and biologically.",
      "Explain how water structure, hydrolysis, pH, density, dissolved gases, temperature, light, pressure, and concentration affect aquatic life.",
      "Evaluate physiological, behavioral, and structural adaptations using observations, measurements, and cause-and-effect reasoning.",
      "Use evidence to protect aquatic ecosystems from pollution, overexploitation, and climate-related change."
    ]
  },
  processSteps: [
    { id: "process-connect", title: "Start with something familiar", subtitle: "Feel comfortable exploring", mission: "Connect ecosystem science to a familiar place and invite a prediction.", brief: "We are connecting the science to a pond, lake, or river the student can imagine.", studentOutcome: "Make a personal prediction without pressure.", parentHint: "The student is building curiosity and confidence.", preparationStages: ["Imagine a familiar water environment", "Write a first prediction"], evaluationStages: ["Prediction is recorded", "Student can name what they are wondering"], successSignal: "Student is ready to investigate without fear of being wrong.", supportDecision: "Use a picture, local example, or conversation to build comfort." },
    { id: "process-understand", title: "Build the big idea", subtitle: "Connect living and non-living parts", mission: "Build a cause-and-effect model of ecosystem balance.", brief: "We are using a demonstration and explanation to connect living and non-living parts.", studentOutcome: "Explain one ecosystem cause-and-effect relationship.", parentHint: "The student is turning an observation into understanding.", preparationStages: ["Watch the demonstration", "Sort living and non-living factors"], evaluationStages: ["Student explains one relationship", "Teacher checks vocabulary in context"], successSignal: "Student can connect a changed condition to an organism response.", supportDecision: "Return to the demonstration and use a two-part cause-and-effect drawing." },
    { id: "process-practice", title: "Try it with evidence", subtitle: "Use evidence, not guesses", mission: "Apply the ecosystem model to a safe new observation.", brief: "We are applying the model to a new situation and a safe local observation.", studentOutcome: "Use evidence instead of guessing.", parentHint: "The student is practising the skill in a meaningful context.", preparationStages: ["Choose one measurable condition", "Plan a safe observation"], evaluationStages: ["Evidence is recorded", "Explanation matches the evidence"], successSignal: "Student can use one observation to support a cautious explanation.", supportDecision: "Provide a simulated example or reduce the observation to one variable." },
    { id: "process-check", title: "Check and choose the next step", subtitle: "See what support will help", mission: "Decide whether to extend, practise, or provide more care.", brief: "We are checking the explanation and deciding whether the student is ready to extend or needs support.", studentOutcome: "Show understanding and identify the next learning action.", parentHint: "The teacher can now choose extension, practice, or extra care.", preparationStages: ["Review the answer and evidence", "Consider confidence and timing"], evaluationStages: ["Check correctness", "Check cause-and-effect explanation", "Check independence and timing"], successSignal: "Teacher has enough evidence to choose the next safe step.", supportDecision: "Assign a short bridge and retry before moving to a harder ecosystem relationship." }
  ],
  slides: [
    {
      id: "ecosystem-phenomenon",
      sourceReferences: ["Chapter One, pages 8-40", "Page 8 chapter opening"],
      type: "lesson_text",
      title: "The hydrosphere and aquatic ecosystem",
      learningObjective: "Recognize the hydrosphere and connect water-cycle change with aquatic ecosystem sustainability.",
      body: "The source begins with the hydrosphere, Earth's water envelope, and Egypt's diverse aquatic environments. Water supports life, exists in solid, liquid, and gaseous states, and connects physical, chemical, and biological processes. Build a first model: hydrosphere or water-cycle change → changed condition → effect on aquatic life.",
      keyTerms: ["hydrosphere", "water cycle", "aquatic ecosystem", "water quality"],
    },
    {
      id: "ecosystem-prediction",
      sourceReferences: ["Chapter One, pages 8-40"],
      type: "question_mcq",
      title: "Make a prediction",
      questionText: "Which statement best reflects the source's integrated view of the hydrosphere and aquatic ecosystems?",
      points: 1,
      choices: [
        { id: "A", text: "Water-cycle and environmental changes can connect physical, chemical, and biological processes.", isCorrect: true, misconceptionId: "EGYPT-ECO-SYSTEMS-SEPARATE", explanation: "The source explicitly presents the water cycle as a system that can change Earth's surface physically, chemically, and biologically." },
        { id: "B", text: "Water should be studied as an isolated transparent liquid.", isCorrect: false, misconceptionId: "EGYPT-ECO-WATER-ISOLATED", explanation: "The source presents water as a medium for reactions and as a life-supporting part of connected Earth systems." },
        { id: "C", text: "Aquatic environments are unrelated to the water cycle.", isCorrect: false, misconceptionId: "EGYPT-ECO-CYCLE-UNRELATED", explanation: "The source connects the hydrosphere, water cycle, and aquatic environments." }
      ],
        processStepId: "process-connect", step: { purpose: "READINESS", targetPoints: ["Make a first prediction", "Show an initial idea without pressure"], completionEvidence: ["Choice and thinking"], advanceRule: "OPEN_NEXT", supportAction: "Use the explanation after the answer to repair the model.", timing: { expectedMs: 60000, fastThresholdMs: 10000, slowThresholdMs: 150000 } }
    },
    {
      id: "ecosystem-demonstration",
      sourceReferences: ["Chapter One, pages 8-40", "Combined source analysis pages 8-96"],
      type: "youtube",
      title: "Demonstration: human impacts on ecosystems",
      subtitle: "While watching, identify one change caused by people and trace its effect through an ecosystem.",
      caption: "Teacher-reviewed demonstration · verify before publishing",
      youtubeUrl: "https://www.youtube.com/watch?v=5eTCZ9L834s",
      startAt: 0,
      maxDuration: 600,
      skillId: "SK-EGYPT-S1-AQUATIC-LIFE"
    },
    {
      id: "ecosystem-model",
      sourceReferences: ["Chapter One, pages 8-9"],
      type: "lesson_text",
      title: "Build the ecosystem model",
      learningObjective: "Classify ecosystem factors and trace a simple cause-and-effect relationship.",
      body: "Biotic factors are living parts, such as fish, plants, algae, and microorganisms. Abiotic factors are non-living conditions, such as temperature, light, pressure, water movement, and dissolved gases. A useful model is: environmental change → changed condition → organism response → wider ecosystem effect. This model helps us explain rather than simply list observations.",
      keyTerms: ["biotic factors", "abiotic factors", "cause and effect"]
      , processStepId: "process-understand", step: { purpose: "EXPLAIN", targetPoints: ["Name living and non-living factors", "Trace one cause-and-effect chain"], completionEvidence: ["Can explain the model in own words"], advanceRule: "OPEN_NEXT" }
    },
    {
      id: "ecosystem-media",
      sourceReferences: ["Chapter One, pages 8-40", "Combined source analysis pages 8-96"],
      type: "upload_zone",
      title: "Add local evidence",
      caption: "Teacher-reviewed ecosystem observation",
      prompt: "Upload a classroom photograph or observation record of a safe local aquatic environment. Do not include identifiable students.",
      skillId: "SK-EGYPT-S1-AQUATIC-LIFE"
      , processStepId: "process-practice", step: { purpose: "DEMONSTRATE", targetPoints: ["Connect learning to local evidence", "Observe safely"], completionEvidence: ["Observation record or teacher-reviewed upload"], advanceRule: "TEACHER_REVIEW", supportAction: "Use a simulation or written observation if no safe photograph is available." }
    },
    {
      id: "ecosystem-application",
      sourceReferences: ["Chapter One, pages 8-40"],
      type: "question_mcq",
      title: "Apply the model",
      questionText: "If water becomes less clear and less light reaches aquatic plants, which explanation is strongest?",
      points: 1,
      choices: [
        { id: "A", text: "Less light may reduce plant activity and affect organisms that depend on the plants.", isCorrect: true, misconceptionId: "EGYPT-ECO-ONE-CAUSE", explanation: "The answer traces a condition through organisms and the wider system." },
        { id: "B", text: "Only the appearance changes; the ecosystem cannot be affected.", isCorrect: false, explanation: "Water clarity can change light conditions and biological interactions." },
        { id: "C", text: "All organisms will immediately disappear.", isCorrect: false, explanation: "The effect must be investigated; an extreme conclusion is not supported by one observation." }
      ],
      processStepId: "process-practice", step: { purpose: "PRACTICE", targetPoints: ["Apply the ecosystem model", "Avoid extreme conclusions"], completionEvidence: ["Correct explanation"], advanceRule: "SUPPORT_AND_RETRY", supportAction: "Return to the cause-and-effect model and try a new example.", supportExamples: ["Less clear water lets less light reach plants.", "Plants are living parts affected by a non-living condition.", "A careful explanation says may affect, not that every organism disappears immediately."], supportDemonstration: "Draw: less clarity → less light → possible change in plant activity → effects on connected organisms.", retryEvaluation: "Choose the explanation that traces the evidence step by step.", timing: { expectedMs: 90000, fastThresholdMs: 15000, slowThresholdMs: 210000 } }
    },
    {
      id: "ecosystem-evaluation",
      sourceReferences: ["Chapter One, pages 8-40"],
      type: "evaluation",
      title: "Evaluate your explanation",
      questionRef: "ecosystem-application",
      correctAnswerText: "Reduced clarity can reduce light reaching plants, which may affect plant activity and organisms connected to them.",
      explanation: "A strong explanation identifies the changed abiotic condition, describes its effect on a living component, and connects that effect to the ecosystem. It does not claim more than the evidence supports.",
      misconceptionNote: "If the learner treats environmental factors as separate from living organisms, return to the cause-and-effect model.",
      masteryImplication: "Secure evidence requires a correct choice plus a cause-and-effect explanation in the learner's own words.",
      processStepId: "process-check", step: { purpose: "EVALUATE", targetPoints: ["Check accuracy", "Explain why the answer works"], completionEvidence: ["Correct answer and explanation"], advanceRule: "OPEN_NEXT", supportAction: "Review the model before retrying.", timing: { expectedMs: 60000, fastThresholdMs: 10000, slowThresholdMs: 180000 } }
    },
    {
      id: "ecosystem-investigation",
      sourceReferences: ["Chapter One, pages 8-40", "Combined source analysis pages 8-96"],
      type: "lesson_text",
      title: "Plan a safe investigation",
      learningObjective: "Design an observation that collects evidence without damaging the habitat.",
      body: "Choose one measurable condition: water temperature, clarity, light level, or visible organism count. Record the place, date, time, method, and units. Repeat the observation when possible. Do not taste water, handle unknown organisms, or enter unsafe water. Ask: what pattern would support your prediction, and what result would make you change it?",
      keyTerms: ["measurement", "evidence", "repeatability", "safety"]
      , processStepId: "process-check", step: { purpose: "DEMONSTRATE", targetPoints: ["Plan a safe measurement", "Choose evidence that can be repeated"], completionEvidence: ["Investigation plan"], advanceRule: "OPEN_NEXT" }
    },
    {
      id: "ecosystem-reflection",
      sourceReferences: ["Chapter Four, pages 77-96", "Combined source analysis pages 8-96"],
      type: "question_mcq",
      title: "Final reflection",
      questionText: "What is the best next step after observing a possible change in an ecosystem?",
      points: 1,
      choices: [
        { id: "A", text: "Collect careful evidence, compare conditions, and evaluate possible explanations.", isCorrect: true, explanation: "Science uses evidence and evaluation before concluding." },
        { id: "B", text: "Choose the most dramatic explanation immediately.", isCorrect: false, explanation: "A dramatic explanation is not necessarily supported by evidence." },
        { id: "C", text: "Ignore measurements because ecosystems are too complex.", isCorrect: false, explanation: "Complex systems can still be studied through careful measurements and models." }
      ],
      processStepId: "process-check", step: { purpose: "REFLECT", targetPoints: ["Judge evidence carefully", "Choose the next learning action"], completionEvidence: ["Reasoned final choice"], advanceRule: "TEACHER_REVIEW", supportAction: "Teacher reviews the evidence and chooses extension or support." }
    }
  ]
};

export default aquaticEcosystemCarousel;
