import type { EduCarouselConfig } from "../../../components/carousel/CarouselTypes";

export const lesson111CircularHVCarousel: EduCarouselConfig = {
  id: "CAROUSEL-PHYS-EB-MECH-1-11",
  title: "Part 1 · 1-11 Vertical and Horizontal Circular Motion",
  skillId: "SK-EGYPT-PHY-MECH-CIRCULAR",
  showProgressBar: true,
  showScoreTally: true,
  allowSkipQuestions: false,
  sequenceMode: "SEQUENTIAL",
  plan: {
    scenario: "Investigating the physics of roller coasters and whirling objects in vertical and horizontal planes.",
    mission: "Analyze tension and normal forces in circular motion to predict minimum speeds and understand apparent weight.",
    planningPoints: [
      "Understand forces in vertical circles",
      "Calculate minimum speed at top",
      "Analyze tension at bottom"
    ],
    studentPromise: "You'll understand why roller coasters don't fall at the top of a loop and how to calculate forces in circular paths.",
    evaluationSummary: "Evaluation completed for vertical and horizontal circular motion.",
    nextStepRule: "Proceed to lesson 1-12 on Kepler and Gravitation."
  },
  processSteps: [
    {
      id: "STEP-1",
      title: "Phenomenon",
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
      id: "STEP-2",
      title: "Explanation",
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
      id: "STEP-3",
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
      id: "STEP-4",
      title: "Summary",
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
      id: "SLIDE-1-CONNECT",
      type: "lesson_text",
      processStepId: "STEP-1",
      title: "The Physics of Roller Coasters",
      body: "### How do roller coasters defy gravity?\n\nHave you ever wondered why you don't fall out of a roller coaster car at the top of a vertical loop? Or why you feel heavier at the bottom of the loop? It's all about **centripetal force** and **apparent weight**.\n\nIn this lesson, we will explore vertical and horizontal circular motion.\n\n**Learning Outcomes:**\n- Analyze forces in vertical circular motion (tension, normal force).\n- Calculate the minimum speed required to complete a vertical circle.\n- Differentiate between horizontal and vertical circular motion.\n\nKey terms: `Tension`, `Normal Force`, `Apparent Weight`, `Centripetal Force`"
    },
    {
      id: "SLIDE-2-PREDICT",
      type: "question_mcq",
      processStepId: "STEP-1",
      title: "Predict: Roller Coaster Loop",
      questionText: "A roller-coaster car goes around a vertical loop. At the TOP of the loop, the passengers feel lighter than normal — or even 'weightless'. Why does this happen, and what determines the minimum speed to stay on track?",
      points: 2,
      imageLayout: "left",
      imageCaption: "Vertical Loop Forces",
      diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240"><rect width="400" height="240" fill="#0f172a"/><circle cx="200" cy="120" r="80" fill="none" stroke="#64748b" stroke-width="4" stroke-dasharray="8 4"/><rect x="180" y="20" width="40" height="20" fill="#38bdf8"/><path d="M 200 40 L 200 70" stroke="#f87171" stroke-width="3" marker-end="url(#arrow)"/><text x="210" y="65" fill="#f87171" font-size="14">mg + N</text><rect x="180" y="200" width="40" height="20" fill="#38bdf8"/><path d="M 200 200 L 200 170" stroke="#4ade80" stroke-width="3" marker-end="url(#arrow)"/><path d="M 200 220 L 200 250" stroke="#f87171" stroke-width="3" marker-end="url(#arrow)"/><text x="210" y="180" fill="#4ade80" font-size="14">N</text><text x="210" y="245" fill="#f87171" font-size="14">mg</text><text x="110" y="40" fill="#cbd5e1" font-size="16">v_top</text><text x="110" y="220" fill="#cbd5e1" font-size="16">v_bottom</text><defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke"/></marker></defs></svg>`,
      choices: [
        {
          id: "C1",
          text: "Gravity turns off at the top, so any speed works.",
          isCorrect: false,
          explanation: "Gravity is always acting on the car. The feeling of weightlessness comes from the normal force becoming zero.",
          misconceptionId: "MECH-VCIRC-NO-GRAVITY"
        },
        {
          id: "C2",
          text: "The normal force and gravity both point down. The car needs a minimum speed to provide enough centripetal acceleration, which is $v = \\sqrt{gr}$.",
          isCorrect: true,
          explanation: "At the top, $N + mg = \\frac{mv^2}{r}$. The minimum speed occurs when $N = 0$, giving $mg = \\frac{mv^2}{r}$ or $v = \\sqrt{gr}$."
        },
        {
          id: "C3",
          text: "The speed is constant everywhere in the loop, so the force is the same at top and bottom.",
          isCorrect: false,
          explanation: "In a vertical loop, speed decreases as the car goes up due to conservation of energy, and forces change significantly.",
          misconceptionId: "MECH-VCIRC-SPEED-CONSTANT"
        }
      ]
    },
    {
      id: "SLIDE-3-EXPLAIN",
      type: "lesson_text",
      processStepId: "STEP-2",
      title: "Analyzing Vertical Circles",
      body: "### Forces at the Top and Bottom\n\nIn a vertical circle, the tension (or normal force) varies with position because gravity always points downward.\n\n**At the top:**\nBoth Tension ($T$) and weight ($mg$) point toward the center.\n$$T_{top} + mg = \\frac{mv^2}{r} \\implies T_{top} = \\frac{mv^2}{r} - mg$$\nFor a minimum speed where the string just goes slack (or normal force becomes zero), $T = 0$:\n$$v_{min} = \\sqrt{gr}$$\n\n*Example:* If $r=20$ m, $v_{min} = \\sqrt{10 \\times 20} = \\sqrt{200} \\approx 14.1$ m/s.\n\n**At the bottom:**\nTension points up (toward center), weight points down (away from center).\n$$T_{bottom} - mg = \\frac{mv^2}{r} \\implies T_{bottom} = \\frac{mv^2}{r} + mg$$\nThe tension at the bottom is much larger than at the top! This is why you feel 'heavier' at the bottom of a loop.\n\n*Conical pendulum (Horizontal circle):*\nThe string sweeps a cone. Horizontal component $T \\sin\\theta = m\\omega^2r$ provides centripetal force, and vertical $T \\cos\\theta = mg$ balances gravity."
    },
    {
      id: "SLIDE-4-PRACTICE",
      type: "question_mcq",
      processStepId: "STEP-3",
      title: "Practice: Whirling a Ball",
      questionText: "A 0.5 kg ball on a 0.8 m string is whirled in a VERTICAL circle. Using $g=10 \\text{ m/s}^2$, find:\n(a) The minimum speed at the top so the string doesn't go slack.\n(b) The tension at the bottom when the speed there is 6 m/s.",
      points: 2,
      imageLayout: "left",
      imageCaption: "Whirling ball in vertical plane",
      diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240"><rect width="400" height="240" fill="#0f172a"/><circle cx="200" cy="120" r="80" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="4 4"/><circle cx="200" cy="40" r="10" fill="#ef4444"/><line x1="200" y1="40" x2="200" y2="120" stroke="#94a3b8" stroke-width="2"/><path d="M 190 40 L 190 70" stroke="#f87171" stroke-width="2" marker-end="url(#arrow2)"/><path d="M 210 40 L 210 70" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow2)"/><circle cx="200" cy="200" r="10" fill="#ef4444"/><line x1="200" y1="200" x2="200" y2="120" stroke="#94a3b8" stroke-width="2"/><path d="M 190 200 L 190 230" stroke="#f87171" stroke-width="2" marker-end="url(#arrow2)"/><path d="M 210 200 L 210 150" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow2)"/><text x="220" y="65" fill="#f87171" font-size="12">mg</text><text x="175" y="65" fill="#38bdf8" font-size="12">T</text><text x="220" y="225" fill="#f87171" font-size="12">mg</text><text x="220" y="165" fill="#38bdf8" font-size="12">T</text><text x="15" y="45" fill="#cbd5e1" font-size="12">Top: T + mg = mv²/r</text><text x="15" y="205" fill="#cbd5e1" font-size="12">Bottom: T - mg = mv²/r</text><defs><marker id="arrow2" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke"/></marker></defs></svg>`,
      choices: [
        {
          id: "C1",
          text: "(a) 2.83 m/s, (b) 22.5 N",
          isCorrect: false,
          explanation: "For part (b), you must ADD $mg$ to the centripetal force: $T = \\frac{mv^2}{r} + mg$. It seems you subtracted or forgot $mg$.",
          misconceptionId: "MECH-VCIRC-TOP-HEAVIER"
        },
        {
          id: "C2",
          text: "(a) 2.83 m/s, (b) 27.5 N",
          isCorrect: true,
          explanation: "(a) $v_{min} = \\sqrt{gr} = \\sqrt{10 \\times 0.8} = \\sqrt{8} \\approx 2.83$ m/s. (b) $T = m(\\frac{v^2}{r} + g) = 0.5 \\times (\\frac{36}{0.8} + 10) = 0.5 \\times (45 + 10) = 0.5 \\times 55 = 27.5$ N."
        },
        {
          id: "C3",
          text: "(a) 8.0 m/s, (b) 27.5 N",
          isCorrect: false,
          explanation: "For part (a), $v_{min}$ is $\\sqrt{gr}$, not $gr$. $\\sqrt{8} \\approx 2.83$.",
          misconceptionId: "MECH-VCIRC-SQUARE-ROOT-ERROR"
        },
        {
          id: "C4",
          text: "(a) 2.83 m/s, (b) 12.5 N",
          isCorrect: false,
          explanation: "Tension is not constant. You calculated tension assuming only $mg$ and ignoring the centripetal component correctly.",
          misconceptionId: "MECH-VCIRC-CONSTANT-TENSION"
        }
      ]
    },
    {
      id: "SLIDE-5-SUMMARY",
      type: "lesson_text",
      processStepId: "STEP-4",
      title: "Summary & Mastery Checklist",
      body: "### Lesson Summary\n\nGreat job! Let's review what we learned about vertical circular motion:\n- **Tension is not constant:** It is greatest at the bottom ($T = \\frac{mv^2}{r} + mg$) and smallest at the top ($T = \\frac{mv^2}{r} - mg$).\n- **Minimum speed:** To maintain a vertical circle without string going slack, $v_{min} = \\sqrt{gr}$ at the top.\n- **Apparent Weight:** You feel heavier at the bottom because the normal force pushing up on you must overcome both gravity and provide centripetal acceleration.\n\n**Next Up:** We'll dive into the grand scale of circular motion with **Lesson 1-12: Kepler's Laws and Gravitation**!"
    }
  ]
};
