import { NextResponse } from "next/server";
import { requireRole } from "@/core/services/auth";
import { generateText } from "@/core/services/ai-provider";
import type { QuestionAlternative, QuestionTranslations } from "@/components/carousel/CarouselTypes";

export const runtime = "nodejs";

const LANGUAGE_NAMES: Record<string, string> = {
  ar: "Arabic (العربية)",
  fr: "French (Français)",
  de: "German (Deutsch)",
  es: "Spanish (Español)",
  tr: "Turkish (Türkçe)",
  en: "English",
};

export async function POST(request: Request) {
  try {
    await requireRole(["TEACHER", "ADMIN"]);

    const body = await request.json();
    const {
      questionText,
      alternatives = [],
      targetLanguages = ["ar", "fr", "de", "es", "tr"],
    } = body as {
      questionText: string;
      alternatives?: QuestionAlternative[];
      targetLanguages?: string[];
    };

    if (!questionText || questionText.trim().length === 0) {
      return NextResponse.json({ error: "Missing questionText" }, { status: 400 });
    }

    const validLangs = targetLanguages.filter((l) => l !== "en" && LANGUAGE_NAMES[l]);
    if (validLangs.length === 0) {
      return NextResponse.json({ error: "No valid target languages specified." }, { status: 400 });
    }

    const itemsToTranslate = [
      { key: "master", text: questionText },
      ...alternatives.map((alt) => ({ key: alt.id, text: alt.questionText })),
    ];

    const instruction = `You are a professional educational translator specializing in scientific, mathematical, and physics terminology.

TASK:
Translate the provided question items into each requested target language: ${validLangs.map((l) => `${l} (${LANGUAGE_NAMES[l]})`).join(", ")}.

CRITICAL RULES:
1. Maintain strict scientific and mathematical accuracy for physics terms (e.g. velocity, acceleration, force, friction, momentum).
2. For Arabic ("ar"), use standard modern academic Arabic suitable for secondary/high school students.
3. Preserve mathematical formulas, variables (like v, t, g, m/s²), and numbers exactly as given.

INPUT ITEMS TO TRANSLATE:
${JSON.stringify(itemsToTranslate, null, 2)}

OUTPUT FORMAT:
Output ONLY valid JSON (no markdown fences, no explanatory text):
{
  "translations": {
    ${validLangs.map((l) => `"${l}": { "questionText": "...", "alternatives": { "alt_id": "translated text" } }`).join(",\n    ")}
  }
}`;

    const answer = await generateText({
      instruction,
      context: `Translate into: ${validLangs.join(", ")}`,
    });

    let parsed: { translations: QuestionTranslations };
    try {
      const jsonMatch = answer.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON object found");
      parsed = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error("Failed to parse translations JSON:", answer);
      return NextResponse.json(
        { error: "AI translation produced unexpected format.", raw: answer.substring(0, 500) },
        { status: 500 }
      );
    }

    return NextResponse.json({
      translations: parsed.translations || {},
    });
  } catch (error: any) {
    if (error?.message === "AUTHORIZATION_REQUIRED") {
      return NextResponse.json({ error: "Teacher access required." }, { status: 403 });
    }
    console.error("Translate question error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
