export interface AIConfiguration {
  provider: "ollama" | "gemini" | "openai" | "custom";
  ollamaEndpoint: string;
  ollamaModel: string;
  apiBaseUrl: string;
  apiKey: string;
  apiModel: string;
  temperature: number;
  maxTokens: number;
  status?: "connected" | "disconnected" | "testing" | "unconfigured";
  lastTestedAt?: string;
  lastTestMessage?: string;
}

export const DEFAULT_AI_CONFIG: AIConfiguration = {
  provider: "gemini",
  ollamaEndpoint: "http://127.0.0.1:11434",
  ollamaModel: "qwen2.5:3b",
  apiBaseUrl: "https://api.openai.com/v1",
  apiKey: "",
  apiModel: "gemini-2.5-flash",
  temperature: 0.2,
  maxTokens: 4096,
  status: "unconfigured"
};

let activeAIConfig: AIConfiguration = {
  provider: ((process.env.AI_PROVIDER || "gemini").toLowerCase() as any),
  ollamaEndpoint: process.env.OLLAMA_ENDPOINT || "http://127.0.0.1:11434",
  ollamaModel: process.env.OLLAMA_MODEL || "qwen2.5:3b",
  apiBaseUrl: process.env.AI_BASE_URL || "https://api.openai.com/v1",
  apiKey: process.env.AI_API_KEY || "",
  apiModel: process.env.AI_MODEL || "gemini-2.5-flash",
  temperature: 0.2,
  maxTokens: 4096,
  status: "connected"
};

export function getAIConfiguration(): AIConfiguration {
  return { ...activeAIConfig };
}

export function updateAIConfiguration(config: Partial<AIConfiguration>): AIConfiguration {
  activeAIConfig = {
    ...activeAIConfig,
    ...config
  };
  return { ...activeAIConfig };
}

