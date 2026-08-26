import { NextResponse } from "next/server";
import { getSession } from "@/app/actions";
import { query } from "@/core/db/connection";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const sessionRes = await getSession();
    if (!sessionRes.success || !sessionRes.data) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const userId = sessionRes.data.userId;
    const body = await request.json();
    const {
      carouselId = "unknown",
      slideId = "unknown",
      classId = null,
      alternativeGroup = "MAIN",
      alternativeLevel = 1,
      languageUsed = "en",
      answerText = "",
      isCorrect = false,
      diagnosticTarget = null,
      timeSpentSeconds = 0,
      attemptNumber = 1,
    } = body;

    const logId = crypto.randomUUID();

    await query(
      `INSERT INTO question_attempt_logs 
        (id, student_id, class_id, carousel_id, slide_id, alternative_group, alternative_level, language_used, answer_text, is_correct, diagnostic_target, time_spent_seconds, attempt_number)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        logId,
        userId,
        classId,
        carouselId,
        slideId,
        alternativeGroup,
        alternativeLevel,
        languageUsed,
        answerText,
        isCorrect ? 1 : 0,
        diagnosticTarget,
        timeSpentSeconds,
        attemptNumber,
      ]
    );

    return NextResponse.json({ success: true, logId });
  } catch (error: any) {
    console.error("Log attempt error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
