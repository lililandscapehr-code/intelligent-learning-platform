import { NextRequest, NextResponse } from "next/server";
import { generateText, getAIProviderPoolConfig } from "../../../../core/services/ai-provider";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are an expert curriculum architect and academic content specialist for the Egyptian Ministry of Education (MoE) K-12 system, with deep knowledge of Egyptian Baccalaureate, STEM frameworks, and international standards.

Your role is to help platform administrators:
1. Parse and extract structured data from uploaded curriculum documents (Word files, PDFs, ministry syllabi)
2. Identify and list chapters, units, lessons, topics, and learning objectives
3. Suggest improvements aligned with MoE standards
4. Generate clean JSON when asked to extract structured data

When extracting structured curriculum data, ALWAYS return a valid JSON block inside triple backticks:
\`\`\`json
{
  "chapters": ["Chapter 1: ...", "Chapter 2: ..."],
  "lessons": [
    { "id": "lesson-1", "title": "Lesson Title" }
  ],
  "summary": "Brief curriculum summary"
}
\`\`\`

Be concise, accurate, and structured. Focus on actionable curriculum intelligence.`;

export async function POST(req: NextRequest) {
  try {
    const { extractedText, conversationHistory, userPrompt, targetCurriculumId, selectedAgentId } = await req.json();

    const poolConfig = getAIProviderPoolConfig();
    const availableProviders = poolConfig.providers.filter(p => p.enabled);

    if (availableProviders.length === 0) {
      return NextResponse.json(
        { error: "No AI agents are enabled in the Admin Control Center pool. Please enable at least one provider (Gemini, Ollama, OpenAI)." },
        { status: 503 }
      );
    }

    // Determine target agent
    const targetAgent = selectedAgentId
      ? availableProviders.find(p => p.id === selectedAgentId) || availableProviders[0]
      : availableProviders[0];

    // Build context with history and document snippet
    const historyText = (conversationHistory || [])
      .map((msg: { role: string; content: string }) => `${msg.role === "admin" ? "Admin" : "AI Agent"}: ${msg.content}`)
      .join("\n\n");

    const docContext = extractedText ? `DOCUMENT CONTENT:\n\`\`\`\n${extractedText.slice(0, 8000)}\n\`\`\`\n\n` : "";

    const context = `${SYSTEM_PROMPT}\n\n${docContext}${historyText ? `CONVERSATION HISTORY:\n${historyText}\n\n` : ""}Active Agent: ${targetAgent.name} (${targetAgent.type})`;

    const responseText = await generateText({
      instruction: userPrompt,
      context
    });

    // Try to extract structured JSON from the response
    let structuredData: Record<string, unknown> | null = null;
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)```/);
    if (jsonMatch?.[1]) {
      try {
        structuredData = JSON.parse(jsonMatch[1].trim());
      } catch {
        // Not valid JSON — keep as text
      }
    }

    return NextResponse.json({
      reply: responseText,
      structuredData,
      usedAgent: { id: targetAgent.id, name: targetAgent.name, type: targetAgent.type },
      targetCurriculumId: targetCurriculumId || null
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Admin Curriculum AI]", message);
    return NextResponse.json(
      { error: `AI agent request failed: ${message}` },
      { status: 500 }
    );
  }
}
