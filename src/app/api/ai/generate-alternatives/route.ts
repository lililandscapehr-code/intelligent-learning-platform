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
I have a master educational question. I need you to generate two groups of alternative versions for this question following the 3-Case Learning Model:

- CASE B (Core / Basic / Mid Question): The master curriculum target.
- CASE PRE (Group A - Foundational Scaffolding - 1 to 10 Trials): Simplifies the SAME question progressively across trials so students can practice and diagnose misconceptions.
- CASE C (Group C / Higher Complexity - 1 to 10 Trials): Higher-level questions testing the SAME concept with reverse direction, multi-step, or Olympiad depth.

MASTER QUESTION (CASE B):
"${questionText}"
${sampleAnswer ? `CORRECT ANSWER / SAMPLE: "${sampleAnswer}"` : ""}
${skillContext ? `SKILL/CONCEPT: "${skillContext}"` : ""}

TASK:
1. CASE PRE (Group A - exactly ${safeGroupACount} trials):
   - Trial 1: Slight simplification of vocabulary and phrasing.
   - Middle Trials: Step-by-step formula breakdown, real-world analogies, and guided practice.
   - Final Trials: Pure concrete numbers / arithmetic calculation breakdown.
   - Each trial must target one diagnostic category: "vocabulary" | "concept" | "procedure" | "arithmetic" | "representation".
   - Include a real-world analogy where appropriate.
   - Include a simplificationNote explaining what was simplified and what gap a failure on this trial reveals.

2. CASE C (Group C / Higher - exactly ${safeGroupBCount} trials):
   - Higher questions for the same concept.
   - Trial 1: Reverse direction (e.g., given output, solve for initial condition).
   - Higher Trials: Multi-step, compound physical systems, or exam-level challenge.
   - Include a challengeNote explaining the escalation.

OUTPUT FORMAT:
Output ONLY a valid JSON object (no markdown fences, no explanatory text):
{
  "groupA": [
    {
      "id": "alt-pre-1",
      "group": "A",
      "level": 1,
      "tierName": "Case Pre",
      "questionText": "...",
      "placeholder": "...",
      "analogy": "...",
      "diagnosticTarget": "vocabulary",
      "simplificationNote": "Trial 1: Simplifies physics jargon into everyday language."
    }
  ],
  "groupB": [
    {
      "id": "alt-c-1",
      "group": "C",
      "level": 1,
      "tierName": "Case C",
      "questionText": "...",
      "placeholder": "...",
      "challengeNote": "Trial 1: Reverses the unknown variable."
    }
  ]
}`;

    const answer = await generateText({
      instruction,
      context: `Generate ${safeGroupACount} Case Pre trials (Group A) and ${safeGroupBCount} Case C higher trials (Group C).`,
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
