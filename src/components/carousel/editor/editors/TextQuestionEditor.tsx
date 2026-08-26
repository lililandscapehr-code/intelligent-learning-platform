"use client";

import React, { useState } from "react";
import RichTextEditor from "../RichTextEditor";
import { QuestionAlternative, QuestionTextSlide, QuestionTranslations } from "../../CarouselTypes";
import {
  Brain,
  ChevronDown,
  ChevronRight,
  Globe,
  Loader2,
  Package,
  Plus,
  Rocket,
  Sparkles,
  Trash2,
  CheckCircle2,
} from "lucide-react";

interface Props {
  slide: QuestionTextSlide;
  onChange: (update: Partial<QuestionTextSlide>) => void;
}

const TARGET_COLORS: Record<string, string> = {
  vocabulary: "amber",
  concept: "sky",
  procedure: "violet",
  arithmetic: "emerald",
  representation: "rose",
};

export default function TextQuestionEditor({ slide, onChange }: Props) {
  // Alternatives authoring state
  const [groupACount, setGroupACount] = useState(5);
  const [groupBCount, setGroupBCount] = useState(3);
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState("");

  // Translations state
  const [selectedLangs, setSelectedLangs] = useState<string[]>(["ar", "fr"]);
  const [transLoading, setTransLoading] = useState(false);
  const [transError, setTransError] = useState("");

  // Practice carousel export state
  const [exportLoading, setExportLoading] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const alternatives = slide.alternatives || [];
  const groupA = alternatives.filter((a) => a.group === "A");
  const groupB = alternatives.filter((a) => a.group === "B");
  const translations = slide.translations || {};

  // ── 1. Generate Alternatives ─────────────────────────────────
  async function handleGenerateAlternatives() {
    if (!slide.questionText?.trim()) {
      setGenError("Please enter question text first.");
      return;
    }

    setGenLoading(true);
    setGenError("");

    try {
      const res = await fetch("/api/ai/generate-alternatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText: slide.questionText,
          sampleAnswer: slide.sampleAnswer,
          groupACount,
          groupBCount,
          skillContext: slide.title || "",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");

      const combined = [...(data.groupA || []), ...(data.groupB || [])];
      onChange({ alternatives: combined });
    } catch (err: any) {
      setGenError(err.message || "Generation failed.");
    } finally {
      setGenLoading(false);
    }
  }

  // ── 2. Update single alternative ─────────────────────────────
  function updateAlt(altId: string, patch: Partial<QuestionAlternative>) {
    const updated = alternatives.map((a) => (a.id === altId ? { ...a, ...patch } : a));
    onChange({ alternatives: updated });
  }

  function deleteAlt(altId: string) {
    const updated = alternatives.filter((a) => a.id !== altId);
    onChange({ alternatives: updated });
  }

  // ── 3. Generate Translations ─────────────────────────────────
  async function handleTranslate() {
    if (!slide.questionText?.trim() || selectedLangs.length === 0) return;

    setTransLoading(true);
    setTransError("");

    try {
      const res = await fetch("/api/ai/translate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText: slide.questionText,
          alternatives,
          targetLanguages: selectedLangs,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Translation failed");

      onChange({
        translations: {
          ...translations,
          ...(data.translations || {}),
        },
      });
    } catch (err: any) {
      setTransError(err.message || "Translation failed.");
    } finally {
      setTransLoading(false);
    }
  }

  // ── 4. Export as Practice Carousel ───────────────────────────
  async function handleExportPractice() {
    setExportLoading(true);
    setExportSuccess(null);

    try {
      const res = await fetch("/api/ai/build-practice-carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionSlide: slide,
          lessonTitle: slide.title || "Targeted Practice",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Export failed");

      // Download JSON directly
      const blob = new Blob([JSON.stringify(data.carousel, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.carousel.id}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setExportSuccess(`Practice carousel with ${data.stats.totalSlides} slides downloaded! You can import it into Studio.`);
    } catch (err: any) {
      setGenError(err.message || "Failed to create practice carousel.");
    } finally {
      setExportLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Core Question Content (Case B) ────────────────────── */}
      <div className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-2">
          ⭐ Case B: Core Master Standard Question (Basic / Mid Level)
        </h3>

        <RichTextEditor
          label="Question prompt (Standard Curriculum Level)"
          value={slide.questionText || ""}
          onChange={(val) => onChange({ questionText: val })}
          accentColor="violet"
          rows={4}
        />

        <label className="block text-xs font-semibold text-neutral-400">
          Placeholder hint for student
          <input
            type="text"
            value={slide.placeholder || ""}
            onChange={(e) => onChange({ placeholder: e.target.value })}
            className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
          />
        </label>

        <RichTextEditor
          label="Sample answer & rubric notes (teacher reference only)"
          value={slide.sampleAnswer || ""}
          onChange={(val) => onChange({ sampleAnswer: val })}
          accentColor="violet"
          rows={3}
        />

        <div className="flex gap-4">
          <label className="block flex-1 text-xs font-semibold text-neutral-400">
            Points
            <input
              type="number"
              min="0"
              step="0.5"
              value={slide.points || 1}
              onChange={(e) => onChange({ points: parseFloat(e.target.value) || 0 })}
              className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
            />
          </label>

          <label className="block flex-1 text-xs font-semibold text-neutral-400">
            ⏱ Answer timer (0 = unlimited)
            <input
              type="number"
              min="0"
              value={slide.timerSeconds || 0}
              onChange={(e) => onChange({ timerSeconds: parseInt(e.target.value) || 0 })}
              className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
            />
          </label>
        </div>
      </div>

      {/* ── AI Alternatives Authoring (Case Pre & Case C) ──────── */}
      <div className="space-y-4 rounded-xl border border-violet-800/40 bg-violet-950/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-violet-300">
              3-Tier Question DNA: Case Pre (10 Trials) & Case C (Higher Questions)
            </h3>
          </div>
          <span className="rounded bg-violet-900/50 px-2 py-0.5 text-[10px] font-bold text-violet-300">
            {alternatives.length} Generated
          </span>
        </div>

        <p className="text-[11px] text-neutral-400 leading-relaxed">
          Pre-generate up to 10 progressive practice trials (<strong>Case Pre</strong>) that simplify the same question step by step when students struggle, plus higher-level challenge escalations (<strong>Case C</strong>).
        </p>

        {/* Generation Controls */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-lg border border-neutral-800 bg-neutral-900/60 p-3">
          <div>
            <label className="text-[11px] font-semibold text-amber-300">
              🌱 Case Pre: Scaffolding ({groupACount} Trials)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={groupACount}
              onChange={(e) => setGroupACount(parseInt(e.target.value))}
              className="w-full accent-amber-500"
            />
            <p className="text-[10px] text-neutral-500">
              Simplifies the same question step-by-step for practice & diagnosis
            </p>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-sky-300">
              🚀 Case C: Higher Complexity ({groupBCount} Trials)
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={groupBCount}
              onChange={(e) => setGroupBCount(parseInt(e.target.value))}
              className="w-full accent-sky-500"
            />
            <p className="text-[10px] text-neutral-500">
              Higher / reverse questions testing the same concept in depth
            </p>
          </div>
        </div>

        {genError && (
          <p className="text-xs text-rose-400 bg-rose-900/20 p-2 rounded-lg border border-rose-800/40">
            {genError}
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleGenerateAlternatives}
            disabled={genLoading || !slide.questionText}
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-500 disabled:opacity-50 transition"
          >
            {genLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            {genLoading ? "Generating DNA Ladders..." : "Generate Both Groups with AI"}
          </button>

          {alternatives.length > 0 && (
            <button
              type="button"
              onClick={handleExportPractice}
              disabled={exportLoading}
              className="flex items-center gap-2 rounded-lg border border-sky-600/50 bg-sky-600/10 px-3 py-2 text-xs font-bold text-sky-300 hover:bg-sky-600/20 transition"
            >
              {exportLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Package className="h-3.5 w-3.5" />}
              Export as Practice Carousel
            </button>
          )}
        </div>

        {exportSuccess && (
          <p className="text-xs text-emerald-300 bg-emerald-900/20 p-2 rounded-lg border border-emerald-800/40">
            {exportSuccess}
          </p>
        )}

        {/* ── Group A List ───────────────────────────────────── */}
        {groupA.length > 0 && (
          <div className="space-y-2 mt-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              🌱 Group A: Scaffold Down (Diagnostic Probes)
            </h4>
            {groupA.map((alt) => {
              const targetColor = TARGET_COLORS[alt.diagnosticTarget || "concept"] || "violet";
              return (
                <div
                  key={alt.id}
                  className="rounded-lg border border-neutral-800 bg-neutral-900/80 p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">
                        Level A-{alt.level}
                      </span>
                      <span
                        className={`rounded bg-${targetColor}-500/20 px-1.5 py-0.5 text-[10px] font-bold text-${targetColor}-300 uppercase`}
                      >
                        Target: {alt.diagnosticTarget || "concept"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteAlt(alt.id)}
                      className="text-neutral-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={alt.questionText}
                    onChange={(e) => updateAlt(alt.id, { questionText: e.target.value })}
                    className="w-full rounded border border-neutral-700 bg-neutral-950 px-2.5 py-1.5 text-xs text-white outline-none focus:border-amber-500"
                  />

                  {alt.analogy && (
                    <div className="text-[10px] text-amber-300/80 bg-amber-950/30 px-2 py-1 rounded border border-amber-900/30">
                      💡 Analogy: {alt.analogy}
                    </div>
                  )}

                  {alt.simplificationNote && (
                    <p className="text-[10px] text-neutral-500 italic">
                      Diagnostic note: {alt.simplificationNote}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Group B List ───────────────────────────────────── */}
        {groupB.length > 0 && (
          <div className="space-y-2 mt-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <Rocket className="h-3.5 w-3.5" /> Group B: Challenge Escalations (Optional for Students)
            </h4>
            {groupB.map((alt) => (
              <div
                key={alt.id}
                className="rounded-lg border border-neutral-800 bg-neutral-900/80 p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded bg-sky-500/20 px-1.5 py-0.5 text-[10px] font-bold text-sky-300">
                    Challenge Level B-{alt.level}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteAlt(alt.id)}
                    className="text-neutral-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <input
                  type="text"
                  value={alt.questionText}
                  onChange={(e) => updateAlt(alt.id, { questionText: e.target.value })}
                  className="w-full rounded border border-neutral-700 bg-neutral-950 px-2.5 py-1.5 text-xs text-white outline-none focus:border-sky-500"
                />

                {alt.challengeNote && (
                  <p className="text-[10px] text-sky-300/80 italic">
                    Escalation: {alt.challengeNote}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Multi-Language Pre-Translation ────────────────────── */}
      <div className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Pre-Translated Language Packs
            </h3>
          </div>
          <div className="flex gap-1">
            {Object.keys(translations).map((lang) => (
              <span
                key={lang}
                className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-300"
              >
                {lang} ✓
              </span>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-neutral-400">
          Select target languages to pre-translate this question and all its alternatives. Students can instantly switch language at runtime with zero AI lag.
        </p>

        <div className="flex flex-wrap gap-2">
          {[
            { code: "ar", label: "Arabic (العربية)" },
            { code: "fr", label: "French (Français)" },
            { code: "de", label: "German (Deutsch)" },
            { code: "es", label: "Spanish (Español)" },
            { code: "tr", label: "Turkish (Türkçe)" },
          ].map(({ code, label }) => {
            const checked = selectedLangs.includes(code);
            return (
              <button
                key={code}
                type="button"
                onClick={() => {
                  if (checked) setSelectedLangs(selectedLangs.filter((c) => c !== code));
                  else setSelectedLangs([...selectedLangs, code]);
                }}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition ${
                  checked
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300 font-semibold"
                    : "border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-neutral-600"
                }`}
              >
                {checked && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                {label}
              </button>
            );
          })}
        </div>

        {transError && (
          <p className="text-xs text-rose-400 bg-rose-900/20 p-2 rounded-lg border border-rose-800/40">
            {transError}
          </p>
        )}

        <button
          type="button"
          onClick={handleTranslate}
          disabled={transLoading || selectedLangs.length === 0 || !slide.questionText}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-50 transition"
        >
          {transLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Globe className="h-3.5 w-3.5" />}
          {transLoading ? "Translating with AI..." : "Pre-Translate into Selected Languages"}
        </button>
      </div>
    </div>
  );
}
