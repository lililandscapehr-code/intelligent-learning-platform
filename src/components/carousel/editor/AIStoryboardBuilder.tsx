"use client";

import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Loader2,
  RefreshCw,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import type { EduSlide } from "../CarouselTypes";

// ── Types ──────────────────────────────────────────────────────

interface StoryboardStep {
  stepNumber: number;
  stepType:
    | "HOOK_QUESTION"
    | "CORE_CONCEPT"
    | "INTERACTIVE_SCENARIO"
    | "MISCONCEPTION_CHECK";
  content: string;
  interactiveOptions?: string[];
  teachingNote: string;
}

interface SynthesisResult {
  lessonName: string;
  sourcesUsed: string[];
  optimizedSequence: StoryboardStep[];
}

interface AIStoryboardBuilderProps {
  onClose: () => void;
  onBuildSlides: (slides: EduSlide[]) => void;
}

// ── Helpers ────────────────────────────────────────────────────

const STEP_COLORS: Record<StoryboardStep["stepType"], string> = {
  HOOK_QUESTION: "amber",
  CORE_CONCEPT: "sky",
  INTERACTIVE_SCENARIO: "violet",
  MISCONCEPTION_CHECK: "rose",
};

const STEP_LABELS: Record<StoryboardStep["stepType"], string> = {
  HOOK_QUESTION: "🎯 Hook Question",
  CORE_CONCEPT: "📘 Core Concept",
  INTERACTIVE_SCENARIO: "🧪 Interactive Scenario",
  MISCONCEPTION_CHECK: "⚠️ Misconception Check",
};

function stepTypeToSlideType(
  stepType: StoryboardStep["stepType"]
): EduSlide["type"] {
  if (stepType === "HOOK_QUESTION" || stepType === "MISCONCEPTION_CHECK")
    return "question_text";
  return "lesson_text";
}

function buildSlideFromStep(step: StoryboardStep, index: number): EduSlide {
  const base = {
    id: `ai-slide-${Date.now()}-${index}`,
  };

  if (
    step.stepType === "HOOK_QUESTION" ||
    step.stepType === "MISCONCEPTION_CHECK"
  ) {
    return {
      ...base,
      type: "question_text" as const,
      questionText: step.content,
      placeholder:
        step.interactiveOptions?.join(" | ") ?? "Type your answer here...",
      sampleAnswer: step.teachingNote,
      points: 1,
      timerSeconds: 0,
    };
  }

  return {
    ...base,
    type: "lesson_text" as const,
    title: STEP_LABELS[step.stepType],
    body: step.content,
    learningObjective: step.teachingNote,
    keyTerms: [],
    theme: "default" as const,
  };
}

// ── Component ──────────────────────────────────────────────────

