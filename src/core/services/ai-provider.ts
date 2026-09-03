import fs from "fs";
import path from "path";
import {
  AIProviderType,
  AIProviderEntry,
  DistilledExemplar,
  AIProviderPoolConfig,
  AIConfiguration,
  DEFAULT_AI_CONFIG
} from "./ai-provider-types";

export type {
  AIProviderType,
  AIProviderEntry,
  DistilledExemplar,
  AIProviderPoolConfig,
  AIConfiguration
};
export {
  DEFAULT_AI_CONFIG
};

// ── Default Configurations ───────────────────────────────────────────────────
export const DEFAULT_AI_POOL_CONFIG: AIProviderPoolConfig = {
  failoverEnabled: true,
  distillationEnabled: true,
  defaultTemperature: 0.2,
  defaultMaxTokens: 4096,
  providers: [
    {
      id: "prov-gemini-primary",
      name: "Google Gemini 2.5 Flash (Primary Cloud)",
      type: "gemini",
      priority: 1,
      enabled: true,
      apiKey: process.env.AI_API_KEY || "",
      model: process.env.AI_MODEL || "gemini-2.5-flash",
      temperature: 0.2,
      maxTokens: 4096,
      lastTestStatus: "untested"
    },
    {
      id: "prov-ollama-local",
      name: "Ollama (Local Offline Fallback)",
      type: "ollama",
      priority: 2,
      enabled: true,
      endpoint: process.env.OLLAMA_ENDPOINT || "http://127.0.0.1:11434",
      model: process.env.OLLAMA_MODEL || "qwen2.5:3b",
      temperature: 0.2,
      maxTokens: 4096,
      lastTestStatus: "untested"
    }
  ]
};

// ── Persistent Storage Paths ─────────────────────────────────────────────────
// On Vercel (VERCEL=1), the filesystem is read-only. We use in-memory cache only.
const IS_VERCEL = process.env.VERCEL === "1";
const DATA_DIR = path.join(process.cwd(), "data");
const CONFIG_FILE = path.join(DATA_DIR, "ai-config.json");
const DISTILLATION_FILE = path.join(DATA_DIR, "ai-distillation-memory.json");

function ensureDataDir() {
  if (IS_VERCEL) return; // Skip on Vercel read-only FS
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    // Ignore — likely read-only
  }
}

// ── Configuration Persistence ────────────────────────────────────────────────
let cachedPoolConfig: AIProviderPoolConfig | null = null;

export function getAIProviderPoolConfig(): AIProviderPoolConfig {
  if (cachedPoolConfig) return { ...cachedPoolConfig };

  if (!IS_VERCEL) {
    ensureDataDir();
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        const data = fs.readFileSync(CONFIG_FILE, "utf-8");
        cachedPoolConfig = JSON.parse(data);
        return { ...cachedPoolConfig! };
      }
    } catch (err) {
      console.error("Error reading ai-config.json, using defaults:", err);
    }
  }

  // On Vercel or first run: build config from env vars
  const envConfig: AIProviderPoolConfig = {
    ...DEFAULT_AI_POOL_CONFIG,
    providers: DEFAULT_AI_POOL_CONFIG.providers.map(p =>
      p.type === "gemini"
        ? { ...p, apiKey: process.env.AI_API_KEY || p.apiKey, model: process.env.AI_MODEL || p.model }
        : p
    )
  };
  cachedPoolConfig = envConfig;
  if (!IS_VERCEL) saveAIProviderPoolConfig(cachedPoolConfig);
  return { ...cachedPoolConfig };
}

export function saveAIProviderPoolConfig(config: AIProviderPoolConfig): AIProviderPoolConfig {
  // Ensure providers are sorted by priority
  config.providers.sort((a, b) => a.priority - b.priority);
  cachedPoolConfig = { ...config };

  // Only write to disk when not in a Vercel serverless environment
  if (!IS_VERCEL) {
    try {
      ensureDataDir();
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
    } catch {
      // Silently keep in-memory only
    }
  }
  return { ...cachedPoolConfig };
}

