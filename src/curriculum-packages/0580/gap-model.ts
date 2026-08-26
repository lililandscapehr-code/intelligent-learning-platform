import { GapModel } from "../../contracts/curriculum";

export const gapModel: GapModel = {
  categories: [
    "CONCEPTUAL",
    "PROCEDURAL",
    "PREREQUISITE",
    "FLUENCY",
    "APPLICATION",
    "NOTATION_CONFUSION"
  ],
  severities: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
  confidenceLevels: ["LOW", "MEDIUM", "HIGH"],
  rules: [
    {
      gapId: "GAP-MATH-ADD-DENOM",
      classification: "PREREQUISITE",
      severity: "HIGH",
      confidenceThreshold: 0.7
    },
    {
      gapId: "GAP-MATH-LCM-CONFUSED-GCD",
      classification: "CONCEPTUAL",
      severity: "MEDIUM",
      confidenceThreshold: 0.7
    },
    {
      gapId: "GAP-MATH-LCM-PRODUCT",
      classification: "PROCEDURAL",
      severity: "LOW",
      confidenceThreshold: 0.6
    },
    {
      gapId: "GAP-MATH-MULT-OP",
      classification: "CONCEPTUAL",
      severity: "HIGH",
      confidenceThreshold: 0.8
    },
    {
      gapId: "GAP-MATH-SIGN-EXPANSION",
      classification: "PROCEDURAL",
      severity: "MEDIUM",
      confidenceThreshold: 0.7
    },
    {
      gapId: "GAP-MATH-QUAD-SIGN-ERROR",
      classification: "PROCEDURAL",
      severity: "HIGH",
      confidenceThreshold: 0.75
    },
    {
      gapId: "GAP-MATH-TRIG-RATIO-INVERT",
      classification: "CONCEPTUAL",
      severity: "HIGH",
      confidenceThreshold: 0.8
    },
    {
      gapId: "GAP-MATH-PROB-WITHOUT-REPLACE-DENOM",
      classification: "CONCEPTUAL",
      severity: "CRITICAL",
      confidenceThreshold: 0.85
    }
  ]
};
