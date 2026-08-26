import type { EduCarouselConfig } from "../../../components/carousel/CarouselTypes";

export const lesson16PowerCarousel: EduCarouselConfig = {
  id: "CAROUSEL-PHYS-EB-MECH-1-6",
  title: "Part 1 · 1-6 Power and Efficiency",
  skillId: "SK-EGYPT-PHY-MECH-POWER",
  showProgressBar: true,
  showScoreTally: true,
  allowSkipQuestions: false,
  sequenceMode: "SEQUENTIAL",
  plan: {
    scenario: "Comparing different methods of doing work",
    mission: "Calculate power and efficiency of mechanical systems",
    planningPoints: ["Define work, power, efficiency", "Apply formulas", "Solve practical problems"],
    studentPromise: "I will correctly identify the difference between work and power.",
    evaluationSummary: "Mastered power and efficiency concepts.",
    nextStepRule: "Proceed to lesson 1-7."
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
      title: "Power and Efficiency",
      markdownBody: `### Work, Power, and Efficiency\n\n- **Work ($W$):** Done when a force moves an object. $W = Fd \\cos\\theta$ (measured in Joules, J).\n- **Power ($P$):** The *rate* at which work is done. $P = \\frac{W}{t} = Fv$ (measured in Watts, W).\n- **Efficiency ($\\eta$):** The ratio of useful power output to total power input. $$\\eta = \\frac{P_{\\text{useful}}}{P_{\\text{input}}} \\times 100\\%$$\n\nPower tells us how *fast* work is being done. The same amount of work done faster requires more power.`,
      keyTerms: ["Work", "Power", "Efficiency", "Watts", "Joules"]
    },
    {
      id: "slide-2-predict",
      processStepId: "predict",
      type: "question_mcq",
      title: "Running Up Stairs",
      question: "Two students run up the same staircase (h=4m). Student A takes 4s, Student B takes 8s. Both have mass 60kg. Who did more WORK? Who used more POWER?",
      imageLayout: "left",
      imageCaption: "Students running up stairs",
      diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240"><rect width="400" height="240" fill="#0f172a"/><path d="M50 200 L100 200 L100 160 L150 160 L150 120 L200 120 L200 80 L250 80 L250 40 L300 40 L300 240 L50 240 Z" fill="#475569"/><circle cx="125" cy="140" r="10" fill="#60a5fa"/><text x="110" y="125" fill="#60a5fa" font-size="12">A: 4s</text><circle cx="225" cy="60" r="10" fill="#f43f5e"/><text x="210" y="45" fill="#f43f5e" font-size="12">B: 8s</text><line x1="320" y1="200" x2="320" y2="40" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4,4"/><text x="330" y="120" fill="#cbd5e1" font-size="12">h = 4m</text></svg>`,
      choices: [
        {
          id: "c1",
          text: "Student A did more work and used more power.",
          isCorrect: false,
          explanation: "Work depends on force and distance, not time.",
          misconceptionId: "MECH-POWER-CONFUSE-WORK"
        },
        {
          id: "c2",
          text: "Student B did more work but Student A used more power.",
          isCorrect: false,
          explanation: "Since their masses and height are the same, the work done is the same.",
          misconceptionId: "MECH-POWER-FASTER-MORE-WORK"
        },
        {
          id: "c3",
          text: "They did the same work, but Student A used more power.",
          isCorrect: true,
          explanation: "Correct! Work is mgh for both. Student A did it in less time, meaning a higher rate of work (power)."
        },
        {
          id: "c4",
          text: "They did the same work and used the same power.",
          isCorrect: false,
          explanation: "Power depends on the time taken.",
          misconceptionId: "MECH-POWER-CONFUSE-WORK"
        }
      ],
      points: 2
    },
    {
      id: "slide-3-explain",
      processStepId: "explain",
      type: "lesson_text",
      title: "Analyzing Power",
      markdownBody: `### Calculating the Stair Problem\n\nLet's prove the answer:\n\n1. **Work Done:**\n   Both students lift their 60 kg mass by 4 meters.\n   $$ W = mgh = 60 \\times 10 \\times 4 = 2400 \\text{ J} $$\n   The work is exactly the same.\n\n2. **Power Output:**\n   - Student A ($t=4s$): $P_A = \\frac{2400}{4} = 600 \\text{ W}$\n   - Student B ($t=8s$): $P_B = \\frac{2400}{8} = 300 \\text{ W}$\n\nStudent A generated twice as much power!\n\n**Another Formula:** If an object is moving at constant velocity, $P = Fv$. E.g., a car engine overcoming air resistance at a steady speed.`,
      keyTerms: ["Constant velocity"]
    },
    {
      id: "slide-4-practice",
      processStepId: "practice",
      type: "question_mcq",
      title: "Motor Efficiency",
      question: "An electric motor lifts a 200kg crate 8m in 10s. The motor draws 2000W from the power supply. Find its efficiency. (g=10m/s²)",
      imageLayout: "left",
      imageCaption: "Electric motor lifting a crate",
      diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240"><rect width="400" height="240" fill="#0f172a"/><rect x="100" y="50" width="80" height="60" fill="#64748b" rx="5"/><text x="110" y="85" fill="#f8fafc" font-size="14">Motor</text><line x1="20" y1="80" x2="100" y2="80" stroke="#fcd34d" stroke-width="4" marker-start="url(#arrow-yellow)"/><text x="25" y="70" fill="#fcd34d" font-size="12">2000W In</text><circle cx="180" cy="80" r="15" fill="#94a3b8"/><line x1="195" y1="80" x2="195" y2="180" stroke="#cbd5e1" stroke-width="2"/><rect x="175" y="180" width="40" height="40" fill="#8b5cf6"/><text x="185" y="205" fill="#f8fafc" font-size="12">200kg</text><path d="M 140 110 Q 140 140 100 150" fill="none" stroke="#f87171" stroke-width="3" marker-end="url(#arrow-red)"/><text x="90" y="170" fill="#f87171" font-size="12">Heat Loss</text><defs><marker id="arrow-yellow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#fcd34d"/></marker><marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f87171"/></marker></defs></svg>`,
      choices: [
        {
          id: "c1",
          text: "125%",
          isCorrect: false,
          explanation: "Efficiency cannot exceed 100%. You divided input by useful output.",
          misconceptionId: "MECH-EFFICIENCY-OVER-100"
        },
        {
          id: "c2",
          text: "80%",
          isCorrect: true,
          explanation: "Useful work = 200 × 10 × 8 = 16000 J. Useful power = 16000 / 10 = 1600 W. Efficiency = (1600 / 2000) × 100% = 80%."
        },
        {
          id: "c3",
          text: "40%",
          isCorrect: false,
          explanation: "Check your calculation for useful power.",
          misconceptionId: "MECH-POWER-CONFUSE-WORK"
        },
        {
          id: "c4",
          text: "16%",
          isCorrect: false,
          explanation: "Check the useful work calculation (mgh).",
          misconceptionId: "MECH-POWER-CONFUSE-WORK"
        }
      ],
      points: 2
    },
    {
      id: "slide-5-evaluate",
      processStepId: "evaluate",
      type: "lesson_text",
      title: "Mastery Checklist",
      markdownBody: `### Lesson Summary\n\n- You can calculate work done by a force ($W = Fd$).\n- You can distinguish between work and power, and calculate power using $P = W/t$ or $P = Fv$.\n- You can determine the efficiency of a system by comparing useful output power to total input power.\n\n**Next Lesson:** 1-7 Momentum and Impulse. You will study how forces acting over time change an object's motion.`,
      keyTerms: []
    }
  ]
};
