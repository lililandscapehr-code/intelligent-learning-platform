import type { EduCarouselConfig } from "../../../components/carousel/CarouselTypes";

export const lesson110CircularCarousel: EduCarouselConfig = {
  id: "CAROUSEL-PHYS-EB-MECH-1-10",
  title: "Part 1 · 1-10 Uniform Circular Motion",
  skillId: "SK-EGYPT-PHY-MECH-CIRCULAR",
  showProgressBar: true,
  showScoreTally: true,
  allowSkipQuestions: false,
  sequenceMode: "SEQUENTIAL",
  plan: {
    scenario: "Understanding the forces and motion of objects moving in circles.",
    mission: "Calculate angular velocity and centripetal force for objects in uniform circular motion.",
    planningPoints: ["Understand angular velocity", "Calculate centripetal acceleration", "Identify centripetal force"],
    studentPromise: "I will be able to explain why circular motion requires a continuous force and calculate its properties.",
    evaluationSummary: "Evaluation based on determining the tangential path of released objects and calculating centripetal force.",
    nextStepRule: "Complete all questions and review the mastery checklist."
  },
  processSteps: [
    { id: "connect", title: "Connect", type: "intro" },
    { id: "predict", title: "Predict", type: "assessment" },
    { id: "explain", title: "Explain", type: "instruction" },
    { id: "practice", title: "Practice", type: "assessment" },
    { id: "evaluate", title: "Evaluate", type: "summary" }
  ],
  slides: [
    {
      slideId: "slide-1",
      processStepId: "connect",
      type: "lesson_text",
      title: "Uniform Circular Motion",
      content: {
        markdownBody: `### Constantly Accelerating (Without Speeding Up)

In **Uniform Circular Motion**, an object travels in a circle at a *constant speed*. However, because its **direction** is constantly changing, its velocity is changing. Therefore, the object is continuously **accelerating**.

**Key Formulas:**
*   **Angular velocity ($\\omega$):** $\\omega = \\frac{2\\pi}{T} = 2\\pi f$
*   **Linear speed ($v$):** $v = \\omega r$
*   **Period ($T$):** $T = \\frac{2\\pi r}{v}$
*   **Centripetal Acceleration ($a_c$):** $a_c = \\frac{v^2}{r} = \\omega^2 r$
*   **Centripetal Force ($F_c$):** $F_c = \\frac{mv^2}{r} = m\\omega^2 r$

This force is always directed **toward the center** of the circle and can be provided by tension, normal force, gravity, or friction.`,
        keyTerms: [
          { term: "Centripetal Force", definition: "A net force directed toward the center of a circular path." },
          { term: "Angular Velocity", definition: "The rate of change of angular position, measured in rad/s." }
        ]
      }
    },
    {
      slideId: "slide-2",
      processStepId: "predict",
      type: "question_mcq",
      title: "Predict: The Broken String",
      content: {
        questionText: "A stone on a string is whirled in a horizontal circle. When the string suddenly breaks, what path does the stone take?",
        imageLayout: "left",
        imageCaption: "A top-down view of a stone whirled on a string.",
        diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" fill="none">
  <rect width="400" height="240" fill="#0f172a" />
  <circle cx="150" cy="120" r="80" stroke="#475569" stroke-width="2" stroke-dasharray="6" fill="none"/>
  
  <circle cx="150" cy="120" r="5" fill="#f8fafc"/>
  <line x1="150" y1="120" x2="230" y2="120" stroke="#f8fafc" stroke-width="2" />
  <circle cx="230" cy="120" r="10" fill="#94a3b8"/>
  
  <!-- Velocity Arrow -->
  <path d="M 230 110 L 230 50" stroke="#4ade80" stroke-width="3" marker-end="url(#arrow)"/>
  <text x="245" y="70" fill="#4ade80" font-size="14">v</text>
  
  <!-- Broken string options -->
  <path d="M 230 110 L 230 20" stroke="#facc15" stroke-width="2" stroke-dasharray="4" marker-end="url(#arrow)"/>
  <text x="215" y="15" fill="#facc15" font-size="12">Path A</text>
  
  <path d="M 240 120 L 320 120" stroke="#f43f5e" stroke-width="2" stroke-dasharray="4" marker-end="url(#arrow)"/>
  <text x="330" y="125" fill="#f43f5e" font-size="12">Path B</text>
  
  <path d="M 235 110 L 285 60" stroke="#a855f7" stroke-width="2" stroke-dasharray="4" marker-end="url(#arrow)"/>
  <text x="295" y="55" fill="#a855f7" font-size="12">Path C</text>

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
            text: "It flies tangentially (Path A, straight ahead from where it was released).",
            isCorrect: true,
            explanation: "Correct! Newton's First Law states an object in motion stays in motion in a straight line unless acted upon. Without the centripetal force (string tension), it moves tangentially."
          },
          {
            id: "c2",
            text: "It flies straight outward radially (Path B).",
            isCorrect: false,
            misconceptionId: "MECH-CIRCULAR-OUTWARD-PATH",
            explanation: "Many people feel a 'centrifugal' outward pull, but no outward force is pushing the stone radially when the string breaks."
          },
          {
            id: "c3",
            text: "It flies diagonally outward (Path C).",
            isCorrect: false,
            misconceptionId: "MECH-CIRCULAR-CENTRIFUGAL-REAL",
            explanation: "The object's instantaneous velocity vector is tangential to the circle. It will follow this exact tangent straight line."
          },
          {
            id: "c4",
            text: "It stops immediately because the force is gone.",
            isCorrect: false,
            misconceptionId: "MECH-CIRCULAR-NO-ACCELERATION",
            explanation: "An object does not require a continuous force to keep moving; it requires force to change its direction or speed."
          }
        ]
      }
    },
    {
      slideId: "slide-3",
      processStepId: "explain",
      type: "lesson_text",
      title: "Centripetal Force Examples",
      content: {
        markdownBody: `### Finding the Force

Centripetal force is not a "new" type of force; it is just the name for whatever net force keeps an object moving in a circle.

**Real-world examples:**
*   **Car on a curve:** Static friction provides $F_c$.
*   **Rollercoaster loop:** Normal force + gravity provides $F_c$.
*   **Moon orbiting Earth:** Gravity provides $F_c$.

**Worked Example:**
A 1000 kg car rounds a circular bend of radius 50 m at 20 m/s. What frictional force is required?
1. Apply the formula: $F_c = \\frac{mv^2}{r}$
2. Substitute: $F_c = \\frac{(1000 \\text{ kg})(20 \\text{ m/s})^2}{50 \\text{ m}}$
3. Calculate: $F_c = \\frac{1000 \\times 400}{50} = \\frac{400000}{50} = 8000 \\text{ N}$

Friction provides 8000 N of force directed toward the center of the curve.`,
        keyTerms: []
      }
    },
    {
      slideId: "slide-4",
      processStepId: "practice",
      type: "question_mcq",
      title: "Practice: The Whirling Ball",
      content: {
        questionText: "A 0.2 kg ball on a 0.5 m string is whirled in a horizontal circle at 4 revolutions per second. Find the centripetal force. (Hint: find angular velocity ω = 2πf first)",
        imageLayout: "left",
        imageCaption: "Ball whirling on a string with angular velocity labeled.",
        diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" fill="none">
  <rect width="400" height="240" fill="#0f172a" />
  
  <!-- Perspective Circle -->
  <ellipse cx="200" cy="140" rx="120" ry="40" stroke="#475569" stroke-width="2" stroke-dasharray="6" fill="none"/>
  
  <!-- Center and String -->
  <circle cx="200" cy="140" r="4" fill="#f8fafc"/>
  <line x1="200" y1="140" x2="320" y2="140" stroke="#f8fafc" stroke-width="2" />
  <text x="260" y="130" fill="#f8fafc" font-size="12">r = 0.5m</text>
  
  <!-- Ball -->
  <circle cx="320" cy="140" r="12" fill="#38bdf8"/>
  <text x="320" y="165" fill="#f8fafc" font-size="10" text-anchor="middle">m = 0.2kg</text>
  
  <!-- Force Arrow -->
  <path d="M 305 140 L 230 140" stroke="#f43f5e" stroke-width="3" marker-end="url(#arrow)"/>
  <text x="250" y="155" fill="#f43f5e" font-size="12">Fc = ?</text>
  
  <!-- Angular Velocity -->
  <path d="M 120 120 C 130 90, 270 90, 280 120" stroke="#a855f7" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  <text x="200" y="95" fill="#a855f7" font-size="12" text-anchor="middle">f = 4 rev/s</text>

</svg>`,
        points: 2,
        choices: [
          {
            id: "c1",
            text: "63.1 N",
            isCorrect: true,
            explanation: "Correct! ω = 2πf = 2π(4) = 8π ≈ 25.1 rad/s. Fc = mω²r = (0.2)(25.1)²(0.5) = 0.1 × 631.6 ≈ 63.1 N."
          },
          {
            id: "c2",
            text: "1.6 N",
            isCorrect: false,
            misconceptionId: "MECH-CIRCULAR-CENTRIFUGAL-REAL",
            explanation: "You might have calculated Fc = m(f)²r, forgetting to convert frequency to angular velocity (multiplying by 2π)."
          },
          {
            id: "c3",
            text: "12.6 N",
            isCorrect: false,
            misconceptionId: "MECH-CIRCULAR-OUTWARD-PATH",
            explanation: "This is m(2πf)r, but angular velocity ω needs to be squared in the formula Fc = mω²r."
          },
          {
            id: "c4",
            text: "31.5 N",
            isCorrect: false,
            misconceptionId: "MECH-CIRCULAR-NO-ACCELERATION",
            explanation: "You may have forgotten to multiply by the mass (0.2kg). 31.5 N is half of the correct force."
          }
        ]
      }
    },
    {
      slideId: "slide-5",
      processStepId: "evaluate",
      type: "lesson_text",
      title: "Mastery Checklist",
      content: {
        markdownBody: `### Summary: Uniform Circular Motion

Great job! Check off the concepts you've mastered:
*   [x] **Angular vs Linear:** Converting frequency to angular velocity ($\\omega = 2\\pi f$).
*   [x] **Centripetal Acceleration:** Direction is always toward the center. Tangential speed is constant but direction changes.
*   [x] **Inertia (Newton's 1st Law):** Objects released from circular motion travel in a straight, tangential line.
*   [x] **Centripetal Force ($F_c$):** The net force toward the center, calculated via $F_c = m\\frac{v^2}{r}$ or $F_c = m\\omega^2r$.

**Next Up (1-11):** We will apply these circular motion concepts to the grand scale of the universe in **Gravitation and Orbits**!`,
        keyTerms: []
      }
    }
  ]
};
