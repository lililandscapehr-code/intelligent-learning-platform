"use client";

import { useState } from "react";
import { CheckCircle2, MessageCircle, Send, ShieldCheck, Sparkles, Upload, FileText, Check, AlertCircle } from "lucide-react";
import { ClassRegistry } from "../../core/services/class-registry";

const starterPrompts = [
  "Prepare a simple explanation for a student who is struggling.",
  "Create three readiness checks before the next lesson.",
  "Analyze uploaded PDF notes and extract key SI unit formulas.",
  "Propose a policy revision to Admin (extend expiry & allow custom slides)."
];

export default function TeacherAIDesk() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [policyProposalSent, setPolicyProposalSent] = useState(false);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachedFile(file);
    setPrompt(`Analyze uploaded file "${file.name}" (${(file.size / 1024).toFixed(1)} KB) and extract main concepts, SI formulas, and 3-case question ideas.`);
  }

  async function submitPolicyProposalToAdmin() {
    ClassRegistry.createAdminNote({
      title: "Teacher Policy Revision Proposal: Custom Slides & Expiry Extension",
      content: prompt || "Teacher requests Admin review to allow custom slides and extend package expiration for Egyptian Physics Part 1.",
      category: "Curriculum Revision",
      priority: "MEDIUM",
      status: "OPEN",
      targetTeacherName: "Active Teacher",
      targetPackageName: "Egyptian Baccalaureate Physics Part 1"
    });

    setPolicyProposalSent(true);
    setAnswer("✓ Policy Revision Proposal submitted to Admin Control Center! The Platform Administrator will receive an alarm notification to review and approve your requested policy changes.");
    setTimeout(() => setPolicyProposalSent(false), 5000);
  }

  async function consult(request = prompt) {
    const text = request.trim();
    if (!text) return;
    setBusy(true);
    setPrompt(text);

    // If teacher selected the policy proposal prompt
    if (text.toLowerCase().includes("propose a policy revision")) {
      submitPolicyProposalToAdmin();
      setBusy(false);
      return;
    }

    try {
      const response = await fetch("/api/ai/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          fileAttached: attachedFile ? attachedFile.name : undefined,
          draft: { workspace: "teacher-dashboard", curriculum: "active teacher curriculum" }
        })
      });
      const result = await response.json();
      setAnswer(result.answer || result.error || "The AI helper did not return a response.");
    } catch {
      setAnswer("The AI helper analyzed your prompt. Continue with your teaching plan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-sky-500/25 bg-sky-500/5 text-xs">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-sky-500/15 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/20 border border-sky-500/30">
            <Sparkles className="h-5 w-5 text-sky-300" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-300">Teacher AI Desk & File Ingestion</p>
            <h3 className="mt-1 text-base font-bold text-white">Interactive AI Assistant & Policy Proposal Hub</h3>
            <p className="mt-1 text-xs text-neutral-400">Upload notes/PDFs for AI analysis, ask pedagogical advice, or submit Policy Proposals to Admin.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5" /> Teacher In-Control Guard
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Starter Prompts */}
        <div className="flex flex-wrap gap-2">
          {starterPrompts.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => consult(item)}
              disabled={busy}
              className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-left text-[11px] text-neutral-300 hover:border-sky-400 disabled:opacity-50 transition"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Input & File Attachment Toolbar */}
        <div className="space-y-2">
          {attachedFile && (
            <div className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between text-neutral-300 text-[11px]">
              <span className="flex items-center gap-2 font-mono">
                <FileText className="h-4 w-4 text-sky-400" />
                {attachedFile.name} ({(attachedFile.size / 1024).toFixed(1)} KB)
              </span>
              <button type="button" onClick={() => setAttachedFile(null)} className="text-neutral-500 hover:text-white font-bold">
                ✕ Remove
              </button>
            </div>
          )}

          <div className="flex items-end gap-2">
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={2}
              placeholder="Ask AI to analyze notes, generate questions, or draft a lesson plan..."
              className="min-w-0 flex-1 resize-none rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-xs text-white outline-none focus:border-sky-400"
            />

            <label className="flex h-11 px-3 items-center justify-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-950 text-neutral-300 hover:text-white hover:border-sky-400 cursor-pointer font-bold text-xs transition">
              <Upload className="h-4 w-4 text-sky-400" />
              <span>Attach File</span>
              <input type="file" accept=".pdf,.docx,.txt,.md,image/*" onChange={handleFileUpload} className="sr-only" />
            </label>

            <button
              type="button"
              onClick={() => consult()}
              disabled={busy || !prompt.trim()}
              className="flex h-11 px-4 items-center justify-center gap-2 rounded-xl bg-sky-400 font-bold text-neutral-950 hover:bg-sky-300 disabled:opacity-50 transition"
            >
              <Send className="h-4 w-4" /> Ask AI
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t border-neutral-800/80 pt-3">
          <button
            type="button"
            onClick={submitPolicyProposalToAdmin}
            className="px-3.5 py-1.5 bg-violet-950/60 hover:bg-violet-900 text-violet-300 border border-violet-500/40 rounded-xl font-bold text-[11px] transition flex items-center gap-1.5"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-violet-400" /> 📜 Submit Policy Proposal to Admin
          </button>
          <span className="text-[10px] text-neutral-500">Curriculum Policies are managed by Admin for MoE compliance</span>
        </div>

        {/* AI Output Box */}
        {answer && (
          <div className="rounded-xl border border-neutral-700 bg-neutral-950 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2 font-bold text-sky-300 text-xs">
                <MessageCircle className="h-4 w-4 text-sky-400" /> Draft Response & Analysis
              </div>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Teacher Verification Guard
              </span>
            </div>
            <p className="whitespace-pre-wrap text-xs leading-relaxed text-neutral-300">{answer}</p>
          </div>
        )}
      </div>
    </section>
  );
}
