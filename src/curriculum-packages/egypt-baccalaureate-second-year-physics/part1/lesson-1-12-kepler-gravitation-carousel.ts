import type { EduCarouselConfig } from "../../../components/carousel/CarouselTypes";

export const lesson112KeplerCarousel: EduCarouselConfig = {
  id: "CAROUSEL-PHYS-EB-MECH-1-12",
  title: "Part 1 · 1-12 Kepler's Laws and Gravitation",
  skillId: "SK-EGYPT-PHY-MECH-GRAVITATION",
  showProgressBar: true,
  showScoreTally: true,
  allowSkipQuestions: false,
  sequenceMode: "SEQUENTIAL",
  plan: {
    scenario: "Exploring the vast universe, from satellites orbiting Earth to planets orbiting the Sun.",
    mission: "Apply Newton's Law of Gravitation and Kepler's Laws to calculate orbital speeds and periods.",
    planningPoints: [
      "Review Kepler's 3 Laws",
      "Apply Newton's Universal Gravitation",
      "Calculate satellite orbital speed and period"
    ],
    studentPromise: "You will understand why the Moon takes nearly a month to orbit Earth while the ISS does it in 90 minutes.",
    evaluationSummary: "Evaluation completed for Kepler's laws and universal gravitation.",
    nextStepRule: "Proceed to Part 2: Gases and Heat."
  },
  processSteps: [
    { id: "STEP-1", title: "Phenomenon" },
    { id: "STEP-2", title: "Explanation" },
    { id: "STEP-3", title: "Practice" },
    { id: "STEP-4", title: "Summary" }
  ],
  slides: [
    {
      id: "SLIDE-1-CONNECT",
      type: "lesson_text",
      processStepId: "STEP-1",
      title: "Orbits in the Cosmos",
      content: "### How do things stay in orbit?\n\nThe Moon has been orbiting the Earth for billions of years, and now human-made satellites like the International Space Station (ISS) do the same. But they move very differently.\n\nIn this lesson, we will uncover the universal laws that govern all orbital motion.\n\n**Learning Outcomes:**\n- State and apply Kepler's three laws of planetary motion.\n- Use Newton's Law of Universal Gravitation.\n- Derive and calculate orbital speed and period for satellites.\n\nKey terms: `Kepler's Laws`, `Universal Gravitation`, `Orbital Period`, `Ellipse`"
    },
    {
      id: "SLIDE-2-PREDICT",
      type: "question_mcq",
      processStepId: "STEP-1",
      title: "Predict: Orbital Times",
      text: "The Moon orbits Earth in ~27 days. The ISS, at a much lower altitude, orbits Earth in just ~90 minutes. Why does a LOWER orbit mean a SHORTER period (and faster speed)?",
      points: 2,
      imageLayout: "left",
      imageCaption: "Earth orbits: ISS vs Moon",
      diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240"><rect width="400" height="240" fill="#0f172a"/><circle cx="200" cy="120" r="15" fill="#3b82f6"/><circle cx="200" cy="120" r="40" fill="none" stroke="#94a3b8" stroke-dasharray="4 2"/><circle cx="200" cy="80" r="4" fill="#fbbf24"/><path d="M 200 80 L 225 80" stroke="#fbbf24" stroke-width="2" marker-end="url(#arrow3)"/><circle cx="200" cy="120" r="100" fill="none" stroke="#64748b" stroke-dasharray="6 4"/><circle cx="200" cy="20" r="6" fill="#cbd5e1"/><path d="M 200 20 L 210 20" stroke="#cbd5e1" stroke-width="2" marker-end="url(#arrow3)"/><text x="235" y="85" fill="#fbbf24" font-size="12">ISS (fast)</text><text x="220" y="25" fill="#cbd5e1" font-size="12">Moon (slow)</text><text x="10" y="20" fill="#f8fafc" font-size="14">Kepler's 3rd Law:</text><text x="10" y="40" fill="#f8fafc" font-size="14">T² ∝ r³</text><defs><marker id="arrow3" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke"/></marker></defs></svg>`,
      choices: [
        {
          id: "C1",
          text: "Higher orbits have more gravity pulling them, making them move faster and take longer.",
          isCorrect: false,
          explanation: "Gravity gets WEAKER as you move further away ($F \\propto 1/r^2$).",
          misconceptionId: "MECH-KEPLER-HIGHER-FASTER"
        },
        {
          id: "C2",
          text: "Lower orbits have a smaller radius and a higher orbital speed because gravity is stronger closer to Earth, leading to a much shorter period.",
          isCorrect: true,
          explanation: "According to $v = \\sqrt{\\frac{GM}{r}}$ and Kepler's 3rd Law ($T^2 \\propto r^3$), smaller $r$ means larger $v$ and much smaller $T$."
        },
        {
          id: "C3",
          text: "The ISS has engines that keep it moving fast, while the Moon only relies on natural gravity.",
          isCorrect: false,
          explanation: "The ISS does not use engines to maintain its orbital speed; it is in free-fall around the Earth, governed entirely by gravity, just like the Moon.",
          misconceptionId: "MECH-KEPLER-ENGINES-NEEDED"
        }
      ]
    },
    {
      id: "SLIDE-3-EXPLAIN",
      type: "lesson_text",
      processStepId: "STEP-2",
      title: "Kepler's Laws and Newton's Gravitation",
      content: "### Kepler's 3 Laws of Planetary Motion\n1. **Law of Ellipses:** Planets move in elliptical orbits with the Sun at one focus.\n2. **Law of Equal Areas:** A line segment joining a planet and the Sun sweeps out equal areas during equal intervals of time (planets move faster when closer to the Sun).\n3. **Law of Harmonies:** The square of the orbital period $T$ is proportional to the cube of the semi-major axis (or mean radius) $r$:\n   $$T^2 \\propto r^3 \\implies \\frac{T^2}{r^3} = \\frac{4\\pi^2}{GM}$$\n\n### Newton's Law of Universal Gravitation\nThe gravitational force between two masses $m_1$ and $m_2$ separated by distance $r$ is:\n$$F_g = G\\frac{m_1 m_2}{r^2}$$\nwhere $G = 6.67 \\times 10^{-11} \\text{ N}\\cdot\\text{m}^2/\\text{kg}^2$.\n\n### Orbital Speed and Period\nFor a circular orbit, gravity provides the centripetal force ($F_c = F_g$):\n$$m\\frac{v^2}{r} = G\\frac{Mm}{r^2} \\implies v = \\sqrt{\\frac{GM}{r}}$$\nThe period is the time for one orbit: $T = \\frac{2\\pi r}{v}$.\n\n*Worked Example:* Satellite at $r = 6.8 \\times 10^6$ m, $GM_E = 4 \\times 10^{14} \\text{ N}\\cdot\\text{m}^2/\\text{kg}$.\n$v = \\sqrt{\\frac{4 \\times 10^{14}}{6.8 \\times 10^6}} \\approx 7668$ m/s.\n$T = \\frac{2\\pi(6.8 \\times 10^6)}{7668} \\approx 5571$ s (approx 92.8 min)."
    },
    {
      id: "SLIDE-4-PRACTICE",
      type: "question_mcq",
      processStepId: "STEP-3",
      title: "Practice: Applying Kepler's Third Law",
      text: "Planet X orbits its star with a period of 8 years and a mean orbital radius $r$. Planet Y orbits the same star with a mean orbital radius of $4r$. Using Kepler's 3rd Law, find Planet Y's orbital period.",
      points: 2,
      imageLayout: "left",
      imageCaption: "Two planets around the same star",
      diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240"><rect width="400" height="240" fill="#0f172a"/><circle cx="200" cy="120" r="10" fill="#fcd34d"/><ellipse cx="200" cy="120" rx="40" ry="30" fill="none" stroke="#94a3b8" stroke-dasharray="4 2"/><circle cx="240" cy="120" r="4" fill="#38bdf8"/><text x="245" y="115" fill="#38bdf8" font-size="12">Planet X (r)</text><ellipse cx="200" cy="120" rx="160" ry="120" fill="none" stroke="#64748b" stroke-dasharray="6 4"/><circle cx="360" cy="120" r="6" fill="#f87171"/><text x="290" y="115" fill="#f87171" font-size="12">Planet Y (4r)</text><text x="10" y="20" fill="#cbd5e1" font-size="14">T²/r³ = constant</text><text x="10" y="45" fill="#cbd5e1" font-size="14">T_X = 8 years</text><text x="10" y="65" fill="#cbd5e1" font-size="14">T_Y = ?</text></svg>`,
      choices: [
        {
          id: "C1",
          text: "32 years",
          isCorrect: false,
          explanation: "It looks like you multiplied the period by 4. But the relationship is $T^2 \\propto r^3$, not $T \\propto r$.",
          misconceptionId: "MECH-KEPLER-LINEAR-RELATION"
        },
        {
          id: "C2",
          text: "64 years",
          isCorrect: true,
          explanation: "Using $\\frac{T_Y^2}{T_X^2} = \\frac{r_Y^3}{r_X^3}$: $\\frac{T_Y^2}{8^2} = \\frac{(4r)^3}{r^3} = 64$. So $T_Y^2 = 64 \\times 64 = 4096$. Taking the square root gives $T_Y = 64$ years."
        },
        {
          id: "C3",
          text: "16 years",
          isCorrect: false,
          explanation: "You might have calculated $T \\propto r^2$ instead of $T^2 \\propto r^3$.",
          misconceptionId: "MECH-KEPLER-WRONG-POWER"
        },
        {
          id: "C4",
          text: "Kepler's laws only apply to circular orbits, so we cannot determine the period.",
          isCorrect: false,
          explanation: "Kepler's laws apply to elliptical orbits as well, where $r$ is the semi-major axis.",
          misconceptionId: "MECH-KEPLER-CIRCULAR-ONLY"
        }
      ]
    },
    {
      id: "SLIDE-5-SUMMARY",
      type: "lesson_text",
      processStepId: "STEP-4",
      title: "Chapter 1 Complete!",
      content: "### Congratulations! 🎉\n\nYou have successfully completed all lessons in **Chapter 1: Mechanics**!\n\n**Mastery Checklist:**\n- [x] Analyzed horizontal and vertical circular motion.\n- [x] Calculated forces and minimum speeds.\n- [x] Applied Newton's Universal Gravitation.\n- [x] Mastered Kepler's Three Laws of Planetary Motion.\n\n**What's Next?**\nYou are now ready to embark on **Part 2**, where we transition from the mechanics of solids and orbits into the fascinating world of **Gases and Heat**."
    }
  ]
};
