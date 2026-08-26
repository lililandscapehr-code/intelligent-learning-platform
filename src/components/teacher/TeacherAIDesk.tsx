"use client";

import { useState } from "react";
import { CheckCircle2, MessageCircle, Send, ShieldCheck, Sparkles } from "lucide-react";

const starterPrompts = [
  "Prepare a simple explanation for a student who is struggling.",
  "Create three readiness checks before the next lesson.",
  "Suggest a calm message to encourage this student.",
  "Draft a parent-safe progress summary without private notes."
];

export default function TeacherAIDesk() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);

  async function consult(request = prompt) {
    const text = request.trim();
    if (!text) return;
    setBusy(true);
    setPrompt(text);
    try {
      const response = await fetch("/api/ai/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, draft: { workspace: "teacher-dashboard", curriculum: "active teacher curriculum" } })
      });
      const result = await response.json();
      setAnswer(result.answer || result.error || "The AI helper did not return a response.");
    } catch {
      setAnswer("The AI helper is unavailable. Continue with the teacher-led plan and try again later.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-xl border border-sky-500/25 bg-sky-500/5">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-sky-500/15 p-5">
        <div className="flex items-start gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/15"><Sparkles className="h-5 w-5 text-sky-300" /></div><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-300">Teacher preparation desk</p><h3 className="mt-1 text-lg font-bold text-white">Think through the next teaching move</h3><p className="mt-1 text-xs text-neutral-400">Ask for a draft explanation, readiness check, intervention idea, or family-safe summary.</p></div></div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-[10px] font-bold text-emerald-300"><ShieldCheck className="h-3.5 w-3.5" /> Teacher reviews every suggestion</div>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2">{starterPrompts.map((item) => <button type="button" key={item} onClick={() => consult(item)} disabled={busy} className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-left text-[11px] text-neutral-300 hover:border-sky-400 disabled:opacity-50">{item}</button>)}</div>
        <div className="mt-4 flex gap-2"><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={2} placeholder="What are you preparing for this student or class?" className="min-w-0 flex-1 resize-y rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-400" /><button type="button" onClick={() => consult()} disabled={busy || !prompt.trim()} aria-label="Ask AI helper" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-400 text-neutral-950 hover:bg-sky-300 disabled:opacity-50"><Send className="h-4 w-4" /></button></div>
        {answer && <div className="mt-4 rounded-lg border border-neutral-700 bg-neutral-950 p-4"><div className="flex items-center gap-2 text-xs font-bold text-sky-300"><MessageCircle className="h-4 w-4" /> Draft response for teacher review</div><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-neutral-300">{answer}</p><p className="mt-4 flex items-center gap-2 text-[10px] text-neutral-500"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Nothing is sent, published, or graded automatically.</p></div>}
      </div>
    </section>
  );
}