export default function AIStoryboardBuilder({
  onClose,
  onBuildSlides,
}: AIStoryboardBuilderProps) {
  // Step state
  const [phase, setPhase] = useState<"setup" | "generating" | "review">(
    "setup"
  );

  // Setup phase
  const [availableBooks, setAvailableBooks] = useState<string[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
  const [lessonName, setLessonName] = useState("");
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [booksError, setBooksError] = useState("");

  // Review phase
  const [result, setResult] = useState<SynthesisResult | null>(null);
  const [genError, setGenError] = useState("");
  const [expandedStep, setExpandedStep] = useState<number | null>(0);
  const [selectedSteps, setSelectedSteps] = useState<Set<number>>(new Set());

  // ── Load book list ───────────────────────────────────────────
  useEffect(() => {
    setLoadingBooks(true);
    fetch("/api/materials/list")
      .then((r) => r.json())
      .then((data) => {
        const files: string[] = data.files ?? [];
        setAvailableBooks(files);
        // Pre-select all books by default
        setSelectedBooks(new Set(files));
        if (files.length === 0) {
          setBooksError(
            'No PDF books found in the "material/" folder. Upload your curriculum PDFs there first.'
          );
        }
      })
      .catch(() =>
        setBooksError("Could not fetch material list. Make sure the server is running.")
      )
      .finally(() => setLoadingBooks(false));
  }, []);

  // ── Toggle book selection ────────────────────────────────────
  function toggleBook(book: string) {
    setSelectedBooks((prev) => {
      const next = new Set(prev);
      if (next.has(book)) next.delete(book);
      else next.add(book);
      return next;
    });
  }

  // ── Generate ─────────────────────────────────────────────────
  async function generate() {
    if (!lessonName.trim()) return;
    if (selectedBooks.size === 0) return;

    setPhase("generating");
    setGenError("");
    setResult(null);

    try {
      const res = await fetch("/api/materials/synthesize-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonName: lessonName.trim(),
          books: Array.from(selectedBooks),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Server error");

      setResult(data as SynthesisResult);
      // Select all steps by default
      setSelectedSteps(
        new Set(data.optimizedSequence.map((_: any, i: number) => i))
      );
      setExpandedStep(0);
      setPhase("review");
    } catch (err: any) {
      setGenError(err.message ?? "Unknown error");
      setPhase("setup");
    }
  }

  // ── Toggle step selection ─────────────────────────────────────
  function toggleStep(index: number) {
    setSelectedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  // ── Build slides from selection ───────────────────────────────
  function buildSlides() {
    if (!result) return;
    const slides = result.optimizedSequence
      .filter((_, i) => selectedSteps.has(i))
      .map((step, i) => buildSlideFromStep(step, i));
    onBuildSlides(slides);
    onClose();
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-950 shadow-2xl">

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex items-center gap-3 border-b border-neutral-800 bg-gradient-to-r from-violet-900/30 to-neutral-900/60 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/20">
            <Brain className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">AI Storyboard Builder</h2>
            <p className="text-[11px] text-neutral-400">
              Synthesizes curriculum PDFs into an optimized step-by-step lesson sequence
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-800 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Phase: Setup ────────────────────────────────────── */}
        {phase === "setup" && (
          <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
            {/* Lesson Name */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-400">
                Lesson / Topic Name
              </label>
              <input
                type="text"
                value={lessonName}
                onChange={(e) => setLessonName(e.target.value)}
                placeholder="e.g. Newton's First Law of Motion, Projectile Motion, Circular Motion..."
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none focus:border-violet-500 transition"
              />
              <p className="mt-1 text-[11px] text-neutral-500">
                Be as specific as possible. The AI will search through all selected books for this topic.
              </p>
            </div>

            {/* Book Selection */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-400">
                Source Books from{" "}
                <code className="rounded bg-neutral-800 px-1 py-0.5 text-violet-400">
                  material/
                </code>{" "}
                Folder
              </label>

              {loadingBooks ? (
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scanning material folder...
                </div>
              ) : booksError ? (
                <div className="rounded-xl border border-rose-700/40 bg-rose-900/20 px-4 py-3">
                  <p className="text-sm text-rose-300">{booksError}</p>
                  <p className="mt-2 text-[11px] text-rose-400/70">
                    Drop your curriculum PDF files into the{" "}
                    <code className="rounded bg-rose-900/40 px-1">material/</code>{" "}
                    folder at the root of your project, then refresh this panel.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {availableBooks.map((book) => {
                    const selected = selectedBooks.has(book);
                    return (
                      <button
                        key={book}
                        onClick={() => toggleBook(book)}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                          selected
                            ? "border-violet-500 bg-violet-500/10 text-white"
                            : "border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-neutral-500"
                        }`}
                      >
                        <BookOpen
                          className={`h-4 w-4 shrink-0 ${
                            selected ? "text-violet-400" : "text-neutral-600"
                          }`}
                        />
                        <span className="truncate text-xs font-medium">{book}</span>
                        {selected && (
                          <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-violet-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {availableBooks.length > 0 && (
                <p className="mt-2 text-[11px] text-neutral-500">
                  {selectedBooks.size} of {availableBooks.length} book
                  {availableBooks.length !== 1 ? "s" : ""} selected. The AI will
                  cross-reference all selected books and synthesize the best
                  explanations for your lesson.
                </p>
              )}
            </div>

            {genError && (
              <div className="rounded-xl border border-rose-700/40 bg-rose-900/20 px-4 py-3 text-sm text-rose-300">
                {genError}
              </div>
            )}

            {/* Generate button */}
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-neutral-500">
                The AI will analyse your selected books and generate an optimised, Socratic step-by-step lesson sequence.
              </p>
              <button
                onClick={generate}
                disabled={
                  !lessonName.trim() ||
                  selectedBooks.size === 0 ||
                  loadingBooks
                }
                className="flex shrink-0 items-center gap-2 rounded-xl bg-violet-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-violet-400 disabled:opacity-40 transition ml-4"
              >
                <Sparkles className="h-4 w-4" />
                Generate Lesson
              </button>
            </div>
          </div>
        )}

        {/* ── Phase: Generating ───────────────────────────────── */}
        {phase === "generating" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 p-12">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-violet-500/20" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/20">
                <Brain className="h-8 w-8 animate-pulse text-violet-400" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-white">AI is synthesizing your lesson…</p>
              <p className="mt-1 text-sm text-neutral-400">
                Reading and cross-referencing {selectedBooks.size} book
                {selectedBooks.size !== 1 ? "s" : ""} for{" "}
                <span className="text-violet-300">"{lessonName}"</span>
              </p>
              <p className="mt-3 text-xs text-neutral-500">
                This may take 10–30 seconds depending on the size of your books.
              </p>
            </div>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Phase: Review ───────────────────────────────────── */}
        {phase === "review" && result && (
          <>
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Review header */}
              <div className="border-b border-neutral-800 bg-neutral-900/50 px-6 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">
                      {result.lessonName}
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      Synthesized from: {result.sourcesUsed.join(", ")} ·{" "}
                      {result.optimizedSequence.length} steps generated ·{" "}
                      {selectedSteps.size} selected
                    </p>
                  </div>
                  <button
                    onClick={() => setPhase("setup")}
                    className="flex items-center gap-1.5 rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:border-neutral-500 transition"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Regenerate
                  </button>
                </div>

                {/* Select all / none */}
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() =>
                      setSelectedSteps(
                        new Set(result.optimizedSequence.map((_, i) => i))
                      )
                    }
                    className="text-[11px] text-violet-400 hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-[11px] text-neutral-600">·</span>
                  <button
                    onClick={() => setSelectedSteps(new Set())}
                    className="text-[11px] text-neutral-500 hover:underline"
                  >
                    Select None
                  </button>
                </div>
              </div>

              {/* Steps list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {result.optimizedSequence.map((step, index) => {
                  const color = STEP_COLORS[step.stepType];
                  const isSelected = selectedSteps.has(index);
                  const isExpanded = expandedStep === index;

                  return (
                    <div
                      key={index}
                      className={`rounded-xl border transition-all ${
                        isSelected
                          ? `border-${color}-600/50 bg-${color}-900/10`
                          : "border-neutral-800 bg-neutral-900/50 opacity-60"
                      }`}
                    >
                      {/* Step header row */}
                      <div className="flex items-center gap-3 px-4 py-3">
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleStep(index)}
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
                            isSelected
                              ? `border-${color}-500 bg-${color}-500 text-white`
                              : "border-neutral-600 bg-neutral-800 text-transparent"
                          }`}
                        >
                          <CheckCircle2 className="h-3 w-3" />
                        </button>

                        {/* Step number badge */}
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold bg-${color}-500/20 text-${color}-300`}
                        >
                          {step.stepNumber}
                        </span>

                        {/* Step type badge */}
                        <span className={`text-xs font-semibold text-${color}-300`}>
                          {STEP_LABELS[step.stepType]}
                        </span>

                        {/* Content preview */}
                        <p className="flex-1 truncate text-xs text-neutral-400">
                          {step.content}
                        </p>

                        {/* Expand toggle */}
                        <button
                          onClick={() =>
                            setExpandedStep(isExpanded ? null : index)
                          }
                          className="rounded p-1 text-neutral-600 hover:text-white transition"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {/* Expanded detail */}
                      {isExpanded && (
                        <div className="border-t border-neutral-800 px-4 pb-4 pt-3 space-y-3">
                          {/* Main content */}
                          <div>
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                              Content
                            </p>
                            <p className="text-sm text-neutral-200 leading-relaxed">
                              {step.content}
                            </p>
                          </div>

                          {/* Interactive options */}
                          {step.interactiveOptions &&
                            step.interactiveOptions.length > 0 && (
                              <div>
                                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                                  Answer Options
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {step.interactiveOptions.map((opt, oi) => (
                                    <span
                                      key={oi}
                                      className={`rounded-lg border border-${color}-700/40 bg-${color}-900/20 px-3 py-1 text-xs text-${color}-300`}
                                    >
                                      {opt}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                          {/* Teaching note */}
                          <div className="rounded-lg border border-amber-700/30 bg-amber-900/10 px-3 py-2">
                            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-500">
                              📝 Teaching Note
                            </p>
                            <p className="text-xs text-amber-200/80 leading-relaxed">
                              {step.teachingNote}
                            </p>
                          </div>

                          {/* Slide type preview */}
                          <p className="text-[10px] text-neutral-600">
                            → Will create a{" "}
                            <code className="rounded bg-neutral-800 px-1 text-neutral-400">
                              {stepTypeToSlideType(step.stepType)}
                            </code>{" "}
                            slide
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-900/60 px-6 py-4">
              <p className="text-xs text-neutral-500">
                {selectedSteps.size} step{selectedSteps.size !== 1 ? "s" : ""} selected → will create{" "}
                {selectedSteps.size} slide{selectedSteps.size !== 1 ? "s" : ""}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="rounded-xl border border-neutral-700 px-4 py-2 text-sm text-neutral-400 hover:text-white hover:border-neutral-500 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={buildSlides}
                  disabled={selectedSteps.size === 0}
                  className="flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-2 text-sm font-bold text-white hover:bg-violet-400 disabled:opacity-40 transition"
                >
                  <Zap className="h-4 w-4" />
                  Build {selectedSteps.size} Slide{selectedSteps.size !== 1 ? "s" : ""} into Carousel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
