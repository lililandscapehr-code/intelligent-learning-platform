import type { EduCarouselConfig } from "./CarouselTypes";

export interface CarouselValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateLearningProcess(config: EduCarouselConfig): CarouselValidationResult {
  const errors: string[] = [];
  const slides = config.slides || [];
  const ids = new Set<string>();
  const hasQuestion = slides.some((slide) => ["question_mcq", "question_text", "question_numeric"].includes(slide.type));
  const hasEvaluation = slides.some((slide) => slide.type === "evaluation");
  const accessPolicy = config.accessPolicy;

  if (slides.length < 3) errors.push("Add at least three slides: connect, teach, and check.");
  for (const slide of slides) {
    if (!slide.id.trim() || ids.has(slide.id)) errors.push(`Slide IDs must be present and unique: ${slide.id || "missing ID"}.`);
    ids.add(slide.id);
    if (slide.type === "question_mcq" || slide.type === "question_text" || slide.type === "question_numeric") {
      if (!slide.points || slide.points < 1) errors.push(`Question ${slide.id} must have at least one point.`);
    }
    if (config.sequenceMode === "SEQUENTIAL" && !slide.step) errors.push(`Sequential slide ${slide.id} needs a learning target and completion rule.`);
    if (slide.processStepId && !config.processSteps?.some((process) => process.id === slide.processStepId)) errors.push(`Slide ${slide.id} references an unknown process step.`);
  }
  if (!hasQuestion) errors.push("Add at least one question or readiness check.");
  if (!hasEvaluation) errors.push("Add an evaluation or reflection step.");
  if (accessPolicy && (accessPolicy.minimumScorePercentage < 0 || accessPolicy.minimumScorePercentage > 100)) errors.push("The minimum score must be between 0 and 100.");
  if (accessPolicy?.scope === "SELECTED_STUDENTS" && !accessPolicy.studentIds?.length) errors.push("Select at least one student for this carousel.");
  if (accessPolicy?.scope === "SELECTED_SUBSCRIPTION" && !accessPolicy.subscriptionIds?.length) errors.push("Select at least one subscription for this carousel.");
  if (!config.plan || !config.plan.scenario.trim() || !config.plan.mission.trim() || !config.plan.planningPoints.length || !config.plan.studentPromise.trim() || !config.plan.evaluationSummary.trim() || !config.plan.nextStepRule.trim()) errors.push("The carousel plan needs a scenario, mission, planning points, student promise, evaluation summary, and next-step rule.");
  if (config.processSteps) {
    for (const process of config.processSteps) {
      if (!process.title.trim() || !process.subtitle.trim() || !process.mission.trim() || !process.brief.trim() || !process.studentOutcome.trim() || !process.parentHint.trim() || !process.preparationStages.length || !process.evaluationStages.length || !process.successSignal.trim() || !process.supportDecision.trim()) errors.push(`Process ${process.id} needs a title, subtitle, mission, preparation, evaluation, success signal, and support decision.`);
    }
  }
  return { valid: errors.length === 0, errors };
}

export function applyStandardStepDefaults(config: EduCarouselConfig): EduCarouselConfig {
  const processSteps = config.processSteps?.length ? config.processSteps : [
    { id: "process-start", title: "Start together", subtitle: "Feel ready to begin", mission: "Create safety, curiosity, and connection.", brief: "Connect with the idea before the formal lesson begins.", studentOutcome: "Know what this learning journey is about.", parentHint: "The student is becoming familiar with the topic.", preparationStages: ["Connect to a familiar situation", "State the lesson goal"], evaluationStages: ["Student makes a prediction", "Teacher notices confidence and prior knowledge"], successSignal: "Student can describe what they are about to explore.", supportDecision: "Use a simpler example or more conversation before teaching the concept." },
    { id: "process-learn", title: "Build the idea", subtitle: "Make sense of what we see", mission: "Turn observation into a clear mental model.", brief: "Meet the explanation and demonstration step by step.", studentOutcome: "Explain the main idea in simple words.", parentHint: "The student is turning an example into understanding.", preparationStages: ["Observe the demonstration", "Compare prediction with evidence"], evaluationStages: ["Student names the key relationship", "Teacher checks explanation in own words"], successSignal: "Student can explain the main idea without copying the formula.", supportDecision: "Return to the demonstration and use a visual or concrete example." },
    { id: "process-practice", title: "Try it", subtitle: "Use the idea with support", mission: "Build confidence through a manageable new application.", brief: "Use the idea in a new situation and receive feedback.", studentOutcome: "Apply the idea with growing independence.", parentHint: "The student is practising, not just memorising.", preparationStages: ["Review the worked example", "Choose the known quantities"], evaluationStages: ["Student applies the method", "Teacher checks reasoning and timing"], successSignal: "Student reaches a reasonable answer and can describe the method.", supportDecision: "Reduce the problem size, model one step, and retry with a new context." },
    { id: "process-check", title: "Check the next step", subtitle: "See what support will help", mission: "Use evidence to choose extension, practice, or additional care.", brief: "Review the evidence and choose support or extension.", studentOutcome: "Know whether to continue or practise more.", parentHint: "The teacher can choose the right next level of care.", preparationStages: ["Review answer and explanation", "Consider confidence and timing"], evaluationStages: ["Check correctness", "Check explanation", "Check timing and independence"], successSignal: "Teacher has enough evidence for a safe next-step decision.", supportDecision: "Assign a short bridge or teacher conversation before unlocking the next concept." }
  ];
  const defaultProcessIds = ["process-start", "process-learn", "process-practice", "process-check"];
  return {
    ...config,
    sequenceMode: config.sequenceMode || "SEQUENTIAL",
    plan: config.plan || {
      scenario: "A familiar real-world situation introduces the lesson question.",
      mission: "Understand one important idea and use it confidently.",
      planningPoints: ["Connect to what you already know", "Explore an example", "Practise with support", "Check the next step"],
      studentPromise: "You will know what you are learning and why it matters.",
      evaluationSummary: "We check your answer, explanation, confidence, and timing.",
      nextStepRule: "You continue, practise again, or receive extra teacher support based on evidence."
    },
    processSteps,
    accessPolicy: config.accessPolicy || {
      scope: "ALL_ENROLLED",
      minimumScorePercentage: 70,
      showCorrectAnswers: true,
      showMarks: true,
      trackTiming: true
    },
    slides: config.slides.map((slide, index) => ({
      ...slide,
      sequenceNumber: index + 1,
      processStepId: slide.processStepId || defaultProcessIds[Math.min(index, defaultProcessIds.length - 1)],
      step: slide.step || {
        purpose: index === 0 ? "CONNECT" : index === config.slides.length - 1 ? "REFLECT" : "EXPLAIN",
        targetPoints: ["Understand the purpose of this step", "Move forward with confidence"],
        completionEvidence: ["Student response or teacher observation"],
        advanceRule: index === config.slides.length - 1 ? "TEACHER_REVIEW" : "OPEN_NEXT"
      }
    }))
  };
}
