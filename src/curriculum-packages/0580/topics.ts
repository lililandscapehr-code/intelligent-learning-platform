import { Topic } from "../../contracts/curriculum";

export const topics: Topic[] = [
  {
    id: "TOPIC-0580-1",
    name: "1. Number",
    subtopics: [
      {
        id: "SUB-0580-1-1",
        name: "Types of number, prime factors, HCF and LCM",
        skillIds: ["SK-PREREQ-ARITHMETIC", "SK-PREREQ-LCM", "SK-NUM-PRIME-FACTORS"]
      },
      {
        id: "SUB-0580-1-2",
        name: "Fractions, decimals, percentages and standard form",
        skillIds: ["SK-NUM-FRAC-ADD", "SK-NUM-PERCENTAGE-CHANGE", "SK-NUM-STANDARD-FORM"]
      },
      {
        id: "SUB-0580-1-3",
        name: "Ratio, proportion, rate and financial mathematics",
        skillIds: ["SK-NUM-RATIO-DIV", "SK-NUM-COMPOUND-INTEREST", "SK-NUM-SPEED-RATES"]
      },
      {
        id: "SUB-0580-1-4",
        name: "Surds and upper/lower bounds (Extended)",
        skillIds: ["SK-NUM-BOUNDS", "SK-NUM-SURDS-SIMPLIFY"]
      }
    ]
  },
  {
    id: "TOPIC-0580-2",
    name: "2. Algebra and Graphs",
    subtopics: [
      {
        id: "SUB-0580-2-1",
        name: "Algebraic manipulation, expansion and factorization",
        skillIds: ["SK-ALG-EXPAND-LINEAR", "SK-ALG-FACTORIZE-COMMON", "SK-ALG-QUAD-EXPAND", "SK-ALG-QUAD-FACTORIZE"]
      },
      {
        id: "SUB-0580-2-2",
        name: "Linear equations, inequalities and simultaneous equations",
        skillIds: ["SK-ALG-SOLVE-LINEAR", "SK-ALG-SIMULTANEOUS-LINEAR", "SK-ALG-LINEAR-INEQUALITIES"]
      },
      {
        id: "SUB-0580-2-3",
        name: "Quadratic equations and algebraic fractions",
        skillIds: ["SK-ALG-SOLVE-QUAD-FORMULA", "SK-ALG-ALGEBRAIC-FRACTIONS"]
      },
      {
        id: "SUB-0580-2-4",
        name: "Functions and sequences",
        skillIds: ["SK-ALG-SEQUENCES-NTH-TERM", "SK-ALG-FUNCTION-NOTATION", "SK-ALG-INVERSE-COMPOSITE-FUNCTIONS"]
      },
      {
        id: "SUB-0580-2-5",
        name: "Linear, quadratic, reciprocal and exponential graphs",
        skillIds: ["SK-ALG-GRAPH-QUADRATIC", "SK-ALG-GRAPH-TANGENTS-RATES", "SK-ALG-DIFFERENTIATION-BASIC"]
      }
    ]
  },
  {
    id: "TOPIC-0580-3",
    name: "3. Coordinate Geometry",
    subtopics: [
      {
        id: "SUB-0580-3-1",
        name: "Straight-line graphs, gradient, midpoint and length",
        skillIds: ["SK-COORD-GRADIENT-MIDPOINT", "SK-COORD-LINE-EQUATION", "SK-COORD-PARALLEL-PERPENDICULAR"]
      }
    ]
  },
  {
    id: "TOPIC-0580-4",
    name: "4. Geometry",
    subtopics: [
      {
        id: "SUB-0580-4-1",
        name: "Geometrical terms, angles, polygons and symmetry",
        skillIds: ["SK-GEOM-ANGLE-RULES", "SK-GEOM-POLYGON-ANGLES"]
      },
      {
        id: "SUB-0580-4-2",
        name: "Circle theorems and angle properties of circles (Extended)",
        skillIds: ["SK-GEOM-CIRCLE-THEOREMS-CORE", "SK-GEOM-CIRCLE-THEOREMS-CYCLIC"]
      },
      {
        id: "SUB-0580-4-3",
        name: "Similarity and congruence",
        skillIds: ["SK-GEOM-SIMILAR-AREAS-VOLUMES"]
      }
    ]
  },
  {
    id: "TOPIC-0580-5",
    name: "5. Mensuration",
    subtopics: [
      {
        id: "SUB-0580-5-1",
        name: "Perimeter, area of 2D shapes, and arc length/sector area",
        skillIds: ["SK-MENS-PERIMETER-AREA-2D", "SK-MENS-ARCS-SECTORS"]
      },
      {
        id: "SUB-0580-5-2",
        name: "Surface area and volume of 3D solids (prisms, cylinders, cones, spheres)",
        skillIds: ["SK-MENS-SURFACE-AREA-3D", "SK-MENS-VOLUME-3D"]
      }
    ]
  },
  {
    id: "TOPIC-0580-6",
    name: "6. Trigonometry",
    subtopics: [
      {
        id: "SUB-0580-6-1",
        name: "Pythagoras' theorem and right-angled trigonometry (SOH CAH TOA)",
        skillIds: ["SK-TRIG-PYTHAGORAS", "SK-TRIG-RIGHT-ANGLED-RATIOS", "SK-TRIG-BEARINGS-ELEVATION"]
      },
      {
        id: "SUB-0580-6-2",
        name: "Sine rule, cosine rule, and 3D trigonometry (Extended)",
        skillIds: ["SK-TRIG-SINE-COSINE-RULE", "SK-TRIG-NON-RIGHT-AREA", "SK-TRIG-3D-PROBLEMS"]
      }
    ]
  },
  {
    id: "TOPIC-0580-7",
    name: "7. Transformations and Vectors",
    subtopics: [
      {
        id: "SUB-0580-7-1",
        name: "Transformations: translation, reflection, rotation, enlargement",
        skillIds: ["SK-TRANS-2D-BASIC", "SK-TRANS-ENLARGEMENT-NEGATIVE"]
      },
      {
        id: "SUB-0580-7-2",
        name: "Vectors in two dimensions and geometric vector proofs",
        skillIds: ["SK-VEC-COLUMN-VECTORS", "SK-VEC-GEOMETRIC-PROOFS"]
      }
    ]
  },
  {
    id: "TOPIC-0580-8",
    name: "8. Probability",
    subtopics: [
      {
        id: "SUB-0580-8-1",
        name: "Basic probability, relative frequency, and Venn diagrams",
        skillIds: ["SK-PROB-SINGLE-EVENT", "SK-PROB-VENN-DIAGRAMS"]
      },
      {
        id: "SUB-0580-8-2",
        name: "Combined events, tree diagrams, and conditional probability",
        skillIds: ["SK-PROB-TREE-DIAGRAMS-INDEPENDENT", "SK-PROB-CONDITIONAL-WITHOUT-REPLACEMENT"]
      }
    ]
  },
  {
    id: "TOPIC-0580-9",
    name: "9. Statistics",
    subtopics: [
      {
        id: "SUB-0580-9-1",
        name: "Statistical charts, stem-and-leaf, mean, median, mode, range",
        skillIds: ["SK-STAT-AVERAGES-DISCRETE", "SK-STAT-STEM-LEAF-SCATTER"]
      },
      {
        id: "SUB-0580-9-2",
        name: "Cumulative frequency, quartiles, box-plots, and histograms",
        skillIds: ["SK-STAT-CUMULATIVE-FREQUENCY", "SK-STAT-HISTOGRAMS-FREQUENCY-DENSITY"]
      }
    ]
  }
];
