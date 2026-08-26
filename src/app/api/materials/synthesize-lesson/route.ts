import { NextResponse } from "next/server";
import { getSession } from "@/app/actions";
import { extractTextFromPdf } from "@/core/services/pdf-service";
import { generateGeminiText } from "@/core/services/ai-provider";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "TEACHER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
        // We limit the text to avoid exceeding token limits if the books are massive,
        // or rely on Gemini 1.5's massive context window.
        combinedContext += `\n\n--- EXCERPT FROM BOOK: ${book} ---\n${text.substring(0, 150000)}\n`; // Taking first ~150k chars for safety
      } catch (err) {
        console.warn(`Could not read book ${book}`);
      }
    }

    if (!combinedContext) {
      return NextResponse.json({ error: "Could not extract text from the selected books." }, { status: 500 });
    }

    // 2. Ask Gemini to synthesize and optimize the lesson from the multiple sources
    const prompt = `
You are an expert master-teacher and curriculum architect.
I am providing you with raw educational material extracted from multiple textbooks regarding a specific lesson topic.

TARGET LESSON: "${lessonName}"

YOUR MISSION:
Analyze the provided textbook excerpts. Cross-reference the explanations, definitions, and examples from the multiple books.
Synthesize this information into a highly optimized, step-by-step Socratic learning sequence. 

Output a JSON array representing the ideal interactive sequence for this lesson.
Each step should build upon the last. Use this JSON schema:
[
  {
    "stepNumber": 1,
    "stepType": "HOOK_QUESTION" | "CORE_CONCEPT" | "INTERACTIVE_SCENARIO" | "MISCONCEPTION_CHECK",
    "content": "The actual explanation or question text...",
    "interactiveOptions": [ "Option A", "Option B" ], // if it's a question
    "teachingNote": "Why you designed this step and how it synthesizes the textbooks."
  }
]

RAW TEXTBOOK CONTEXT:
${combinedContext}
    `;

    const aiResponse = await generateGeminiText(prompt);

    // Try to parse the JSON output
    let parsedSequence = [];
    try {
      // Find the JSON array in the response (stripping markdown backticks if present)
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        parsedSequence = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not find JSON array in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI sequence JSON:", aiResponse);
      return NextResponse.json({ 
        error: "AI produced invalid JSON.",
        rawAiResponse: aiResponse 
      }, { status: 500 });
    }

    return NextResponse.json({
      lessonName,
      sourcesUsed: books,
      optimizedSequence: parsedSequence
    });

  } catch (error: any) {
    console.error("Synthesize lesson API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
