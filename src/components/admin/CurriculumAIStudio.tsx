"use client";

import { useState, useRef, useEffect } from "react";
import {
  Upload, FileText, Send, Sparkles, CheckCircle2, AlertCircle,
  RefreshCw, ChevronDown, ChevronRight, BookOpen, List, Layers, Cpu, ShieldCheck
} from "lucide-react";
import { ClassRegistry, CurriculumSpec, REGISTERED_CURRICULUM_SPECS } from "../../core/services/class-registry";
import { getAIProviderPoolAction } from "../../app/actions";
import { AIProviderEntry, DEFAULT_AI_POOL_CONFIG } from "../../core/services/ai-provider-types";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ChatMessage {
  role: "admin" | "ai";
  content: string;
  timestamp: string;
  agentName?: string;
}

interface StructuredCurriculum {
  chapters?: string[];
  lessons?: Array<{ id: string; title: string }>;
  summary?: string;
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function CurriculumAIStudio() {
  // Document state
  const [extractedText, setExtractedText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [parseError, setParseError] = useState("");

  // AI Agent Pool State
  const [agents, setAgents] = useState<AIProviderEntry[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userPrompt, setUserPrompt] = useState("");
  const [busy, setBusy] = useState(false);

  // Structured output & apply state
  const [structuredData, setStructuredData] = useState<StructuredCurriculum | null>(null);
  const [targetCurriculumId, setTargetCurriculumId] = useState("");
  const [applyResult, setApplyResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Panels
  const [showDocPreview, setShowDocPreview] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const availableCurriculums = Object.values(REGISTERED_CURRICULUM_SPECS) as CurriculumSpec[];

  // Load configured AI Agents from server
  useEffect(() => {
    async function loadAgents() {
      try {
        const res = await getAIProviderPoolAction();
        if (res && res.success && res.data && Array.isArray(res.data.providers)) {
          const enabled = res.data.providers.filter((p: AIProviderEntry) => p.enabled);
          setAgents(enabled);
          if (enabled.length > 0) {
            setSelectedAgentId(enabled[0].id);
          }
          return;
        }
      } catch (err) {
        console.warn("Could not load AI pool action, using defaults", err);
      }

      // Fallback default agents
      const defaultEnabled = DEFAULT_AI_POOL_CONFIG.providers.filter(p => p.enabled);
      setAgents(defaultEnabled);
      if (defaultEnabled.length > 0) {
        setSelectedAgentId(defaultEnabled[0].id);
      }
    }
    loadAgents();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Document Parsing ──────────────────────────────────────────────────────────
  async function parseDocument(file: File) {
    setParseError("");
    setExtractedText("");
    setFileName(file.name);
    setMessages([]);
    setStructuredData(null);
    setApplyResult(null);

    try {
      if (file.name.endsWith(".docx")) {
        // Dynamically import mammoth (client-side only)
        const mammoth = await import("mammoth");
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setExtractedText(result.value);
      } else if (file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        const text = await file.text();
        setExtractedText(text);
      } else {
        setParseError("Unsupported file type. Please upload .docx, .txt, or .md files.");
        return;
      }

      // Auto-suggest initial prompt
      setUserPrompt("Extract all chapter names and lesson titles from this document as a structured JSON list.");
    } catch (err) {
      setParseError("Failed to parse document. Please ensure it is a valid .docx or text file.");
      console.error(err);
    }
  }

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) parseDocument(file);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) parseDocument(file);
  }

  // ── AI Chat ───────────────────────────────────────────────────────────────────
  async function sendToAI() {
    if (!userPrompt.trim()) return;
    setBusy(true);

    const activeAgent = agents.find(a => a.id === selectedAgentId);

    const newMessage: ChatMessage = {
      role: "admin",
      content: userPrompt,
      timestamp: new Date().toISOString()
    };
    const updatedHistory = [...messages, newMessage];
    setMessages(updatedHistory);
    setUserPrompt("");

    try {
      const response = await fetch("/api/admin/curriculum-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          extractedText,
          conversationHistory: messages,
          userPrompt: newMessage.content,
          targetCurriculumId: targetCurriculumId || undefined,
          selectedAgentId: selectedAgentId || undefined
        })
      });

      const data = await response.json();

      if (data.error) {
        setMessages(prev => [...prev, {
          role: "ai",
          content: `⚠️ Error: ${data.error}`,
          timestamp: new Date().toISOString(),
          agentName: activeAgent?.name || "AI Agent"
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: "ai",
          content: data.reply,
          timestamp: new Date().toISOString(),
          agentName: data.usedAgent?.name || activeAgent?.name || "AI Agent"
        }]);
        if (data.structuredData) {
          setStructuredData(data.structuredData);
          setShowPreview(true);
        }
      }
    } catch {
      setMessages(prev => [...prev, {
        role: "ai",
        content: "Network error — could not reach selected AI Agent. Check connection.",
        timestamp: new Date().toISOString(),
        agentName: activeAgent?.name || "AI Agent"
      }]);
    } finally {
      setBusy(false);
    }
  }

  // ── Apply Structured Data to Registry ──────────────────────────────────────────
  function applyToCurriculum() {
    if (!structuredData || !targetCurriculumId) return;
    setApplyResult(null);

    const patch: Parameters<typeof ClassRegistry.adminUpdateCurriculumStructure>[1] = {};
    if (structuredData.chapters) patch.chapters = structuredData.chapters;
    if (structuredData.lessons) patch.lessons = structuredData.lessons;
    if (structuredData.summary) patch.notes = `AI Extracted Summary: ${structuredData.summary}`;

    const result = ClassRegistry.adminUpdateCurriculumStructure(targetCurriculumId, patch);
    setApplyResult(result);
    setShowPreview(false);
  }

  // ── Starter Prompts ───────────────────────────────────────────────────────────
  const starterPrompts = [
    "Extract all chapter names and lesson titles as JSON",
    "List all learning objectives mentioned in this document",
    "Summarize the curriculum scope and pedagogical approach",
    "Identify all topics in Part 1 / Term 1 only",
    "Rewrite the lesson titles to match MoE STEM standards",
    "Find all prerequisite knowledge statements in this document"
  ];

  const activeAgentObj = agents.find(a => a.id === selectedAgentId);

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header & Agent Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border border-violet-500/20 bg-violet-500/5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 border border-violet-500/30 flex-shrink-0">
            <Sparkles className="h-5 w-5 text-violet-300" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-400">Admin Curriculum AI Studio</p>
            <h3 className="mt-0.5 text-lg font-bold text-white">Multi-Agent Document Upload & Curriculum Architect</h3>
            <p className="mt-1 text-xs text-neutral-400">Upload Word documents (.docx), choose your preferred Online Cloud or Offline Local AI Agent, and apply updates directly.</p>
          </div>
        </div>

        {/* 🤖 Online Agent Selector dropdown */}
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-violet-300 uppercase tracking-wider block">Active AI Agent:</label>
            <select
              value={selectedAgentId}
              onChange={e => setSelectedAgentId(e.target.value)}
              className="bg-neutral-900 border border-violet-500/40 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-violet-400 font-bold"
            >
              {agents.length === 0 && <option value="">Loading AI Pool Agents...</option>}
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} ({agent.type.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{activeAgentObj ? activeAgentObj.type.toUpperCase() : "AI POOL"} READY</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* LEFT: Document Upload Panel */}
        <div className="space-y-4">
          {/* Upload Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 transition cursor-pointer ${
              isDragging
                ? "border-violet-400 bg-violet-500/10"
                : extractedText
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-neutral-700 bg-neutral-900/60 hover:border-violet-500/50"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx,.txt,.md"
              onChange={handleFileSelect}
              className="sr-only"
            />

            {extractedText ? (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-emerald-300 text-sm">{fileName}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{extractedText.length.toLocaleString()} characters extracted</p>
                  <p className="text-[10px] text-neutral-500 mt-1">Click to replace with another file</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-800 border border-neutral-700">
                  <Upload className="h-6 w-6 text-neutral-400" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-white text-sm">Drop your curriculum document here</p>
                  <p className="text-xs text-neutral-400 mt-1">Supports .docx · .txt · .md</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Or click to browse files</p>
                </div>
              </>
            )}
          </div>

          {parseError && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {parseError}
            </div>
          )}

          {/* Document Preview */}
          {extractedText && (
            <div className="rounded-xl border border-neutral-800 bg-neutral-950">
              <button
                type="button"
                onClick={() => setShowDocPreview(!showDocPreview)}
                className="flex w-full items-center justify-between px-4 py-3 text-xs font-bold text-neutral-300 hover:text-white"
              >
                <span className="flex items-center gap-2"><FileText className="h-3.5 w-3.5 text-violet-400" /> Document Preview</span>
                {showDocPreview ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {showDocPreview && (
                <div className="border-t border-neutral-800 px-4 py-3 max-h-48 overflow-y-auto">
                  <pre className="text-[10px] text-neutral-400 whitespace-pre-wrap leading-relaxed font-mono">
                    {extractedText.slice(0, 3000)}
                    {extractedText.length > 3000 && `\n\n... [${(extractedText.length - 3000).toLocaleString()} more characters]`}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Structured Output Preview */}
          {structuredData && showPreview && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-amber-300 flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5" /> AI-Extracted Structure
                </p>
                <span className="text-[10px] text-neutral-400">Ready to apply</span>
              </div>

              {structuredData.chapters && (
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-neutral-400 flex items-center gap-1.5">
                    <BookOpen className="h-3 w-3" /> {structuredData.chapters.length} Chapters
                  </p>
                  <ul className="space-y-0.5 pl-2">
                    {structuredData.chapters.slice(0, 6).map((ch, i) => (
                      <li key={i} className="text-[11px] text-neutral-300 truncate">• {ch}</li>
                    ))}
                    {structuredData.chapters.length > 6 && (
                      <li className="text-[10px] text-neutral-500">... and {structuredData.chapters.length - 6} more</li>
                    )}
                  </ul>
                </div>
              )}

              {structuredData.lessons && (
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-neutral-400 flex items-center gap-1.5">
                    <List className="h-3 w-3" /> {structuredData.lessons.length} Lessons
                  </p>
                  <ul className="space-y-0.5 pl-2">
                    {structuredData.lessons.slice(0, 5).map((l, i) => (
                      <li key={i} className="text-[11px] text-neutral-300 truncate">• {l.title}</li>
                    ))}
                    {structuredData.lessons.length > 5 && (
                      <li className="text-[10px] text-neutral-500">... and {structuredData.lessons.length - 5} more</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Target Curriculum Selector */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-neutral-400">Apply to Curriculum:</p>
                <select
                  value={targetCurriculumId}
                  onChange={e => setTargetCurriculumId(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-violet-500"
                >
                  <option value="">— Select target curriculum —</option>
                  {availableCurriculums.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={applyToCurriculum}
                disabled={!targetCurriculumId}
                className="w-full py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Apply to Curriculum Registry
              </button>

              {applyResult && (
                <div className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 text-xs ${
                  applyResult.success
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border-red-500/30 bg-red-500/10 text-red-300"
                }`}>
                  {applyResult.success
                    ? <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    : <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  }
                  <span>{applyResult.message}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Selected AI Agent Chat Panel */}
        <div className="flex flex-col gap-3">
          {/* Starter Prompts */}
          {extractedText && messages.length === 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Suggested Prompts</p>
              <div className="flex flex-wrap gap-1.5">
                {starterPrompts.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setUserPrompt(p)}
                    className="rounded-lg border border-neutral-700 bg-neutral-900 px-2.5 py-1.5 text-[11px] text-neutral-300 hover:border-violet-500/50 hover:text-white transition"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat History */}
          <div className="flex-1 rounded-2xl border border-neutral-800 bg-neutral-950 flex flex-col min-h-[320px] max-h-[520px]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
              <p className="text-xs font-bold text-neutral-300 flex items-center gap-2">
                <Cpu className="h-3.5 w-3.5 text-violet-400" />
                <span>Chat with: <strong className="text-white">{activeAgentObj?.name || "Default Agent"}</strong></span>
              </p>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => { setMessages([]); setStructuredData(null); setApplyResult(null); }}
                  className="text-[10px] text-neutral-500 hover:text-white flex items-center gap-1 transition"
                >
                  <RefreshCw className="h-3 w-3" /> Clear
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-8">
                  <div className="h-12 w-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-violet-400" />
                  </div>
                  <p className="text-xs text-neutral-500 max-w-[220px]">
                    {extractedText
                      ? `Document loaded. Ask ${activeAgentObj?.name || "the agent"} to parse curriculum data.`
                      : "Upload a curriculum document to begin."}
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2.5 ${msg.role === "admin" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    msg.role === "admin"
                      ? "bg-sky-500/20 border border-sky-500/30 text-sky-300"
                      : "bg-violet-500/20 border border-violet-500/30 text-violet-300"
                  }`}>
                    {msg.role === "admin" ? "A" : "AI"}
                  </div>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    msg.role === "admin"
                      ? "bg-sky-500/10 border border-sky-500/20 text-sky-100 rounded-tr-sm"
                      : "bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-tl-sm"
                  }`}>
                    {msg.role === "ai" && msg.agentName && (
                      <p className="text-[9px] font-bold text-violet-400 mb-1">🤖 {msg.agentName}</p>
                    )}
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-[9px] text-neutral-600 mt-1.5">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}

              {busy && (
                <div className="flex gap-2.5">
                  <div className="h-7 w-7 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-[10px] text-violet-300 font-bold">AI</div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map(d => (
                        <div key={d} className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-neutral-800 p-3 flex gap-2">
              <textarea
                value={userPrompt}
                onChange={e => setUserPrompt(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendToAI(); } }}
                rows={2}
                disabled={!extractedText && messages.length === 0}
                placeholder={extractedText ? `Ask ${activeAgentObj?.name || "AI"} about the document...` : "Upload a document first..."}
                className="flex-1 resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white outline-none focus:border-violet-500 disabled:opacity-40 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={sendToAI}
                disabled={busy || !userPrompt.trim()}
                className="flex h-full px-4 items-center justify-center gap-1.5 rounded-xl bg-violet-500 hover:bg-violet-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs transition self-end py-2"
              >
                <Send className="h-3.5 w-3.5" />
                Ask
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
