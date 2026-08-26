import { QuestionInstance } from "../../../contracts/question-content";

export const sample0580Questions: QuestionInstance[] = [
  // ============================================================
  // SKILL: SK-PREREQ-ARITHMETIC (Arithmetic Order of Operations / BIDMAS)
  // ============================================================
  {
    id: "QI-0580-ARITH-001",
    blueprintId: "QB-0580-R-BIDMAS-01",
    skillId: "SK-PREREQ-ARITHMETIC",
    curriculumId: "cambridge-igcse-0580",
    curriculumVersion: "2025-2027",
    promptText: "Evaluate: 12 - 3 x 2",
    difficulty: 1,
    points: 1,
    answerConfig: {
      type: "MULTIPLE_CHOICE",
      choices: [
        {
          id: "A",
          text: "18",
          isCorrect: false,
          misconceptionId: "GAP-MATH-ORDER-LEFT-TO-RIGHT",
          distractorRationale: "Calculated left-to-right: (12 - 3) x 2 = 9 x 2 = 18."
        },
        {
          id: "B",
          text: "6",
          isCorrect: true,
          distractorRationale: "Correct order: multiplication first (3 x 2 = 6), then subtraction (12 - 6 = 6)."
        },
        {
          id: "C",
          text: "9",
          isCorrect: false,
          distractorRationale: "Incorrect arithmetic calculation."
        },
        {
          id: "D",
          text: "0",
          isCorrect: false,
          distractorRationale: "Incorrect order of operation calculation."
        }
      ]
    },
    explanationText: "According to BIDMAS rules, multiplication must be done before subtraction. First calculate 3 x 2 = 6. Then perform the subtraction: 12 - 6 = 6.",
    origin: "MANUAL_EDUCATOR",
    provenance: {
      generatedAt: "2025-01-20T10:00:00.000Z"
    },
    approval: {
      status: "APPROVED",
      reviewedBy: "EDU-CAMBRIDGE-LEAD",
      reviewedAt: "2025-01-22T14:30:00.000Z",
      version: 1
    }
  },
  // ============================================================
  // SKILL: SK-NUM-FRAC-ADD (Fraction Addition with Unlike Denominators)
  // ============================================================
  {
    id: "QI-0580-FRAC-001",
    blueprintId: "QB-0580-R-FRAC-01",
    skillId: "SK-NUM-FRAC-ADD",
    curriculumId: "cambridge-igcse-0580",
    curriculumVersion: "2025-2027",
    promptText: "Calculate the exact value in simplest form: 1/4 + 1/6",
    difficulty: 2,
    points: 2,
    answerConfig: {
      type: "MULTIPLE_CHOICE",
      choices: [
        {
          id: "A",
          text: "2/10",
          isCorrect: false,
          misconceptionId: "GAP-MATH-ADD-DENOM",
          distractorRationale: "Added numerators (1+1=2) and added denominators (4+6=10) without finding common base."
        },
        {
          id: "B",
          text: "5/12",
          isCorrect: true,
          distractorRationale: "Correct common denominator 12 (3/12 + 2/12 = 5/12)."
        },
        {
          id: "C",
          text: "5/24",
          isCorrect: false,
          misconceptionId: "GAP-MATH-LCM-PRODUCT",
          distractorRationale: "Multiplied denominators 4×6=24 but only adjusted one numerator."
        },
        {
          id: "D",
          text: "1/24",
          isCorrect: false,
          misconceptionId: "GAP-MATH-MULT-OP",
          distractorRationale: "Multiplied fractions (1/4 × 1/6) instead of adding."
        }
      ]
    },
    explanationText: "Find the LCM of denominators 4 and 6, which is 12. Convert to equivalent fractions: 1/4 = 3/12 and 1/6 = 2/12. Adding numerators gives 3/12 + 2/12 = 5/12.",
    origin: "MANUAL_EDUCATOR",
    provenance: {
      sourcePaper: "Cambridge 0580 Paper 2 Specimen",
      generatedAt: "2025-01-20T10:00:00.000Z"
    },
    approval: {
      status: "APPROVED",
      reviewedBy: "EDU-CAMBRIDGE-LEAD",
      reviewedAt: "2025-01-22T14:30:00.000Z",
      reviewerComments: "Verified against Cambridge 0580 Syllabus strand 1.2.",
      version: 1
    },
    tags: ["Fractions", "Core", "Paper 2"]
  },

  {
    id: "QI-0580-FRAC-002",
    blueprintId: "QB-0580-R-FRAC-01",
    skillId: "SK-NUM-FRAC-ADD",
    curriculumId: "cambridge-igcse-0580",
    curriculumVersion: "2025-2027",
    promptText: "Calculate: 2/3 + 3/5",
    difficulty: 2,
    points: 2,
    answerConfig: {
      type: "MULTIPLE_CHOICE",
      choices: [
        {
          id: "A",
          text: "5/8",
          isCorrect: false,
          misconceptionId: "GAP-MATH-ADD-DENOM",
          distractorRationale: "Added numerators (2+3=5) and denominators (3+5=8)."
        },
        {
          id: "B",
          text: "19/15",
          isCorrect: true,
          distractorRationale: "Correct: 10/15 + 9/15 = 19/15 = 1 4/15."
        },
        {
          id: "C",
          text: "6/15",
          isCorrect: false,
          misconceptionId: "GAP-MATH-MULT-OP",
          distractorRationale: "Multiplied numerators (2×3=6) with common denominator."
        },
        {
          id: "D",
          text: "15/19",
          isCorrect: false,
          misconceptionId: "GAP-MATH-NOTATION-CONFUSION",
          distractorRationale: "Inverted fraction result."
        }
      ]
    },
    explanationText: "The LCM of 3 and 5 is 15. 2/3 = 10/15 and 3/5 = 9/15. Sum = 10/15 + 9/15 = 19/15.",
    origin: "MANUAL_EDUCATOR",
    provenance: {
      generatedAt: "2025-01-20T10:00:00.000Z"
    },
    approval: {
      status: "APPROVED",
      reviewedBy: "EDU-CAMBRIDGE-LEAD",
      reviewedAt: "2025-01-22T14:30:00.000Z",
      version: 1
    },
    tags: ["Fractions", "Improper Fractions"]
  },

  // ============================================================
  // SKILL: SK-PREREQ-LCM (Least Common Multiple)
  // ============================================================
  {
    id: "QI-0580-LCM-001",
    blueprintId: "QB-0580-R-LCM-01",
    skillId: "SK-PREREQ-LCM",
    curriculumId: "cambridge-igcse-0580",
    curriculumVersion: "2025-2027",
    promptText: "What is the Lowest Common Multiple (LCM) of 6 and 8?",
    difficulty: 1,
    points: 1,
    answerConfig: {
      type: "MULTIPLE_CHOICE",
      choices: [
        {
          id: "A",
          text: "2",
          isCorrect: false,
          misconceptionId: "GAP-MATH-LCM-CONFUSED-GCD",
          distractorRationale: "Found Greatest Common Divisor (HCF=2) instead of LCM."
        },
        {
          id: "B",
          text: "24",
          isCorrect: true,
          distractorRationale: "Smallest multiple in both lists (6,12,18,24 and 8,16,24)."
        },
        {
          id: "C",
          text: "48",
          isCorrect: false,
          misconceptionId: "GAP-MATH-LCM-PRODUCT",
          distractorRationale: "Multiplied 6 × 8 = 48 directly without finding lowest common factor."
        },
        {
          id: "D",
          text: "14",
          isCorrect: false,
          misconceptionId: "GAP-MATH-ADD-DENOM",
          distractorRationale: "Added 6 + 8 = 14."
        }
      ]
    },
    explanationText: "Multiples of 6 are 6, 12, 18, 24, 30... Multiples of 8 are 8, 16, 24, 32... The lowest common multiple is 24.",
    origin: "MANUAL_EDUCATOR",
    provenance: {
      generatedAt: "2025-01-20T10:00:00.000Z"
    },
    approval: {
      status: "APPROVED",
      reviewedBy: "EDU-CAMBRIDGE-LEAD",
      reviewedAt: "2025-01-22T14:30:00.000Z",
      version: 1
    },
    tags: ["LCM", "Factors"]
  }
];
