import { NextResponse } from "next/server";
import { requireRole } from "@/core/services/auth";
import { generateText } from "@/core/services/ai-provider";
import type { QuestionAlternative } from "@/components/carousel/CarouselTypes";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    await requireRole(["TEACHER", "ADMIN"]);

    const body = await request.json();
    const {
      questionText,
      sampleAnswer = "",
      groupACount = 5,
      groupBCount = 3,
      skillContext = "",
    } = body as {
      questionText: string;
      sampleAnswer?: string;
      groupACount?: number;
      groupBCount?: number;
      skillContext?: string;
    };

    if (!questionText || questionText.trim().length === 0) {
      return NextResponse.json({ error: "Missing questionText" }, { status: 400 });
    }

    const safeGroupACount = Math.min(Math.max(1, groupACount), 10);
    const safeGroupBCount = Math.min(Math.max(0, groupBCount), 10);

    const instruction = `You are an expert pedagogical diagnostician and curriculum engineer.
I have a master educational question. I need you to generate two groups of alternative versions for this question.

MASTER QUESTION:
"${questionText}"
${sampleAnswer ? `CORRECT ANSWER / SAMPLE: "${sampleAnswer}"` : ""}
${skillContext ? `SKILL/CONCEPT: "${skillContext}"` : ""}

TASK:
1. GROUP A ("Scaffold Down" - exactly ${safeGroupACount} alternatives):
   - Each alternative tests the EXACT SAME core concept, but with scaffolding designed to diagnose specific student failure points and provide practice.
   - Ordered from Level 2 (slightly simpler vocabulary) down to Level ${safeGroupACount + 1} (most concrete/arithmetic breakdown).
   - Each must target one diagnostic category: "vocabulary" | "concept" | "procedure" | "arithmetic" | "representation".
   - Include a real-world analogy where appropriate.
   - Include a simplificationNote explaining what was simplified and what gap a failure on this level reveals.

2. GROUP B ("Challenge Up" - exactly ${safeGroupBCount} alternatives):
   - Each alternative tests the EXACT SAME core concept, but escalates complexity for advanced students.
   - Level 1: Reverse problem (e.g. given output, find input variable).
   - Higher levels: Multi-step, compound scenario, or IB/Olympiad-style framing.
   - Include a challengeNote explaining the escalation.

OUTPUT FORMAT:
Output ONLY a valid JSON object (no markdown fences, no explanatory text):
{
  "groupA": [
    {
      "id": "alt-a-2",
      "group": "A",
      "level": 2,
      "questionText": "...",
      "placeholder": "...",
      "analogy": "...",
      "diagnosticTarget": "vocabulary",
      "simplificationNote": "Simplifies physics jargon into everyday language. If student fails here, root cause is vocabulary."
    }
  ],
  "groupB": [
    {
      "id": "alt-b-1",
      "group": "B",
      "level": 1,
      "questionText": "...",
      "placeholder": "...",
      "challengeNote": "Reverses the unknown variable."
    }
  ]
}`;

    const answer = await generateText({
      instruction,
      context: `Generate ${safeGroupACount} Group A (diagnostic scaffolds) and ${safeGroupBCount} Group B (challenge escalations).`,
    });

    let parsed: { groupA: QuestionAlternative[]; groupB: QuestionAlternative[] };
    try {
      const jsonMatch = answer.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON object found");
      parsed = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error("Failed to parse alternatives JSON:", answer);
      return NextResponse.json(
        { error: "AI produced unexpected format. Please try again.", raw: answer.substring(0, 500) },
        { status: 500 }
      );
    }

    // Ensure IDs and structure
    const groupA: QuestionAlternative[] = (parsed.groupA || []).map((item, idx) => ({
      id: item.id || `alt-a-${idx + 2}-${Date.now()}`,
      group: "A" as const,
      level: item.level || idx + 2,
      questionText: item.questionText || "",
      placeholder: item.placeholder || "Enter your answer...",
      analogy: item.analogy || undefined,
      diagnosticTarget: item.diagnosticTarget || "concept",
      simplificationNote: item.simplificationNote || "",
    }));

    const groupB: QuestionAlternative[] = (parsed.groupB || []).map((item, idx) => ({
      id: item.id || `alt-b-${idx + 1}-${Date.now()}`,
      group: "B" as const,
      level: item.level || idx + 1,
      questionText: item.questionText || "",
      placeholder: item.placeholder || "Enter your answer...",
      challengeNote: item.challengeNote || "",
    }));

    return NextResponse.json({
      questionText,
      groupA,
      groupB,
    });
  } catch (error: any) {
    if (error?.message === "AUTHORIZATION_REQUIRED") {
      return NextResponse.json({ error: "Teacher access required." }, { status: 403 });
    }
    console.error("Generate alternatives error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
