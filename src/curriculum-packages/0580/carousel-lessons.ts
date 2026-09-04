import { EduCarouselConfig } from "../../components/carousel/CarouselTypes";

export const sampleLessonCarousels: Record<string, EduCarouselConfig> = {
  "SK-PREREQ-LCM": {
    id: "CAROUSEL-LCM-01",
    title: "Mastering Least Common Multiples (LCM)",
    skillId: "SK-PREREQ-LCM",
    blueprintId: "QB-LCM-01",
    showProgressBar: true,
    showScoreTally: true,
    slides: [
      {
        id: "lcm-s1-lesson",
        type: "lesson_text",
        title: "Understanding Least Common Multiple (LCM)",
        learningObjective: "Find the smallest positive integer that is divisible by both numbers.",
        body: "The **Least Common Multiple** (LCM) of two integers is the smallest positive integer that is a multiple of both.\n\nTo find the LCM of 4 and 6:\n1. List multiples of 4: 4, 8, **12**, 16, 20, 24...\n2. List multiples of 6: 6, **12**, 18, 24...\n3. The smallest common multiple is **12**.\n\nDo not confuse **LCM** with **GCD** (Greatest Common Divisor, which would be 2).",
        keyTerms: ["Least Common Multiple", "LCM", "Multiples", "GCD", "Divisor"]
      },
      {
        id: "lcm-s2-video",
        type: "youtube",
        title: "Video Explanation: Finding LCM Fast",
        subtitle: "Prime Factorization Method for Cambridge 0580",
        youtubeUrl: "https://www.youtube.com/watch?v=3W8At84-Fw8",
        caption: "Cambridge 0580 Core Skill"
      },
      {
        id: "lcm-s3-question",
        type: "question_mcq",
        questionText: "What is the Least Common Multiple (LCM) of 4 and 6?",
        points: 2,
        skillId: "SK-PREREQ-LCM",
        choices: [
          { id: "A", text: "2 (Greatest Common Divisor)", isCorrect: false, misconceptionId: "GAP-MATH-LCM-CONFUSED-GCD", explanation: "Incorrect. 2 is the greatest common divisor (GCD/HCF), not the least common multiple." },
          { id: "B", text: "12 (Smallest common multiple)", isCorrect: true, explanation: "Correct! The multiples of 4 are 4, 8, 12, 16... and multiples of 6 are 6, 12, 18... The least common multiple is 12." },
          { id: "C", text: "24 (Product of 4 × 6)", isCorrect: false, misconceptionId: "GAP-MATH-LCM-PRODUCT", explanation: "Incorrect. 24 is a common multiple, but not the LEAST common multiple because 12 is smaller." },
          { id: "D", text: "10 (Sum of 4 + 6)", isCorrect: false, misconceptionId: "GAP-MATH-LCM-SUM", explanation: "Incorrect. 10 is the sum of 4 + 6, not a multiple of either number." }
        ]
      },
      {
        id: "lcm-s4-eval",
        type: "evaluation",
        questionRef: "lcm-s3-question",
        correctAnswerText: "Option B: 12",
        explanation: "Multiples of 4 are 4, 8, 12, 16... and multiples of 6 are 6, 12, 18... The least number appearing in both lists is 12. Alternatively, using prime factors: 4 = 2², 6 = 2 × 3. LCM = 2² × 3 = 12.",
        misconceptionNote: "If you answered 2, you found the GCD/HCF instead of LCM. If you answered 24, you multiplied 4 × 6 directly without simplifying.",
        masteryImplication: "Accurate LCM knowledge unlocks Fraction Addition and Algebraic Fraction simplification.",
        rubricPoints: [
          { label: "Identified correct multiple set", earned: true },
          { label: "Selected minimum common element", earned: true },
          { label: "Avoided GCD confusion", earned: true }
        ]
      },
      {
        id: "lcm-s5-upload",
        type: "upload_zone",
        title: "Educator Media & Notes",
        prompt: "Upload teacher supplementary worksheets, custom voice notes, or extra YouTube examples for this skill."
      }
    ]
  },

  "SK-NUM-FRAC-ADD": {
    id: "CAROUSEL-FRAC-01",
    title: "Adding Fractions with Unlike Denominators",
    skillId: "SK-NUM-FRAC-ADD",
    blueprintId: "QB-FRAC-01",
    showProgressBar: true,
    showScoreTally: true,
    slides: [
      {
        id: "frac-s1-lesson",
        type: "lesson_text",
        title: "Fraction Addition: Common Denominator Protocol",
        learningObjective: "Add fractions with different denominators by finding their common denominator.",
        body: "To add fractions with **different denominators** like 1/4 + 1/6:\n\n1. Find the LCM of denominators (4 and 6): **12**.\n2. Convert fractions to equivalent fractions with denominator 12:\n   • 1/4 = 3/12\n   • 1/6 = 2/12\n3. Add the numerators: 3 + 2 = **5**.\n4. Keep denominator the same: **5/12**.\n\n*Critical Warning:* Never add denominators directly (1/4 + 1/6 ≠ 2/10)!",
        keyTerms: ["Common Denominator", "Equivalent Fractions", "Numerators", "Denominators", "LCM"]
      },
      {
        id: "frac-s2-video",
        type: "youtube",
        title: "Video Tutorial: Step-by-Step Fraction Addition",
        subtitle: "Visualizing fraction slices & common bases",
        youtubeUrl: "https://www.youtube.com/watch?v=N-Y0Kvak3ng",
        caption: "Visual Fractions"
      },
      {
        id: "frac-s3-question",
        type: "question_mcq",
        questionText: "Calculate the exact result: 1/4 + 1/6",
        points: 2,
        skillId: "SK-NUM-FRAC-ADD",
        choices: [
          { id: "A", text: "2/10 (Added numerators & denominators)", isCorrect: false, misconceptionId: "GAP-MATH-ADD-DENOM", explanation: "Incorrect. You cannot add denominators directly (1/4 + 1/6 ≠ 2/10). You must find a common denominator first." },
          { id: "B", text: "5/12 (Common denominator 12)", isCorrect: true, explanation: "Correct! The LCM of 4 and 6 is 12. Converting: 1/4 = 3/12 and 1/6 = 2/12. Adding: 3/12 + 2/12 = 5/12." },
          { id: "C", text: "5/24 (Sub-optimal denominator)", isCorrect: false, misconceptionId: "GAP-MATH-LCM-FAIL", explanation: "Incorrect. While 24 is a common denominator, 1/4 + 1/6 = 6/24 + 4/24 = 10/24 = 5/12, not 5/24." },
          { id: "D", text: "1/24 (Multiplied instead of adding)", isCorrect: false, misconceptionId: "GAP-MATH-MULT-OP", explanation: "Incorrect. 1/24 is the result of multiplying (1/4 × 1/6), not adding." }
        ]
      },
      {
        id: "frac-s4-eval",
        type: "evaluation",
        questionRef: "frac-s3-question",
        correctAnswerText: "Option B: 5/12",
        explanation: "1/4 = 3/12 and 1/6 = 2/12. 3/12 + 2/12 = 5/12. 5 and 12 are coprime, so the fraction is in its simplest form.",
        misconceptionNote: "Adding denominators (1+1)/(4+6) = 2/10 is the #1 most common fraction misconception worldwide.",
        masteryImplication: "Essential foundation for Stage 1 Cambridge 0580 Algebra & Rational Expressions.",
        rubricPoints: [
          { label: "Correct denominator conversion", earned: true },
          { label: "Accurate numerator addition", earned: true },
          { label: "Simplified to lowest terms", earned: true }
        ]
      },
      {
        id: "frac-s5-upload",
        type: "upload_zone",
        title: "Add Supporting Material",
        prompt: "Add device videos, diagrams, or paste YouTube links for fractional problem-solving."
      }
    ]
  }
};
