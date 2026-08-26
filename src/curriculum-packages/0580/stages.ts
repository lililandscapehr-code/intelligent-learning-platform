import { Stage } from "../../contracts/curriculum";

export const stages: Stage[] = [
  // ============================================================
  // STAGE 1: FOUNDATION NUMBERS & LINEAR ALGEBRA BASICS
  // ============================================================
  {
    id: "STAGE-0580-1",
    name: "Stage 1: Foundation Arithmetic, Fractions & Linear Algebra",
    sequence: 1,
    objectives: [
      "Master integer operations, BIDMAS, HCF, LCM, and prime factorization.",
      "Calculate fractional arithmetic with unlike denominators fluently.",
      "Solve linear equations and perform basic algebraic expansions and factorizations."
    ],
    includedSkills: [
      "SK-PREREQ-ARITHMETIC",
      "SK-PREREQ-LCM",
      "SK-NUM-PRIME-FACTORS",
      "SK-NUM-FRAC-ADD",
      "SK-NUM-PERCENTAGE-CHANGE",
      "SK-NUM-STANDARD-FORM",
      "SK-ALG-EXPAND-LINEAR",
      "SK-ALG-FACTORIZE-COMMON",
      "SK-ALG-SOLVE-LINEAR"
    ],
    prerequisiteRequirements: [],
    lessons: [
      "LES-0580-S1-NUM-01",
      "LES-0580-S1-LCM-02",
      "LES-0580-S1-FRAC-03",
      "LES-0580-S1-ALG-04"
    ],
    assessments: [
      "ASSESS-0580-READINESS",
      "ASSESS-0580-SM1"
    ],
    masteryRequirements: {
      minimumSkillMasteryLevel: 3, // Secure
      requiredScorePercentage: 75,
      mustClearCriticalGaps: true
    },
    remediationRules: {
      maxAttempts: 3,
      interventionType: "PREREQUISITE_REVIEW",
      triggerSeverity: "HIGH"
    },
    progressionRules: {
      requireTeacherSignoff: false,
      autoUnlockNextStage: true
    },
    optionalExtensions: ["EXT-0580-NUMBER-PATTERNS"],
    stemOpportunities: ["STEM-LCM-PLANETARY-ORBITS", "STEM-STANDARD-FORM-ASTRONOMY"]
  },

  // ============================================================
  // STAGE 2: PROPORTIONAL REASONING, COORDINATE GEOMETRY & QUADRATICS
  // ============================================================
  {
    id: "STAGE-0580-2",
    name: "Stage 2: Proportions, Coordinate Lines & Quadratic Expansions",
    sequence: 2,
    objectives: [
      "Solve compound financial, speed, and proportional rate problems.",
      "Expand double brackets and factorize quadratic trinomials.",
      "Determine gradients, midpoints, and equations of straight lines y = mx + c."
    ],
    includedSkills: [
      "SK-NUM-RATIO-DIV",
      "SK-NUM-COMPOUND-INTEREST",
      "SK-NUM-SPEED-RATES",
      "SK-ALG-QUAD-EXPAND",
      "SK-ALG-QUAD-FACTORIZE",
      "SK-ALG-SIMULTANEOUS-LINEAR",
      "SK-ALG-LINEAR-INEQUALITIES",
      "SK-COORD-GRADIENT-MIDPOINT",
      "SK-COORD-LINE-EQUATION"
    ],
    prerequisiteRequirements: ["STAGE-0580-1"],
    lessons: [
      "LES-0580-S2-RATES-01",
      "LES-0580-S2-QUAD-02",
      "LES-0580-S2-COORD-03"
    ],
    assessments: ["ASSESS-0580-SM2"],
    masteryRequirements: {
      minimumSkillMasteryLevel: 3,
      requiredScorePercentage: 80,
      mustClearCriticalGaps: true
    },
    remediationRules: {
      maxAttempts: 3,
      interventionType: "PRACTICE",
      triggerSeverity: "HIGH"
    },
    progressionRules: {
      requireTeacherSignoff: false,
      autoUnlockNextStage: true
    },
    optionalExtensions: ["EXT-0580-FINANCIAL-MODELING"],
    stemOpportunities: ["STEM-SPEED-DISTANCE-PHYSICS", "STEM-COMPOUND-POPULATION-GROWTH"]
  },

  // ============================================================
  // STAGE 3: ADVANCED ALGEBRA, FUNCTIONS, SEQUENCES & MENSURATION
  // ============================================================
  {
    id: "STAGE-0580-3",
    name: "Stage 3: Quadratic Formula, Algebraic Fractions, Functions & Mensuration",
    sequence: 3,
    objectives: [
      "Solve quadratic equations using the quadratic formula and completing the square.",
      "Simplify algebraic fractions and evaluate inverse/composite functions.",
      "Calculate arc lengths, sector areas, and surface areas/volumes of 3D solids."
    ],
    includedSkills: [
      "SK-NUM-BOUNDS",
      "SK-NUM-SURDS-SIMPLIFY",
      "SK-ALG-SOLVE-QUAD-FORMULA",
      "SK-ALG-ALGEBRAIC-FRACTIONS",
      "SK-ALG-SEQUENCES-NTH-TERM",
      "SK-ALG-FUNCTION-NOTATION",
      "SK-ALG-INVERSE-COMPOSITE-FUNCTIONS",
      "SK-MENS-PERIMETER-AREA-2D",
      "SK-MENS-ARCS-SECTORS",
      "SK-MENS-SURFACE-AREA-3D",
      "SK-MENS-VOLUME-3D"
    ],
    prerequisiteRequirements: ["STAGE-0580-2"],
    lessons: [
      "LES-0580-S3-SURDS-01",
      "LES-0580-S3-QUAD-FORM-02",
      "LES-0580-S3-FUNCTIONS-03",
      "LES-0580-S3-MENSURATION-04"
    ],
    assessments: ["ASSESS-0580-SM3"],
    masteryRequirements: {
      minimumSkillMasteryLevel: 3,
      requiredScorePercentage: 80,
      mustClearCriticalGaps: true
    },
    remediationRules: {
      maxAttempts: 3,
      interventionType: "RETEACH",
      triggerSeverity: "CRITICAL"
    },
    progressionRules: {
      requireTeacherSignoff: false,
      autoUnlockNextStage: true
    },
    optionalExtensions: ["EXT-0580-FIBONACCI-FRACTALS"],
    stemOpportunities: ["STEM-AEROSPACE-TANK-VOLUMES", "STEM-BALLISTICS-PARABOLAS"]
  },

  // ============================================================
  // STAGE 4: GEOMETRY, TRIGONOMETRY, VECTORS & TRANSFORMATIONS
  // ============================================================
  {
    id: "STAGE-0580-4",
    name: "Stage 4: Circle Theorems, 3D Trigonometry, Vectors & Geometric Proofs",
    sequence: 4,
    objectives: [
      "Apply circle theorems and similarity relationships to solve geometric problems.",
      "Use right-angled and non-right-angled trigonometry (Sine/Cosine rules, 3D problems).",
      "Perform vector arithmetic and prove collinearity and parallelism geometrically."
    ],
    includedSkills: [
      "SK-COORD-PARALLEL-PERPENDICULAR",
      "SK-GEOM-ANGLE-RULES",
      "SK-GEOM-POLYGON-ANGLES",
      "SK-GEOM-CIRCLE-THEOREMS-CORE",
      "SK-GEOM-CIRCLE-THEOREMS-CYCLIC",
      "SK-GEOM-SIMILAR-AREAS-VOLUMES",
      "SK-TRIG-PYTHAGORAS",
      "SK-TRIG-RIGHT-ANGLED-RATIOS",
      "SK-TRIG-BEARINGS-ELEVATION",
      "SK-TRIG-SINE-COSINE-RULE",
      "SK-TRIG-NON-RIGHT-AREA",
      "SK-TRIG-3D-PROBLEMS",
      "SK-TRANS-2D-BASIC",
      "SK-TRANS-ENLARGEMENT-NEGATIVE",
      "SK-VEC-COLUMN-VECTORS",
      "SK-VEC-GEOMETRIC-PROOFS"
    ],
    prerequisiteRequirements: ["STAGE-0580-3"],
    lessons: [
      "LES-0580-S4-CIRCLES-01",
      "LES-0580-S4-TRIG-02",
      "LES-0580-S4-VECTORS-03",
      "LES-0580-S4-TRANSFORM-04"
    ],
    assessments: ["ASSESS-0580-SM4"],
    masteryRequirements: {
      minimumSkillMasteryLevel: 3,
      requiredScorePercentage: 80,
      mustClearCriticalGaps: true
    },
    remediationRules: {
      maxAttempts: 3,
      interventionType: "RETEACH",
      triggerSeverity: "HIGH"
    },
    progressionRules: {
      requireTeacherSignoff: true, // Educator validation of geometric proofs
      autoUnlockNextStage: false
    },
    optionalExtensions: ["EXT-0580-VECTOR-ENGINEERING"],
    stemOpportunities: ["STEM-STRUCTURAL-TRUSSES", "STEM-RADAR-NAVIGATION-BEARINGS"]
  },

  // ============================================================
  // STAGE 5: PROBABILITY, STATISTICS, CALCULUS & EXAM SYNTHESIS
  // ============================================================
  {
    id: "STAGE-0580-5",
    name: "Stage 5: Probability Distributions, Statistical Analysis, Differentiation & Exam Mastery",
    sequence: 5,
    objectives: [
      "Differentiate polynomials, analyze curve turning points, and estimate rates of change.",
      "Calculate conditional probabilities and construct cumulative frequency curves/histograms.",
      "Synthesize cross-topic Cambridge IGCSE Paper 2/4 examination problems."
    ],
    includedSkills: [
      "SK-ALG-GRAPH-QUADRATIC",
      "SK-ALG-GRAPH-TANGENTS-RATES",
      "SK-ALG-DIFFERENTIATION-BASIC",
      "SK-PROB-SINGLE-EVENT",
      "SK-PROB-VENN-DIAGRAMS",
      "SK-PROB-TREE-DIAGRAMS-INDEPENDENT",
      "SK-PROB-CONDITIONAL-WITHOUT-REPLACEMENT",
      "SK-STAT-AVERAGES-DISCRETE",
      "SK-STAT-STEM-LEAF-SCATTER",
      "SK-STAT-CUMULATIVE-FREQUENCY",
      "SK-STAT-HISTOGRAMS-FREQUENCY-DENSITY"
    ],
    prerequisiteRequirements: ["STAGE-0580-4"],
    lessons: [
      "LES-0580-S5-CALCULUS-01",
      "LES-0580-S5-PROBABILITY-02",
      "LES-0580-S5-STATISTICS-03",
      "LES-0580-S5-EXAM-SYNTHESIS-04"
    ],
    assessments: [
      "ASSESS-0580-SM5",
      "ASSESS-0580-DIAGNOSTIC-GLOBAL"
    ],
    masteryRequirements: {
      minimumSkillMasteryLevel: 4, // Mastered
      requiredScorePercentage: 85,
      mustClearCriticalGaps: true
    },
    remediationRules: {
      maxAttempts: 2,
      interventionType: "TEACHER_REFERRAL",
      triggerSeverity: "CRITICAL"
    },
    progressionRules: {
      requireTeacherSignoff: true,
      autoUnlockNextStage: false
    },
    optionalExtensions: ["EXT-0580-FURTHER-PURE-MATH"],
    stemOpportunities: ["STEM-EPIDEMIOLOGY-PROBABILITY", "STEM-MAXIMA-MINIMA-OPTIMIZATION"]
  }
];