// ── Distillation Memory: Ollama Learning from Cloud AI & Teachers ───────────
let cachedDistillationMemory: DistilledExemplar[] | null = null;

export function getDistillationMemory(): DistilledExemplar[] {
  if (cachedDistillationMemory) return [...cachedDistillationMemory];

  if (!IS_VERCEL) {
    ensureDataDir();
    try {
      if (fs.existsSync(DISTILLATION_FILE)) {
        const data = fs.readFileSync(DISTILLATION_FILE, "utf-8");
        cachedDistillationMemory = JSON.parse(data);
        return [...cachedDistillationMemory!];
      }
    } catch {
      // Fall through to seed
    }
  }

  // Initial seed exemplars for physics and curriculum authoring
  cachedDistillationMemory = [
    {
      id: "seed-distill-01",
      subject: "Physics",
      gradeLevel: "Secondary 2",
      sourceModel: "gemini-2.5-pro (verified)",
      instruction: "Generate a 3-case velocity vector question for Nile boat crossing.",
      idealResponse: JSON.stringify({
        concept: "Velocity Vectors & Relative Motion",
        caseB: { question: "A boat heads East at 4 m/s across a 3 m/s downstream Nile current. Find resultant velocity.", answer: "5 m/s at 37°" },
        casePreScaffold: "Break down into perpendicular vectors: vx = 4, vy = 3, use Pythagoras R = √(4² + 3²).",
        caseCChallenge: "If the river width is 120m and current accelerates to 5 m/s midway, determine the upstream heading required to land directly opposite."
      }),
      createdAt: new Date().toISOString(),
      verifiedByTeacher: true
    }
  ];
  if (!IS_VERCEL) saveDistillationMemory(cachedDistillationMemory);
  return [...cachedDistillationMemory];
}

export function saveDistillationMemory(memory: DistilledExemplar[]): void {
  cachedDistillationMemory = [...memory];
  if (!IS_VERCEL) {
    try {
      ensureDataDir();
      fs.writeFileSync(DISTILLATION_FILE, JSON.stringify(memory, null, 2), "utf-8");
    } catch {
      // Silently keep in-memory only on read-only environments
    }
  }
}

export function recordDistilledExemplar(exemplar: Omit<DistilledExemplar, "id" | "createdAt">): DistilledExemplar {
  const memory = getDistillationMemory();
  const newEntry: DistilledExemplar = {
    ...exemplar,
    id: `distill-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString()
  };

  // Keep latest 100 high-quality exemplars
  const updated = [newEntry, ...memory].slice(0, 100);
  saveDistillationMemory(updated);
  return newEntry;
}

export function clearDistillationMemory(): void {
  saveDistillationMemory([]);
}

// ── In-Context Few-Shot Builder for Ollama ─────────────────────────────────────
function buildOllamaPromptWithDistillation(instruction: string, context: string): string {
  const config = getAIProviderPoolConfig();
  if (!config.distillationEnabled) {
    return `${SYSTEM_TEXT}\n\n${instruction}\n\n${context}`;
  }

  const memory = getDistillationMemory();
  if (memory.length === 0) {
    return `${SYSTEM_TEXT}\n\n${instruction}\n\n${context}`;
  }

  // Select top 2 relevant exemplars
  const topExemplars = memory.slice(0, 2);
  const exemplarGuidance = topExemplars.map((ex, i) => 
    `### Gold Standard Exemplar #${i + 1} (Source: ${ex.sourceModel}):\nPrompt: ${ex.instruction}\nIdeal Structured Response:\n${ex.idealResponse.slice(0, 350)}...`
  ).join("\n\n");

  return `${SYSTEM_TEXT}

[LEARNED CURRICULUM PATTERNS FROM GEMINI & MASTER TEACHERS]:
Follow the exact pedagogical precision, SI units, and structured diagnostic format shown in these gold exemplars:

${exemplarGuidance}

---
[CURRENT INSTRUCTION]:
${instruction}

${context ? `[CONTEXT]:\n${context}` : ""}`;
}

