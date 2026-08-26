import type { EduCarouselConfig } from "../../../components/carousel/CarouselTypes";

export const lesson17MomentumImpulseCarousel: EduCarouselConfig = {
  id: "CAROUSEL-PHYS-EB-MECH-1-7",
  title: "Part 1 · 1-7 Momentum and Impulse",
  skillId: "SK-EGYPT-PHY-MECH-MOMENTUM",
  showProgressBar: true,
  showScoreTally: true,
  allowSkipQuestions: false,
  sequenceMode: "SEQUENTIAL",
  plan: {
    scenario: "Analyzing collisions and impacts",
    mission: "Use the impulse-momentum theorem to find forces during collisions",
    planningPoints: ["Define momentum and impulse", "Apply theorem", "Calculate forces"],
    studentPromise: "I will use correct signs for velocity to calculate changes in momentum.",
    evaluationSummary: "Mastered momentum and impulse.",
    nextStepRule: "Proceed to lesson 1-8."
  },
  processSteps: [
    {
      id: "connect",
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
      id: "predict",
      title: "Predict",
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
      id: "explain",
      title: "Explain",
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
      id: "practice",
      title: "Practice",
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
      id: "evaluate",
      title: "Evaluate",
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
      id: "slide-1-connect",
      processStepId: "connect",
      type: "lesson_text",
      title: "Momentum and Impulse",
      body: `### Momentum & Impulse\n\n- **Momentum ($\\vec{p}$):** The product of an object's mass and velocity. It is a vector. $$\\vec{p} = m\\vec{v}$$ (Unit: kg·m/s)\n- **Impulse ($J$):** The product of the average force applied and the time interval. $$J = F\\Delta t$$\n- **Impulse-Momentum Theorem:** Impulse equals the change in momentum. $$F\\Delta t = \\Delta p = m(v_f - v_i)$$\n\nIf the change in momentum is fixed (like stopping a car), extending the time ($\\Delta t$) reduces the average force ($F$). This is why airbags and landing mats are used!`,
      keyTerms: ["Momentum", "Impulse", "Vector", "Collision"]
    },
    {
      id: "slide-2-predict",
      processStepId: "predict",
      type: "question_mcq",
      title: "Bouncing Ball",
      questionText: "A 0.5kg ball hits a wall at 10m/s and bounces back at 8m/s. The collision lasts 0.02s. Predict: is the force from the wall large or small? In which direction?",
      imageLayout: "left",
      imageCaption: "Ball colliding with a wall",
      diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240"><rect width="400" height="240" fill="#0f172a"/><rect x="300" y="40" width="20" height="160" fill="#94a3b8"/><circle cx="150" cy="100" r="15" fill="#ef4444"/><line x1="150" y1="100" x2="220" y2="100" stroke="#fca5a5" stroke-width="3" marker-end="url(#arrow-right)"/><text x="160" y="90" fill="#fca5a5" font-size="12">10 m/s (initial)</text><circle cx="200" cy="160" r="15" fill="#3b82f6"/><line x1="200" y1="160" x2="130" y2="160" stroke="#93c5fd" stroke-width="3" marker-end="url(#arrow-left)"/><text x="130" y="150" fill="#93c5fd" font-size="12">8 m/s (final)</text><text x="330" y="125" fill="#cbd5e1" font-size="14">Δt = 0.02s</text><defs><marker id="arrow-right" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#fca5a5"/></marker><marker id="arrow-left" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#93c5fd"/></marker></defs></svg>`,
      choices: [
        {
          id: "c1",
          text: "Small force (50N) toward the wall",
          isCorrect: false,
          explanation: "The force must push away from the wall to reverse the ball's direction. Also, check your Δp calculation.",
          misconceptionId: "MECH-IMPULSE-WRONG-SIGN"
        },
        {
          id: "c2",
          text: "Small force (50N) away from the wall",
          isCorrect: false,
          explanation: "Did you calculate Δv as 10 - 8 = 2? Remember velocity is a vector, so they have opposite signs.",
          misconceptionId: "MECH-IMPULSE-WRONG-SIGN"
        },
        {
          id: "c3",
          text: "Large force (450N) toward the wall",
          isCorrect: false,
          explanation: "The force on the ball must be away from the wall.",
          misconceptionId: "MECH-IMPULSE-NO-DIRECTION"
        },
        {
          id: "c4",
          text: "Large force (450N) away from the wall",
          isCorrect: true,
          explanation: "Correct! Δv = -8 - 10 = -18 m/s. F = mΔv/Δt = 0.5(-18)/0.02 = -450N. The negative sign means away from the wall."
        }
      ],
      points: 2
    },
    {
      id: "slide-3-explain",
      processStepId: "explain",
      type: "lesson_text",
      title: "Applying the Theorem",
      body: `### Calculating the Wall Force\n\nBecause velocity is a vector, we must assign a positive direction. Let's make \"toward the wall\" positive.\n\n- Initial velocity, $v_i = +10 \\text{ m/s}$\n- Final velocity, $v_f = -8 \\text{ m/s}$ (opposite direction!)\n\n**Change in Momentum:**\n$$ \\Delta p = m(v_f - v_i) = 0.5 \\times (-8 - 10) = 0.5 \\times (-18) = -9 \\text{ N}\\cdot\\text{s} $$\n\n**Average Force:**\n$$ F = \\frac{\\Delta p}{\\Delta t} = \\frac{-9}{0.02} = -450 \\text{ N} $$\n\nThe force from the wall on the ball is 450N away from the wall. By Newton's Third Law, the ball hits the wall with +450N.\nThe force is large because the collision time ($\\Delta t$) is very small!`,
      keyTerms: ["Vector direction", "Newton's Third Law"]
    },
    {
      id: "slide-4-practice",
      processStepId: "practice",
      type: "question_mcq",
      title: "Braking Car",
      questionText: "A 1000kg car moving at 20m/s brakes to rest in 5s. Find the average braking force.",
      imageLayout: "left",
      imageCaption: "Car braking",
      diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240"><rect width="400" height="240" fill="#0f172a"/><path d="M 80 160 L 80 120 L 140 120 L 180 160 L 260 160 L 260 190 L 80 190 Z" fill="#64748b"/><circle cx="120" cy="190" r="20" fill="#334155"/><circle cx="220" cy="190" r="20" fill="#334155"/><line x1="170" y1="140" x2="250" y2="140" stroke="#10b981" stroke-width="3" marker-end="url(#arrow-green)"/><text x="180" y="130" fill="#10b981" font-size="12">v_i = 20 m/s</text><line x1="80" y1="150" x2="40" y2="150" stroke="#f43f5e" stroke-width="4" marker-end="url(#arrow-red-rev)"/><text x="10" y="140" fill="#f43f5e" font-size="12">F_brake</text><text x="300" y="150" fill="#cbd5e1" font-size="14">Δt = 5s</text><text x="300" y="170" fill="#cbd5e1" font-size="14">v_f = 0 m/s</text><defs><marker id="arrow-green" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981"/></marker><marker id="arrow-red-rev" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e"/></marker></defs></svg>`,
      choices: [
        {
          id: "c1",
          text: "10000 N",
          isCorrect: false,
          explanation: "Check your formula. F = mΔv / Δt.",
          misconceptionId: "MECH-IMPULSE-CONFUSE-MOMENTUM"
        },
        {
          id: "c2",
          text: "4000 N",
          isCorrect: true,
          explanation: "J = mΔv = 1000 × (0 - 20) = -20000 N·s. F = J / Δt = -20000 / 5 = -4000 N. The magnitude is 4000 N."
        },
        {
          id: "c3",
          text: "20000 N",
          isCorrect: false,
          explanation: "This is the impulse (change in momentum), not the force.",
          misconceptionId: "MECH-IMPULSE-CONFUSE-MOMENTUM"
        },
        {
          id: "c4",
          text: "200 N",
          isCorrect: false,
          explanation: "Recheck the mΔv calculation.",
          misconceptionId: "MECH-IMPULSE-WRONG-SIGN"
        }
      ],
      points: 2
    },
    {
      id: "slide-5-evaluate",
      processStepId: "evaluate",
      type: "lesson_text",
      title: "Mastery Checklist",
      body: `### Lesson Summary\n\n- You can apply the impulse-momentum theorem: $F\\Delta t = \\Delta p$.\n- You remember that velocity and momentum are vectors, requiring careful attention to signs (directions).\n- You can explain how increasing the time of a collision decreases the average impact force.\n\n**Next Lesson:** 1-8 Conservation of Momentum. You will learn what happens when multiple objects collide in a closed system.`,
      keyTerms: []
    }
  ]
};
