import type { EduCarouselConfig } from "../../../components/carousel/CarouselTypes";

export const lesson12HorizontalProjectileCarousel: EduCarouselConfig = {
  id: "CAROUSEL-PHYS-EB-MECH-1-2",
  title: "Part 1 · 1-2 Horizontal Projectile Motion",
  skillId: "SK-EGYPT-PHY-MECH-PROJECTILES",
  showProgressBar: true,
  showScoreTally: true,
  allowSkipQuestions: false,
  sequenceMode: "SEQUENTIAL",
  plan: {
    scenario: "Mastering horizontal projectiles.",
    mission: "Understand the independence of horizontal and vertical motion.",
    planningPoints: ["Analyze free fall vs horizontal projection", "Calculate time and range"],
    studentPromise: "You will be able to solve horizontal projectile problems.",
    evaluationSummary: "Well done!",
    nextStepRule: "Proceed to angled projectiles."
  },
  processSteps: [
    {
      id: "step-1",
      title: "Connect",
      subtitle: "Complete this step to advance.",
      mission: "Engage with the material and demonstrate understanding.",
      brief: "Work through the slide carefully before moving on.",
      studentOutcome: "You will be able to answer questions about this concept.",
      parentHint: "Ask your child to explain the key idea from this step in their own words.",
      preparationStages: ["Read the explanation", "Note key terms"],
      evaluationStages: ["Answer the practice question", "Check the evaluation slide"],
      successSignal: "Student answers correctly on the first attempt.",
      supportDecision: "If incorrect, review the explanation slide and retry."
    },
    {
      id: "step-2",
      title: "Predict Phenomenon",
      subtitle: "Complete this step to advance.",
      mission: "Engage with the material and demonstrate understanding.",
      brief: "Work through the slide carefully before moving on.",
      studentOutcome: "You will be able to answer questions about this concept.",
      parentHint: "Ask your child to explain the key idea from this step in their own words.",
      preparationStages: ["Read the explanation", "Note key terms"],
      evaluationStages: ["Answer the practice question", "Check the evaluation slide"],
      successSignal: "Student answers correctly on the first attempt.",
      supportDecision: "If incorrect, review the explanation slide and retry."
    },
    {
      id: "step-3",
      title: "Concept & Derivation",
      subtitle: "Complete this step to advance.",
      mission: "Engage with the material and demonstrate understanding.",
      brief: "Work through the slide carefully before moving on.",
      studentOutcome: "You will be able to answer questions about this concept.",
      parentHint: "Ask your child to explain the key idea from this step in their own words.",
      preparationStages: ["Read the explanation", "Note key terms"],
      evaluationStages: ["Answer the practice question", "Check the evaluation slide"],
      successSignal: "Student answers correctly on the first attempt.",
      supportDecision: "If incorrect, review the explanation slide and retry."
    },
    {
      id: "step-4",
      title: "Practice Problem",
      subtitle: "Complete this step to advance.",
      mission: "Engage with the material and demonstrate understanding.",
      brief: "Work through the slide carefully before moving on.",
      studentOutcome: "You will be able to answer questions about this concept.",
      parentHint: "Ask your child to explain the key idea from this step in their own words.",
      preparationStages: ["Read the explanation", "Note key terms"],
      evaluationStages: ["Answer the practice question", "Check the evaluation slide"],
      successSignal: "Student answers correctly on the first attempt.",
      supportDecision: "If incorrect, review the explanation slide and retry."
    },
    {
      id: "step-5",
      title: "Mastery Checklist",
      subtitle: "Complete this step to advance.",
      mission: "Engage with the material and demonstrate understanding.",
      brief: "Work through the slide carefully before moving on.",
      studentOutcome: "You will be able to answer questions about this concept.",
      parentHint: "Ask your child to explain the key idea from this step in their own words.",
      preparationStages: ["Read the explanation", "Note key terms"],
      evaluationStages: ["Answer the practice question", "Check the evaluation slide"],
      successSignal: "Student answers correctly on the first attempt.",
      supportDecision: "If incorrect, review the explanation slide and retry."
    }
  ],
  slides: [
    {
      id: "slide-1",
      type: "lesson_text",
      processStepId: "step-1",
      body: "### The Core Law of Projectiles\n\nHorizontal and vertical motions are **INDEPENDENT**.\n- Horizontal: $x = v_0t$ (constant velocity, $a_x = 0$)\n- Vertical: $y = \\frac{1}{2}gt^2$ (free fall, $a_y = g$ downward)\n\nTime of flight from height $h$: $t = \\sqrt{\\frac{2h}{g}}$.\nRange: $R = v_0 \\times t$",
      
      keyTerms: ["Horizontal Projectile", "Time of Flight", "Range"]
    },
    {
      id: "slide-2",
      type: "question_mcq",
      processStepId: "step-2",
      questionText: "A stone thrown horizontally off a cliff AND a stone dropped vertically from the same height. Which hits the ground first?",
      points: 2,
      imageLayout: "left",
      imageCaption: "Dropped vs. Thrown Stone",
      diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240"><rect width="100%" height="100%" fill="#0f172a"/><path d="M50 20 L50 200" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5,5"/><path d="M50 20 Q150 20 200 200" stroke="#38bdf8" stroke-width="2" fill="none"/><circle cx="50" cy="20" r="5" fill="#f87171"/><circle cx="50" cy="20" r="5" fill="#38bdf8"/><text x="40" y="215" fill="#f8fafc" font-size="12">Ground</text><path d="M20 200 L380 200" stroke="#475569" stroke-width="3"/></svg>`,
      choices: [
        {
          id: "c1",
          text: "The dropped stone hits first.",
          isCorrect: false,
          explanation: "Horizontal velocity does not affect vertical fall time.",
          misconceptionId: "MECH-PROJ-HORIZ-AFFECTS-VERTICAL"
        },
        {
          id: "c2",
          text: "The thrown stone hits first.",
          isCorrect: false,
          explanation: "Horizontal velocity does not speed up the vertical drop.",
          misconceptionId: "MECH-PROJ-SAME-SPEED"
        },
        {
          id: "c3",
          text: "They hit the ground at the same time.",
          isCorrect: true,
          explanation: "Both are in free fall vertically with initial vertical velocity of 0."
        },
        {
          id: "c4",
          text: "It depends on the mass of the stones.",
          isCorrect: false,
          explanation: "Gravity accelerates all objects equally in the absence of air resistance.",
          misconceptionId: "MECH-PROJ-NO-HORIZONTAL"
        }
      ]
    },
    {
      id: "slide-3",
      type: "lesson_text",
      processStepId: "step-3",
      body: "### Worked Example\n\nA ball rolls off a table ($h = 1.25$ m) at $v_0 = 4$ m/s. Let $g = 10$ m/s$^2$.\n\n1. **Time of flight:**\n   $$t = \\sqrt{\\frac{2h}{g}} = \\sqrt{\\frac{2 \\times 1.25}{10}} = \\sqrt{0.25} = 0.5 \\text{ s}$$\n2. **Range:**\n   $$R = v_0 \\times t = 4 \\times 0.5 = 2 \\text{ m}$$",
      
      keyTerms: ["Free Fall", "Constant Velocity"]
    },
    {
      id: "slide-4",
      type: "question_mcq",
      processStepId: "step-4",
      questionText: "A package is dropped from a plane flying horizontally at 200 m/s at a height of 500m. Find the time to hit the ground and horizontal distance from the drop point. (g = 10 m/s²).",
      points: 2,
      imageLayout: "left",
      imageCaption: "Package dropped from plane",
      diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240"><rect width="100%" height="100%" fill="#0f172a"/><path d="M50 40 Q200 40 350 200" stroke="#f472b6" stroke-width="2" fill="none" stroke-dasharray="4,4"/><rect x="30" y="30" width="40" height="20" fill="#94a3b8"/><text x="80" y="45" fill="#f8fafc" font-size="12">v=200 m/s, h=500m</text><path d="M20 200 L380 200" stroke="#475569" stroke-width="3"/></svg>`,
      choices: [
        {
          id: "c1",
          text: "t = 10s, x = 2000m",
          isCorrect: true,
          explanation: "t = √(2*500/10) = 10s, x = 200 * 10 = 2000m"
        },
        {
          id: "c2",
          text: "t = 5s, x = 1000m",
          isCorrect: false,
          explanation: "Check the vertical equation. t = √(2h/g).",
          misconceptionId: "MECH-PROJ-HORIZ-AFFECTS-VERTICAL"
        },
        {
          id: "c3",
          text: "t = 50s, x = 10000m",
          isCorrect: false,
          explanation: "Used h/g instead of √(2h/g) for time.",
          misconceptionId: "MECH-PROJ-SAME-SPEED"
        }
      ]
    },
    {
      id: "slide-5",
      type: "lesson_text",
      processStepId: "step-5",
      body: "### Mastery Checklist\n\n- [x] I know horizontal and vertical motion are independent.\n- [x] I can calculate time of flight using $t = \\sqrt{\\frac{2h}{g}}$.\n- [x] I can calculate horizontal range using $x = v_xt$.\n\n**Next up:** Lesson 1-3 Angled Projectile Motion.",
      
      keyTerms: ["Mastery"]
    }
  ]
};