export async function testAIConnection(testConfig?: Partial<AIConfiguration>): Promise<{
  success: boolean;
  message: string;
  latencyMs: number;
  model: string;
}> {
  const cfg = { ...activeAIConfig, ...testConfig };
  const startTime = Date.now();

  try {
    if (cfg.provider === "ollama") {
      const endpoint = cfg.ollamaEndpoint.replace(/\/$/, "");
      const res = await fetch(`${endpoint}/api/tags`, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) throw new Error(`Ollama responded with HTTP ${res.status}`);
      const data = await res.json();
      const models = (data.models || []).map((m: any) => m.name);
      const latencyMs = Date.now() - startTime;
      const hasSelectedModel = models.some((m: string) => m.includes(cfg.ollamaModel));

      return {
        success: true,
        message: hasSelectedModel
          ? `✓ Connected to Ollama (${models.length} models found. Selected: "${cfg.ollamaModel}")`
          : `✓ Connected to Ollama (${models.length} models found: ${models.slice(0, 3).join(", ") || "none downloaded"})`,
        latencyMs,
        model: cfg.ollamaModel
      };
    } else if (cfg.provider === "gemini") {
      const key = cfg.apiKey || process.env.AI_API_KEY;
      if (!key) throw new Error("Gemini API Key is missing. Please enter your API Key.");
      const model = cfg.apiModel || "gemini-2.5-flash";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}?key=${key}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gemini API error (HTTP ${res.status}): ${errText.slice(0, 100)}`);
      }
      const latencyMs = Date.now() - startTime;
      return {
        success: true,
        message: `✓ Connected to Google Gemini API (Model: ${model}, Latency: ${latencyMs}ms)`,
        latencyMs,
        model
      };
    } else {
      // OpenAI / Custom REST
      const baseUrl = (cfg.apiBaseUrl || "https://api.openai.com/v1").replace(/\/$/, "");
      const key = cfg.apiKey || process.env.AI_API_KEY;
      if (!key) throw new Error("API Key is missing for custom endpoint.");
      const model = cfg.apiModel || "gpt-4o-mini";
      const res = await fetch(`${baseUrl}/models`, {
        headers: { Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(8000)
      });
      if (!res.ok) throw new Error(`Endpoint responded with HTTP ${res.status}`);
      const latencyMs = Date.now() - startTime;
      return {
        success: true,
        message: `✓ Connected to Custom AI API (${baseUrl}, Model: ${model})`,
        latencyMs,
        model
      };
    }
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    return {
      success: false,
      message: `Connection failed: ${error?.message || "Unknown error"}`,
      latencyMs,
      model: cfg.provider === "ollama" ? cfg.ollamaModel : cfg.apiModel
    };
  }
}

type TextRequest = {
  instruction: string;
  context?: string;
};

type VisionRequest = TextRequest & {
  imageDataUrl: string;
};

// ── Gemini (Google Generative Language API) ──────────────────
async function generateGeminiText(systemPrompt: string, userText: string): Promise<string> {
  const apiKey = activeAIConfig.apiKey || process.env.AI_API_KEY;
  if (!apiKey) throw new Error("ONLINE_AI_NOT_CONFIGURED");
  const model = activeAIConfig.apiModel || process.env.AI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userText }] }],
      generationConfig: { temperature: activeAIConfig.temperature }
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
  const apiKey = activeAIConfig.apiKey || process.env.AI_API_KEY;
  if (!apiKey) throw new Error("ONLINE_AI_NOT_CONFIGURED");
  const model = activeAIConfig.apiModel || process.env.AI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
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
      generationConfig: { temperature: activeAIConfig.temperature }
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

// ── OpenAI-compatible ────────────────────────────────────────
async function generateOnline(messages: unknown[]) {
  const baseUrl = (activeAIConfig.apiBaseUrl || "https://api.openai.com/v1").replace(/\/$/, "");
  const apiKey = activeAIConfig.apiKey || process.env.AI_API_KEY;
  const model = activeAIConfig.apiModel || "gpt-4o-mini";
  if (!apiKey || !model) throw new Error("ONLINE_AI_NOT_CONFIGURED");
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, temperature: activeAIConfig.temperature }),
    signal: AbortSignal.timeout(60000)
  });
  if (!response.ok) throw new Error("ONLINE_AI_REQUEST_FAILED");
  const result = await response.json();
  return result.choices?.[0]?.message?.content || "The AI provider returned no suggestion.";
}

// ── Ollama (local) ───────────────────────────────────────────
async function generateOllama(prompt: string) {
  const endpoint = (activeAIConfig.ollamaEndpoint || "http://127.0.0.1:11434").replace(/\/$/, "");
  const model = activeAIConfig.ollamaModel || "qwen2.5:3b";
  const response = await fetch(`${endpoint}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, stream: false, prompt, options: { temperature: activeAIConfig.temperature } }),
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
  const p = activeAIConfig.provider;
  if (p === "ollama") return generateOllama(`${SYSTEM_TEXT}\n\n${instruction}\n\n${context}`);
  if (p === "gemini") return generateGeminiText(SYSTEM_TEXT, `${instruction}\n\n${context}`);
  return generateOnline([
    { role: "system", content: SYSTEM_TEXT },
    { role: "user", content: `${instruction}\n\n${context}` }
  ]);
}

export async function generateVision({ instruction, context = "", imageDataUrl }: VisionRequest) {
  const p = activeAIConfig.provider;
  if (p === "ollama") throw new Error("OLLAMA_VISION_NOT_SUPPORTED");
  if (p === "gemini") return generateGeminiVision(SYSTEM_VISION, `${instruction}\n\n${context}`, imageDataUrl);
  return generateOnline([
    { role: "system", content: SYSTEM_VISION },
    { role: "user", content: [{ type: "text", text: `${instruction}\n\n${context}` }, { type: "image_url", image_url: { url: imageDataUrl } }] }
  ]);
}