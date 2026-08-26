import { NextResponse } from "next/server";
import { requireRole } from "@/core/services/auth";
import { extractTextFromPdf } from "@/core/services/pdf-service";
import { generateText } from "@/core/services/ai-provider";

export const runtime = "nodejs";

// Cache analyzed curricula in memory per server process to avoid re-analyzing on every request
const analysisCache = new Map<string, { chapters: CurriculumChapter[]; analyzedAt: number }>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

export interface CurriculumLesson {
  lessonNumber: string;
  title: string;
  topics: string[];
  pageReference?: string;
}

export interface CurriculumChapter {
  chapterNumber: string;
  title: string;
  lessons: CurriculumLesson[];
}

export async function POST(request: Request) {
  try {
    await requireRole(["TEACHER", "ADMIN"]);

    const body = await request.json();
    const { book, forceRefresh = false } = body as { book: string; forceRefresh?: boolean };

    if (!book) {
      return NextResponse.json({ error: "Missing book filename" }, { status: 400 });
    }

    // Check cache
    const cacheKey = book;
    const cached = analysisCache.get(cacheKey);
    if (!forceRefresh && cached && Date.now() - cached.analyzedAt < CACHE_TTL_MS) {
      return NextResponse.json({
        book,
        chapters: cached.chapters,
        fromCache: true,
        analyzedAt: new Date(cached.analyzedAt).toISOString(),
      });
    }

    // Extract text from the PDF
    let text: string;
    try {
      text = await extractTextFromPdf(book);
    } catch (err: any) {
      return NextResponse.json({ error: `Could not read "${book}": ${err.message}` }, { status: 404 });
    }

    // Use the first 60k chars (table of contents + opening chapters usually appear early)
    // Plus a sample from the middle to catch later chapters
    const earlySection = text.substring(0, 60000);
    const midSection = text.substring(60000, 100000);

    const instruction = `You are an expert curriculum analyst and educational content mapper.

I will give you the raw extracted text from a Physics textbook PDF.
Your job is to analyze the table of contents and chapter structure and output a clean, structured JSON map of the book.

Output ONLY a valid JSON array (no markdown fences, no explanation) using this exact schema:
[
  {
    "chapterNumber": "1",
    "title": "Mechanics",
    "lessons": [
      {
        "lessonNumber": "1-1",
        "title": "Velocity and Acceleration",
        "topics": ["uniform motion", "Newton's laws", "free fall"],
        "pageReference": "p.12"
      }
    ]
  }
]

Rules:
- Extract ALL chapters and ALL lessons you can identify from the table of contents or headings.
- For topics, list 2-5 key physics concepts covered in that lesson.
- If you cannot determine page numbers, omit pageReference.
- Do NOT invent chapters or lessons — only include what is clearly in the text.
- If the book has parts (Part 1, Part 2), treat each part's chapters separately.`;

    const context = `BOOK: ${book}\n\n--- EARLY SECTION ---\n${earlySection}\n\n--- MID SECTION ---\n${midSection}`;

    const answer = await generateText({ instruction, context });

    // Parse JSON
    let chapters: CurriculumChapter[] = [];
    try {
      const jsonMatch = answer.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        chapters = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON array found in AI response");
      }
    } catch (parseError) {
      console.error("Failed to parse curriculum analysis JSON:", answer.substring(0, 500));
      return NextResponse.json(
        { error: "AI produced an unexpected response. Please try again.", rawPreview: answer.substring(0, 500) },
        { status: 500 }
      );
    }

    // Store in cache
    const analyzedAt = Date.now();
    analysisCache.set(cacheKey, { chapters, analyzedAt });

    return NextResponse.json({
      book,
      chapters,
      fromCache: false,
      analyzedAt: new Date(analyzedAt).toISOString(),
    });

  } catch (error: any) {
    if (error?.message === "AUTHORIZATION_REQUIRED") {
      return NextResponse.json({ error: "Teacher access required." }, { status: 403 });
    }
    console.error("Analyze curriculum API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
