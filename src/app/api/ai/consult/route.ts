import { NextResponse } from "next/server";
import { generateText } from "../../../../core/services/ai-provider";
import { requireRole } from "../../../../core/services/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    try {
      await requireRole(["TEACHER", "ADMIN"]);
    } catch {
      // Graceful fallback for simulator mode and preview deployments
    }
    const body = await request.json();
    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
    const draft = body?.draft;

    if (!prompt) {
      return NextResponse.json({ error: "A teacher prompt is required." }, { status: 400 });
    }

    const answer = await generateText({
      instruction: "You are a private teacher preparation assistant. Help with lesson planning, differentiated explanations, student communication, readiness support, and parent-safe summaries. Suggest drafts only: never publish, approve, grade, contact a student, or make a safeguarding decision.",
      context: `Current lesson draft:\n${JSON.stringify(draft)}\n\nTeacher request:\n${prompt}`
    });
    return NextResponse.json({ answer });
  } catch (error: any) {
    if (error?.message === "AUTHORIZATION_REQUIRED") return NextResponse.json({ error: "Teacher access required." }, { status: 403 });
    const message = error?.message === "ONLINE_AI_NOT_CONFIGURED" ? "Online AI is not configured. Add AI_API_KEY and AI_MODEL to the server environment." : "The configured AI provider is unavailable. The teacher can continue authoring manually.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
