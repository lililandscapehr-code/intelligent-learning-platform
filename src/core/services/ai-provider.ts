type TextRequest = {
  instruction: string;
  context?: string;
};

type VisionRequest = TextRequest & {
  imageDataUrl: string;
};

function provider() {
  return (process.env.AI_PROVIDER || "online").toLowerCase();
}

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

export async function generateText({ instruction, context = "" }: TextRequest) {
  const system = "You are a private educational assistant. Propose suggestions only. Never publish, approve, score, change permissions, or make an irreversible educational decision.";
  if (provider() === "ollama") return generateOllama(`${system}\n\n${instruction}\n\n${context}`);
  return generateOnline([
    { role: "system", content: system },
    { role: "user", content: `${instruction}\n\n${context}` }
  ]);
}

export async function generateVision({ instruction, context = "", imageDataUrl }: VisionRequest) {
  if (provider() === "ollama") throw new Error("OLLAMA_VISION_NOT_SUPPORTED");
  return generateOnline([
    { role: "system", content: "You are a private educational vision assistant. Describe and propose draft content only. Never publish, approve, score, or make an irreversible educational decision." },
    { role: "user", content: [{ type: "text", text: `${instruction}\n\n${context}` }, { type: "image_url", image_url: { url: imageDataUrl } }] }
  ]);
}