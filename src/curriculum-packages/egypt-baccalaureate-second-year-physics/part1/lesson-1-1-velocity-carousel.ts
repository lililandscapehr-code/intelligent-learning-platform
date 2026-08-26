import type { EduCarouselConfig } from "../../../components/carousel/CarouselTypes";

// =============================================================
// Part 1 · Lesson 1-1 · Velocity Vectors & Relative Velocity
// Egyptian Baccalaureate Second Year Physics (English)
// Inquiry loop: OBSERVE → PREDICT → MEASURE → NAME
// =============================================================

export const lesson11VelocityCarousel: EduCarouselConfig = {
  id: "CAROUSEL-PHYS-EB-MECH-1-1",
  title: "Part 1 · 1-1  Velocity Vectors & Relative Velocity",
  skillId: "SK-EGYPT-PHY-MECH-VELOCITY",
  showProgressBar: true,
  showScoreTally: true,
  allowSkipQuestions: false,
  sequenceMode: "SEQUENTIAL",
  accessPolicy: {
    scope: "ALL_ENROLLED",
    showCorrectAnswers: true,
    showMarks: true,
    trackTiming: true,
    minimumScorePercentage: 70
  },
  plan: {
    scenario:
      "A felucca boat needs to cross the Nile from one bank to the directly opposite bank. The river current pushes the boat sideways. The captain must aim at an angle upstream — but what angle? And what is the boat's actual speed as seen from the shore?",
    mission:
      "Distinguish displacement from distance and velocity from speed; add velocity vectors using components; calculate the velocity of one object relative to another moving observer.",
    planningPoints: [
      "Observe a boat crossing a river while current acts sideways",
      "Predict the resultant direction and speed before calculating",
      "Decompose 2-D velocity into perpendicular components",
      "Apply vector addition graphically and algebraically",
      "Calculate relative velocity between two moving reference frames"
    ],
    studentPromise:
      "You will be able to answer: 'What direction does the captain aim, and how fast does the boat move relative to the shore?' — and apply the same reasoning to aircraft in crosswinds and trains.",
    evaluationSummary:
      "Assessed across: prediction quality, vector decomposition accuracy, relative velocity calculation, and reasonableness of answers.",
    nextStepRule:
      "Advance to Lesson 1-2 (Horizontal Projectile Motion) after achieving ≥ 70% on the practice questions."
  },

  processSteps: [
    {
      id: "step-observe-predict",
      title: "1 · Observe & Predict",
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
      id: "step-measure-components",
      title: "2 · Measure & Decompose",
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
      id: "step-name-law",
      title: "3 · Name the Law",
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
      id: "step-unknown",
      title: "Step",
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
      id: "step-unknown",
      title: "Step",
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
      id: "step-unknown",
      title: "Step",
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
      id: "step-transfer",
      title: "4 · Transfer & Evaluate",
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
    // ── Slide 1: CONNECT ─────────────────────────────────────
    {
      id: "eb-mech-1-1-connect",
      type: "lesson_text",
      title: "Lesson 1-1: Velocity Vectors & Relative Velocity",
      subtitle: "Part 1 · Chapter 1: Mechanics · Egyptian Baccalaureate Physics",
      body: `### ❓ Lesson Question
**How can we describe and predict the motion of an object when its direction and reference frame both matter?**

---

### You will learn to:

1. **Distinguish** between scalar and vector quantities — distance vs displacement, speed vs velocity.
2. **Add** two velocity vectors using perpendicular components:
   $$v_x = v\\cos\\theta, \\quad v_y = v\\sin\\theta, \\quad |\\vec{v}| = \\sqrt{v_x^2 + v_y^2}$$
3. **Find** the velocity of A relative to B using:
   $$\\vec{v}_{AB} = \\vec{v}_A - \\vec{v}_B$$
4. **Apply** these ideas to river crossings, trains, and aircraft in crosswinds.

---

### Key Terms
| Term | Meaning |
|---|---|
| **Displacement** | Change in position — has direction (vector) |
| **Velocity** | Rate of change of displacement — vector |
| **Resultant velocity** | Vector sum of all component velocities |
| **Relative velocity** | Velocity of A as measured by observer B |

> **★ Key Idea:** A velocity is only meaningful when you state *relative to what*. A passenger sitting still on a 100 km/h train is moving at 100 km/h relative to the ground but 0 km/h relative to the seat.`,
      keyTerms: [
        "Displacement", "Velocity", "Vector", "Scalar",
        "Component", "Resultant", "Relative velocity", "Reference frame"
      ],
      processStepId: "step-observe-predict",
      step: {
        purpose: "CONNECT",
        targetPoints: ["Understand lesson goal", "Review vector vs scalar"],
        completionEvidence: ["Ready to make first prediction"],
        advanceRule: "OPEN_NEXT"
      }
    },

    // ── Slide 2: PREDICT (MCQ + SVG) ─────────────────────────
    {
      id: "eb-mech-1-1-predict",
      type: "question_mcq",
      title: "Observe & Predict — The Nile Crossing",
      subtitle: "Commit your prediction before any formula",
      questionText:
        "A felucca boat can travel at 4 m/s in still water. The Nile current flows at 3 m/s downstream (to the right in the diagram). The captain aims the boat straight across (upward in the diagram). What is the actual speed of the boat relative to the shore, and in what direction does it move?",
      imageLayout: "left",
      imageSizePct: 46,
      imageCaption: "Figure 1.1a — Boat velocity (blue, 4 m/s upward) + current velocity (orange, 3 m/s right) = resultant (white dashed)",
      diagramSvg: `<svg viewBox="0 0 400 260" class="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrW" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <polygon points="0 0,8 3,0 6" fill="white"/>
    </marker>
    <marker id="arrB" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <polygon points="0 0,8 3,0 6" fill="#38bdf8"/>
    </marker>
    <marker id="arrO" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <polygon points="0 0,8 3,0 6" fill="#f59e0b"/>
    </marker>
    <linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0c4a6e" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#075985" stop-opacity="0.9"/>
    </linearGradient>
  </defs>
  <!-- River -->
  <rect x="0" y="0" width="400" height="260" fill="#0f172a"/>
  <rect x="60" y="0" width="280" height="260" fill="url(#waterGrad)" rx="4"/>
  <!-- Banks -->
  <rect x="0" y="0" width="60" height="260" fill="#78350f"/>
  <rect x="340" y="0" width="60" height="260" fill="#78350f"/>
  <text x="30" y="135" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="bold">Bank</text>
  <text x="370" y="135" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="bold">Bank</text>
  <!-- Current arrows -->
  <text x="100" y="20" fill="#f59e0b" font-size="10" font-weight="bold">Current 3 m/s →</text>
  <line x1="115" y1="40" x2="175" y2="40" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#arrO)" opacity="0.5"/>
  <line x1="155" y1="80" x2="215" y2="80" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#arrO)" opacity="0.5"/>
  <line x1="135" y1="220" x2="195" y2="220" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#arrO)" opacity="0.5"/>
  <!-- Boat position -->
  <circle cx="120" cy="160" r="10" fill="#1e40af" stroke="#93c5fd" stroke-width="1.5"/>
  <text x="120" y="164" text-anchor="middle" fill="white" font-size="9" font-weight="bold">⛵</text>
  <!-- Boat velocity vector (up, 4 m/s → scaled to 80px) -->
  <line x1="120" y1="160" x2="120" y2="80" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arrB)"/>
  <text x="100" y="118" fill="#38bdf8" font-size="11" font-weight="bold">4 m/s</text>
  <text x="100" y="130" fill="#38bdf8" font-size="10">(boat aim)</text>
  <!-- Current component at boat (right, 3 m/s → scaled to 60px) -->
  <line x1="120" y1="160" x2="180" y2="160" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#arrO)"/>
  <text x="135" y="178" fill="#f59e0b" font-size="11" font-weight="bold">3 m/s</text>
  <text x="135" y="190" fill="#f59e0b" font-size="10">(current)</text>
  <!-- Resultant (dashed white) -->
  <line x1="120" y1="160" x2="180" y2="80" stroke="white" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#arrW)" opacity="0.9"/>
  <text x="185" y="118" fill="white" font-size="11" font-weight="bold">? m/s</text>
  <text x="185" y="130" fill="#94a3b8" font-size="10">resultant</text>
  <!-- Angle arc -->
  <path d="M 120 140 Q 135 140 138 130" stroke="#e2e8f0" stroke-width="1" fill="none"/>
  <text x="140" y="147" fill="#e2e8f0" font-size="10">θ</text>
</svg>`,
      choices: [
        {
          id: "A",
          text: "5 m/s at an angle, drifting downstream from the straight-across direction.",
          isCorrect: true,
          explanation:
            "Correct! Using Pythagoras: |v| = √(4² + 3²) = √(16 + 9) = √25 = 5 m/s. The boat drifts downstream because the current adds a rightward component. The angle is θ = arctan(3/4) ≈ 37° from straight across."
        },
        {
          id: "B",
          text: "7 m/s straight across — the speeds simply add since both push the boat forward.",
          isCorrect: false,
          misconceptionId: "MECH-VECTOR-SCALAR-ADD",
          explanation:
            "Incorrect. Speeds only add directly if they act in the same direction. Here the boat aims across (vertical) while the current acts along the river (horizontal). These are perpendicular, so we use Pythagoras, not simple addition."
        },
        {
          id: "C",
          text: "4 m/s straight across — the captain corrects for the current so the net motion is across.",
          isCorrect: false,
          misconceptionId: "MECH-VECTOR-NO-RESULTANT",
          explanation:
            "Incorrect. The captain aimed straight across but did not turn upstream. The current still adds its 3 m/s sideways component. The resultant motion is diagonal. To go perfectly straight across, the captain would need to aim upstream at an angle."
        },
        {
          id: "D",
          text: "1 m/s — the current partially cancels the boat's forward speed.",
          isCorrect: false,
          misconceptionId: "MECH-VECTOR-CANCEL-PERPENDICULAR",
          explanation:
            "Incorrect. Perpendicular vectors do not cancel each other. The 3 m/s current acts sideways; it cannot cancel the 4 m/s across-river motion. Cancellation only happens when vectors are exactly opposite in direction."
        }
      ],
      points: 2,
      processStepId: "step-observe-predict",
      step: {
        purpose: "EVALUATE",
        targetPoints: ["Prediction committed", "Vector nature of velocity understood"],
        completionEvidence: ["Answer submitted"],
        advanceRule: "OPEN_NEXT",
        supportExamples: [
          "Draw two separate arrows — one going up (boat speed) and one going right (current). They form the two sides of a right triangle. The diagonal is the resultant.",
          "Try: 3, 4, 5 — a Pythagorean triple. Any right triangle with sides 3 and 4 has hypotenuse 5.",
          "The key word is 'resultant' — it's the single vector that replaces the combination of all other vectors."
        ]
      }
    },

    // ── Slide 3: EXPLAIN ─────────────────────────────────────
    {
      id: "eb-mech-1-1-explain",
      type: "lesson_text",
      title: "Observation to Model — Vector Addition & Relative Velocity",
      subtitle: "Building the formal framework from what we observed",
      body: `### 1 · Scalars vs Vectors
| | Scalar | Vector |
|---|---|---|
| **Definition** | Magnitude only | Magnitude + direction |
| **Examples** | Distance (5 km), Speed (60 km/h) | Displacement (5 km North), Velocity (60 km/h North) |
| **Symbol** | $d$, $v$ | $\\vec{d}$, $\\vec{v}$ |

---

### 2 · Decomposing a Velocity Vector
Any velocity at angle $\\theta$ to the x-axis splits into:
$$v_x = v\\cos\\theta \\qquad v_y = v\\sin\\theta$$

To recover the resultant from components:
$$|\\vec{v}| = \\sqrt{v_x^2 + v_y^2} \\qquad \\theta = \\arctan\\!\\left(\\frac{v_y}{v_x}\\right)$$

---

### 3 · Worked Example — Nile Crossing
**Given:** Boat speed in still water = 4 m/s (across), current = 3 m/s (downstream).

**Step 1** — Components of resultant:
- $v_x = 3\\text{ m/s}$ (current, downstream)
- $v_y = 4\\text{ m/s}$ (boat engine, across)

**Step 2** — Resultant speed:
$$|\\vec{v}_{\\text{shore}}| = \\sqrt{3^2 + 4^2} = \\sqrt{9+16} = \\sqrt{25} = \\boxed{5\\text{ m/s}}$$

**Step 3** — Direction (angle from straight-across):
$$\\theta = \\arctan\\!\\left(\\frac{3}{4}\\right) \\approx 37°\\text{ downstream}$$

---

### 4 · Relative Velocity — The Formal Law
The velocity of object A **as seen by observer B** is:
$$\\boxed{\\vec{v}_{A/B} = \\vec{v}_A - \\vec{v}_B}$$

**Example:** Train moves at 80 km/h East. Passenger walks at 5 km/h toward the front (East).
- Passenger velocity relative to ground: $80 + 5 = 85\\text{ km/h East}$
- If walking backward: $80 - 5 = 75\\text{ km/h East}$ (still East, just slower)

**Example:** Two trains approach each other — Train A at 90 km/h East, Train B at 70 km/h West.
- Velocity of A relative to B: $90 - (-70) = 160\\text{ km/h East}$

> **★ Remember:** When the observer B is stationary (ground frame), $\\vec{v}_B = 0$, so $\\vec{v}_{A/B} = \\vec{v}_A$. Relative velocity becomes familiar only when B is also moving.`,
      keyTerms: ["Vector components", "Resultant velocity", "Relative velocity", "Reference frame"],
      processStepId: "step-measure-components",
      step: {
        purpose: "EXPLAIN",
        targetPoints: ["Decompose vectors using trig", "Apply relative velocity formula"],
        completionEvidence: ["Can write components", "Understands v_AB = v_A - v_B"],
        advanceRule: "OPEN_NEXT"
      }
    },

    // ── Slide 4: PRACTICE (MCQ + SVG) ────────────────────────
    {
      id: "eb-mech-1-1-practice",
      type: "question_mcq",
      title: "Practice — Train Relative Velocity",
      subtitle: "Apply the model to a new context",
      questionText:
        "A train travels at 72 km/h due East. A passenger walks toward the rear of the train at 2 m/s. A person standing on the station platform watches the passenger. What is the passenger's velocity relative to the platform? (Take East as positive. 72 km/h = 20 m/s)",
      imageLayout: "top",
      imageSizePct: 42,
      imageCaption: "Figure 1.1b — Train (East, 20 m/s) and passenger walking toward rear (West relative to train, −2 m/s)",
      diagramSvg: `<svg viewBox="0 0 400 200" class="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrE" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <polygon points="0 0,8 3,0 6" fill="#10b981"/>
    </marker>
    <marker id="arrP" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <polygon points="0 0,8 3,0 6" fill="#f87171"/>
    </marker>
    <marker id="arrR" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <polygon points="0 0,8 3,0 6" fill="#fbbf24"/>
    </marker>
  </defs>
  <rect width="400" height="200" fill="#0f172a"/>
  <!-- Ground line -->
  <line x1="0" y1="160" x2="400" y2="160" stroke="#334155" stroke-width="2"/>
  <!-- Train body -->
  <rect x="80" y="100" width="200" height="50" rx="6" fill="#1e3a5f" stroke="#38bdf8" stroke-width="1.5"/>
  <!-- Windows -->
  <rect x="100" y="110" width="25" height="20" rx="3" fill="#0ea5e9" opacity="0.4"/>
  <rect x="145" y="110" width="25" height="20" rx="3" fill="#0ea5e9" opacity="0.4"/>
  <rect x="190" y="110" width="25" height="20" rx="3" fill="#0ea5e9" opacity="0.4"/>
  <rect x="235" y="110" width="25" height="20" rx="3" fill="#0ea5e9" opacity="0.4"/>
  <!-- Wheels -->
  <circle cx="120" cy="155" r="8" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>
  <circle cx="240" cy="155" r="8" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>
  <!-- Train velocity arrow -->
  <line x1="280" y1="125" x2="360" y2="125" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrE)"/>
  <text x="290" y="118" fill="#10b981" font-size="11" font-weight="bold">Train: 20 m/s East</text>
  <!-- Passenger figure (inside train, near rear) -->
  <circle cx="130" cy="118" r="6" fill="#fbbf24"/>
  <line x1="130" y1="124" x2="130" y2="140" stroke="#fbbf24" stroke-width="1.5"/>
  <!-- Passenger walking arrow (backward = left = West relative to train) -->
  <line x1="125" y1="130" x2="85" y2="130" stroke="#f87171" stroke-width="2" marker-end="url(#arrP)"/>
  <text x="55" y="128" fill="#f87171" font-size="10">−2 m/s</text>
  <text x="48" y="140" fill="#f87171" font-size="10">(rel. train)</text>
  <!-- Platform observer -->
  <circle cx="30" cy="152" r="6" fill="#a78bfa"/>
  <line x1="30" y1="158" x2="30" y2="170" stroke="#a78bfa" stroke-width="1.5"/>
  <text x="5" y="185" fill="#a78bfa" font-size="10">Observer</text>
  <!-- Result arrow -->
  <line x1="200" y1="85" x2="330" y2="85" stroke="#fbbf24" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#arrR)"/>
  <text x="218" y="78" fill="#fbbf24" font-size="11" font-weight="bold">? m/s East (relative to platform)</text>
</svg>`,
      choices: [
        {
          id: "A",
          text: "18 m/s East — train velocity minus passenger's walking speed: 20 − 2 = 18 m/s.",
          isCorrect: true,
          explanation:
            "Correct! Using $\\vec{v}_{\\text{passenger/ground}} = \\vec{v}_{\\text{passenger/train}} + \\vec{v}_{\\text{train/ground}}$. The passenger walks at −2 m/s (West) relative to the train, and the train moves at +20 m/s (East) relative to the ground. So: −2 + 20 = +18 m/s East."
        },
        {
          id: "B",
          text: "22 m/s East — the walking speed adds to the train speed in the same direction.",
          isCorrect: false,
          misconceptionId: "MECH-RELATIVE-DIRECTION-ERROR",
          explanation:
            "Incorrect. The passenger walks toward the rear — that is the opposite direction to the train's motion. Walking toward the front would add speed; walking toward the rear subtracts. Direction matters."
        },
        {
          id: "C",
          text: "2 m/s West — the passenger moves West, so that is their absolute velocity.",
          isCorrect: false,
          misconceptionId: "MECH-RELATIVE-IGNORES-TRAIN",
          explanation:
            "Incorrect. The 2 m/s West is the passenger's velocity only relative to the train, not relative to the ground. The platform observer still sees the passenger being carried East by the train at 20 m/s, partly offset by the 2 m/s walk."
        },
        {
          id: "D",
          text: "20 m/s East — the passenger's walking speed is negligible and can be ignored.",
          isCorrect: false,
          misconceptionId: "MECH-RELATIVE-IGNORE-SMALL",
          explanation:
            "Incorrect. While 2 m/s is small compared to 20 m/s, the problem asks for the exact value. In physics, every component must be accounted for unless explicitly told to neglect it. The correct answer is 18 m/s."
        }
      ],
      points: 2,
      processStepId: "step-transfer",
      step: {
        purpose: "PRACTICE",
        targetPoints: ["Apply relative velocity formula", "Use correct sign convention for direction"],
        completionEvidence: ["Correct answer and explanation given"],
        advanceRule: "SUPPORT_AND_RETRY",
        supportExamples: [
          "Write down what you know: v_train = +20 m/s (East). v_passenger relative to train = −2 m/s (toward rear = West).",
          "Use the formula: v_passenger/ground = v_passenger/train + v_train/ground = (−2) + (+20) = +18 m/s.",
          "Always define positive direction first. Here: East = positive, West = negative."
        ]
      }
    },

    // ── Slide 5: TRANSFER (MCQ + SVG — aircraft crosswind) ───
    {
      id: "eb-mech-1-1-transfer",
      type: "question_mcq",
      title: "Transfer — Aircraft in a Crosswind",
      subtitle: "Apply vectors to a real aviation problem",
      questionText:
        "An aircraft flies at 300 m/s relative to the air, heading due North. A crosswind blows at 40 m/s due East. A radar on the ground tracks the aircraft. What is the aircraft's speed relative to the ground, and in which direction does it actually travel?",
      imageLayout: "left",
      imageSizePct: 44,
      imageCaption: "Figure 1.1c — Aircraft heading North at 300 m/s; wind pushes East at 40 m/s; radar tracks resultant",
      diagramSvg: `<svg viewBox="0 0 400 260" class="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="aN" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <polygon points="0 0,8 3,0 6" fill="#38bdf8"/>
    </marker>
    <marker id="aW" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <polygon points="0 0,8 3,0 6" fill="#f59e0b"/>
    </marker>
    <marker id="aR" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <polygon points="0 0,8 3,0 6" fill="#a78bfa"/>
    </marker>
  </defs>
  <rect width="400" height="260" fill="#0f172a"/>
  <!-- Compass rose -->
  <text x="200" y="20" text-anchor="middle" fill="#64748b" font-size="11">N</text>
  <text x="200" y="255" text-anchor="middle" fill="#64748b" font-size="11">S</text>
  <text x="15"  y="135" text-anchor="middle" fill="#64748b" font-size="11">W</text>
  <text x="385" y="135" text-anchor="middle" fill="#64748b" font-size="11">E</text>
  <!-- Grid lines -->
  <line x1="200" y1="0"   x2="200" y2="260" stroke="#1e293b" stroke-width="1" stroke-dasharray="4 4"/>
  <line x1="0"   y1="130" x2="400" y2="130" stroke="#1e293b" stroke-width="1" stroke-dasharray="4 4"/>
  <!-- Aircraft icon -->
  <text x="200" y="218" text-anchor="middle" font-size="22">✈</text>
  <!-- Aircraft velocity (North, 300 m/s → scaled to 100px) -->
  <line x1="200" y1="210" x2="200" y2="110" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#aN)"/>
  <text x="145" y="160" fill="#38bdf8" font-size="11" font-weight="bold">300 m/s</text>
  <text x="148" y="173" fill="#38bdf8" font-size="10">(aircraft/air)</text>
  <!-- Wind velocity (East, 40 m/s → scaled to ~13px) -->
  <line x1="200" y1="210" x2="280" y2="210" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#aW)"/>
  <text x="215" y="228" fill="#f59e0b" font-size="11" font-weight="bold">40 m/s East (wind)</text>
  <!-- Resultant (dashed purple) -->
  <line x1="200" y1="210" x2="280" y2="110" stroke="#a78bfa" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#aR)"/>
  <text x="283" y="160" fill="#a78bfa" font-size="11" font-weight="bold">? m/s</text>
  <text x="278" y="172" fill="#a78bfa" font-size="10">(ground track)</text>
  <!-- Right angle mark -->
  <polyline points="200,200 210,200 210,210" fill="none" stroke="#475569" stroke-width="1.2"/>
  <!-- Angle label -->
  <path d="M 200 190 Q 210 185 215 175" stroke="#e2e8f0" stroke-width="1" fill="none"/>
  <text x="215" y="185" fill="#e2e8f0" font-size="10">θ</text>
</svg>`,
      choices: [
        {
          id: "A",
          text: "≈ 302.7 m/s, slightly East of North — faster than aircraft airspeed, drifted East.",
          isCorrect: true,
          explanation:
            "Correct! Resultant = √(300² + 40²) = √(90000 + 1600) = √91600 ≈ 302.7 m/s. Direction: θ = arctan(40/300) ≈ 7.6° East of North. The crosswind increases ground speed slightly and deflects the path."
        },
        {
          id: "B",
          text: "340 m/s North — the wind pushes the aircraft faster so speeds add directly.",
          isCorrect: false,
          misconceptionId: "MECH-VECTOR-SCALAR-ADD",
          explanation:
            "Incorrect. The wind blows East, not North. Velocities in perpendicular directions cannot be added arithmetically. 300 + 40 = 340 applies only when both vectors point in the same direction."
        },
        {
          id: "C",
          text: "260 m/s North — the crosswind reduces the northward speed.",
          isCorrect: false,
          misconceptionId: "MECH-VECTOR-CANCEL-PERPENDICULAR",
          explanation:
            "Incorrect. A perpendicular wind (East) cannot reduce northward speed. It adds a new eastward component but leaves the northward component at exactly 300 m/s. Only a headwind or tailwind (North-South) would change northward speed."
        },
        {
          id: "D",
          text: "300 m/s North — the aircraft engine corrects for the wind automatically.",
          isCorrect: false,
          misconceptionId: "MECH-RELATIVE-IGNORE-WIND",
          explanation:
            "Incorrect. The pilot has not corrected for the crosswind — the aircraft simply aims North. The wind adds an eastward component to the ground track. To fly truly North, the pilot would need to aim slightly West into the wind."
        }
      ],
      points: 2,
      processStepId: "step-transfer",
      step: {
        purpose: "EVALUATE",
        targetPoints: ["Transfer to aviation context", "Apply Pythagoras and arctan correctly"],
        completionEvidence: ["Correct ground speed and direction found"],
        advanceRule: "SUPPORT_AND_RETRY",
        supportExamples: [
          "Draw two perpendicular arrows: one pointing North (300), one pointing East (40).",
          "Resultant = √(300² + 40²). Try this calculation step by step.",
          "The wind is at 90° to the aircraft's heading, so we must use Pythagoras, not simple addition."
        ]
      }
    },

    // ── Slide 6: REFLECT / SUMMARY ────────────────────────────
    {
      id: "eb-mech-1-1-evaluate",
      type: "lesson_text",
      title: "Lesson 1-1 Complete — Evidence Summary",
      subtitle: "Velocity Vectors & Relative Velocity · What you can now do",
      body: `### ✅ Mastery Checklist

Before moving to Lesson 1-2 (Horizontal Projectile Motion), confirm you can:

1. ☐ **Distinguish** velocity (vector) from speed (scalar), and displacement from distance
2. ☐ **Decompose** a velocity at angle θ:
   $$v_x = v\\cos\\theta \\qquad v_y = v\\sin\\theta$$
3. ☐ **Find** the resultant velocity using:
   $$|\\vec{v}| = \\sqrt{v_x^2 + v_y^2}$$
4. ☐ **Calculate** relative velocity using:
   $$\\vec{v}_{A/B} = \\vec{v}_A - \\vec{v}_B$$
5. ☐ **Solve** river crossing, train, and aircraft crosswind problems

---

### 📊 Your Session Evidence
- Prediction question (Nile crossing) — committed before explanation ✓
- Practice question (train relative velocity) — calculated with sign convention ✓
- Transfer question (aircraft crosswind) — applied Pythagoras to new context ✓

---

> **Next lesson:** 1-2 Horizontal Projectile Motion — you will discover that a stone thrown horizontally and one dropped vertically hit the ground at exactly the same time. Why?`,
      keyTerms: ["Velocity vector", "Relative velocity", "Vector components", "Resultant"],
      processStepId: "step-transfer",
      step: {
        purpose: "REFLECT",
        targetPoints: [
          "All five mastery points confirmed",
          "Ready for Lesson 1-2"
        ],
        completionEvidence: ["Summary reviewed"],
        advanceRule: "OPEN_NEXT"
      }
    }
  ]
};
