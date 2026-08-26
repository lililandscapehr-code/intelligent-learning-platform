import type { EduCarouselConfig } from "../../components/carousel/CarouselTypes";

export const boyleCharlesCarousel: EduCarouselConfig = {
  id: "CAROUSEL-PHYS-EB-BOYLE-CHARLES",
  title: "1-1 Boyle-Charles's Law: Pressure, Volume & Temperature",
  skillId: "SK-EGYPT-PHY-GAS-BOYLE-CHARLES",
  showProgressBar: true,
  showScoreTally: true,
  allowSkipQuestions: false,
  sequenceMode: "SEQUENTIAL",
  plan: {
    scenario: "On an airplane at cruising altitude, cabin pressure is lower than ground level. A sealed bag of chips swells as trapped gas expands until a new equilibrium is reached.",
    mission: "Relate pressure, volume, and absolute temperature for a fixed mass of gas, and calculate cylinder piston balance.",
    planningPoints: [
      "Commit a written prediction before formal explanation",
      "Collect syringe load data and observe the p × V product",
      "Build the combined law pV/T = constant from observation",
      "Account for atmospheric pressure (p0) in piston balance",
      "Apply the model to high-altitude and engine compression"
    ],
    studentPromise: "You will discover why pV/T is invariant and master piston force balance.",
    evaluationSummary: "Evaluation across 6 parameters: Prerequisite readiness, conceptual depth, mathematical execution, inquiry intuition, transfer capability, and cognitive fluency.",
    nextStepRule: "Advance to 1-2 Equation of State for an Ideal Gas upon achieving >= 70% mastery."
  },
  processSteps: [
    {
      id: "process-observe-predict",
      title: "1. Observe & Predict",
      subtitle: "The Phenomenon — Cruising Altitude Bag",
      mission: "Commit a written prediction based on the real scene before reading the explanation.",
      brief: "Observe the swelling bag of chips and commit your prediction.",
      studentOutcome: "State intuition and recognize pressure-volume-temperature dependencies.",
      parentHint: "The student is exercising scientific curiosity and committing hypotheses.",
      preparationStages: ["Observe the sealed bag", "Record initial prediction"],
      evaluationStages: ["Prediction is committed", "Initial scientific reasoning noted"],
      successSignal: "Student commits prediction without fear of error.",
      supportDecision: "Use visual analogies if student is hesitant."
    },
    {
      id: "process-explore-measure",
      title: "2. Explore & Measure",
      subtitle: "Hands-on Sealed-Air Squeeze",
      mission: "Collect data from a loaded syringe apparatus and notice the p × V pattern.",
      brief: "Measure pressure changes as slotted masses are added to the plunger.",
      studentOutcome: "Recognize that p × V remains nearly constant during isothermal compression.",
      parentHint: "The student is gathering experimental evidence with apparatus.",
      preparationStages: ["Read plunger diameter and area", "Record load vs volume"],
      evaluationStages: ["Data entered accurately", "Recognizes inverse proportionality"],
      successSignal: "Student spots that p × V stays constant.",
      supportDecision: "Highlight the product column to visualize the constant."
    },
    {
      id: "process-model-equation",
      title: "3. Observation to Model",
      subtitle: "Deriving Boyle-Charles's Law",
      mission: "Synthesize the two proportionalities into one combined invariant equation.",
      brief: "Combine isothermal compression and isobaric heating into pV/T = constant.",
      studentOutcome: "Explain why pV/T survives as a single governing law.",
      parentHint: "The student turns experimental data into physical law.",
      preparationStages: ["Combine loading and warming steps", "Establish Equation Box"],
      evaluationStages: ["Understands Kelvin absolute temperature requirement", "Identifies model boundaries"],
      successSignal: "Student remembers T must be in Kelvin.",
      supportDecision: "Emphasize absolute zero and T [K] = θ [°C] + 273."
    },
    {
      id: "process-practice-transfer",
      title: "4. Practice & Real-World Transfer",
      subtitle: "Cylinder Piston Balance & Cruising Cabin Application",
      mission: "Solve piston equilibrium and calculate new state variables in real contexts.",
      brief: "Apply p = p0 + mg/A and p1V1/T1 = p2V2/T2 to authentic Egyptian contexts.",
      studentOutcome: "Accurately balance piston forces and compute final volume.",
      parentHint: "The student demonstrates mastery and transfer.",
      preparationStages: ["Draw free-body diagram", "Substitute with Kelvin units"],
      evaluationStages: ["Correct calculation", "Checks reasonableness of magnitude"],
      successSignal: "Student calculates state variables independently.",
      supportDecision: "Provide guided step-by-step hint if unit error occurs."
    }
  ],
  slides: [
    {
      id: "eb-phy-1-1-goal",
      type: "lesson_text",
      title: "Lesson 1-1: Boyle-Charles's Law",
      subtitle: "Egyptian Baccalaureate Physics · 2nd Secondary",
      body: `### ❓ Lesson Question
**How are the pressure, volume, and absolute temperature of a fixed mass of gas related?**

### You will learn to:
1. **Calculate** the pressure of a gas from force per unit area, $p = \\frac{F}{A}$, in pascals ($\\text{Pa} = \\text{N/m}^2$).
2. **Find** the pressure of gas enclosed by a piston by applying the balance of forces on the piston:
   $$p = p_0 + \\frac{mg}{A}$$
3. **Apply** Boyle-Charles's law, $\\frac{pV}{T} = \\text{constant}$, to relate states before and after a change.

> **★ Key Idea**: Pressure measures how concentrated a push is. Standard atmospheric pressure is $p_0 \\approx 1.0 \\times 10^5\\text{ Pa}$.`,
      keyTerms: ["Pressure", "Pascal", "Boyle-Charles Law", "Absolute Temperature", "Ideal Gas"],
      processStepId: "process-observe-predict",
      step: {
        purpose: "CONNECT",
        targetPoints: ["Understand lesson goals", "Review pressure definition"],
        completionEvidence: ["Ready to predict"],
        advanceRule: "OPEN_NEXT"
      }
    },
    {
      id: "eb-phy-1-1-predict",
      type: "question_mcq",
      title: "The Phenomenon — Predict First",
      subtitle: "A sealed bag of chips swells at cruising altitude",
      imageCaption: "Figure 1.1: Gas particles expanding as external cabin pressure drops at cruising altitude",
      diagramSvg: `<svg viewBox="0 0 400 240" class="w-full h-auto max-h-56" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0284c7" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.8"/>
    </linearGradient>
    <radialGradient id="bagGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#d97706" stop-opacity="0.7"/>
    </radialGradient>
  </defs>
  <!-- Background Arena -->
  <rect width="400" height="240" rx="16" fill="url(#skyGrad)" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 4" stroke-opacity="0.4"/>
  
  <!-- Altitude Badge -->
  <rect x="20" y="20" width="160" height="28" rx="6" fill="#0f172a" stroke="#0ea5e9" stroke-width="1"/>
  <text x="30" y="38" fill="#38bdf8" font-size="11" font-weight="bold" font-family="sans-serif">✈ Cruising Altitude: 10 km</text>

  <!-- External Pressure Arrows -->
  <g stroke="#94a3b8" stroke-width="2" stroke-linecap="round">
    <line x1="200" y1="50" x2="200" y2="75"/>
    <polygon points="200,78 196,70 204,70" fill="#94a3b8"/>
    <text x="210" y="65" fill="#cbd5e1" font-size="10" font-family="sans-serif">Lower p_ext</text>

    <line x1="100" y1="130" x2="125" y2="130"/>
    <polygon points="128,130 120,126 120,134" fill="#94a3b8"/>

    <line x1="300" y1="130" x2="275" y2="130"/>
    <polygon points="272,130 280,126 280,134" fill="#94a3b8"/>
  </g>

  <!-- Swollen Bag of Chips -->
  <rect x="135" y="85" width="130" height="100" rx="24" fill="url(#bagGrad)" stroke="#fbbf24" stroke-width="2.5"/>
  <text x="200" y="132" fill="#451a03" font-size="13" font-weight="900" font-family="sans-serif" text-anchor="middle">SEALED BAG</text>
  <text x="200" y="148" fill="#78350f" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">Swelling: V_2 &gt; V_1</text>

  <!-- Internal Pressure Outward Arrows -->
  <g stroke="#fef08a" stroke-width="2">
    <line x1="160" y1="100" x2="148" y2="92"/>
    <line x1="240" y1="100" x2="252" y2="92"/>
    <line x1="160" y1="170" x2="148" y2="178"/>
    <line x1="240" y1="170" x2="252" y2="178"/>
  </g>

  <!-- Baseline Ground Label -->
  <text x="200" y="215" fill="#94a3b8" font-size="11" font-family="sans-serif" text-anchor="middle">Ground: p_0 = 100 kPa (Flat) → Altitude: p_ext = 75 kPa (Puffed)</text>
</svg>`,
      questionText: "On an airplane at cruising altitude, the cabin pressure is lower than ground atmospheric pressure. (a) When a fixed mass of gas expands at constant temperature, what happens to its internal pressure? (b) When you warm a sealed gas at constant pressure, what does its volume do?",
      points: 1,
      choices: [
        {
          id: "A",
          text: "When volume increases, pressure falls; when warmed at fixed pressure, volume rises.",
          isCorrect: true,
          explanation: "Correct! Gas volume is inversely proportional to pressure (Boyle's law) and directly proportional to absolute temperature (Charles's law)."
        },
        {
          id: "B",
          text: "When volume increases, pressure rises; when warmed, volume falls.",
          isCorrect: false,
          misconceptionId: "PHYS-PRESSURE-VOLUME-DIRECT",
          explanation: "In a gas, expanding into a larger volume reduces molecular collision frequency per unit area, lowering pressure."
        },
        {
          id: "C",
          text: "Pressure and volume both stay unchanged because the mass is sealed.",
          isCorrect: false,
          explanation: "While mass is constant, mechanical equilibrium requires internal and external forces to balance by changing volume."
        }
      ],
      processStepId: "process-observe-predict",
      step: {
        purpose: "CONNECT",
        targetPoints: ["Commit prediction before reading", "Explore pressure-volume relationship"],
        completionEvidence: ["Committed prediction choice"],
        advanceRule: "SUPPORT_AND_RETRY",
        supportAction: "Remember: more space for molecules = fewer collisions per cm² = lower pressure.",
        timing: { expectedMs: 45000, fastThresholdMs: 10000, slowThresholdMs: 90000 }
      }
    },
    {
      id: "eb-phy-1-1-explore",
      type: "lesson_text",
      title: "Explore — Sealed-Air Squeeze (Syringe Experiment)",
      subtitle: "Apparatus: Capped syringe, slotted masses, water bath",
      body: `### Apparatus & Procedure
A fixed mass of air is trapped in a vertical syringe of cross-sectional area $A = \\frac{\\pi d^2}{4}$. Slotted masses $m$ are added to the plunger to increase pressure.

| Run | Plunger Load | Pressure $p$ (kPa) | Volume $V$ (mL) | $p \\times V$ ($\\text{kPa}\\cdot\\text{mL}$) |
| :--- | :--- | :--- | :--- | :--- |
| 1 | No load ($p_0$) | $100$ | $60.0$ | **$6000$** |
| 2 | One mass ($+50\\text{ kPa}$) | $150$ | $40.0$ | **$6000$** |
| 3 | Two masses ($+100\\text{ kPa}$) | $200$ | $30.0$ | **$6000$** |

### Notice the Pattern:
Look down the last column: while pressure doubles from $100$ to $200\\text{ kPa}$, volume halves from $60$ to $30\\text{ mL}$. **The product $p \\times V$ barely changes.**`,
      keyTerms: ["Isothermal", "Inverse proportionality", "Piston balance"],
      processStepId: "process-explore-measure",
      step: {
        purpose: "DEMONSTRATE",
        targetPoints: ["Verify p × V is constant", "Understand syringe data"],
        completionEvidence: ["Observed data table"],
        advanceRule: "OPEN_NEXT"
      }
    },
    {
      id: "eb-phy-1-1-model",
      type: "lesson_text",
      title: "From Observation to Model — Equation Box",
      subtitle: "Synthesizing Boyle-Charles's Law",
      body: `### 1. Piston Balance of Forces
A vertical floating piston of mass $m$ and area $A$ is in mechanical equilibrium under:
1. Downward atmospheric force: $p_0 A$
2. Downward weight: $mg$
3. Upward gas pressure force: $p A$

$$p A - p_0 A - mg = 0 \\implies p = p_0 + \\frac{mg}{A}$$

### 2. Boyle-Charles's Combined Law
$$\\frac{p_1 V_1}{T_1} = \\frac{p_2 V_2}{T_2} = \\text{constant}$$

> **★ Critical Unit Rule**: The temperature $T$ must always be in **kelvin**:
> $$T\\text{ [K]} = \\theta\\text{ [°C]} + 273$$
>
> **★ Where the Model Stops**: Real gases deviate from ideal behavior when very cold or strongly compressed, because molecular volume and intermolecular forces become significant.`,
      keyTerms: ["Equation Box", "Kelvin conversion", "Model limitations"],
      processStepId: "process-model-equation",
      step: {
        purpose: "EXPLAIN",
        targetPoints: ["Master piston force balance", "Apply Kelvin conversion"],
        completionEvidence: ["Model understood"],
        advanceRule: "OPEN_NEXT"
      }
    },
    {
      id: "eb-phy-1-1-practice-piston",
      type: "question_mcq",
      title: "Worked Practice: Piston Pressure & Temperature Conversion",
      subtitle: "Apply the force balance and unit rules",
      imageCaption: "Figure 1.2: Free-body force balance on floating piston (p·A = p0·A + mg)",
      diagramSvg: `<svg viewBox="0 0 380 250" class="w-full h-auto max-h-56" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gasGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0.5"/>
    </linearGradient>
  </defs>
  <!-- Cylinder Walls -->
  <rect x="80" y="30" width="160" height="190" rx="4" fill="none" stroke="#64748b" stroke-width="4"/>
  
  <!-- Enclosed Gas -->
  <rect x="82" y="110" width="156" height="108" fill="url(#gasGrad)"/>
  <text x="160" y="170" fill="#38bdf8" font-size="12" font-weight="bold" font-family="sans-serif" text-anchor="middle">Enclosed Gas</text>
  <text x="160" y="186" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle">θ = 27 °C</text>

  <!-- Piston -->
  <rect x="76" y="90" width="168" height="20" rx="3" fill="#475569" stroke="#cbd5e1" stroke-width="2"/>
  <text x="160" y="104" fill="#f8fafc" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">Piston (m = 20 kg)</text>

  <!-- Atmospheric Pressure Force (p0 * A) Downward -->
  <g stroke="#f87171" stroke-width="2.5" stroke-linecap="round">
    <line x1="120" y1="40" x2="120" y2="82"/>
    <polygon points="120,86 116,78 124,78" fill="#f87171"/>
    
    <line x1="200" y1="40" x2="200" y2="82"/>
    <polygon points="200,86 196,78 204,78" fill="#f87171"/>
    <text x="160" y="55" fill="#fca5a5" font-size="11" font-weight="bold" font-family="sans-serif" text-anchor="middle">p_0 · A (Atmosphere)</text>
  </g>

  <!-- Gravity Force (mg) Downward -->
  <line x1="160" y1="90" x2="160" y2="135" stroke="#fbbf24" stroke-width="2.5"/>
  <polygon points="160,139 156,131 164,131" fill="#fbbf24"/>
  <text x="180" y="130" fill="#fef08a" font-size="10" font-weight="bold" font-family="sans-serif">mg (Weight)</text>

  <!-- Gas Pressure Force (p * A) Upward -->
  <line x1="160" y1="210" x2="160" y2="125" stroke="#34d399" stroke-width="3"/>
  <polygon points="160,120 156,128 164,128" fill="#34d399"/>
  <text x="250" y="125" fill="#6ee7b7" font-size="11" font-weight="bold" font-family="sans-serif">↑ p · A (Gas Force)</text>

  <!-- Formula Callout -->
  <rect x="250" y="45" width="120" height="42" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1"/>
  <text x="258" y="62" fill="#38bdf8" font-size="10" font-weight="bold" font-family="sans-serif">Area A = 0.01 m²</text>
  <text x="258" y="78" fill="#94a3b8" font-size="9" font-family="sans-serif">p_0 = 1.0 × 10⁵ Pa</text>
</svg>`,
      questionText: "A vertical cylinder with piston area A = 0.01 m² and piston mass m = 20 kg encloses gas at 27 °C under atmospheric pressure p0 = 1.0 × 10⁵ Pa (use g = 10 m/s²). (1) What is the total gas pressure p? (2) What is the absolute temperature T?",
      points: 2,
      choices: [
        {
          id: "A",
          text: "Pressure p = 1.2 × 10⁵ Pa; Temperature T = 300 K",
          isCorrect: true,
          explanation: "Correct! p = p0 + mg/A = 100,000 + (20 × 10)/0.01 = 100,000 + 20,000 = 1.2 × 10⁵ Pa. T = 27 + 273 = 300 K."
        },
        {
          id: "B",
          text: "Pressure p = 20,000 Pa; Temperature T = 27 K",
          isCorrect: false,
          misconceptionId: "PHYS-GAUGE-VS-ABSOLUTE",
          explanation: "You computed only the load pressure mg/A and forgot to add atmospheric pressure p0! Also forgot to convert Celsius to Kelvin."
        },
        {
          id: "C",
          text: "Pressure p = 1.2 × 10⁵ Pa; Temperature T = 27 K",
          isCorrect: false,
          misconceptionId: "PHYS-TEMP-CELSIUS-KELVIN",
          explanation: "Pressure is correct, but you must convert 27 °C to Kelvin by adding 273 (T = 300 K)."
        }
      ],
      processStepId: "process-practice-transfer",
      step: {
        purpose: "PRACTICE",
        targetPoints: ["Calculate p0 + mg/A", "Convert 27 °C to 300 K"],
        completionEvidence: ["Correct calculation and unit conversion"],
        advanceRule: "SUPPORT_AND_RETRY",
        supportAction: "Check: Total pressure = Atmospheric (100,000) + Load (20,000). Temperature = 27 + 273 = 300 K.",
        timing: { expectedMs: 60000, fastThresholdMs: 15000, slowThresholdMs: 150000 }
      }
    },
    {
      id: "eb-phy-1-1-transfer",
      type: "question_mcq",
      title: "In a New Context — High-Altitude Weather Balloon",
      subtitle: "Real-world atmospheric transfer",
      imageCaption: "Figure 1.3: State 1 (Ground level) to State 2 (Stratosphere: lower pressure & temperature)",
      diagramSvg: `<svg viewBox="0 0 400 240" class="w-full h-auto max-h-56" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="balloon1" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#fb7185"/>
      <stop offset="100%" stop-color="#be123c"/>
    </radialGradient>
    <radialGradient id="balloon2" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#fda4af"/>
      <stop offset="100%" stop-color="#e11d48"/>
    </radialGradient>
  </defs>

  <!-- Left: State 1 (Ground) -->
  <rect x="20" y="20" width="160" height="200" rx="12" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
  <text x="100" y="42" fill="#f43f5e" font-size="11" font-weight="900" font-family="sans-serif" text-anchor="middle">STATE 1: GROUND</text>
  <circle cx="100" cy="105" r="32" fill="url(#balloon1)" stroke="#fda4af" stroke-width="1.5"/>
  <text x="100" y="110" fill="#fff" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">V_1 = 10 m³</text>
  <text x="100" y="160" fill="#cbd5e1" font-size="10" font-family="sans-serif" text-anchor="middle">p_1 = 1.0 × 10⁵ Pa</text>
  <text x="100" y="178" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle">T_1 = 300 K (27 °C)</text>

  <!-- Transition Arrow -->
  <path d="M 190 120 L 210 120" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
  <polygon points="214,120 206,115 206,125" fill="#f59e0b"/>
  <text x="202" y="105" fill="#fbbf24" font-size="9" font-weight="bold" font-family="sans-serif" text-anchor="middle">Rises ↑</text>

  <!-- Right: State 2 (Stratosphere) -->
  <rect x="220" y="20" width="160" height="200" rx="12" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.5"/>
  <text x="300" y="42" fill="#38bdf8" font-size="11" font-weight="900" font-family="sans-serif" text-anchor="middle">STATE 2: STRATOSPHERE</text>
  <circle cx="300" cy="105" r="48" fill="url(#balloon2)" stroke="#fecdd3" stroke-width="2"/>
  <text x="300" y="110" fill="#fff" font-size="12" font-weight="bold" font-family="sans-serif" text-anchor="middle">V_2 = ?</text>
  <text x="300" y="175" fill="#38bdf8" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">p_2 = 0.2 × 10⁵ Pa</text>
  <text x="300" y="193" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle">T_2 = 240 K (-33 °C)</text>
</svg>`,
      questionText: "A weather balloon is filled with 10 m³ of helium at ground level (p1 = 1.0 × 10⁵ Pa, T1 = 300 K). It rises to the stratosphere where p2 = 0.2 × 10⁵ Pa and T2 = 240 K. What is the new volume V2 of the balloon?",
      points: 2,
      choices: [
        {
          id: "A",
          text: "V2 = 40 m³",
          isCorrect: true,
          explanation: "Correct! Using (p1·V1)/T1 = (p2·V2)/T2: V2 = V1 · (p1/p2) · (T2/T1) = 10 · (1.0/0.2) · (240/300) = 10 · 5 · 0.8 = 40 m³."
        },
        {
          id: "B",
          text: "V2 = 50 m³",
          isCorrect: false,
          misconceptionId: "PHYS-NEGLECT-TEMPERATURE-EFFECT",
          explanation: "You accounted for pressure drop (10 × 5 = 50) but forgot the cooling factor (240/300 = 0.8)!"
        },
        {
          id: "C",
          text: "V2 = 8 m³",
          isCorrect: false,
          explanation: "Pressure dropped by a factor of 5, so volume must expand, not shrink."
        }
      ],
      processStepId: "process-practice-transfer",
      step: {
        purpose: "EVALUATE",
        targetPoints: ["Apply combined p1V1/T1 = p2V2/T2 in real context", "Check reasonableness of answer"],
        completionEvidence: ["Transfer calculation verified"],
        advanceRule: "OPEN_NEXT",
        timing: { expectedMs: 75000, fastThresholdMs: 20000, slowThresholdMs: 180000 }
      }
    }
  ]
};

export default boyleCharlesCarousel;
