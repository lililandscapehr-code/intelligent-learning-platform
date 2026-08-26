import type { EduCarouselConfig } from "../../../components/carousel/CarouselTypes";

export const lesson19MomentumEnergyCarousel: EduCarouselConfig = {
  id: "CAROUSEL-PHYS-EB-MECH-1-9",
  title: "Part 1 · 1-9 Momentum and Kinetic Energy in Collisions",
  skillId: "SK-EGYPT-PHY-MECH-MOMENTUM",
  showProgressBar: true,
  showScoreTally: true,
  allowSkipQuestions: false,
  sequenceMode: "SEQUENTIAL",
  plan: {
    scenario: "Investigate energy transfer during different types of collisions.",
    mission: "Distinguish between elastic and inelastic collisions using kinetic energy calculations.",
    planningPoints: ["Define elastic vs inelastic", "Calculate coefficient of restitution", "Analyze equal mass collisions"],
    studentPromise: "I will be able to determine if a collision is elastic or inelastic by analyzing kinetic energy.",
    evaluationSummary: "Evaluation based on identifying kinetic energy conservation and final velocities in elastic collisions.",
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
      title: "Elastic vs Inelastic Collisions",
      
        body: `### Not All Collisions Are the Same!

While **Momentum is ALWAYS conserved** in an isolated collision, Kinetic Energy ($KE = \\frac{1}{2}mv^2$) behaves differently depending on the collision type.

*   **Elastic Collisions:** Both momentum AND kinetic energy are conserved. Objects bounce off each other with no loss of energy.
*   **Inelastic Collisions:** Momentum is conserved, but KE is lost (converted into heat, sound, or permanent deformation).
*   **Perfectly Inelastic Collisions:** Maximum KE is lost as the objects stick together.

**Coefficient of Restitution ($e$):**
Measures how elastic a collision is.
$$ e = \\frac{v_2' - v_1'}{v_1 - v_2} $$
*   $e = 1$: Perfectly Elastic
*   $e = 0$: Perfectly Inelastic`,
        keyTerms: ["Elastic Collision", "Coefficient of Restitution"]
      
    },
    {
      id: "slide-2",
      processStepId: "predict",
      type: "question_mcq",
      title: "Predict: The Bouncing Balls",
      
        questionText: "A rubber ball and a clay ball of equal mass are dropped from 1m height. The rubber ball bounces back to ~0.9m. The clay ball doesn't bounce at all. Why does one bounce and the other doesn't?",
        imageLayout: "left",
        imageCaption: "Rubber and clay balls hitting the floor.",
        diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" fill="none">
  <rect width="400" height="240" fill="#0f172a" />
  <line x1="20" y1="200" x2="380" y2="200" stroke="#94a3b8" stroke-width="6" />
  
  <text x="120" y="30" fill="#f8fafc" font-size="14" text-anchor="middle">Rubber Ball</text>
  <circle cx="120" cy="185" r="15" fill="#38bdf8"/>
  <path d="M 140 185 L 140 100" stroke="#4ade80" stroke-width="2" stroke-dasharray="4" marker-end="url(#arrow)"/>
  <rect x="80" y="210" width="80" height="10" fill="#4ade80"/>
  <text x="120" y="235" fill="#4ade80" font-size="10" text-anchor="middle">High KE Recovered</text>

  <text x="280" y="30" fill="#f8fafc" font-size="14" text-anchor="middle">Clay Ball</text>
  <ellipse cx="280" cy="190" rx="20" ry="10" fill="#f97316"/>
  <rect x="240" y="210" width="80" height="10" fill="#f43f5e"/>
  <text x="280" y="235" fill="#f43f5e" font-size="10" text-anchor="middle">High KE Lost (Deformation)</text>

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
            text: "The rubber ball undergoes a mostly elastic collision, conserving kinetic energy, while the clay ball deforms, losing kinetic energy.",
            isCorrect: true,
            explanation: "Correct! The clay ball's collision is highly inelastic; its kinetic energy transforms into work done to deform the clay and thermal energy."
          },
          {
            id: "c2",
            text: "Momentum is only conserved for the rubber ball, allowing it to bounce back.",
            isCorrect: false,
            misconceptionId: "MECH-ELASTIC-BOTH-MOVE-AFTER",
            explanation: "Momentum is conserved in BOTH collisions (when factoring in the Earth). The difference is in Kinetic Energy conservation."
          },
          {
            id: "c3",
            text: "The clay ball loses its mass upon impact, reducing its kinetic energy to zero.",
            isCorrect: false,
            misconceptionId: "MECH-ELASTIC-KE-LOST",
            explanation: "The clay ball does not lose mass. It loses kinetic energy due to internal structural deformation."
          },
          {
            id: "c4",
            text: "Gravity affects the clay ball more strongly because it doesn't have elastic properties.",
            isCorrect: false,
            misconceptionId: "MECH-ELASTIC-AVERAGE-SPEED",
            explanation: "Gravity accelerates both objects equally at 9.8 m/s². The difference in bounce is purely due to the material's elasticity during the collision."
          }
        ]
      
    },
    {
      id: "slide-3",
      processStepId: "explain",
      type: "lesson_text",
      title: "Equal Mass Elastic Collisions",
      
        body: `### Trading Velocities!

In a 1D elastic collision where **Kinetic Energy is fully conserved**:
$$ \\frac{1}{2}m_1v_1^2 + \\frac{1}{2}m_2v_2^2 = \\frac{1}{2}m_1v_1'^2 + \\frac{1}{2}m_2v_2'^2 $$

A fascinating mathematical outcome occurs when the **masses are equal ($m_1 = m_2$)**:
The objects simply **exchange velocities**!
*   $v_1' = v_2$
*   $v_2' = v_1$

**Example:**
A 1 kg billiard ball moving at 4 m/s strikes a stationary 1 kg billiard ball.
Because it's an elastic collision of equal masses:
*   The first ball stops completely ($v_1' = 0$ m/s).
*   The second ball shoots forward at the exact same speed ($v_2' = 4$ m/s).`,
        keyTerms: []
      
    },
    {
      id: "slide-4",
      processStepId: "practice",
      type: "question_mcq",
      title: "Practice: Elastic Collision Calculation",
      
        questionText: "Ball A (2 kg, 6 m/s) collides elastically with ball B (2 kg, at rest). After the collision, what are their respective velocities?",
        imageLayout: "left",
        imageCaption: "Two equal mass balls on a track undergoing an elastic collision.",
        diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" fill="none">
  <rect width="400" height="240" fill="#0f172a" />
  <line x1="20" y1="100" x2="380" y2="100" stroke="#475569" stroke-width="4" />
  
  <text x="200" y="30" fill="#f8fafc" font-size="14" text-anchor="middle">Before Collision</text>
  <circle cx="80" cy="85" r="15" fill="#38bdf8"/>
  <text x="80" y="88" fill="#0f172a" font-size="10" text-anchor="middle">A</text>
  <path d="M 100 85 L 140 85" stroke="#4ade80" stroke-width="2" marker-end="url(#arrow)"/>
  
  <circle cx="200" cy="85" r="15" fill="#f43f5e"/>
  <text x="200" y="88" fill="#0f172a" font-size="10" text-anchor="middle">B (Rest)</text>
  
  <line x1="20" y1="200" x2="380" y2="200" stroke="#475569" stroke-width="4" />
  <text x="200" y="140" fill="#f8fafc" font-size="14" text-anchor="middle">After Collision</text>
  <circle cx="150" cy="185" r="15" fill="#38bdf8"/>
  <text x="150" y="188" fill="#0f172a" font-size="10" text-anchor="middle">A</text>
  
  <circle cx="270" cy="185" r="15" fill="#f43f5e"/>
  <text x="270" y="188" fill="#0f172a" font-size="10" text-anchor="middle">B</text>
  <path d="M 290 185 L 330 185" stroke="#4ade80" stroke-width="2" marker-end="url(#arrow)"/>

</svg>`,
        points: 2,
        choices: [
          {
            id: "c1",
            text: "v_A' = 0 m/s, v_B' = 6 m/s",
            isCorrect: true,
            explanation: "Correct! In a completely elastic collision between two objects of equal mass, they perfectly exchange velocities."
          },
          {
            id: "c2",
            text: "v_A' = 3 m/s, v_B' = 3 m/s",
            isCorrect: false,
            misconceptionId: "MECH-ELASTIC-BOTH-MOVE-AFTER",
            explanation: "This would be the result if they stuck together (a perfectly inelastic collision), but this collision is perfectly elastic."
          },
          {
            id: "c3",
            text: "v_A' = 6 m/s, v_B' = 0 m/s",
            isCorrect: false,
            misconceptionId: "MECH-ELASTIC-KE-LOST",
            explanation: "If this happened, Ball A would have passed right through Ball B without interacting!"
          },
          {
            id: "c4",
            text: "v_A' = -3 m/s, v_B' = 9 m/s",
            isCorrect: false,
            misconceptionId: "MECH-ELASTIC-AVERAGE-SPEED",
            explanation: "While this conserves momentum, it does not conserve Kinetic Energy (KE would actually increase, which is impossible without an explosion)."
          }
        ]
      
    },
    {
      id: "slide-5",
      processStepId: "evaluate",
      type: "lesson_text",
      title: "Mastery Checklist",
      
        body: `### Summary: Momentum and Kinetic Energy

Excellent work! Let's review what you've learned:
*   [x] **Elastic Collisions:** Both momentum and kinetic energy are fully conserved.
*   [x] **Inelastic Collisions:** Momentum is conserved, but kinetic energy is converted into other forms (heat, deformation).
*   [x] **Velocity Exchange:** In 1D elastic collisions between equal masses, the objects swap velocities.
*   [x] **Coefficient of Restitution ($e$):** Describes the elasticity of the impact on a scale from 0 to 1.

**Next Up (1-10):** We will step away from straight lines and collisions to study **Uniform Circular Motion**!`,
        keyTerms: []
      
    }
  ]
};
