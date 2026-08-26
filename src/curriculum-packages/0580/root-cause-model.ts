import { RootCauseModel } from "../../contracts/curriculum";

export const rootCauseModel: RootCauseModel = {
  rules: [
    {
      rootCauseId: "ROOT-LCM-MISSED",
      description: "Student lacks foundational understanding of multiples vs divisors, defaulting to multiplying denominators.",
      triggerGapIds: ["GAP-MATH-ADD-DENOM", "GAP-MATH-LCM-CONFUSED-GCD", "GAP-MATH-LCM-PRODUCT"],
      requiredEvidenceCount: 1,
      verificationMethod: "PREREQUISITE_LCM_DRILL"
    },
    {
      rootCauseId: "ROOT-NEGATIVE-SIGNS-ALGEBRA",
      description: "Student fails to distribute negative signs across multiple bracket terms in algebraic expansions.",
      triggerGapIds: ["GAP-MATH-SIGN-EXPANSION", "GAP-MATH-QUAD-SIGN-ERROR"],
      requiredEvidenceCount: 2,
      verificationMethod: "TARGETED_SIGN_EXPANSION_QUIZ"
    },
    {
      rootCauseId: "ROOT-SOHCAHTOA-OPPOSITE-ADJACENT",
      description: "Student inverts opposite and adjacent sides relative to the reference angle in right-angled triangles.",
      triggerGapIds: ["GAP-MATH-TRIG-RATIO-INVERT"],
      requiredEvidenceCount: 1,
      verificationMethod: "TRIANGLE_ORIENTATION_LABELING_TASK"
    },
    {
      rootCauseId: "ROOT-PROBABILITY-DEPENDENT-EVENT-SAMPLE-SPACE",
      description: "Student keeps the sample space denominator constant in consecutive trials when items are drawn without replacement.",
      triggerGapIds: ["GAP-MATH-PROB-WITHOUT-REPLACE-DENOM"],
      requiredEvidenceCount: 1,
      verificationMethod: "TREE_DIAGRAM_BRANCH_VERIFICATION"
    }
  ]
};
