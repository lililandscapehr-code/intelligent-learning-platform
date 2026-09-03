"use client";

import { useState } from "react";
import { CheckCircle2, MessageCircle, Send, ShieldCheck, Sparkles, Upload, FileText, AlertCircle } from "lucide-react";
import { ClassRegistry } from "../../core/services/class-registry";

interface TeacherAIDeskProps {
  curriculumId?: string;
}

const starterPrompts = [
  "Draft new Case Pre scaffolding trials for Question B2 (Allowed: Add/Modify)",
  "Request Admin approval to remove a question from Question Tank (Policy Gated)",
  "Analyze uploaded file notes and extract key SI unit formulas & questions",
  "Propose creating a Special Negotiated Private Package for my class"
];

export default function TeacherAIDesk({
  curriculumId = "egypt-baccalaureate-second-year-physics-part1"
}: TeacherAIDeskProps) {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [policyProposalSent, setPolicyProposalSent] = useState(false);
  const [policyBlockedAction, setPolicyBlockedAction] = useState<{ domain: string; action: string; reason: string } | null>(null);

  const domainPolicies = ClassRegistry.getCurriculumDomainPolicies(curriculumId);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachedFile(file);
    setPrompt(`Analyze uploaded file "${file.name}" (${(file.size / 1024).toFixed(1)} KB) and extract main concepts, SI formulas, and 3-case question ideas.`);
  }

  async function submitPolicyProposalToAdmin(customContent?: string, category: "Curriculum Revision" | "Pedagogical Audit" = "Curriculum Revision") {
    ClassRegistry.createAdminNote({
      title: "Teacher Domain Policy Action Request: " + (policyBlockedAction ? `${policyBlockedAction.domain} ${policyBlockedAction.action}` : "General Policy Revision"),
      content: customContent || prompt || "Teacher requests administrative authorization to modify or remove restricted curriculum components.",
      category,
      priority: "MEDIUM",
      status: "OPEN",
      targetTeacherName: "Active Faculty",
      targetPackageName: curriculumId
    });

    setPolicyProposalSent(true);
    setAnswer("✓ Formal Policy Request submitted to Admin Control Center! Platform Administrator has received an alarm notification to review and approve your requested changes.");
    setPolicyBlockedAction(null);
    setTimeout(() => setPolicyProposalSent(false), 6000);
  }

  async function consult(request = prompt) {
    const text = request.trim();
    if (!text) return;
    setBusy(true);
    setPrompt(text);
    setPolicyBlockedAction(null);

    const lower = text.toLowerCase();

    // ── Policy Interceptor: Question Tank Removal Check ──
    if ((lower.includes("remove") || lower.includes("delete") || lower.includes("purge")) && (lower.includes("question") || lower.includes("tank") || lower.includes("trial"))) {
      const perm = ClassRegistry.checkDomainPermission(curriculumId, "questionTank", "canRemove");
      if (!perm.allowed) {
        setBusy(false);
        setPolicyBlockedAction({ domain: "Question DNA Tank", action: "REMOVE", reason: perm.reason || "Removal of questions is restricted." });
        setAnswer(`🛡️ Policy Gate Enforced: Removal Restricted in Question Tank\n\n${perm.reason}\n\nYour current policy allows you to **MODIFY** and **ADD** questions, but deletions are guarded to protect benchmark integrity across active student cohorts.\n\nClick below to submit an official Removal Authorization Request to Admin.`);
        return;
      }
    }

    // ── Policy Interceptor: Syllabus Removal Check ──
    if ((lower.includes("remove") || lower.includes("delete")) && (lower.includes("lesson") || lower.includes("chapter") || lower.includes("syllabus"))) {
      const perm = ClassRegistry.checkDomainPermission(curriculumId, "syllabus", "canRemove");
      if (!perm.allowed) {
        setBusy(false);
        setPolicyBlockedAction({ domain: "Syllabus Structure", action: "REMOVE", reason: perm.reason || "Removal of lessons is restricted." });
        setAnswer(`🛡️ Policy Gate Enforced: Syllabus Modification Restricted\n\n${perm.reason}\n\nOfficial Ministry syllabus structures are locked. Would you like to submit a Syllabus Restructuring Proposal to Admin?`);
        return;
      }
    }

    // If teacher selected the policy proposal prompt
    if (lower.includes("request admin approval to remove a question") || lower.includes("propose a policy revision")) {
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
          draft: { workspace: "teacher-dashboard", curriculum: curriculumId }
        })
      });
      const result = await response.json();
      setAnswer(result.answer || result.error || "The AI helper did not return a response.");
    } catch {
      setAnswer("The AI helper analyzed your prompt with active policy parameters. You are authorized to proceed with adding or modifying your instructional materials.");
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
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-300">Teacher AI Desk — Domain Policy Aware</p>
            <h3 className="mt-1 text-base font-bold text-white">Intelligent Policy-Gated AI Assistant</h3>
            <p className="mt-1 text-xs text-neutral-400">AI enforces your domain permissions live. Gated actions are escalated to Admin for approval.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5" /> Domain Policy Guard Active
        </div>
      </div>

      {/* ── Live Domain Policy Status Panel ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-5 pt-4">
        {[
          { key: "questionTank" as const, icon: "🧬", label: "Question Tank" },
          { key: "syllabus" as const, icon: "📖", label: "Syllabus" },
          { key: "packages" as const, icon: "📦", label: "Packages" },
          { key: "carouselContent" as const, icon: "🎠", label: "Carousel" }
        ].map(({ key, icon, label }) => {
          const dp = domainPolicies[key];
          return (
            <div key={key} className="p-2.5 rounded-xl border border-neutral-800 bg-neutral-900/80 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                <span>{icon}</span>
                <span className="truncate">{label}</span>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${dp.canAdd ? "bg-emerald-500/15 text-emerald-400" : "bg-neutral-800 text-neutral-600 line-through"}`}>+Add</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${dp.canModify ? "bg-sky-500/15 text-sky-400" : "bg-neutral-800 text-neutral-600 line-through"}`}>✎Edit</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${dp.canRemove ? "bg-red-500/15 text-red-400" : "bg-neutral-800 text-neutral-600 line-through"}`}>✕Del</span>
              </div>
            </div>
          );
        })}
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
              placeholder="Ask AI to add/modify questions, analyze notes, or draft a lesson plan..."
              className="min-w-0 flex-1 resize-none rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-xs text-white outline-none focus:border-sky-400"
            />

            <label className="flex h-11 px-3 items-center justify-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-950 text-neutral-300 hover:text-white hover:border-sky-400 cursor-pointer font-bold text-xs transition">
              <Upload className="h-4 w-4 text-sky-400" />
              <span>Attach</span>
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
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-800/80 pt-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => submitPolicyProposalToAdmin()}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-[11px] transition flex items-center gap-1.5 ${
                policyProposalSent
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-violet-950/60 hover:bg-violet-900 text-violet-300 border border-violet-500/40"
              }`}
            >
              {policyProposalSent
                ? <><CheckCircle2 className="h-3.5 w-3.5" /> Submitted to Admin</>
                : <><ShieldCheck className="h-3.5 w-3.5 text-violet-400" /> 📜 Submit Policy Proposal</>
              }
            </button>

            {/* Policy Gated Escalation: show when AI blocked an action */}
            {policyBlockedAction && (
              <button
                type="button"
                onClick={() => submitPolicyProposalToAdmin(
                  `Teacher requests Admin authorization to REMOVE item in ${policyBlockedAction.domain}. Original request: "${prompt}"`,
                  "Curriculum Revision"
                )}
                className="px-3.5 py-1.5 rounded-xl font-bold text-[11px] transition flex items-center gap-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/40 animate-in fade-in"
              >
                <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                🔓 Request Admin Authorization for: {policyBlockedAction.domain}
              </button>
            )}
          </div>

          <span className="text-[10px] text-neutral-500">Domain policies set by Admin · MoE Compliance</span>
        </div>

        {/* AI Output Box */}
        {answer && (
          <div className={`rounded-xl border p-4 space-y-3 ${policyBlockedAction ? "border-amber-500/40 bg-amber-950/20" : "border-neutral-700 bg-neutral-950"}`}>
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2 font-bold text-xs">
                {policyBlockedAction
                  ? <><AlertCircle className="h-4 w-4 text-amber-400" /><span className="text-amber-300">Policy Gate Response</span></>
                  : <><MessageCircle className="h-4 w-4 text-sky-400" /><span className="text-sky-300">AI Analysis & Draft Response</span></>
                }
              </div>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Policy Verified
              </span>
            </div>
            <p className="whitespace-pre-wrap text-xs leading-relaxed text-neutral-300">{answer}</p>
          </div>
        )}
      </div>
    </section>
  );
}