// ── Single Provider Call Handlers ─────────────────────────────────────────────
const SYSTEM_TEXT = "You are a private educational assistant. Propose suggestions only. Never publish, approve, score, change permissions, or make an irreversible educational decision.";
const SYSTEM_VISION = "You are a private educational vision assistant. Describe and propose draft content only. Never publish, approve, score, or make an irreversible educational decision.";

async function executeGeminiText(provider: AIProviderEntry, systemPrompt: string, userText: string): Promise<string> {
  const apiKey = provider.apiKey || process.env.AI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY_MISSING");
  const model = provider.model || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userText }] }],
      generationConfig: { temperature: provider.temperature ?? 0.2 }
    }),
    signal: AbortSignal.timeout(45000)
  });

  if (!response.ok) {
    const errText = await response.text();
    if (response.status === 429) throw new Error("QUOTA_EXCEEDED (Rate Limit 429)");
    throw new Error(`GEMINI_API_ERROR (HTTP ${response.status}): ${errText.slice(0, 100)}`);
  }

  const result = await response.json();
  const output = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!output) throw new Error("GEMINI_EMPTY_RESPONSE");
  return output;
}

async function executeGeminiVision(provider: AIProviderEntry, systemPrompt: string, userText: string, imageDataUrl: string): Promise<string> {
  const apiKey = provider.apiKey || process.env.AI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY_MISSING");
  const model = provider.model || "gemini-2.5-flash";
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
      generationConfig: { temperature: provider.temperature ?? 0.2 }
    }),
    signal: AbortSignal.timeout(60000)
  });

  if (!response.ok) {
    const errText = await response.text();
    if (response.status === 429) throw new Error("QUOTA_EXCEEDED (Rate Limit 429)");
    throw new Error(`GEMINI_VISION_ERROR (HTTP ${response.status}): ${errText.slice(0, 100)}`);
  }

  const result = await response.json();
  return result.candidates?.[0]?.content?.parts?.[0]?.text || "No vision analysis generated.";
}

