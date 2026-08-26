type TextRequest = {
  instruction: string;
  context?: string;
};

type VisionRequest = TextRequest & {
  imageDataUrl: string;
};

function provider() {
  return (process.env.AI_PROVIDER || "gemini").toLowerCase();
}

// ── Gemini (Google Generative Language API) ──────────────────
async function generateGeminiText(systemPrompt: string, userText: string): Promise<string> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) throw new Error("ONLINE_AI_NOT_CONFIGURED");
  const model = process.env.AI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userText }] }],
      generationConfig: { temperature: 0.2 }
    }),
    signal: AbortSignal.timeout(60000)
  });
  if (!response.ok) {
    const err = await response.text();
    console.error("Gemini error:", err);
    throw new Error("ONLINE_AI_REQUEST_FAILED");
  }
  const result = await response.json();
  return result.candidates?.[0]?.content?.parts?.[0]?.text || "Gemini returned no suggestion.";
}

async function generateGeminiVision(systemPrompt: string, userText: string, imageDataUrl: string): Promise<string> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) throw new Error("ONLINE_AI_NOT_CONFIGURED");
  const model = process.env.AI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  // Extract base64 data and mime type from data URL
  const [meta, base64Data] = imageDataUrl.split(",");
  const mimeType = meta.match(/:(.*?);/)?.[1] || "image/png";
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{
        role: "user",
        parts: [
          { text: userText },
          { inline_data: { mime_type: mimeType, data: base64Data } }
        ]
      }],
      generationConfig: { temperature: 0.2 }
    }),
    signal: AbortSignal.timeout(60000)
  });
  if (!response.ok) {
    const err = await response.text();
    console.error("Gemini vision error:", err);
    throw new Error("ONLINE_AI_REQUEST_FAILED");
  }
  const result = await response.json();
  return result.candidates?.[0]?.content?.parts?.[0]?.text || "Gemini returned no vision suggestion.";
}

// ── OpenAI-compatible (fallback) ─────────────────────────────
function onlineConfig() {
  const baseUrl = (process.env.AI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  if (!apiKey || !model) throw new Error("ONLINE_AI_NOT_CONFIGURED");
  return { baseUrl, apiKey, model };
}

async function generateOnline(messages: unknown[]) {
  const config = onlineConfig();
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.apiKey}` },
    body: JSON.stringify({ model: config.model, messages, temperature: 0.2 }),
    signal: AbortSignal.timeout(60000)
  });
  if (!response.ok) throw new Error("ONLINE_AI_REQUEST_FAILED");
  const result = await response.json();
  return result.choices?.[0]?.message?.content || "The AI provider returned no suggestion.";
}

// ── Ollama (local) ───────────────────────────────────────────
async function generateOllama(prompt: string) {
  const response = await fetch("http://127.0.0.1:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: process.env.OLLAMA_MODEL || "qwen2.5:3b", stream: false, prompt }),
    signal: AbortSignal.timeout(60000)
  });
  if (!response.ok) throw new Error("OLLAMA_UNAVAILABLE");
  const result = await response.json();
  return result.response || "The local AI provider returned no suggestion.";
}

// ── Public API ────────────────────────────────────────────────
const SYSTEM_TEXT = "You are a private educational assistant. Propose suggestions only. Never publish, approve, score, change permissions, or make an irreversible educational decision.";
const SYSTEM_VISION = "You are a private educational vision assistant. Describe and propose draft content only. Never publish, approve, score, or make an irreversible educational decision.";

export async function generateText({ instruction, context = "" }: TextRequest) {
  const p = provider();
  if (p === "ollama") return generateOllama(`${SYSTEM_TEXT}\n\n${instruction}\n\n${context}`);
  if (p === "gemini") return generateGeminiText(SYSTEM_TEXT, `${instruction}\n\n${context}`);
  return generateOnline([
    { role: "system", content: SYSTEM_TEXT },
    { role: "user", content: `${instruction}\n\n${context}` }
  ]);
}

export async function generateVision({ instruction, context = "", imageDataUrl }: VisionRequest) {
  const p = provider();
  if (p === "ollama") throw new Error("OLLAMA_VISION_NOT_SUPPORTED");
  if (p === "gemini") return generateGeminiVision(SYSTEM_VISION, `${instruction}\n\n${context}`, imageDataUrl);
  return generateOnline([
    { role: "system", content: SYSTEM_VISION },
    { role: "user", content: [{ type: "text", text: `${instruction}\n\n${context}` }, { type: "image_url", image_url: { url: imageDataUrl } }] }
  ]);
}