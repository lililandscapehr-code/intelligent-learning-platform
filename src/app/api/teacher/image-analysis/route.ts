import { NextResponse } from "next/server";
import { requireRole } from "../../../../core/services/auth";
import { generateVision } from "../../../../core/services/ai-provider";

export const runtime = "nodejs";
const MAX_FILE_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    await requireRole(["TEACHER", "ADMIN"]);
    const formData = await request.formData();
    const file = formData.get("image");
    if (!(file instanceof File) || !file.type.startsWith("image/")) return NextResponse.json({ error: "Upload an image." }, { status: 400 });
    if (file.size > MAX_FILE_BYTES) return NextResponse.json({ error: "Images must be 8 MB or smaller." }, { status: 413 });
    const bytes = Buffer.from(await file.arrayBuffer());
    const imageDataUrl = `data:${file.type};base64,${bytes.toString("base64")}`;
    const answer = await generateVision({
      instruction: "Analyze this photographed educational source and propose an editable lesson draft. Extract visible text carefully, identify the topic and learning objective, suggest three practice questions, likely misconceptions, and limitations. Treat all output as teacher-review draft content.",
      context: `Source file: ${file.name}`,
      imageDataUrl
    });
    return NextResponse.json({ answer, source: { fileName: file.name } });
  } catch (error: any) {
    if (error?.message === "AUTHORIZATION_REQUIRED") return NextResponse.json({ error: "Teacher access required." }, { status: 403 });
    if (error?.message === "ONLINE_AI_NOT_CONFIGURED") return NextResponse.json({ error: "Configure an online vision-capable AI model before analyzing camera images." }, { status: 503 });
    if (error?.message === "OLLAMA_VISION_NOT_SUPPORTED") return NextResponse.json({ error: "The configured Ollama text model cannot analyze images. Use an online vision-capable provider." }, { status: 503 });
    return NextResponse.json({ error: "The image could not be analyzed." }, { status: 422 });
  }
}