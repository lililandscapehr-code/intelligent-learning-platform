import type { EduCarouselConfig } from "../../../components/carousel/CarouselTypes";

export const lesson15EquilibriumCarousel: EduCarouselConfig = {
  id: "CAROUSEL-PHYS-EB-MECH-1-5",
  title: "Part 1 · 1-5 Static Equilibrium",
  skillId: "SK-EGYPT-PHY-MECH-FORCES",
  showProgressBar: true,
  showScoreTally: true,
  allowSkipQuestions: false,
  sequenceMode: "SEQUENTIAL",
  plan: {
    scenario: "Calculating support forces for stationary structures",
    mission: "Determine reaction forces using translational and rotational equilibrium conditions",
    planningPoints: ["Define equilibrium", "Calculate moments", "Solve for unknowns"],
    studentPromise: "I will use both force and moment balances to solve equilibrium problems.",
    evaluationSummary: "Mastered the conditions of static equilibrium.",
    nextStepRule: "Proceed to lesson 1-6."
  },
  processSteps: [
    { id: "connect", title: "Connect", type: "instruction" },
    { id: "predict", title: "Predict", type: "practice" },
    { id: "explain", title: "Explain", type: "instruction" },
    { id: "practice", title: "Practice", type: "practice" },
    { id: "evaluate", title: "Evaluate", type: "instruction" }
  ],
  slides: [
    {
      id: "slide-1-connect",
      processStepId: "connect",
      type: "lesson_text",
      title: "Conditions for Static Equilibrium",
      markdownBody: `### Static Equilibrium\n\nFor a rigid body to be in static equilibrium, two conditions must be met:\n\n1. **Translational Equilibrium:** The vector sum of all external forces must be zero. $$\\Sigma F = 0$$\n2. **Rotational Equilibrium:** The sum of the moments (torques) about *any* point must be zero. $$\\Sigma M = 0$$\n\n**Centre of Gravity:** The point where the entire weight of the body acts. For a uniform rod or beam, it is exactly at the midpoint.`,
      keyTerms: ["Equilibrium", "Translational", "Rotational", "Centre of Gravity", "Moment"]
    },
    {
      id: "slide-2-predict",
      processStepId: "predict",
      type: "question_mcq",
      title: "Beam on Supports",
      question: "A uniform beam (weight 200N, length 4m) rests on two supports at its ends. A 500N load hangs 1m from the left end. What are the two support reaction forces $R_1$ (left) and $R_2$ (right)?",
      imageLayout: "left",
      imageCaption: "Forces on a simply supported beam",
      diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240"><rect width="400" height="240" fill="#0f172a"/><rect x="40" y="110" width="320" height="20" fill="#94a3b8"/><path d="M40 140 L50 110 L60 140 Z" fill="#cbd5e1"/><path d="M340 140 L350 110 L360 140 Z" fill="#cbd5e1"/><line x1="50" y1="180" x2="50" y2="150" stroke="#f87171" stroke-width="3" marker-end="url(#arrow)"/><line x1="350" y1="180" x2="350" y2="150" stroke="#f87171" stroke-width="3" marker-end="url(#arrow)"/><text x="35" y="195" fill="#f87171" font-size="14">R₁</text><text x="340" y="195" fill="#f87171" font-size="14">R₂</text><line x1="125" y1="110" x2="125" y2="50" stroke="#60a5fa" stroke-width="3" marker-start="url(#arrow-rev)"/><text x="135" y="70" fill="#60a5fa" font-size="14">500N (1m)</text><line x1="200" y1="110" x2="200" y2="50" stroke="#60a5fa" stroke-width="3" marker-start="url(#arrow-rev)"/><text x="210" y="70" fill="#60a5fa" font-size="14">200N (2m)</text><defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f87171"/></marker><marker id="arrow-rev" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa"/></marker></defs></svg>`,
      choices: [
        {
          id: "c1",
          text: "R₁ = 350N, R₂ = 350N",
          isCorrect: false,
          explanation: "This assumes the total weight (700N) is shared equally, which would only happen if the load was exactly in the middle.",
          misconceptionId: "MECH-EQUIL-MOMENT-WRONG-PIVOT"
        },
        {
          id: "c2",
          text: "R₁ = 575N, R₂ = 125N",
          isCorrect: true,
          explanation: "Correct! The load is closer to R₁, so R₁ supports more of the weight."
        },
        {
          id: "c3",
          text: "R₁ = 600N, R₂ = 100N",
          isCorrect: false,
          explanation: "You may have miscalculated the moment arm for the center of gravity.",
          misconceptionId: "MECH-EQUIL-IGNORE-WEIGHT"
        },
        {
          id: "c4",
          text: "R₁ = 500N, R₂ = 200N",
          isCorrect: false,
          explanation: "The reaction forces do not simply equal the individual loads. They are determined by the moments.",
          misconceptionId: "MECH-EQUIL-ONE-CONDITION-ONLY"
        }
      ],
      points: 2
    },
    {
      id: "slide-3-explain",
      processStepId: "explain",
      type: "lesson_text",
      title: "Taking Moments to Find Forces",
      markdownBody: `### Calculating Reaction Forces\n\nLet's verify the beam problem. We use the two conditions of equilibrium:\n\n1. **Take moments about the left support ($R_1$):**\n   This eliminates $R_1$ from the equation because its distance is 0.\n   Clockwise moments = Anticlockwise moments\n   $$ (200 \\text{ N} \\times 2 \\text{ m}) + (500 \\text{ N} \\times 1 \\text{ m}) = R_2 \\times 4 \\text{ m} $$\n   $$ 400 + 500 = 4 R_2 $$\n   $$ R_2 = \\frac{900}{4} = 125 \\text{ N} $$\n\n2. **Apply translational equilibrium:**\n   Total upward force = Total downward force\n   $$ R_1 + R_2 = 200 + 500 $$\n   $$ R_1 + 125 = 700 $$\n   $$ R_1 = 575 \\text{ N} $$\n\n*Check:* Does the sum of moments about $R_2$ give the correct $R_1$?`,
      keyTerms: ["Clockwise moment", "Anticlockwise moment"]
    },
    {
      id: "slide-4-practice",
      processStepId: "practice",
      type: "question_mcq",
      title: "Ladder on a Wall",
      question: "A ladder (weight 150N, length 5m) leans against a smooth wall at 60° to horizontal. Bottom of ladder on rough floor. A man (weight 600N) stands 2m up the ladder. Find the wall reaction force (normal, horizontal).",
      imageLayout: "left",
      imageCaption: "Ladder leaning against a smooth wall",
      diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240"><rect width="400" height="240" fill="#0f172a"/><line x1="100" y1="200" x2="350" y2="200" stroke="#cbd5e1" stroke-width="4"/><line x1="300" y1="200" x2="300" y2="40" stroke="#cbd5e1" stroke-width="4"/><line x1="150" y1="200" x2="300" y2="80" stroke="#f59e0b" stroke-width="6"/><text x="170" y="190" fill="#cbd5e1" font-size="12">60°</text><line x1="300" y1="80" x2="260" y2="80" stroke="#f87171" stroke-width="3" marker-start="url(#arrow-rev)"/><text x="210" y="75" fill="#f87171" font-size="12">W_wall</text><circle cx="210" cy="152" r="5" fill="#38bdf8"/><line x1="210" y1="152" x2="210" y2="182" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow-blue)"/><text x="215" y="172" fill="#38bdf8" font-size="12">600N</text><circle cx="225" cy="140" r="4" fill="#a78bfa"/><line x1="225" y1="140" x2="225" y2="170" stroke="#a78bfa" stroke-width="2" marker-end="url(#arrow-purp)"/><text x="230" y="160" fill="#a78bfa" font-size="12">150N</text><defs><marker id="arrow-rev" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f87171"/></marker><marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8"/></marker><marker id="arrow-purp" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#a78bfa"/></marker></defs></svg>`,
      choices: [
        {
          id: "c1",
          text: "182 N",
          isCorrect: true,
          explanation: "Take moments about the base: W_wall × 5sin60° = 150 × 2.5cos60° + 600 × 2cos60°. W_wall = (187.5 + 600) / (5 × 0.866) = 787.5 / 4.33 ≈ 182 N."
        },
        {
          id: "c2",
          text: "318 N",
          isCorrect: false,
          explanation: "Did you use sin instead of cos for the moment arms of the weights?",
          misconceptionId: "MECH-EQUIL-MOMENT-WRONG-PIVOT"
        },
        {
          id: "c3",
          text: "750 N",
          isCorrect: false,
          explanation: "This is the total downward force, not the horizontal wall reaction.",
          misconceptionId: "MECH-EQUIL-ONE-CONDITION-ONLY"
        },
        {
          id: "c4",
          text: "150 N",
          isCorrect: false,
          explanation: "You must include the moment of both the ladder's weight and the man's weight.",
          misconceptionId: "MECH-EQUIL-IGNORE-WEIGHT"
        }
      ],
      points: 2
    },
    {
      id: "slide-5-evaluate",
      processStepId: "evaluate",
      type: "lesson_text",
      title: "Mastery Checklist",
      markdownBody: `### Lesson Summary\n\n- You can define the two conditions for static equilibrium: $\\Sigma F = 0$ and $\\Sigma M = 0$.\n- You can apply moments about a chosen pivot to eliminate unknown forces.\n- You can resolve forces into components (like in the ladder problem) to find perpendicular distances.\n\n**Next Lesson:** 1-6 Power and Efficiency. You will learn about the rate of doing work and how efficient machines are.`,
      keyTerms: []
    }
  ]
};
