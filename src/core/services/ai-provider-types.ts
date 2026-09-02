export type AIProviderType = "gemini" | "ollama" | "openai" | "custom";

export interface AIProviderEntry {
  id: string;
  name: string;
  type: AIProviderType;
  priority: number; // 1 = Highest / Primary, 2 = Secondary fallback, etc.
  enabled: boolean;
  apiKey?: string;
  endpoint?: string; // For Ollama or custom REST
  model: string;
  apiBaseUrl?: string; // For OpenAI or custom REST endpoints
  temperature?: number;
  maxTokens?: number;
  lastTestedAt?: string;
  lastTestStatus?: "healthy" | "unreachable" | "quota_exceeded" | "untested";
  lastTestMessage?: string;
  latencyMs?: number;
}

export interface DistilledExemplar {
  id: string;
  subject: string;
  gradeLevel?: string;
  sourceModel: string; // e.g. "gemini-2.5-pro", "gpt-4o", "teacher-verified"
  instruction: string;
  context?: string;
  idealResponse: string;
  createdAt: string;
  verifiedByTeacher?: boolean;
}

export interface AIProviderPoolConfig {
  failoverEnabled: boolean; // Auto-fallback to next provider/Ollama on failure or offline
  distillationEnabled: boolean; // Allow Ollama to learn from Gemini/OpenAI gold outputs via Few-Shot RAG
  defaultTemperature: number;
  defaultMaxTokens: number;
  providers: AIProviderEntry[];
}

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
      apiKey: "",
      model: "gemini-2.5-flash",
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
      endpoint: "http://127.0.0.1:11434",
      model: "qwen2.5:3b",
      temperature: 0.2,
      maxTokens: 4096,
      lastTestStatus: "untested"
    }
  ]
};

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
