import type { EduCarouselConfig } from "../../../components/carousel/CarouselTypes";

export const lesson18ConservationMomentumCarousel: EduCarouselConfig = {
  id: "CAROUSEL-PHYS-EB-MECH-1-8",
  title: "Part 1 · 1-8 Conservation of Momentum",
  skillId: "SK-EGYPT-PHY-MECH-MOMENTUM",
  showProgressBar: true,
  showScoreTally: true,
  allowSkipQuestions: false,
  sequenceMode: "SEQUENTIAL",
  plan: {
    scenario: "Mastering the Law of Conservation of Momentum through real-world applications.",
    mission: "Calculate final velocities in various collision and recoil scenarios.",
    planningPoints: ["Understand momentum", "Apply conservation laws", "Analyze inelastic collisions"],
    studentPromise: "I will be able to predict the outcome of collisions and explosions using momentum principles.",
    evaluationSummary: "Evaluation based on predicting recoil speed and final velocities after perfectly inelastic collisions.",
    nextStepRule: "Complete all questions and review the mastery checklist."
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
      id: "slide-1",
      processStepId: "connect",
      type: "lesson_text",
      title: "The Law of Conservation of Momentum",
      
        body: `### Total Momentum is Conserved

The **Law of Conservation of Momentum** states that in an isolated system (no external forces acting on it), the total momentum before an event equals the total momentum after the event. 

$$ \\sum \\vec{p}_{\\text{before}} = \\sum \\vec{p}_{\\text{after}} $$
$$ m_1 \\vec{v}_1 + m_2 \\vec{v}_2 = m_1 \\vec{v}_1' + m_2 \\vec{v}_2' $$

This universal law applies to:
*   **Collisions:** Objects bounce off each other and separate.
*   **Perfectly Inelastic Collisions:** Objects stick together after impact.
*   **Explosions/Recoil:** Objects initially together push apart.`,
        keyTerms: ["Conservation of Momentum", "Isolated System"]
      
    },
    {
      id: "slide-2",
      processStepId: "predict",
      type: "question_mcq",
      title: "Predict: The Skater's Recoil",
      
        questionText: "A 70 kg skater at rest pushes off a 5 kg skateboard. The skateboard flies forward at 14 m/s. What happens to the skater, and at what speed?",
        imageLayout: "left",
        imageCaption: "Skater pushing a skateboard.",
        diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" fill="none">
  <rect width="400" height="240" fill="#0f172a" />
  <text x="200" y="30" fill="#f8fafc" font-size="16" text-anchor="middle">Before: Skater and Board at Rest</text>
  <circle cx="200" cy="80" r="20" fill="#38bdf8"/>
  <rect x="180" y="105" width="40" height="10" fill="#facc15"/>
  <text x="200" y="140" fill="#f8fafc" font-size="16" text-anchor="middle">After: Skateboard pushed forward</text>
  <circle cx="120" cy="190" r="20" fill="#38bdf8"/>
  <path d="M 90 190 L 40 190" stroke="#f43f5e" stroke-width="3" marker-end="url(#arrow)" />
  <text x="65" y="180" fill="#f43f5e" font-size="14" text-anchor="middle">v = ?</text>
  <rect x="260" y="215" width="40" height="10" fill="#facc15"/>
  <path d="M 310 220 L 370 220" stroke="#4ade80" stroke-width="3" marker-end="url(#arrow)" />
  <text x="340" y="210" fill="#4ade80" font-size="14" text-anchor="middle">14 m/s</text>
  <defs>
    <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto-start-reverse">
      <path d="M 0 0 L 6 3 L 0 6 z" fill="currentColor"/>
    </marker>
  </defs>
</svg>`,
        points: 2,
        choices: [
          {
            id: "c1",
            text: "The skater recoils backwards at 1 m/s.",
            isCorrect: true,
            explanation: "Correct! Total momentum before is 0. So, 0 = (70 kg)(v_skater) + (5 kg)(14 m/s). 70v = -70, v = -1 m/s. The negative sign means backward recoil."
          },
          {
            id: "c2",
            text: "The skater recoils backwards at 14 m/s.",
            isCorrect: false,
            misconceptionId: "MECH-CONS-MOM-SPEED-NOT-VELOCITY",
            explanation: "The skater is much heavier than the skateboard, so their recoil velocity will be proportionally smaller."
          },
          {
            id: "c3",
            text: "The skater recoils backwards at 196 m/s.",
            isCorrect: false,
            misconceptionId: "MECH-CONS-MOM-RECOIL-FASTER",
            explanation: "You may have divided the mass of the skater by the skateboard's momentum instead of setting the total momentum to zero."
          },
          {
            id: "c4",
            text: "The skater remains at rest because the system is isolated.",
            isCorrect: false,
            misconceptionId: "MECH-CONS-MOM-ENERGY-CONSERVED",
            explanation: "If the skater stayed at rest, the total momentum would be non-zero (just the skateboard moving), violating conservation of momentum."
          }
        ]
      
    },
    {
      id: "slide-3",
      processStepId: "explain",
      type: "lesson_text",
      title: "Explaining Conservation",
      
        body: `### Calculating Collisions and Recoil

**Recoil (Explosions):**
Initially, objects are at rest, so total initial momentum $P_i = 0$.
$$ m_1 v_1 + m_2 v_2 = 0 \\implies v_1 = - \\frac{m_2}{m_1} v_2 $$
*The negative sign indicates the objects move in opposite directions.*

**Perfectly Inelastic Collisions:**
When objects stick together after a collision, they share a common final velocity $V$.
$$ m_1 v_1 + m_2 v_2 = (m_1 + m_2) V $$

**Worked Example:**
A 2 kg cart moving at 6 m/s hits a 4 kg cart at rest. They stick together. What is their final speed?
1. Initial Momentum: $P_i = (2 \\text{ kg})(6 \\text{ m/s}) + (4 \\text{ kg})(0 \\text{ m/s}) = 12 \\text{ kg}\\cdot\\text{m/s}$
2. Final Momentum: $P_f = (2 + 4) V = 6V$
3. Conservation: $12 = 6V \\implies V = 2 \\text{ m/s}$`,
        keyTerms: []
      
    },
    {
      id: "slide-4",
      processStepId: "practice",
      type: "question_mcq",
      title: "Practice: Perfectly Inelastic Collision",
      
        questionText: "A 2 kg cart moving to the right at 5 m/s collides with a stationary 3 kg cart. They stick together (perfectly inelastic). Find their common velocity after the collision.",
        imageLayout: "left",
        imageCaption: "Two carts colliding and sticking together.",
        diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" fill="none">
  <rect width="400" height="240" fill="#0f172a" />
  <line x1="20" y1="120" x2="380" y2="120" stroke="#475569" stroke-width="4" />
  
  <text x="200" y="30" fill="#f8fafc" font-size="14" text-anchor="middle">Before Collision</text>
  <rect x="50" y="80" width="40" height="40" fill="#38bdf8"/>
  <text x="70" y="105" fill="#0f172a" font-size="14" text-anchor="middle">2kg</text>
  <path d="M 95 100 L 140 100" stroke="#4ade80" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="117" y="90" fill="#4ade80" font-size="12" text-anchor="middle">5 m/s</text>
  
  <rect x="180" y="80" width="40" height="40" fill="#f43f5e"/>
  <text x="200" y="105" fill="#0f172a" font-size="14" text-anchor="middle">3kg</text>
  
  <line x1="20" y1="220" x2="380" y2="220" stroke="#475569" stroke-width="4" />
  <text x="200" y="150" fill="#f8fafc" font-size="14" text-anchor="middle">After Collision</text>
  <rect x="220" y="180" width="80" height="40" fill="#a855f7"/>
  <text x="260" y="205" fill="#0f172a" font-size="14" text-anchor="middle">5kg</text>
  <path d="M 310 200 L 360 200" stroke="#4ade80" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="335" y="190" fill="#4ade80" font-size="12" text-anchor="middle">V = ?</text>
</svg>`,
        points: 2,
        choices: [
          {
            id: "c1",
            text: "2 m/s to the right",
            isCorrect: true,
            explanation: "Correct! p_before = 2 kg × 5 m/s = 10 kg·m/s. Since they stick together, p_after = (2 kg + 3 kg) × V. 10 = 5V, so V = 2 m/s."
          },
          {
            id: "c2",
            text: "5 m/s to the right",
            isCorrect: false,
            misconceptionId: "MECH-CONS-MOM-SPEED-NOT-VELOCITY",
            explanation: "The velocity does not stay the same because the mass of the moving object has effectively increased."
          },
          {
            id: "c3",
            text: "3.33 m/s to the right",
            isCorrect: false,
            misconceptionId: "MECH-CONS-MOM-RECOIL-FASTER",
            explanation: "You divided by the 3 kg cart's mass. You must divide the total momentum by the total combined mass (5 kg)."
          },
          {
            id: "c4",
            text: "10 m/s to the right",
            isCorrect: false,
            misconceptionId: "MECH-CONS-MOM-ENERGY-CONSERVED",
            explanation: "You calculated the total momentum, not the final velocity. Divide momentum (10 kg·m/s) by the total mass (5 kg)."
          }
        ]
      
    },
    {
      id: "slide-5",
      processStepId: "evaluate",
      type: "lesson_text",
      title: "Mastery Checklist",
      
        body: `### Summary: Conservation of Momentum

You have reached the end of this lesson! Review your mastery of the following concepts:
*   [x] **Law of Conservation of Momentum:** $\\sum \\vec{p}_{\\text{before}} = \\sum \\vec{p}_{\\text{after}}$
*   [x] **Isolated Systems:** No external forces (like friction) are considered during the instant of collision.
*   [x] **Perfectly Inelastic Collisions:** Objects combine masses and share a final velocity.
*   [x] **Recoil:** Using negative signs to denote backward velocity after objects push apart from rest.

**Next Up (1-9):** We will explore how Kinetic Energy behaves during collisions, separating "Elastic" from "Inelastic" interactions!`,
        keyTerms: []
      
    }
  ]
};
