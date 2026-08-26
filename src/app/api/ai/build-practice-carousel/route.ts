import { NextResponse } from "next/server";
import { requireRole } from "@/core/services/auth";
import type { EduCarouselConfig, EduSlide, QuestionTextSlide } from "@/components/carousel/CarouselTypes";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    await requireRole(["TEACHER", "ADMIN"]);

    const body = await request.json();
    const {
      questionSlide,
      lessonTitle = "Practice Set",
      curriculumId = "egypt-baccalaureate-second-year-physics",
    } = body as {
      questionSlide: QuestionTextSlide;
      lessonTitle?: string;
      curriculumId?: string;
    };

    if (!questionSlide || !questionSlide.questionText) {
      return NextResponse.json({ error: "Missing questionSlide" }, { status: 400 });
    }

    const alternatives = questionSlide.alternatives || [];
    const groupA = alternatives
      .filter((a) => a.group === "A")
      .sort((a, b) => b.level - a.level); // Simplest first (e.g. 5 down to 2)

    const groupB = alternatives
      .filter((a) => a.group === "B")
      .sort((a, b) => a.level - b.level); // Challenging in order (1 up to 10)

    const now = Date.now();
    const practiceId = `CAROUSEL-PRACTICE-${now}`;

    const slides: EduSlide[] = [];

    // 1. Intro slide
    slides.push({
      id: `slide-intro-${now}`,
      type: "lesson_text",
      title: `🎯 Adaptive Practice: ${lessonTitle}`,
      subtitle: "Step-by-step concept mastery from basics to brilliance",
      body: `Welcome to this targeted practice set. 

We will start with the fundamental steps and concrete analogies, build up to the master question, and finally explore challenge variations.

**Learning Goals:**
- Solidify foundational calculations and concepts
- Identify and eliminate common misconceptions
- Master the topic at both standard and advanced levels`,
      learningObjective: `Master ${lessonTitle} through scaffolded practice.`,
      keyTerms: ["Concept Mastery", "Scaffolded Practice", "Challenge"],
      theme: "sky",
    });

    // 2. Group A slides (Scaffold down / foundational practice)
    groupA.forEach((alt, idx) => {
      slides.push({
        id: `slide-alt-a-${alt.id || idx}`,
        type: "question_text",
        title: `🌱 Foundational Step ${idx + 1}: ${alt.diagnosticTarget ? `Focus on ${alt.diagnosticTarget.toUpperCase()}` : "Step by Step"}`,
        questionText: alt.questionText,
        placeholder: alt.placeholder || "Solve this step...",
        sampleAnswer: alt.simplificationNote || alt.analogy || "Foundational practice answer",
        points: 1,
      });
    });

    // 3. Master question slide
    slides.push({
      ...questionSlide,
      id: `slide-master-${now}`,
      title: `⭐ Master Assessment: ${lessonTitle}`,
    });

    // 4. Group B slides (Challenge up)
    groupB.forEach((alt, idx) => {
      slides.push({
        id: `slide-alt-b-${alt.id || idx}`,
        type: "question_text",
        title: `🚀 Challenge Level ${alt.level}: Advanced Application`,
        questionText: alt.questionText,
        placeholder: alt.placeholder || "Show your advanced solution...",
        sampleAnswer: alt.challengeNote || "Advanced challenge answer",
        points: 2,
      });
    });

    // 5. Final evaluation / mastery slide
    slides.push({
      id: `slide-eval-${now}`,
      type: "evaluation",
      questionRef: `slide-master-${now}`,
      correctAnswerText: "Full mastery of foundational and advanced concepts demonstrated.",
      explanation: `Great work completing this adaptive practice sequence for **${lessonTitle}**!
You worked through foundational scaffolds, conquered the core master problem, and took on challenge escalations.`,
      masteryImplication: "Student has achieved comprehensive depth in this concept.",
      rubricPoints: [
        { label: "Foundational calculation & terminology", earned: true },
        { label: "Master question resolution", earned: true },
        { label: "Advanced application & transfer", earned: true },
      ],
    });

    const carouselConfig: EduCarouselConfig = {
      id: practiceId,
      title: `Practice Set: ${lessonTitle}`,
      skillId: questionSlide.skillId || "",
      blueprintId: questionSlide.blueprintId || "",
      showProgressBar: true,
      showScoreTally: true,
      sequenceMode: "SEQUENTIAL",
      autoAdvanceMs: 0,
      allowSkipQuestions: false,
      accessPolicy: {
        scope: "ALL_ENROLLED",
        minimumScorePercentage: 70,
        showCorrectAnswers: true,
        showMarks: true,
        trackTiming: true,
      },
      slides,
    };

    return NextResponse.json({
      carousel: carouselConfig,
      stats: {
        totalSlides: slides.length,
        groupACount: groupA.length,
        groupBCount: groupB.length,
      },
    });
  } catch (error: any) {
    if (error?.message === "AUTHORIZATION_REQUIRED") {
      return NextResponse.json({ error: "Teacher access required." }, { status: 403 });
    }
    console.error("Build practice carousel error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
