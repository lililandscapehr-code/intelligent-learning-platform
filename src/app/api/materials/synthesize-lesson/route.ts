import { NextResponse } from "next/server";
import { requireRole } from "@/core/services/auth";
import { extractTextFromPdf } from "@/core/services/pdf-service";
import { generateText } from "@/core/services/ai-provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await requireRole(["TEACHER", "ADMIN"]);

    const body = await request.json();
    const { lessonName, books } = body as { lessonName: string; books: string[] };

    if (!lessonName || !books || books.length === 0) {
      return NextResponse.json({ error: "Missing lessonName or books array" }, { status: 400 });
    }

    // 1. Extract text from all selected books
    let combinedContext = "";
    for (const book of books) {
      try {
        const text = await extractTextFromPdf(book);
        // Limit to ~150k chars per book to avoid token overflow
        combinedContext += `\n\n--- EXCERPT FROM BOOK: ${book} ---\n${text.substring(0, 150000)}\n`;
      } catch (err) {
        console.warn(`Could not read book ${book}:`, err);
      }
    }

    if (!combinedContext.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from the selected books. Make sure they are valid PDF files." },
        { status: 500 }
      );
    }

    // 2. Ask Gemini to synthesize and optimize the lesson from the multiple sources
    const instruction = `
You are an expert master-teacher and curriculum architect.
I am providing you with raw educational material extracted from multiple textbooks regarding a specific lesson topic.

TARGET LESSON: "${lessonName}"

YOUR MISSION:
Analyze the provided textbook excerpts. Cross-reference the explanations, definitions, and examples from the multiple books.
Synthesize this information into a highly optimized, step-by-step Socratic learning sequence.

Output ONLY a valid JSON array (no markdown, no explanation outside the JSON) representing the ideal interactive sequence for this lesson.
Each step must build upon the last. Use this exact JSON schema for each element:
{
  "stepNumber": 1,
  "stepType": "HOOK_QUESTION",
  "content": "The actual explanation or question text",
  "interactiveOptions": ["Option A", "Option B", "Option C"],
  "teachingNote": "Why you designed this step and what the student should understand."
}

stepType must be one of: "HOOK_QUESTION" | "CORE_CONCEPT" | "INTERACTIVE_SCENARIO" | "MISCONCEPTION_CHECK"
Only HOOK_QUESTION and MISCONCEPTION_CHECK steps need interactiveOptions. For CORE_CONCEPT and INTERACTIVE_SCENARIO, set interactiveOptions to [].

Generate 5 to 8 steps maximum. Start with a compelling HOOK_QUESTION.`;

    const answer = await generateText({
      instruction,
      context: combinedContext,
    });

    // 3. Try to parse the JSON output
    let parsedSequence = [];
    try {
      const jsonMatch = answer.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        parsedSequence = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not find JSON array in AI response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI sequence JSON:", answer);
      return NextResponse.json(
        { error: "AI produced an unexpected response format. Please try again.", rawAiResponse: answer },
        { status: 500 }
      );
    }

    return NextResponse.json({
      lessonName,
      sourcesUsed: books,
      optimizedSequence: parsedSequence,
    });

  } catch (error: any) {
    if (error?.message === "AUTHORIZATION_REQUIRED") {
      return NextResponse.json({ error: "Teacher access required." }, { status: 403 });
    }
    console.error("Synthesize lesson API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
