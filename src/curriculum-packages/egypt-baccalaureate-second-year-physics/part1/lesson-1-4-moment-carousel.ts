import type { EduCarouselConfig } from "../../../components/carousel/CarouselTypes";

export const lesson14MomentCarousel: EduCarouselConfig = {
  id: "CAROUSEL-PHYS-EB-MECH-1-4",
  title: "Part 1 · 1-4 Moments",
  skillId: "SK-EGYPT-PHY-MECH-FORCES",
  showProgressBar: true,
  showScoreTally: true,
  allowSkipQuestions: false,
  sequenceMode: "SEQUENTIAL",
  plan: {
    scenario: "Mastering moments of forces.",
    mission: "Understand torque and the principle of moments.",
    planningPoints: ["Calculate moments", "Apply Principle of Moments for equilibrium"],
    studentPromise: "You will be able to balance forces on a lever.",
    evaluationSummary: "Well done!",
    nextStepRule: "Proceed to lesson 1-5."
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
      body: "### Moment of a Force (Torque)\n\n$M = F \\times d_{\\perp}$\nWhere $d_{\\perp}$ is the **perpendicular distance** from pivot to line of action.\n\n- Unit: N·m\n- Convention: Clockwise = negative, Anticlockwise = positive\n- Principle of Moments: For equilibrium, sum of clockwise moments = sum of anticlockwise moments",
      
      keyTerms: ["Moment", "Torque", "Equilibrium"]
    },
    {
      id: "slide-2",
      type: "question_mcq",
      processStepId: "step-2",
      questionText: "A 60N force at 40cm from a pivot acts against a smaller force at 15cm. Can a smaller force balance a larger force on a lever?",
      points: 2,
      imageLayout: "left",
      imageCaption: "Forces on a Spanner",
      diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240"><rect width="100%" height="100%" fill="#0f172a"/><rect x="150" y="100" width="200" height="20" fill="#94a3b8"/><circle cx="150" cy="110" r="15" fill="#64748b"/><line x1="330" y1="120" x2="330" y2="180" stroke="#f87171" stroke-width="4" marker-end="url(#arrow)"/><text x="340" y="160" fill="#f8fafc">60N</text><line x1="150" y1="130" x2="330" y2="130" stroke="#38bdf8" stroke-dasharray="4,4"/><text x="220" y="145" fill="#38bdf8">d = 40cm</text></svg>`,
      choices: [
        {
          id: "c1",
          text: "Yes, by increasing its perpendicular distance from the pivot.",
          isCorrect: true,
          explanation: "Moment depends on both force and distance. A smaller force at a larger distance can exert the same moment."
        },
        {
          id: "c2",
          text: "No, a smaller force can never balance a larger force.",
          isCorrect: false,
          explanation: "This ignores the effect of distance on the moment.",
          misconceptionId: "MECH-MOMENT-FORCE-ONLY"
        },
        {
          id: "c3",
          text: "Yes, by decreasing its distance to the pivot.",
          isCorrect: false,
          explanation: "Decreasing the distance would reduce its moment even further.",
          misconceptionId: "MECH-MOMENT-DISTANCE-NOT-PERP"
        },
        {
          id: "c4",
          text: "Yes, by placing it on the same side as the larger force.",
          isCorrect: false,
          explanation: "Forces on the same side with the same direction add their moments, they don't balance.",
          misconceptionId: "MECH-MOMENT-WRONG-SIDE"
        }
      ]
    },
    {
      id: "slide-3",
      type: "lesson_text",
      processStepId: "step-3",
      body: "### Worked Example\n\n$M = F \\times d_{\\perp}$\n\nExample: $F_1 = 60$ N, $d_1 = 0.4$ m $\\rightarrow M_1 = 24$ N·m.\n\nFor balance:\n$F_2 \\times 0.15 = 24 \\rightarrow F_2 = 160$ N.\n\nRemember: Moment depends on PERPENDICULAR distance. If a force acts at an angle, resolve it into components or calculate the true perpendicular distance.",
      
      keyTerms: ["Perpendicular Distance", "Equilibrium"]
    },
    {
      id: "slide-4",
      type: "question_mcq",
      processStepId: "step-4",
      questionText: "A uniform seesaw (length 4m) has child A (weight 300N) at left end, pivot at center. Where must child B (weight 200N) sit on the right to balance?",
      points: 2,
      imageLayout: "left",
      imageCaption: "Seesaw balance",
      diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240"><rect width="100%" height="100%" fill="#0f172a"/><polygon points="200,150 180,200 220,200" fill="#64748b"/><line x1="50" y1="150" x2="350" y2="150" stroke="#94a3b8" stroke-width="6"/><rect x="50" y="110" width="30" height="40" fill="#f87171"/><text x="45" y="100" fill="#f8fafc">300N</text><rect x="280" y="110" width="30" height="40" fill="#38bdf8"/><text x="275" y="100" fill="#f8fafc">200N</text><text x="195" y="145" fill="#f8fafc">P</text></svg>`,
      choices: [
        {
          id: "c1",
          text: "3m from pivot",
          isCorrect: true,
          explanation: "300 * 2 = 200 * d → d = 600 / 200 = 3m from the pivot."
        },
        {
          id: "c2",
          text: "2m from pivot",
          isCorrect: false,
          explanation: "If d=2, the right moment is 400 Nm, but the left is 600 Nm.",
          misconceptionId: "MECH-MOMENT-DISTANCE-NOT-PERP"
        },
        {
          id: "c3",
          text: "1.5m from pivot",
          isCorrect: false,
          explanation: "Check the calculation: 300 * 2 = 600. 600 / 200 = ?",
          misconceptionId: "MECH-MOMENT-WRONG-SIDE"
        }
      ]
    },
    {
      id: "slide-5",
      type: "lesson_text",
      processStepId: "step-5",
      body: "### Mastery Checklist\n\n- [x] I know that moment = Force $\\times$ perpendicular distance.\n- [x] I can identify clockwise and anticlockwise moments.\n- [x] I can use the principle of moments to solve equilibrium problems.\n\n**Next up:** Lesson 1-5.",
      
      keyTerms: ["Mastery"]
    }
  ]
};
