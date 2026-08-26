import { Skill } from "../../contracts/curriculum";

export const skills: Skill[] = [
  // ============================================================
  // TOPIC 1: NUMBER (Core & Extended)
  // ============================================================
  {
    id: "SK-PREREQ-ARITHMETIC",
    name: "Fundamental Integer Operations & Order of Operations (BIDMAS)",
    learningObjectives: [
      "Add, subtract, multiply and divide positive and negative integers with fluency.",
      "Apply BIDMAS order of operations correctly."
    ],
    relations: [],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 30000, slowThreshold: 60000 }
  },
  {
    id: "SK-PREREQ-LCM",
    name: "Multiples, Factors, HCF and LCM Calculation",
    learningObjectives: [
      "Find the Highest Common Factor (HCF) and Lowest Common Multiple (LCM) of two or three numbers."
    ],
    relations: [
      { targetSkillId: "SK-PREREQ-ARITHMETIC", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 45000, slowThreshold: 90000 }
  },
  {
    id: "SK-NUM-PRIME-FACTORS",
    name: "Prime Factorization & Index Notation",
    learningObjectives: [
      "Express integers as products of prime factors in index form.",
      "Use prime factor trees to deduce HCF, LCM, and square/cube roots."
    ],
    relations: [
      { targetSkillId: "SK-PREREQ-LCM", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 60000, slowThreshold: 120000 }
  },
  {
    id: "SK-NUM-FRAC-ADD",
    name: "Fraction Arithmetic with Mixed Numbers & Unlike Denominators",
    learningObjectives: [
      "Calculate addition, subtraction, multiplication and division of proper, improper and mixed fractions."
    ],
    relations: [
      { targetSkillId: "SK-PREREQ-LCM", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 60000, slowThreshold: 120000 }
  },
  {
    id: "SK-NUM-PERCENTAGE-CHANGE",
    name: "Percentage Increase, Decrease & Reverse Percentages",
    learningObjectives: [
      "Calculate percentage profit, loss, discount and original values before percentage change."
    ],
    relations: [
      { targetSkillId: "SK-NUM-FRAC-ADD", relationType: "REINFORCES" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 60000, slowThreshold: 120000 }
  },
  {
    id: "SK-NUM-STANDARD-FORM",
    name: "Scientific Notation & Standard Form Operations",
    learningObjectives: [
      "Convert numbers into and out of standard form A × 10^n where 1 ≤ A < 10 and n is an integer.",
      "Perform arithmetic operations on numbers in standard form."
    ],
    relations: [
      { targetSkillId: "SK-PREREQ-ARITHMETIC", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 45000, slowThreshold: 90000 }
  },
  {
    id: "SK-NUM-RATIO-DIV",
    name: "Ratio Division & Direct/Inverse Proportion",
    learningObjectives: [
      "Divide quantities into given ratios.",
      "Solve direct and inverse proportional reasoning problems."
    ],
    relations: [
      { targetSkillId: "SK-NUM-FRAC-ADD", relationType: "REINFORCES" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 60000, slowThreshold: 120000 }
  },
  {
    id: "SK-NUM-COMPOUND-INTEREST",
    name: "Compound Interest & Exponential Growth/Decay",
    learningObjectives: [
      "Calculate compound interest, depreciation and population growth using formula A = P(1 + r/100)^n."
    ],
    relations: [
      { targetSkillId: "SK-NUM-PERCENTAGE-CHANGE", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 75000, slowThreshold: 150000 }
  },
  {
    id: "SK-NUM-SPEED-RATES",
    name: "Speed, Distance, Time & Density/Pressure Compound Rates",
    learningObjectives: [
      "Convert between compound units (e.g. km/h to m/s, g/cm³ to kg/m³).",
      "Calculate average speed for multi-part journeys."
    ],
    relations: [
      { targetSkillId: "SK-NUM-RATIO-DIV", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 60000, slowThreshold: 120000 }
  },
  {
    id: "SK-NUM-BOUNDS",
    name: "Upper and Lower Bounds & Error Propagation (Extended)",
    learningObjectives: [
      "Determine upper and lower limits of accuracy for rounded data.",
      "Calculate maximum and minimum bounds in compound formula calculations."
    ],
    relations: [
      { targetSkillId: "SK-NUM-SPEED-RATES", relationType: "REINFORCES" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 90000, slowThreshold: 180000 }
  },
  {
    id: "SK-NUM-SURDS-SIMPLIFY",
    name: "Surds Simplification & Rationalising Denominators (Extended)",
    learningObjectives: [
      "Simplify square root surds and expand brackets involving radical expressions.",
      "Rationalise fractional denominators of form a / (b + √c)."
    ],
    relations: [
      { targetSkillId: "SK-NUM-PRIME-FACTORS", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 90000, slowThreshold: 180000 }
  },

  // ============================================================
  // TOPIC 2: ALGEBRA AND GRAPHS
  // ============================================================
  {
    id: "SK-ALG-EXPAND-LINEAR",
    name: "Expanding Single Brackets & Collecting Like Terms",
    learningObjectives: [
      "Expand single brackets with signs and variables.",
      "Simplify expressions by collecting like terms."
    ],
    relations: [
      { targetSkillId: "SK-PREREQ-ARITHMETIC", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 45000, slowThreshold: 90000 }
  },
  {
    id: "SK-ALG-FACTORIZE-COMMON",
    name: "Single-Bracket Factorization by Common Factors",
    learningObjectives: [
      "Factorize algebraic expressions by extracting highest numerical and algebraic common factors."
    ],
    relations: [
      { targetSkillId: "SK-ALG-EXPAND-LINEAR", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 45000, slowThreshold: 90000 }
  },
  {
    id: "SK-ALG-SOLVE-LINEAR",
    name: "Solving Linear Equations with Variables on Both Sides",
    learningObjectives: [
      "Solve linear equations including brackets and fractional coefficients."
    ],
    relations: [
      { targetSkillId: "SK-ALG-EXPAND-LINEAR", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 60000, slowThreshold: 120000 }
  },
  {
    id: "SK-ALG-QUAD-EXPAND",
    name: "Expanding Double Brackets (FOIL / Binomials)",
    learningObjectives: [
      "Expand products of two linear binomial brackets (ax + b)(cx + d).",
      "Expand perfect squares (ax + b)²."
    ],
    relations: [
      { targetSkillId: "SK-ALG-EXPAND-LINEAR", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 60000, slowThreshold: 120000 }
  },
  {
    id: "SK-ALG-QUAD-FACTORIZE",
    name: "Factorizing Trinomial Quadratics & Difference of Two Squares",
    learningObjectives: [
      "Factorize quadratics of form x² + bx + c and ax² + bx + c.",
      "Factorize difference of two squares a² - b²."
    ],
    relations: [
      { targetSkillId: "SK-ALG-QUAD-EXPAND", relationType: "PREREQUISITE" },
      { targetSkillId: "SK-ALG-FACTORIZE-COMMON", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 75000, slowThreshold: 150000 }
  },
  {
    id: "SK-ALG-SIMULTANEOUS-LINEAR",
    name: "Simultaneous Linear Equations by Elimination & Substitution",
    learningObjectives: [
      "Solve systems of two linear simultaneous equations in two variables."
    ],
    relations: [
      { targetSkillId: "SK-ALG-SOLVE-LINEAR", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 90000, slowThreshold: 180000 }
  },
  {
    id: "SK-ALG-LINEAR-INEQUALITIES",
    name: "Linear Inequalities & Number Line / Region Representations",
    learningObjectives: [
      "Solve linear inequalities in one variable and represent solutions on number lines.",
      "Identify graphical regions defined by inequalities in two variables."
    ],
    relations: [
      { targetSkillId: "SK-ALG-SOLVE-LINEAR", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 75000, slowThreshold: 150000 }
  },
  {
    id: "SK-ALG-SOLVE-QUAD-FORMULA",
    name: "Solving Quadratic Equations by Factorization, Formula & Completing the Square",
    learningObjectives: [
      "Solve ax² + bx + c = 0 using the quadratic formula x = (-b ± √(b² - 4ac)) / (2a).",
      "Solve by completing the square."
    ],
    relations: [
      { targetSkillId: "SK-ALG-QUAD-FACTORIZE", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 90000, slowThreshold: 180000 }
  },
  {
    id: "SK-ALG-ALGEBRAIC-FRACTIONS",
    name: "Algebraic Fractions Simplification & Equations (Extended)",
    learningObjectives: [
      "Simplify algebraic fractions by factorizing numerator and denominator.",
      "Solve equations with algebraic fractions."
    ],
    relations: [
      { targetSkillId: "SK-ALG-QUAD-FACTORIZE", relationType: "PREREQUISITE" },
      { targetSkillId: "SK-NUM-FRAC-ADD", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 100000, slowThreshold: 200000 }
  },
  {
    id: "SK-ALG-SEQUENCES-NTH-TERM",
    name: "Linear, Quadratic & Geometric Sequences (nth Term)",
    learningObjectives: [
      "Find the nth term of linear arithmetic sequences an + b.",
      "Find the nth term of quadratic sequences an² + bn + c and simple cubic/geometric sequences."
    ],
    relations: [
      { targetSkillId: "SK-ALG-SOLVE-LINEAR", relationType: "REINFORCES" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 75000, slowThreshold: 150000 }
  },
  {
    id: "SK-ALG-FUNCTION-NOTATION",
    name: "Function Notation & Evaluation",
    learningObjectives: [
      "Understand f(x) notation and evaluate functions for given domain values."
    ],
    relations: [
      { targetSkillId: "SK-ALG-EXPAND-LINEAR", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 45000, slowThreshold: 90000 }
  },
  {
    id: "SK-ALG-INVERSE-COMPOSITE-FUNCTIONS",
    name: "Composite & Inverse Functions fg(x) and f⁻¹(x) (Extended)",
    learningObjectives: [
      "Form and evaluate composite functions fg(x).",
      "Derive inverse functions f⁻¹(x)."
    ],
    relations: [
      { targetSkillId: "SK-ALG-FUNCTION-NOTATION", relationType: "PREREQUISITE" },
      { targetSkillId: "SK-ALG-SOLVE-LINEAR", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 90000, slowThreshold: 180000 }
  },
  {
    id: "SK-ALG-GRAPH-QUADRATIC",
    name: "Plotting and Interpreting Quadratic & Reciprocal Curves",
    learningObjectives: [
      "Construct tables of values and draw quadratic, cubic and reciprocal graphs y = k/x.",
      "Estimate roots and turning points from graphs."
    ],
    relations: [
      { targetSkillId: "SK-ALG-QUAD-EXPAND", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 90000, slowThreshold: 180000 }
  },
  {
    id: "SK-ALG-GRAPH-TANGENTS-RATES",
    name: "Estimating Gradients by Drawing Tangents (Extended)",
    learningObjectives: [
      "Draw tangents to curves to estimate instantaneous rate of change.",
      "Estimate distance from speed-time graphs using area under curves."
    ],
    relations: [
      { targetSkillId: "SK-ALG-GRAPH-QUADRATIC", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 100000, slowThreshold: 200000 }
  },
  {
    id: "SK-ALG-DIFFERENTIATION-BASIC",
    name: "Basic Differentiation of Polynomials dy/dx = ax^(n-1) (Extended)",
    learningObjectives: [
      "Differentiate powers of x: d/dx(ax^n) = anx^(n-1).",
      "Find stationary points / turning points and determine their nature."
    ],
    relations: [
      { targetSkillId: "SK-ALG-GRAPH-TANGENTS-RATES", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 100000, slowThreshold: 200000 }
  },

  // ============================================================
  // TOPIC 3: COORDINATE GEOMETRY
  // ============================================================
  {
    id: "SK-COORD-GRADIENT-MIDPOINT",
    name: "Gradient, Midpoint and Distance between Two Points",
    learningObjectives: [
      "Calculate gradient m = (y2 - y1) / (x2 - x1).",
      "Find midpoints ((x1+x2)/2, (y1+y2)/2) and segment lengths using Pythagoras."
    ],
    relations: [
      { targetSkillId: "SK-PREREQ-ARITHMETIC", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 60000, slowThreshold: 120000 }
  },
  {
    id: "SK-COORD-LINE-EQUATION",
    name: "Equation of a Straight Line y = mx + c",
    learningObjectives: [
      "Find the equation of a straight line given gradient and a point, or two points."
    ],
    relations: [
      { targetSkillId: "SK-COORD-GRADIENT-MIDPOINT", relationType: "PREREQUISITE" },
      { targetSkillId: "SK-ALG-SOLVE-LINEAR", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 75000, slowThreshold: 150000 }
  },
  {
    id: "SK-COORD-PARALLEL-PERPENDICULAR",
    name: "Parallel & Perpendicular Line Gradients (m1 × m2 = -1) (Extended)",
    learningObjectives: [
      "Find equations of lines parallel and perpendicular to given linear equations."
    ],
    relations: [
      { targetSkillId: "SK-COORD-LINE-EQUATION", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 90000, slowThreshold: 180000 }
  },

  // ============================================================
  // TOPIC 4: GEOMETRY
  // ============================================================
  {
    id: "SK-GEOM-ANGLE-RULES",
    name: "Angles on Lines, Vertically Opposite, and Parallel Lines (Alternate/Corresponding)",
    learningObjectives: [
      "Apply angle relationships to deduce unknown angles with geometric justification."
    ],
    relations: [
      { targetSkillId: "SK-PREREQ-ARITHMETIC", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 60000, slowThreshold: 120000 }
  },
  {
    id: "SK-GEOM-POLYGON-ANGLES",
    name: "Interior and Exterior Angles of Regular & Irregular Polygons",
    learningObjectives: [
      "Calculate interior and exterior angle sums of n-sided polygons using (n-2) × 180°."
    ],
    relations: [
      { targetSkillId: "SK-GEOM-ANGLE-RULES", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 60000, slowThreshold: 120000 }
  },
  {
    id: "SK-GEOM-CIRCLE-THEOREMS-CORE",
    name: "Circle Theorems: Angle at Centre, Semicircle, and Tangent-Radius",
    learningObjectives: [
      "Apply angle in a semicircle = 90° and angle at centre = 2 × angle at circumference.",
      "Apply tangent is perpendicular to radius at point of contact."
    ],
    relations: [
      { targetSkillId: "SK-GEOM-ANGLE-RULES", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 90000, slowThreshold: 180000 }
  },
  {
    id: "SK-GEOM-CIRCLE-THEOREMS-CYCLIC",
    name: "Circle Theorems: Cyclic Quadrilaterals & Alternate Segment Theorem (Extended)",
    learningObjectives: [
      "Apply opposite angles of cyclic quadrilateral sum to 180°.",
      "Apply angles in the same segment are equal and alternate segment theorem."
    ],
    relations: [
      { targetSkillId: "SK-GEOM-CIRCLE-THEOREMS-CORE", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 90000, slowThreshold: 180000 }
  },
  {
    id: "SK-GEOM-SIMILAR-AREAS-VOLUMES",
    name: "Length, Area, and Volume Scale Factors of Similar Shapes (Extended)",
    learningObjectives: [
      "Solve problems using scale factor k, area factor k², and volume factor k³ for similar shapes."
    ],
    relations: [
      { targetSkillId: "SK-NUM-RATIO-DIV", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 90000, slowThreshold: 180000 }
  },

  // ============================================================
  // TOPIC 5: MENSURATION
  // ============================================================
  {
    id: "SK-MENS-PERIMETER-AREA-2D",
    name: "Perimeter & Area of Triangles, Parallelograms, Trapeziums & Circles",
    learningObjectives: [
      "Calculate perimeter and area of compound 2D geometric shapes."
    ],
    relations: [
      { targetSkillId: "SK-PREREQ-ARITHMETIC", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 60000, slowThreshold: 120000 }
  },
  {
    id: "SK-MENS-ARCS-SECTORS",
    name: "Arc Length and Sector Area of Circles",
    learningObjectives: [
      "Calculate arc length (θ/360 × 2πr) and sector area (θ/360 × πr²)."
    ],
    relations: [
      { targetSkillId: "SK-MENS-PERIMETER-AREA-2D", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 75000, slowThreshold: 150000 }
  },
  {
    id: "SK-MENS-SURFACE-AREA-3D",
    name: "Total Surface Area of Prisms, Cylinders, Cones and Spheres",
    learningObjectives: [
      "Calculate curved and total surface area of cylinders, cones, and spheres using formula sheet."
    ],
    relations: [
      { targetSkillId: "SK-MENS-PERIMETER-AREA-2D", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 90000, slowThreshold: 180000 }
  },
  {
    id: "SK-MENS-VOLUME-3D",
    name: "Volume of Prisms, Cylinders, Pyramids, Cones and Spheres",
    learningObjectives: [
      "Calculate volumes of standard and composite 3D solids."
    ],
    relations: [
      { targetSkillId: "SK-MENS-PERIMETER-AREA-2D", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 90000, slowThreshold: 180000 }
  },

  // ============================================================
  // TOPIC 6: TRIGONOMETRY
  // ============================================================
  {
    id: "SK-TRIG-PYTHAGORAS",
    name: "Pythagoras' Theorem in 2D",
    learningObjectives: [
      "Calculate hypotenuse and shorter sides in right-angled triangles using a² + b² = c²."
    ],
    relations: [
      { targetSkillId: "SK-PREREQ-ARITHMETIC", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 45000, slowThreshold: 90000 }
  },
  {
    id: "SK-TRIG-RIGHT-ANGLED-RATIOS",
    name: "Right-Angled Trigonometry (Sine, Cosine, Tangent Ratios)",
    learningObjectives: [
      "Apply sin θ, cos θ, tan θ to find unknown sides and angles in right-angled triangles."
    ],
    relations: [
      { targetSkillId: "SK-TRIG-PYTHAGORAS", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 60000, slowThreshold: 120000 }
  },
  {
    id: "SK-TRIG-BEARINGS-ELEVATION",
    name: "Angles of Elevation/Depression and Three-Figure Bearings",
    learningObjectives: [
      "Solve practical navigational problems using 3-figure bearings (000° to 360°) and trigonometry."
    ],
    relations: [
      { targetSkillId: "SK-TRIG-RIGHT-ANGLED-RATIOS", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 75000, slowThreshold: 150000 }
  },
  {
    id: "SK-TRIG-SINE-COSINE-RULE",
    name: "Sine Rule and Cosine Rule for Non-Right-Angled Triangles (Extended)",
    learningObjectives: [
      "Apply a / sin A = b / sin B to find sides and angles.",
      "Apply c² = a² + b² - 2ab cos C and cos C = (a² + b² - c²) / (2ab)."
    ],
    relations: [
      { targetSkillId: "SK-TRIG-RIGHT-ANGLED-RATIOS", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 100000, slowThreshold: 200000 }
  },
  {
    id: "SK-TRIG-NON-RIGHT-AREA",
    name: "Area of Non-Right-Angled Triangle Area = 1/2 ab sin C (Extended)",
    learningObjectives: [
      "Calculate area of any triangle using Area = 1/2 ab sin C."
    ],
    relations: [
      { targetSkillId: "SK-TRIG-SINE-COSINE-RULE", relationType: "REINFORCES" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 60000, slowThreshold: 120000 }
  },
  {
    id: "SK-TRIG-3D-PROBLEMS",
    name: "Three-Dimensional Trigonometry & Pythagoras in Cuboids/Pyramids (Extended)",
    learningObjectives: [
      "Calculate angles between lines and planes in 3D geometric solids."
    ],
    relations: [
      { targetSkillId: "SK-TRIG-SINE-COSINE-RULE", relationType: "PREREQUISITE" },
      { targetSkillId: "SK-MENS-VOLUME-3D", relationType: "REINFORCES" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 120000, slowThreshold: 240000 }
  },

  // ============================================================
  // TOPIC 7: TRANSFORMATIONS AND VECTORS
  // ============================================================
  {
    id: "SK-TRANS-2D-BASIC",
    name: "2D Transformations: Translation, Reflection, Rotation, Enlargement",
    learningObjectives: [
      "Describe and perform 2D translations by column vector, reflections in lines y = ±x or x = k, rotations about center, and enlargements with positive scale factor."
    ],
    relations: [
      { targetSkillId: "SK-COORD-LINE-EQUATION", relationType: "REINFORCES" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 75000, slowThreshold: 150000 }
  },
  {
    id: "SK-TRANS-ENLARGEMENT-NEGATIVE",
    name: "Enlargements with Fractional & Negative Scale Factors (Extended)",
    learningObjectives: [
      "Perform and describe negative and fractional center-based enlargements."
    ],
    relations: [
      { targetSkillId: "SK-TRANS-2D-BASIC", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 90000, slowThreshold: 180000 }
  },
  {
    id: "SK-VEC-COLUMN-VECTORS",
    name: "Vector Addition, Scalar Multiplication and Magnitude",
    learningObjectives: [
      "Add, subtract, and multiply 2D column vectors by scalars.",
      "Calculate magnitude |v| = √(x² + y²)."
    ],
    relations: [
      { targetSkillId: "SK-TRIG-PYTHAGORAS", relationType: "REINFORCES" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 60000, slowThreshold: 120000 }
  },
  {
    id: "SK-VEC-GEOMETRIC-PROOFS",
    name: "Vector Geometry Proofs for Collinear Points & Parallel Segments (Extended)",
    learningObjectives: [
      "Express geometric paths in terms of vectors a and b.",
      "Prove points are collinear and line segments are parallel using scalar multiples."
    ],
    relations: [
      { targetSkillId: "SK-VEC-COLUMN-VECTORS", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 120000, slowThreshold: 240000 }
  },

  // ============================================================
  // TOPIC 8: PROBABILITY
  // ============================================================
  {
    id: "SK-PROB-SINGLE-EVENT",
    name: "Single Event Probability & Relative Frequency",
    learningObjectives: [
      "Calculate theoretical probability P(A) = favorable / total.",
      "Estimate probabilities from relative frequency experimental trials."
    ],
    relations: [
      { targetSkillId: "SK-NUM-FRAC-ADD", relationType: "REINFORCES" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 45000, slowThreshold: 90000 }
  },
  {
    id: "SK-PROB-VENN-DIAGRAMS",
    name: "Set Notation, Universal Sets & Venn Diagram Probabilities",
    learningObjectives: [
      "Use set notation (A ∩ B, A ∪ B, A', n(A)).",
      "Calculate probabilities from 2-set and 3-set Venn diagrams."
    ],
    relations: [
      { targetSkillId: "SK-PROB-SINGLE-EVENT", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 60000, slowThreshold: 120000 }
  },
  {
    id: "SK-PROB-TREE-DIAGRAMS-INDEPENDENT",
    name: "Probability Tree Diagrams for Independent Events (With Replacement)",
    learningObjectives: [
      "Construct tree diagrams and multiply branch probabilities for independent consecutive events."
    ],
    relations: [
      { targetSkillId: "SK-PROB-SINGLE-EVENT", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 75000, slowThreshold: 150000 }
  },
  {
    id: "SK-PROB-CONDITIONAL-WITHOUT-REPLACEMENT",
    name: "Conditional Probability & Combined Events Without Replacement (Extended)",
    learningObjectives: [
      "Calculate probabilities of successive dependent events where sample space decreases."
    ],
    relations: [
      { targetSkillId: "SK-PROB-TREE-DIAGRAMS-INDEPENDENT", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 90000, slowThreshold: 180000 }
  },

  // ============================================================
  // TOPIC 9: STATISTICS
  // ============================================================
  {
    id: "SK-STAT-AVERAGES-DISCRETE",
    name: "Mean, Median, Mode and Range for Discrete & Frequency Table Data",
    learningObjectives: [
      "Calculate mean, median, mode and range from raw lists and discrete frequency tables."
    ],
    relations: [
      { targetSkillId: "SK-PREREQ-ARITHMETIC", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 60000, slowThreshold: 120000 }
  },
  {
    id: "SK-STAT-STEM-LEAF-SCATTER",
    name: "Stem-and-Leaf Diagrams, Scatter Graphs & Correlation",
    learningObjectives: [
      "Construct stem-and-leaf diagrams with keys.",
      "Draw lines of best fit on scatter plots and identify positive, negative or zero correlation."
    ],
    relations: [
      { targetSkillId: "SK-STAT-AVERAGES-DISCRETE", relationType: "REINFORCES" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 60000, slowThreshold: 120000 }
  },
  {
    id: "SK-STAT-CUMULATIVE-FREQUENCY",
    name: "Cumulative Frequency Curves, Median, Quartiles and Interquartile Range (Extended)",
    learningObjectives: [
      "Plot cumulative frequency curves and estimate median, lower quartile Q1, upper quartile Q3, and IQR."
    ],
    relations: [
      { targetSkillId: "SK-STAT-AVERAGES-DISCRETE", relationType: "PREREQUISITE" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 90000, slowThreshold: 180000 }
  },
  {
    id: "SK-STAT-HISTOGRAMS-FREQUENCY-DENSITY",
    name: "Histograms with Unequal Class Widths & Frequency Density (Extended)",
    learningObjectives: [
      "Calculate frequency density = frequency / class width.",
      "Construct and interpret histograms where area represents frequency."
    ],
    relations: [
      { targetSkillId: "SK-STAT-CUMULATIVE-FREQUENCY", relationType: "REINFORCES" }
    ],
    timingExpectation: { trackingType: "SESSION_MS", expectedDuration: 90000, slowThreshold: 180000 }
  }
];
