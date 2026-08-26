import { AssessmentBlueprint } from "../../contracts/assessment";

export const assessments: AssessmentBlueprint[] = [
  // ============================================================
  // 1. READINESS GATEKEEPER ASSESSMENT
  // ============================================================
  {
    id: "ASSESS-0580-READINESS",
    type: "READINESS",
    purpose: "Evaluate whether an incoming student possesses the prerequisite integer, LCM, and fraction foundation to commence Stage 1.",
    eligibility: "All newly enrolled students prior to starting Stage 1",
    skillsAssessed: [
      "SK-PREREQ-ARITHMETIC",
      "SK-PREREQ-LCM",
      "SK-NUM-FRAC-ADD"
    ],
    questionBlueprints: [
      {
        id: "QB-0580-R-BIDMAS-01",
        skillId: "SK-PREREQ-ARITHMETIC",
        type: "MULTIPLE_CHOICE",
        difficulty: 1,
        expectedResponseType: "CHOICE_ID",
        scoringModel: "BINARY_EXACT",
        timingExpectation: {
          trackingType: "SESSION_MS",
          expectedDuration: 30000,
          slowThreshold: 60000
        }
      },
      {
        id: "QB-0580-R-LCM-01",
        skillId: "SK-PREREQ-LCM",
        type: "MULTIPLE_CHOICE",
        difficulty: 1,
        expectedResponseType: "CHOICE_ID",
        scoringModel: "BINARY_EXACT",
        timingExpectation: {
          trackingType: "SESSION_MS",
          expectedDuration: 30000,
          slowThreshold: 60000
        }
      },
      {
        id: "QB-0580-R-FRAC-01",
        skillId: "SK-NUM-FRAC-ADD",
        type: "MULTIPLE_CHOICE",
        difficulty: 2,
        expectedResponseType: "CHOICE_ID",
        scoringModel: "BINARY_EXACT",
        timingExpectation: {
          trackingType: "SESSION_MS",
          expectedDuration: 45000,
          slowThreshold: 90000
        }
      }
    ]
  },

  // ============================================================
  // 2. COMPREHENSIVE GLOBAL DIAGNOSTIC & PLACEMENT ASSESSMENT
  // ============================================================
  {
    id: "ASSESS-0580-DIAGNOSTIC-GLOBAL",
    type: "DIAGNOSTIC",
    purpose: "Multi-stage adaptive diagnostic allowing students with prior mathematical knowledge to test directly into Stage 2, 3, 4, or 5.",
    eligibility: "Students entering with prior Cambridge, GCSE, or equivalent coursework",
    skillsAssessed: [
      "SK-NUM-FRAC-ADD",
      "SK-ALG-SOLVE-LINEAR",
      "SK-ALG-QUAD-FACTORIZE",
      "SK-ALG-SOLVE-QUAD-FORMULA",
      "SK-TRIG-RIGHT-ANGLED-RATIOS",
      "SK-PROB-CONDITIONAL-WITHOUT-REPLACEMENT"
    ],
    questionBlueprints: [
      {
        id: "QB-0580-DIAG-S1",
        skillId: "SK-ALG-SOLVE-LINEAR",
        type: "MULTIPLE_CHOICE",
        difficulty: 2,
        expectedResponseType: "CHOICE_ID",
        scoringModel: "BINARY_EXACT",
        timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 60000, slowThreshold: 120000 }
      },
      {
        id: "QB-0580-DIAG-S2",
        skillId: "SK-ALG-QUAD-FACTORIZE",
        type: "MULTIPLE_CHOICE",
        difficulty: 2,
        expectedResponseType: "CHOICE_ID",
        scoringModel: "BINARY_EXACT",
        timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 75000, slowThreshold: 150000 }
      },
      {
        id: "QB-0580-DIAG-S3",
        skillId: "SK-ALG-SOLVE-QUAD-FORMULA",
        type: "MULTIPLE_CHOICE",
        difficulty: 3,
        expectedResponseType: "CHOICE_ID",
        scoringModel: "BINARY_EXACT",
        timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 90000, slowThreshold: 180000 }
      },
      {
        id: "QB-0580-DIAG-S4",
        skillId: "SK-TRIG-RIGHT-ANGLED-RATIOS",
        type: "MULTIPLE_CHOICE",
        difficulty: 3,
        expectedResponseType: "CHOICE_ID",
        scoringModel: "BINARY_EXACT",
        timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 75000, slowThreshold: 150000 }
      },
      {
        id: "QB-0580-DIAG-S5",
        skillId: "SK-PROB-CONDITIONAL-WITHOUT-REPLACEMENT",
        type: "MULTIPLE_CHOICE",
        difficulty: 4,
        expectedResponseType: "CHOICE_ID",
        scoringModel: "BINARY_EXACT",
        timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 90000, slowThreshold: 180000 }
      }
    ]
  },

  // ============================================================
  // 3. STAGE 1 MASTERY BLUEPRINT
  // ============================================================
  {
    id: "ASSESS-0580-SM1",
    type: "STAGE_MASTERY",
    purpose: "Evaluate mastery of Stage 1 Number and Linear Algebra skills before unlocking Stage 2.",
    skillsAssessed: [
      "SK-NUM-PRIME-FACTORS",
      "SK-NUM-FRAC-ADD",
      "SK-NUM-PERCENTAGE-CHANGE",
      "SK-ALG-EXPAND-LINEAR",
      "SK-ALG-SOLVE-LINEAR"
    ],
    questionBlueprints: [
      {
        id: "QB-0580-SM1-01",
        skillId: "SK-NUM-PRIME-FACTORS",
        type: "MULTIPLE_CHOICE",
        difficulty: 2,
        expectedResponseType: "CHOICE_ID",
        scoringModel: "BINARY_EXACT",
        timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 60000, slowThreshold: 120000 }
      },
      {
        id: "QB-0580-SM1-02",
        skillId: "SK-NUM-FRAC-ADD",
        type: "MULTIPLE_CHOICE",
        difficulty: 2,
        expectedResponseType: "CHOICE_ID",
        scoringModel: "BINARY_EXACT",
        timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 60000, slowThreshold: 120000 }
      },
      {
        id: "QB-0580-SM1-03",
        skillId: "SK-ALG-SOLVE-LINEAR",
        type: "MULTIPLE_CHOICE",
        difficulty: 2,
        expectedResponseType: "CHOICE_ID",
        scoringModel: "BINARY_EXACT",
        timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 60000, slowThreshold: 120000 }
      }
    ]
  },

  // ============================================================
  // 4. STAGE 2 MASTERY BLUEPRINT
  // ============================================================
  {
    id: "ASSESS-0580-SM2",
    type: "STAGE_MASTERY",
    purpose: "Evaluate mastery of Stage 2 Proportions, Coordinate Lines and Quadratic expansions.",
    skillsAssessed: [
      "SK-NUM-COMPOUND-INTEREST",
      "SK-ALG-QUAD-FACTORIZE",
      "SK-COORD-LINE-EQUATION"
    ],
    questionBlueprints: [
      {
        id: "QB-0580-SM2-01",
        skillId: "SK-NUM-COMPOUND-INTEREST",
        type: "MULTIPLE_CHOICE",
        difficulty: 3,
        expectedResponseType: "CHOICE_ID",
        scoringModel: "BINARY_EXACT",
        timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 75000, slowThreshold: 150000 }
      },
      {
        id: "QB-0580-SM2-02",
        skillId: "SK-ALG-QUAD-FACTORIZE",
        type: "MULTIPLE_CHOICE",
        difficulty: 3,
        expectedResponseType: "CHOICE_ID",
        scoringModel: "BINARY_EXACT",
        timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 75000, slowThreshold: 150000 }
      },
      {
        id: "QB-0580-SM2-03",
        skillId: "SK-COORD-LINE-EQUATION",
        type: "MULTIPLE_CHOICE",
        difficulty: 3,
        expectedResponseType: "CHOICE_ID",
        scoringModel: "BINARY_EXACT",
        timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 75000, slowThreshold: 150000 }
      }
    ]
  },

  // ============================================================
  // 5. STAGE 3 MASTERY BLUEPRINT
  // ============================================================
  {
    id: "ASSESS-0580-SM3",
    type: "STAGE_MASTERY",
    purpose: "Evaluate mastery of Stage 3 Quadratic Formula, Algebraic Fractions, and 3D Mensuration.",
    skillsAssessed: [
      "SK-NUM-SURDS-SIMPLIFY",
      "SK-ALG-SOLVE-QUAD-FORMULA",
      "SK-ALG-ALGEBRAIC-FRACTIONS",
      "SK-MENS-VOLUME-3D"
    ],
    questionBlueprints: [
      {
        id: "QB-0580-SM3-01",
        skillId: "SK-ALG-SOLVE-QUAD-FORMULA",
        type: "MULTIPLE_CHOICE",
        difficulty: 3,
        expectedResponseType: "CHOICE_ID",
        scoringModel: "BINARY_EXACT",
        timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 90000, slowThreshold: 180000 }
      },
      {
        id: "QB-0580-SM3-02",
        skillId: "SK-MENS-VOLUME-3D",
        type: "MULTIPLE_CHOICE",
        difficulty: 3,
        expectedResponseType: "CHOICE_ID",
        scoringModel: "BINARY_EXACT",
        timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 90000, slowThreshold: 180000 }
      }
    ]
  },

  // ============================================================
  // 6. STAGE 4 MASTERY BLUEPRINT
  // ============================================================
  {
    id: "ASSESS-0580-SM4",
    type: "STAGE_MASTERY",
    purpose: "Evaluate mastery of Stage 4 Circle Theorems, 3D Trigonometry, and Vector Proofs.",
    skillsAssessed: [
      "SK-GEOM-CIRCLE-THEOREMS-CORE",
      "SK-TRIG-SINE-COSINE-RULE",
      "SK-VEC-GEOMETRIC-PROOFS"
    ],
    questionBlueprints: [
      {
        id: "QB-0580-SM4-01",
        skillId: "SK-TRIG-SINE-COSINE-RULE",
        type: "MULTIPLE_CHOICE",
        difficulty: 4,
        expectedResponseType: "CHOICE_ID",
        scoringModel: "BINARY_EXACT",
        timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 100000, slowThreshold: 200000 }
      },
      {
        id: "QB-0580-SM4-02",
        skillId: "SK-VEC-GEOMETRIC-PROOFS",
        type: "MULTIPLE_CHOICE",
        difficulty: 4,
        expectedResponseType: "CHOICE_ID",
        scoringModel: "BINARY_EXACT",
        timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 120000, slowThreshold: 240000 }
      }
    ]
  },

  // ============================================================
  // 7. STAGE 5 FINAL EXAM MASTERY BLUEPRINT
  // ============================================================
  {
    id: "ASSESS-0580-SM5",
    type: "STAGE_MASTERY",
    purpose: "Full Cambridge IGCSE Mathematics 0580 Mock Examination Synthesis across all 9 Syllabus Strands.",
    skillsAssessed: [
      "SK-ALG-DIFFERENTIATION-BASIC",
      "SK-PROB-CONDITIONAL-WITHOUT-REPLACEMENT",
      "SK-STAT-HISTOGRAMS-FREQUENCY-DENSITY"
    ],
    questionBlueprints: [
      {
        id: "QB-0580-SM5-01",
        skillId: "SK-ALG-DIFFERENTIATION-BASIC",
        type: "MULTIPLE_CHOICE",
        difficulty: 4,
        expectedResponseType: "CHOICE_ID",
        scoringModel: "BINARY_EXACT",
        timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 100000, slowThreshold: 200000 }
      },
      {
        id: "QB-0580-SM5-02",
        skillId: "SK-PROB-CONDITIONAL-WITHOUT-REPLACEMENT",
        type: "MULTIPLE_CHOICE",
        difficulty: 4,
        expectedResponseType: "CHOICE_ID",
        scoringModel: "BINARY_EXACT",
        timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 90000, slowThreshold: 180000 }
      }
    ]
  }
];
