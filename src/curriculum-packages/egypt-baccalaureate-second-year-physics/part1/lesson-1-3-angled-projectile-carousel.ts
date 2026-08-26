import type { EduCarouselConfig } from "../../../components/carousel/CarouselTypes";

export const lesson13AngledProjectileCarousel: EduCarouselConfig = {
  id: "CAROUSEL-PHYS-EB-MECH-1-3",
  title: "Part 1 · 1-3 Angled Projectile Motion",
  skillId: "SK-EGYPT-PHY-MECH-PROJECTILES",
  showProgressBar: true,
  showScoreTally: true,
  allowSkipQuestions: false,
  sequenceMode: "SEQUENTIAL",
  plan: {
    scenario: "Mastering angled projectiles.",
    mission: "Understand projectile motion launched at an angle.",
    planningPoints: ["Decompose velocity components", "Calculate max height, time, and range"],
    studentPromise: "You will be able to solve angled projectile problems.",
    evaluationSummary: "Well done!",
    nextStepRule: "Proceed to moments."
  },
  processSteps: [
    { id: "step-1", label: "Connect" },
    { id: "step-2", label: "Predict Phenomenon" },
    { id: "step-3", label: "Concept & Derivation" },
    { id: "step-4", label: "Practice Problem" },
    { id: "step-5", label: "Mastery Checklist" }
  ],
  slides: [
    {
      id: "slide-1",
      type: "lesson_text",
      processStepId: "step-1",
      body: "### Angled Projectiles\n\nComponents at launch:\n- $v_{0x} = v_0\\cos\\theta$ (constant)\n- $v_{0y} = v_0\\sin\\theta$ (decelerates to 0 at top)\n\nAt max height: $v_y = 0$, $v_x = v_0\\cos\\theta$\n- Time to top: $t_{top} = \\frac{v_0\\sin\\theta}{g}$\n- Max Height: $H_{max} = \\frac{v_0^2\\sin^2\\theta}{2g}$\n- Total time: $T = 2t_{top}$\n- Range: $R = \\frac{v_0^2\\sin2\\theta}{g}$ (Max range at $\\theta = 45^{\\circ}$)",
      objectives: ["Decompose velocity vectors", "Apply projectile formulas"],
      keyTerms: ["Launch Angle", "Max Height", "Range"]
    },
    {
      id: "slide-2",
      type: "question_mcq",
      processStepId: "step-2",
      question: "A footballer kicks a ball at 20 m/s at 30° angle. Is 45° always the angle for max range? What if there's a wall?",
      points: 2,
      imageLayout: "left",
      imageCaption: "Launch components",
      diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240"><rect width="100%" height="100%" fill="#0f172a"/><path d="M50 200 Q200 20 350 200" stroke="#38bdf8" stroke-width="2" fill="none"/><line x1="50" y1="200" x2="100" y2="150" stroke="#f87171" stroke-width="2" marker-end="url(#arrow)"/><text x="110" y="145" fill="#f8fafc" font-size="12">v0</text><path d="M50 200 A30 30 0 0 1 80 180" fill="none" stroke="#f472b6"/><text x="85" y="195" fill="#f472b6" font-size="12">θ</text><path d="M20 200 L380 200" stroke="#475569" stroke-width="3"/></svg>`,
      choices: [
        {
          id: "c1",
          text: "Yes, 45° always guarantees the ball travels furthest no matter the obstacles.",
          isCorrect: false,
          explanation: "Obstacles like walls might block a lower 45° trajectory, requiring a higher launch angle.",
          misconceptionId: "MECH-PROJ-45-ALWAYS-MAX"
        },
        {
          id: "c2",
          text: "No, if there is a wall, a higher angle might be needed to clear it, even if it means a shorter theoretical max range.",
          isCorrect: true,
          explanation: "45° gives max theoretical range on flat ground, but real-world constraints (like walls) often require adjusting the angle."
        },
        {
          id: "c3",
          text: "Max range is always achieved at 90°.",
          isCorrect: false,
          explanation: "90° gives maximum height, but zero horizontal range.",
          misconceptionId: "MECH-PROJ-VERT-COMPONENT-WRONG"
        },
        {
          id: "c4",
          text: "The angle doesn't matter, only the initial speed determines range.",
          isCorrect: false,
          explanation: "Range depends on both initial speed and angle.",
          misconceptionId: "MECH-PROJ-RANGE-WRONG"
        }
      ]
    },
    {
      id: "slide-3",
      type: "lesson_text",
      processStepId: "step-3",
      body: "### Worked Example\n\nBall launched at 20 m/s, $30^{\\circ}$, $g = 10$ m/s$^2$.\n\n1. **Components:**\n   - $v_{0x} = 20\\cos(30^{\\circ}) \\approx 17.3$ m/s\n   - $v_{0y} = 20\\sin(30^{\\circ}) = 10$ m/s\n2. **Time to Top & Height:**\n   - $t_{top} = 1$ s\n   - $H = 5$ m\n3. **Total Time & Range:**\n   - $T = 2$ s\n   - $R = 17.3 \\times 2 = 34.6$ m",
      objectives: ["Decompose velocity components", "Calculate max height, time, and range"],
      keyTerms: ["Launch Angle", "Max Height", "Range"]
    },
    {
      id: "slide-4",
      type: "question_mcq",
      processStepId: "step-4",
      question: "A projectile is launched at 40m/s at 60° above horizontal. Find: (a) max height, (b) total time of flight. (g=10m/s²).",
      points: 2,
      imageLayout: "left",
      imageCaption: "Range vs Angle",
      diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240"><rect width="100%" height="100%" fill="#0f172a"/><path d="M50 200 Q200 50 350 200" stroke="#f472b6" stroke-width="2" fill="none" stroke-dasharray="4,4"/><path d="M50 200 Q150 20 250 200" stroke="#38bdf8" stroke-width="2" fill="none"/><text x="180" y="40" fill="#f8fafc" font-size="12">45 deg (Max Range)</text><text x="100" y="100" fill="#38bdf8" font-size="12">60 deg</text><path d="M20 200 L380 200" stroke="#475569" stroke-width="3"/></svg>`,
      choices: [
        {
          id: "c1",
          text: "H = 60m, T ≈ 7s",
          isCorrect: true,
          explanation: "v_0y = 40sin(60) = 34.6 m/s. H = 34.6²/(2*10) = 60m. T = 2*34.6/10 = 6.93s ≈ 7s"
        },
        {
          id: "c2",
          text: "H = 40m, T = 4s",
          isCorrect: false,
          explanation: "Did you use 40cos(60) for vertical velocity? Remember vertical is sin(θ).",
          misconceptionId: "MECH-PROJ-VERT-COMPONENT-WRONG"
        },
        {
          id: "c3",
          text: "H = 80m, T = 8s",
          isCorrect: false,
          explanation: "Did you use the full velocity instead of the vertical component?",
          misconceptionId: "MECH-PROJ-45-ALWAYS-MAX"
        }
      ]
    },
    {
      id: "slide-5",
      type: "lesson_text",
      processStepId: "step-5",
      body: "### Mastery Checklist\n\n- [x] I can decompose initial velocity into $v_{0x}$ and $v_{0y}$.\n- [x] I know horizontal velocity is constant while vertical decelerates.\n- [x] I can calculate max height and range for angled launches.\n\n**Next up:** Lesson 1-4 Moments.",
      objectives: ["Review concepts"],
      keyTerms: ["Mastery"]
    }
  ]
};