async function executeOllamaText(provider: AIProviderEntry, prompt: string): Promise<string> {
  const endpoint = (provider.endpoint || "http://127.0.0.1:11434").replace(/\/$/, "");
  const model = provider.model || "qwen2.5:3b";

  const response = await fetch(`${endpoint}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      prompt,
      options: { temperature: provider.temperature ?? 0.2 }
    }),
    signal: AbortSignal.timeout(60000)
  });

  if (!response.ok) throw new Error(`OLLAMA_HTTP_ERROR_${response.status}`);
  const result = await response.json();
  return result.response || "No response generated from local Ollama model.";
}

async function executeOpenAIText(provider: AIProviderEntry, messages: unknown[]): Promise<string> {
  const baseUrl = (provider.apiBaseUrl || "https://api.openai.com/v1").replace(/\/$/, "");
  const apiKey = provider.apiKey || process.env.AI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY_MISSING");
  const model = provider.model || "gpt-4o-mini";

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: provider.temperature ?? 0.2
    }),
    signal: AbortSignal.timeout(45000)
  });

  if (!response.ok) {
    const errText = await response.text();
    if (response.status === 429) throw new Error("QUOTA_EXCEEDED (Rate Limit 429)");
    throw new Error(`OPENAI_ERROR (HTTP ${response.status}): ${errText.slice(0, 100)}`);
  }

  const result = await response.json();
  return result.choices?.[0]?.message?.content || "No response from OpenAI provider.";
}

// ── Smart Multi-Provider Failover Dispatcher ──────────────────────────────────
export type TextRequest = {
  instruction: string;
  context?: string;
};

export type VisionRequest = TextRequest & {
  imageDataUrl: string;
};

export async function generateText({ instruction, context = "" }: TextRequest): Promise<string> {
  const poolConfig = getAIProviderPoolConfig();
  const enabledProviders = poolConfig.providers.filter(p => p.enabled);

  if (enabledProviders.length === 0) {
    throw new Error("NO_AI_PROVIDERS_ENABLED");
  }

  let lastError: Error | null = null;
  const executionLogs: string[] = [];

  for (const provider of enabledProviders) {
    try {
      let output = "";
      if (provider.type === "gemini") {
        output = await executeGeminiText(provider, SYSTEM_TEXT, `${instruction}\n\n${context}`);
        // Automatically distill high-quality cloud outputs to help Ollama learn
        if (poolConfig.distillationEnabled && output.length > 50) {
          recordDistilledExemplar({
            subject: "Curriculum",
            sourceModel: provider.model,
            instruction,
            context,
            idealResponse: output,
            verifiedByTeacher: false
          });
        }
      } else if (provider.type === "ollama") {
        // Build few-shot enriched prompt so Ollama learns from distilled exemplars
        const distilledPrompt = buildOllamaPromptWithDistillation(instruction, context);
        output = await executeOllamaText(provider, distilledPrompt);
      } else {
        output = await executeOpenAIText(provider, [
          { role: "system", content: SYSTEM_TEXT },
          { role: "user", content: `${instruction}\n\n${context}` }
        ]);
        if (poolConfig.distillationEnabled && output.length > 50) {
          recordDistilledExemplar({
            subject: "Curriculum",
            sourceModel: provider.model,
            instruction,
            context,
            idealResponse: output,
            verifiedByTeacher: false
          });
        }
      }

      // Success: update healthy status
      provider.lastTestStatus = "healthy";
      return output;
    } catch (err: any) {
      lastError = err;
      executionLogs.push(`Provider [${provider.name}] failed: ${err.message}`);
      console.warn(`AI failover: Provider [${provider.name}] failed, trying next fallback...`, err.message);

      if (!poolConfig.failoverEnabled) {
        throw err; // Fail fast if failover is disabled
      }
    }
  }

  throw new Error(`ALL_PROVIDERS_FAILED: ${executionLogs.join("; ")} | Last error: ${lastError?.message}`);
}

export async function generateVision({ instruction, context = "", imageDataUrl }: VisionRequest): Promise<string> {
  const poolConfig = getAIProviderPoolConfig();
  const enabledProviders = poolConfig.providers.filter(p => p.enabled && p.type !== "ollama");

  if (enabledProviders.length === 0) {
    throw new Error("VISION_REQUIRES_CLOUD_PROVIDER");
  }

  for (const provider of enabledProviders) {
    try {
      if (provider.type === "gemini") {
        return await executeGeminiVision(provider, SYSTEM_VISION, `${instruction}\n\n${context}`, imageDataUrl);
      }
    } catch (err) {
      console.warn(`Vision failover: Provider [${provider.name}] failed, trying next...`, err);
    }
  }

  throw new Error("VISION_GENERATION_FAILED_ALL_PROVIDERS");
}

// ── Provider Test Utilities ───────────────────────────────────────────────────
export async function testSingleProvider(provider: AIProviderEntry): Promise<{
  success: boolean;
  message: string;
  latencyMs: number;
}> {
  const startTime = Date.now();

  try {
    if (provider.type === "ollama") {
      const endpoint = (provider.endpoint || "http://127.0.0.1:11434").replace(/\/$/, "");
      const res = await fetch(`${endpoint}/api/tags`, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) throw new Error(`Ollama returned HTTP ${res.status}`);
      const data = await res.json();
      const models = (data.models || []).map((m: any) => m.name);
      const latencyMs = Date.now() - startTime;
      const modelPresent = models.some((m: string) => m.includes(provider.model));

      return {
        success: true,
        message: modelPresent
          ? `✓ Connected to Ollama (${models.length} local models. Selected: "${provider.model}")`
          : `✓ Connected to Ollama (${models.length} models available: ${models.slice(0, 3).join(", ") || "none"})`,
        latencyMs
      };
    } else if (provider.type === "gemini") {
      const key = provider.apiKey || process.env.AI_API_KEY;
      if (!key) throw new Error("Missing Gemini API Key.");
      const model = provider.model || "gemini-2.5-flash";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}?key=${key}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) throw new Error(`Gemini API error (HTTP ${res.status})`);
      const latencyMs = Date.now() - startTime;
      return {
        success: true,
        message: `✓ Connected to Google Gemini API (${model}, ${latencyMs}ms)`,
        latencyMs
      };
    } else {
      const baseUrl = (provider.apiBaseUrl || "https://api.openai.com/v1").replace(/\/$/, "");
      const key = provider.apiKey || process.env.AI_API_KEY;
      if (!key) throw new Error("Missing API Key for custom endpoint.");
      const res = await fetch(`${baseUrl}/models`, {
        headers: { Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(8000)
      });
      if (!res.ok) throw new Error(`Endpoint returned HTTP ${res.status}`);
      const latencyMs = Date.now() - startTime;
      return {
        success: true,
        message: `✓ Connected to ${baseUrl} (${provider.model}, ${latencyMs}ms)`,
        latencyMs
      };
    }
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    return {
      success: false,
      message: `Connection failed: ${err?.message || "Unknown error"}`,
      latencyMs
    };
  }
}

// ── Backward Compatibility Helpers ────────────────────────────────────────────


export function getAIConfiguration(): AIConfiguration {
  const pool = getAIProviderPoolConfig();
  const primary = pool.providers[0] || DEFAULT_AI_POOL_CONFIG.providers[0];
  return {
    provider: primary.type as any,
    ollamaEndpoint: primary.endpoint || "http://127.0.0.1:11434",
    ollamaModel: primary.model || "qwen2.5:3b",
    apiBaseUrl: primary.apiBaseUrl || "https://api.openai.com/v1",
    apiKey: primary.apiKey || "",
    apiModel: primary.model || "gemini-2.5-flash",
    temperature: primary.temperature ?? 0.2,
    maxTokens: primary.maxTokens ?? 4096,
    status: "connected"
  };
}

export function updateAIConfiguration(config: Partial<AIConfiguration>): AIConfiguration {
  const pool = getAIProviderPoolConfig();
  if (pool.providers[0]) {
    pool.providers[0] = {
      ...pool.providers[0],
      type: (config.provider as any) || pool.providers[0].type,
      apiKey: config.apiKey !== undefined ? config.apiKey : pool.providers[0].apiKey,
      model: config.apiModel || config.ollamaModel || pool.providers[0].model,
      endpoint: config.ollamaEndpoint || pool.providers[0].endpoint,
      apiBaseUrl: config.apiBaseUrl || pool.providers[0].apiBaseUrl,
      temperature: config.temperature !== undefined ? config.temperature : pool.providers[0].temperature,
      maxTokens: config.maxTokens !== undefined ? config.maxTokens : pool.providers[0].maxTokens
    };
    saveAIProviderPoolConfig(pool);
  }
  return getAIConfiguration();
}

export async function testAIConnection(testConfig?: Partial<AIConfiguration>): Promise<{
  success: boolean;
  message: string;
  latencyMs: number;
  model: string;
}> {
  const pool = getAIProviderPoolConfig();
  const target = pool.providers[0];
  if (!target) return { success: false, message: "No provider configured", latencyMs: 0, model: "none" };

  const result = await testSingleProvider(target);
  return {
    success: result.success,
    message: result.message,
    latencyMs: result.latencyMs,
    model: target.model
  };
}