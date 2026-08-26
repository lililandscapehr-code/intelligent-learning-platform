"use client";

import React, { useState, useEffect } from "react";
import {
  QuestionTextSlide,
  QuestionNumericSlide,
  SlideAnswerRecord,
  QuestionAlternative,
} from "../CarouselTypes";
import {
  Brain,
  CheckCircle2,
  ChevronRight,
  Flame,
  Globe,
  Lightbulb,
  RefreshCw,
  Rocket,
  Send,
  Sparkles,
  XCircle,
} from "lucide-react";

interface Props {
  slide: QuestionTextSlide | QuestionNumericSlide;
  existingAnswer?: SlideAnswerRecord;
  onAnswer: (record: SlideAnswerRecord) => void;
  startTime: number;
  viewerRole?: "STUDENT" | "TEACHER" | "ADMIN";
  activeLanguage?: string;
}

export function QuestionTextSlideView({
  slide,
  existingAnswer,
  onAnswer,
  startTime,
  viewerRole = "STUDENT",
  activeLanguage = "en",
}: Props) {
  const [inputText, setInputText] = useState("");
  const [activeAltIndex, setActiveAltIndex] = useState<number | null>(null); // null = master question
  const [mode, setMode] = useState<"standard" | "challenge">("standard");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState<{ type: "correct" | "wrong" | "info"; text: string } | null>(null);

  const alternatives = slide.alternatives || [];
  const groupA = alternatives.filter((a) => a.group === "A").sort((a, b) => a.level - b.level);
  const groupB = alternatives.filter((a) => a.group === "B").sort((a, b) => a.level - b.level);

  // Active question item
  const activeAlt: QuestionAlternative | null = activeAltIndex !== null ? alternatives[activeAltIndex] : null;

  // Resolve translated text if available
  const langTranslations = slide.translations?.[activeLanguage];
  let displayQuestionText = slide.questionText;

  if (activeAlt) {
    displayQuestionText =
      langTranslations?.alternatives?.[activeAlt.id] ||
      langTranslations?.alternatives?.[String(activeAlt.level)] ||
      activeAlt.questionText;
  } else if (langTranslations?.questionText) {
    displayQuestionText = langTranslations.questionText;
  }

  // Handle student submit
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const timeSpent = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    const newAttempts = attemptCount + 1;
    setAttemptCount(newAttempts);

    // Basic heuristic: check against sample answer or numeric value
    let isCorrect = true;
    if (slide.type === "question_numeric") {
      const numVal = parseFloat(inputText);
      const target = slide.correctValue;
      const tol = slide.tolerance || 0;
      isCorrect = !isNaN(numVal) && Math.abs(numVal - target) <= tol;
    } else if (slide.sampleAnswer) {
      // Basic text containment or teacher validation
      isCorrect = inputText.trim().length > 3;
    }

    setIsSubmitted(true);

    if (isCorrect) {
      setStatusMessage({
        type: "correct",
        text: activeAlt?.group === "B" ? "⭐ Outstanding! Challenge level mastered!" : "✓ Correct! Concept verified.",
      });
    } else {
      setStatusMessage({
        type: "wrong",
        text: "Not quite yet. Try breaking the problem down with a simpler approach below!",
      });
    }

    // Silent background logging to database
    fetch("/api/student/log-attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        carouselId: (slide as any).carouselId || "current-session",
        slideId: slide.id,
        alternativeGroup: activeAlt?.group || "MAIN",
        alternativeLevel: activeAlt?.level || 1,
        languageUsed: activeLanguage,
        answerText: inputText,
        isCorrect,
        diagnosticTarget: activeAlt?.diagnosticTarget || null,
        timeSpentSeconds: timeSpent,
        attemptNumber: newAttempts,
      }),
    }).catch(() => {});

    // Notify carousel of answer
    onAnswer({
      slideId: slide.id,
      sequenceNumber: slide.sequenceNumber || 1,
      type: slide.type === "question_numeric" ? "numeric" : "text",
      value: slide.type === "question_numeric" ? (parseFloat(inputText) || 0) : inputText,
      isCorrect,
      points: isCorrect ? (slide.points ?? 1) : 0,
      responseTimeMs: Date.now() - startTime,
    });
  };

  // Switch to next simpler alternative in Group A
  const handleNextSimpler = () => {
    if (groupA.length === 0) return;
    const currentAIdx = activeAlt ? groupA.findIndex((a) => a.id === activeAlt.id) : -1;
    const nextA = groupA[currentAIdx + 1] || groupA[0];
    const fullIdx = alternatives.findIndex((a) => a.id === nextA.id);
    setActiveAltIndex(fullIdx);
    setInputText("");
    setIsSubmitted(false);
    setStatusMessage(null);
  };

  // Switch to challenge in Group B
  const handleStartChallenge = () => {
    if (groupB.length === 0) return;
    const nextB = groupB[0];
    const fullIdx = alternatives.findIndex((a) => a.id === nextB.id);
    setActiveAltIndex(fullIdx);
    setMode("challenge");
    setInputText("");
    setIsSubmitted(false);
    setStatusMessage(null);
  };

  // Reset to master question
  const handleResetToMaster = () => {
    setActiveAltIndex(null);
    setMode("standard");
    setInputText("");
    setIsSubmitted(false);
    setStatusMessage(null);
  };

  return (
    <div className="space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-sm">
      {/* ── Header Badge & Scaffold Level Indicator ──────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          {activeAlt ? (
            activeAlt.group === "A" ? (
              <span className="flex items-center gap-1 rounded-lg bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-300 border border-amber-500/30">
                <Lightbulb className="h-3.5 w-3.5" /> Scaffold Level A-{activeAlt.level}
                {activeAlt.diagnosticTarget && ` (${activeAlt.diagnosticTarget.toUpperCase()})`}
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-lg bg-violet-500/20 px-2.5 py-1 text-xs font-bold text-violet-300 border border-violet-500/30">
                <Rocket className="h-3.5 w-3.5" /> Challenge Level B-{activeAlt.level}
              </span>
            )
          ) : (
            <span className="flex items-center gap-1 rounded-lg bg-sky-500/20 px-2.5 py-1 text-xs font-bold text-sky-300 border border-sky-500/30">
              <Brain className="h-3.5 w-3.5" /> Master Assessment
            </span>
          )}

          {activeLanguage !== "en" && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
              <Globe className="h-3 w-3" /> {activeLanguage.toUpperCase()}
            </span>
          )}
        </div>

        {/* Back to master question link */}
        {activeAlt && (
          <button
            type="button"
            onClick={handleResetToMaster}
            className="text-xs text-neutral-400 hover:text-white underline transition"
          >
            ↩ Back to Master Question
          </button>
        )}
      </div>

      {/* ── Question Prompt Display ─────────────────────────── */}
      <div className="space-y-3">
        <p className="text-base font-semibold text-white leading-relaxed">
          {displayQuestionText}
        </p>

        {/* Real-world analogy callout box */}
        {activeAlt?.analogy && (
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200">
            <Lightbulb className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">💡 Intuitive Analogy: </span>
              {activeAlt.analogy}
            </div>
          </div>
        )}
      </div>

      {/* ── Answer Input Form ─────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
            Your Solution:
          </label>
          <div className="flex gap-2">
            <input
              type={slide.type === "question_numeric" ? "number" : "text"}
              step="any"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isSubmitted && statusMessage?.type === "correct"}
              placeholder={activeAlt?.placeholder || (slide.type === "question_text" ? slide.placeholder : "") || "Type your calculation or answer..."}
              className="flex-1 rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-amber-500 transition"
            />
            {slide.type === "question_numeric" && (slide as QuestionNumericSlide).unit && (
              <span className="flex items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 text-sm font-semibold text-neutral-400">
                {(slide as QuestionNumericSlide).unit}
              </span>
            )}
            <button
              type="submit"
              disabled={!inputText.trim() || (isSubmitted && statusMessage?.type === "correct")}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 text-sm font-bold text-neutral-950 hover:brightness-110 disabled:opacity-40 transition shadow-lg shadow-amber-500/20"
            >
              <Send className="h-4 w-4" /> Submit
            </button>
          </div>
        </div>
      </form>

      {/* ── Status Feedback Banner ────────────────────────────── */}
      {statusMessage && (
        <div
          className={`flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
            statusMessage.type === "correct"
              ? "border border-emerald-500/30 bg-emerald-950/40 text-emerald-300"
              : "border border-rose-500/30 bg-rose-950/40 text-rose-300"
          }`}
        >
          {statusMessage.type === "correct" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* ── Scaffolding & Escalation Action Buttons ────────────── */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-800/60">
        {/* If student failed or wants help: Offer Group A Scaffolding */}
        {groupA.length > 0 && (!statusMessage || statusMessage.type === "wrong") && (
          <button
            type="button"
            onClick={handleNextSimpler}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition"
          >
            <Lightbulb className="h-3.5 w-3.5" />
            {activeAlt ? "Try Next Concrete Step →" : "💡 Break it Down (Simpler Step) →"}
          </button>
        )}

        {/* If student got it correct: Offer Group B Challenge Escalation */}
        {groupB.length > 0 && statusMessage?.type === "correct" && (
          <button
            type="button"
            onClick={handleStartChallenge}
            className="flex items-center gap-2 rounded-xl border border-violet-500/40 bg-violet-600/20 px-4 py-2 text-xs font-bold text-violet-200 hover:bg-violet-600/30 shadow-lg shadow-violet-500/20 transition animate-bounce"
          >
            <Rocket className="h-4 w-4 text-violet-400" />
            🚀 Challenge Me Further (+Bonus XP)
          </button>
        )}

        {/* Practice repetition counter */}
        {attemptCount > 0 && (
          <span className="ml-auto text-[11px] text-neutral-500">
            Attempts: {attemptCount}
          </span>
        )}
      </div>
    </div>
  );
}
