"use client";

import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Brain,
  ChevronDown,
  ChevronRight,
  Loader2,
  RefreshCw,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────

interface CurriculumLesson {
  lessonNumber: string;
  title: string;
  topics: string[];
  pageReference?: string;
}

interface CurriculumChapter {
  chapterNumber: string;
  title: string;
  lessons: CurriculumLesson[];
}

interface BookAnalysis {
  book: string;
  chapters: CurriculumChapter[];
  fromCache: boolean;
  analyzedAt: string;
}

interface MaterialsLibraryPanelProps {
  /** Called when the teacher clicks "Generate Storyboard" on a lesson */
  onGenerateLesson: (lessonTitle: string, books: string[]) => void;
}

// ── Component ──────────────────────────────────────────────────

export default function MaterialsLibraryPanel({ onGenerateLesson }: MaterialsLibraryPanelProps) {
  const [availableBooks, setAvailableBooks] = useState<string[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [analyzeState, setAnalyzeState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [analysis, setAnalysis] = useState<BookAnalysis | null>(null);
  const [analyzeError, setAnalyzeError] = useState("");
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [crossRefBooks, setCrossRefBooks] = useState<Set<string>>(new Set());
  const [hoveredLesson, setHoveredLesson] = useState<string | null>(null);

  // ── Load book list ──────────────────────────────────────────
  useEffect(() => {
    fetch("/api/materials/list")
      .then((r) => r.json())
      .then((data) => {
        const files: string[] = data.files ?? [];
        setAvailableBooks(files);
        if (files.length > 0) {
          setSelectedBook(files[0]);
          setCrossRefBooks(new Set(files)); // Cross-reference all by default
        }
      })
      .catch(() => {})
      .finally(() => setLoadingBooks(false));
  }, []);

  // ── Analyze selected book ────────────────────────────────────
  async function analyzeBook(book: string, forceRefresh = false) {
    setAnalyzeState("loading");
    setAnalyzeError("");
    setAnalysis(null);
    setExpandedChapters(new Set());

    try {
      const res = await fetch("/api/materials/analyze-curriculum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book, forceRefresh }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Server error");
      setAnalysis(data as BookAnalysis);
      // Auto-expand first chapter
      if (data.chapters?.[0]) {
        setExpandedChapters(new Set([data.chapters[0].chapterNumber]));
      }
      setAnalyzeState("done");
    } catch (err: any) {
      setAnalyzeError(err.message ?? "Failed to analyze");
      setAnalyzeState("error");
    }
  }

  function toggleChapter(chapterNumber: string) {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterNumber)) next.delete(chapterNumber);
      else next.add(chapterNumber);
      return next;
    });
  }

  function toggleCrossRef(book: string) {
    setCrossRefBooks((prev) => {
      const next = new Set(prev);
      if (next.has(book)) next.delete(book);
      else next.add(book);
      return next;
    });
  }

  // ── Render ──────────────────────────────────────────────────
  if (loadingBooks) {
    return (
      <div className="flex items-center gap-2 p-6 text-sm text-neutral-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Scanning material folder…
      </div>
    );
  }

  if (availableBooks.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-white">No books found</p>
            <p className="mt-1 text-xs text-neutral-400">
              Drop PDF curriculum books into the{" "}
              <code className="rounded bg-neutral-800 px-1 text-amber-400">material/</code> folder
              at the root of your project, then refresh.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Book picker */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
          📚 Curriculum Books in material/ Folder
        </p>
        <div className="flex flex-col gap-2">
          {availableBooks.map((book) => {
            const isSelected = selectedBook === book;
            return (
              <button
                key={book}
                onClick={() => setSelectedBook(book)}
                className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all ${
                  isSelected
                    ? "border-sky-500/60 bg-sky-500/10 text-white"
                    : "border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-neutral-500 hover:text-white"
                }`}
              >
                <BookOpen className={`h-4 w-4 shrink-0 ${isSelected ? "text-sky-400" : "text-neutral-600"}`} />
                <span className="flex-1 truncate text-xs font-medium">{book}</span>
                {isSelected && <CheckCircle2 className="h-4 w-4 shrink-0 text-sky-400" />}
              </button>
            );
          })}
        </div>

        {/* Analyze button */}
        {selectedBook && (
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => analyzeBook(selectedBook)}
              disabled={analyzeState === "loading"}
              className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-500 disabled:opacity-50 transition"
            >
              {analyzeState === "loading" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Brain className="h-3.5 w-3.5" />
              )}
              {analyzeState === "loading" ? "Analysing…" : "Analyse This Book"}
            </button>
            {analyzeState === "done" && analysis && (
              <button
                onClick={() => analyzeBook(selectedBook, true)}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-500 hover:text-white hover:border-neutral-500 transition"
              >
                <RefreshCw className="h-3 w-3" /> Refresh
              </button>
            )}
          </div>
        )}
      </div>

      {/* Cross-reference books selector */}
      {availableBooks.length > 1 && analyzeState === "done" && (
        <div className="rounded-xl border border-violet-700/30 bg-violet-900/10 p-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-violet-400">
            🔀 Cross-Reference with Other Books
          </p>
          <p className="mb-3 text-[11px] text-neutral-500">
            When you generate a lesson, the AI will also consult these additional books for richer synthesis.
          </p>
          <div className="flex flex-col gap-1.5">
            {availableBooks.map((book) => {
              const checked = crossRefBooks.has(book);
              return (
                <button
                  key={book}
                  onClick={() => toggleCrossRef(book)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition ${
                    checked
                      ? "border-violet-600/50 bg-violet-600/10 text-violet-300"
                      : "border-neutral-700 text-neutral-500 hover:border-neutral-600"
                  }`}
                >
                  <div
                    className={`h-3.5 w-3.5 shrink-0 rounded border flex items-center justify-center ${
                      checked ? "border-violet-500 bg-violet-500" : "border-neutral-600"
                    }`}
                  >
                    {checked && <CheckCircle2 className="h-2.5 w-2.5 text-white" />}
                  </div>
                  <span className="truncate">{book}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Error */}
      {analyzeState === "error" && (
        <div className="rounded-xl border border-rose-700/40 bg-rose-900/20 px-4 py-3">
          <p className="text-sm font-semibold text-rose-300">Analysis Failed</p>
          <p className="mt-1 text-xs text-rose-400/80">{analyzeError}</p>
        </div>
      )}

      {/* Loading state */}
      {analyzeState === "loading" && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-sky-700/30 bg-sky-900/10 py-10">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-sky-500/20" />
            <Brain className="relative h-7 w-7 animate-pulse text-sky-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-white">AI is reading the book…</p>
            <p className="mt-1 text-xs text-neutral-400">
              Extracting chapters and lessons from {selectedBook}
            </p>
            <p className="mt-1 text-[11px] text-neutral-600">This takes 10–20 seconds</p>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Curriculum map */}
      {analyzeState === "done" && analysis && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
            <div>
              <p className="text-xs font-bold text-white">
                {analysis.book.replace(".pdf", "")}
              </p>
              <p className="text-[10px] text-neutral-500">
                {analysis.chapters.length} chapters ·{" "}
                {analysis.chapters.reduce((acc, c) => acc + c.lessons.length, 0)} lessons ·{" "}
                {analysis.fromCache ? "from cache" : "freshly analysed"}
              </p>
            </div>
            <FileText className="h-4 w-4 text-neutral-600" />
          </div>

          {/* Chapters */}
          <div className="divide-y divide-neutral-800/50">
            {analysis.chapters.map((chapter) => {
              const isExpanded = expandedChapters.has(chapter.chapterNumber);
              return (
                <div key={chapter.chapterNumber}>
                  {/* Chapter row */}
                  <button
                    onClick={() => toggleChapter(chapter.chapterNumber)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-neutral-800/40 transition"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
                    )}
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-sky-600/20 text-[10px] font-bold text-sky-400">
                      {chapter.chapterNumber}
                    </div>
                    <span className="flex-1 text-xs font-semibold text-neutral-200">
                      {chapter.title}
                    </span>
                    <span className="text-[10px] text-neutral-600">
                      {chapter.lessons.length} lessons
                    </span>
                  </button>

                  {/* Lessons */}
                  {isExpanded && (
                    <div className="border-t border-neutral-800/50 bg-neutral-950/40">
                      {chapter.lessons.map((lesson) => {
                        const lessonKey = `${chapter.chapterNumber}-${lesson.lessonNumber}`;
                        const isHovered = hoveredLesson === lessonKey;
                        return (
                          <div
                            key={lesson.lessonNumber}
                            className={`group flex items-start gap-3 border-b border-neutral-800/30 px-5 py-3 transition-all last:border-0 ${
                              isHovered ? "bg-violet-900/10" : "hover:bg-neutral-800/20"
                            }`}
                            onMouseEnter={() => setHoveredLesson(lessonKey)}
                            onMouseLeave={() => setHoveredLesson(null)}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-neutral-600">
                                  {lesson.lessonNumber}
                                </span>
                                <span className="truncate text-xs font-medium text-neutral-300">
                                  {lesson.title}
                                </span>
                                {lesson.pageReference && (
                                  <span className="shrink-0 text-[9px] text-neutral-600">
                                    {lesson.pageReference}
                                  </span>
                                )}
                              </div>
                              {lesson.topics.length > 0 && (
                                <div className="mt-1.5 flex flex-wrap gap-1">
                                  {lesson.topics.map((topic, ti) => (
                                    <span
                                      key={ti}
                                      className="rounded bg-neutral-800 px-1.5 py-0.5 text-[9px] text-neutral-500"
                                    >
                                      {topic}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Generate button */}
                            <button
                              onClick={() =>
                                onGenerateLesson(
                                  `${lesson.title} (${chapter.title})`,
                                  Array.from(crossRefBooks)
                                )
                              }
                              className="shrink-0 flex items-center gap-1.5 rounded-lg border border-violet-600/40 bg-violet-600/10 px-2.5 py-1.5 text-[10px] font-bold text-violet-300 opacity-0 group-hover:opacity-100 hover:bg-violet-600/20 hover:border-violet-500 transition-all"
                              title="Generate AI storyboard for this lesson"
                            >
                              <Sparkles className="h-3 w-3" />
                              Generate
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
