"use client";

import React, { useState, useEffect, useCallback } from "react";
import type {
  QuestionDNA,
  QuestionAlternative,
  MCQChoice,
  CasePhase,
} from "../carousel/CarouselTypes";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
export interface BQuestionResult {
  bIndex: number;
  concept: string;
  bPassed: boolean;
  bAttempts: number;
  preRoundsUsed: number;
  preTrialsUsed: number;
  preMasteredAtLevel: number;
  cQuestionsDone: number;
  cQuestionsPassed: number;
}

export interface LessonCompletionReport {
  lessonId: string;
  completedAt: string;
  bResults: BQuestionResult[];
  totalBPassed: number;
  totalPreTrialsUsed: number;
  totalCQuestionsDone: number;
  overallScore: number;
}

interface ProgressState {
  currentBIndex: number;
  phase: CasePhase;
  preTrialIndex: number;
  cTrialIndex: number;
  bAttempts: number;
  preRoundsUsed: number;
  preTrialsUsed: number;
  bResults: BQuestionResult[];
}

interface StudentDiagnosticProps {
  lessonId: string;
  lessonTitle: string;
  questionDNA: QuestionDNA[];
  onComplete: (report: LessonCompletionReport) => void;
  onBack: () => void;
}

function storageKey(lessonId: string) {
  return `dna-progress-${lessonId}`;
}

function computeScore(results: BQuestionResult[], totalB: number): number {
  if (totalB === 0) return 0;
  const bScore = results.filter((r) => r.bPassed).length / totalB;
  const cTotal = results.reduce((s, r) => s + r.cQuestionsDone, 0);
  const cPassed = results.reduce((s, r) => s + r.cQuestionsPassed, 0);
  const cBonus = cTotal > 0 ? cPassed / cTotal : 0;
  return Math.round(bScore * 70 + cBonus * 30);
}

// ─────────────────────────────────────────────────────────────────────────────
// MCQ Card
// ─────────────────────────────────────────────────────────────────────────────
interface MCQCardProps {
  questionText: string;
  choices: MCQChoice[];
  note?: string;
  noteColor?: "amber" | "violet" | "emerald" | "sky" | "red";
  onSubmit: (choiceId: string, isCorrect: boolean) => void;
}

function MCQCard({ questionText, choices, note, noteColor = "amber", onSubmit }: MCQCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const noteColors: Record<string, string> = {
    amber: "border-amber-500/40 bg-amber-500/10 text-amber-300",
    violet: "border-violet-500/40 bg-violet-500/10 text-violet-300",
    emerald: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    sky: "border-sky-500/40 bg-sky-500/10 text-sky-300",
    red: "border-red-500/40 bg-red-500/10 text-red-300",
  };

  function handleSubmit() {
    if (!selected || submitted) return;
    const choice = choices.find((c) => c.id === selected);
    if (!choice) return;
    const correct = !!choice.isCorrect;
    setIsCorrect(correct);
    setSubmitted(true);
    setTimeout(() => onSubmit(selected, correct), 1400);
  }

  return (
    <div className="rounded-2xl border border-neutral-700 bg-neutral-800/60 p-6 space-y-5">
      {note && (
        <p className={`text-xs rounded-lg border px-3 py-2 ${noteColors[noteColor]}`}>{note}</p>
      )}
      <p className="text-white font-medium text-base leading-relaxed">{questionText}</p>
      <div className="space-y-3">
        {choices.map((c, i) => {
          const letter = ["A", "B", "C", "D", "E"][i] ?? String(i + 1);
          const isSelected = selected === c.id;
          let borderCls = "border-neutral-700 hover:border-neutral-500";
          if (submitted && c.isCorrect) borderCls = "border-emerald-500 bg-emerald-500/10";
          else if (submitted && isSelected && !c.isCorrect) borderCls = "border-red-500 bg-red-500/10";
          else if (isSelected) borderCls = "border-amber-500 bg-amber-500/10";
          return (
            <button
              key={c.id}
              onClick={() => !submitted && setSelected(c.id)}
              className={`w-full flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all ${borderCls}`}
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-full border border-neutral-600 flex items-center justify-center text-xs font-bold text-neutral-300">
                {letter}
              </span>
              <span className="text-sm text-neutral-200 pt-0.5">{c.text}</span>
            </button>
          );
        })}
      </div>
      {submitted ? (
        <div className={`flex items-center gap-2 text-sm font-semibold ${isCorrect ? "text-emerald-400" : "text-red-400"}`}>
          {isCorrect ? "✓ Correct! Moving on…" : "✗ Not quite — simplifying now…"}
        </div>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-3 text-sm transition-all"
        >
          Submit Answer
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Progress strip
// ─────────────────────────────────────────────────────────────────────────────
function ProgressStrip({ total, currentIndex, results }: { total: number; currentIndex: number; results: BQuestionResult[] }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {Array.from({ length: total }).map((_, i) => {
        const res = results.find((r) => r.bIndex === i);
        const isCurrent = i === currentIndex;
        let cls = "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ";
        if (res?.bPassed) cls += "border-emerald-500 bg-emerald-500/20 text-emerald-400";
        else if (isCurrent) cls += "border-amber-500 bg-amber-500/20 text-amber-400 ring-2 ring-amber-500/40";
        else cls += "border-neutral-700 bg-neutral-800 text-neutral-500";
        return <div key={i} className={cls}>{res?.bPassed ? "✓" : i + 1}</div>;
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase badge
// ─────────────────────────────────────────────────────────────────────────────
function PhaseBadge({ phase }: { phase: CasePhase }) {
  const map: Record<string, { label: string; cls: string }> = {
    CASE_B: { label: "Case B — Core", cls: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
    CASE_PRE: { label: "Case Pre — Simplification", cls: "bg-sky-500/20 text-sky-300 border-sky-500/40" },
    PRE_MASTERED: { label: "Pre Mastered ✓", cls: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
    CASE_B_RETRY: { label: "Case B — Retry", cls: "bg-orange-500/20 text-orange-300 border-orange-500/40" },
    CASE_C: { label: "Case C — Challenge", cls: "bg-violet-500/20 text-violet-300 border-violet-500/40" },
    C_SOLVED_CHOICE: { label: "Challenge Solved!", cls: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
    C_EXHAUSTED: { label: "All C Done", cls: "bg-neutral-700 text-neutral-300 border-neutral-600" },
    LESSON_COMPLETE: { label: "Lesson Complete!", cls: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  };
  const { label, cls } = map[phase] ?? map.CASE_B;
  return <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${cls}`}>{label}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// Mandatory flow:
//   CASE_B → wrong → CASE_PRE (sequential) → PRE_MASTERED → CASE_B_RETRY
//   CASE_B_RETRY → wrong → CASE_PRE again (restart) → loop
//   CASE_B (any correct) → CASE_C mandatory (min 1) → C_SOLVED_CHOICE → choice
// ─────────────────────────────────────────────────────────────────────────────
export default function StudentDiagnostic({
  lessonId,
  lessonTitle,
  questionDNA,
  onComplete,
  onBack,
}: StudentDiagnosticProps) {
  const [currentBIndex, setCurrentBIndex] = useState(0);
  const [phase, setPhase] = useState<CasePhase>("CASE_B");
  const [preTrialIndex, setPreTrialIndex] = useState(0);
  const [cTrialIndex, setCTrialIndex] = useState(0);
  const [bAttempts, setBAttempts] = useState(1);
  const [preRoundsUsed, setPreRoundsUsed] = useState(0);
  const [preTrialsUsed, setPreTrialsUsed] = useState(0);
  const [bResults, setBResults] = useState<BQuestionResult[]>([]);
  const [cDoneCount, setCDoneCount] = useState(0);
  const [cPassedCount, setCPassedCount] = useState(0);
  const [cardKey, setCardKey] = useState(0);

  const lsKey = storageKey(lessonId);
  const totalB = questionDNA.length;
  const dna = questionDNA[currentBIndex];
  const preTrials: QuestionAlternative[] = dna?.preTrials ?? [];
  const cQuestions: QuestionAlternative[] = dna?.cQuestions ?? [];

  // Restore from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(lsKey);
      if (saved) {
        const s: ProgressState = JSON.parse(saved);
        setCurrentBIndex(s.currentBIndex);
        setPhase(s.phase);
        setPreTrialIndex(s.preTrialIndex);
        setCTrialIndex(s.cTrialIndex);
        setBAttempts(s.bAttempts ?? 1);
        setPreRoundsUsed(s.preRoundsUsed ?? 0);
        setPreTrialsUsed(s.preTrialsUsed ?? 0);
        setBResults(s.bResults);
      }
    } catch { /* ignore */ }
  }, [lsKey]);

  const persist = useCallback((patch: Partial<ProgressState>) => {
    const current: ProgressState = {
      currentBIndex, phase, preTrialIndex, cTrialIndex,
      bAttempts, preRoundsUsed, preTrialsUsed, bResults, ...patch,
    };
    try { localStorage.setItem(lsKey, JSON.stringify(current)); } catch { /* ignore */ }
  }, [lsKey, currentBIndex, phase, preTrialIndex, cTrialIndex, bAttempts, preRoundsUsed, preTrialsUsed, bResults]);

  function bump() { setCardKey((k) => k + 1); }

  // Reset C counters when advancing to new B
  useEffect(() => { setCDoneCount(0); setCPassedCount(0); }, [currentBIndex]);

  function finishCurrentB(cDone: number, cPassed: number) {
    const result: BQuestionResult = {
      bIndex: currentBIndex,
      concept: String(dna?.bQuestion?.id ?? `B${currentBIndex + 1}`),
      bPassed: true,
      bAttempts,
      preRoundsUsed,
      preTrialsUsed,
      preMasteredAtLevel: preTrialIndex,
      cQuestionsDone: cDone,
      cQuestionsPassed: cPassed,
    };
    const newResults = [...bResults, result];
    setBResults(newResults);

    const nextIndex = currentBIndex + 1;
    if (nextIndex >= totalB) {
      localStorage.removeItem(lsKey);
      setPhase("LESSON_COMPLETE");
      onComplete({
        lessonId,
        completedAt: new Date().toISOString(),
        bResults: newResults,
        totalBPassed: newResults.filter((r) => r.bPassed).length,
        totalPreTrialsUsed: newResults.reduce((s, r) => s + r.preTrialsUsed, 0),
        totalCQuestionsDone: newResults.reduce((s, r) => s + r.cQuestionsDone, 0),
        overallScore: computeScore(newResults, totalB),
      });
    } else {
      setCurrentBIndex(nextIndex);
      setPhase("CASE_B");
      setPreTrialIndex(0);
      setCTrialIndex(0);
      setBAttempts(1);
      setPreRoundsUsed(0);
      setPreTrialsUsed(0);
      persist({ currentBIndex: nextIndex, phase: "CASE_B", preTrialIndex: 0, cTrialIndex: 0, bAttempts: 1, preRoundsUsed: 0, preTrialsUsed: 0, bResults: newResults });
      bump();
    }
  }

  // CASE_B: first attempt
  // ✅ Correct on first try → next B directly (no C required)
  // ❌ Wrong → CASE_PRE
  function handleBAnswer(_id: string, correct: boolean) {
    if (correct) {
      // First-try pass → go straight to next B (C not required)
      finishCurrentB(0, 0);
    } else {
      // Start Pre from the beginning
      setPhase("CASE_PRE"); setPreTrialIndex(0);
      persist({ phase: "CASE_PRE", preTrialIndex: 0 });
      bump();
    }
  }

  // CASE_PRE: sequential one by one
  function handlePreAnswer(_id: string, correct: boolean) {
    const newUsed = preTrialsUsed + 1;
    setPreTrialsUsed(newUsed);
    if (correct) {
      setPhase("PRE_MASTERED");
      persist({ phase: "PRE_MASTERED", preTrialsUsed: newUsed });
    } else {
      // Stay on same trial — re-mount card for retry
      persist({ preTrialsUsed: newUsed });
    }
    bump();
  }

  // PRE_MASTERED: click to retry B
  function handleRetryB() {
    const newAtt = bAttempts + 1;
    const newRounds = preRoundsUsed + 1;
    setBAttempts(newAtt);
    setPreRoundsUsed(newRounds);
    setPhase("CASE_B_RETRY");
    persist({ phase: "CASE_B_RETRY", bAttempts: newAtt, preRoundsUsed: newRounds });
    bump();
  }

  // CASE_B_RETRY: B after Pre
  function handleBRetryAnswer(_id: string, correct: boolean) {
    if (correct) {
      setPhase("CASE_C"); setCTrialIndex(0);
      persist({ phase: "CASE_C", cTrialIndex: 0 });
    } else {
      // Fail again → restart Pre from scratch
      setPhase("CASE_PRE"); setPreTrialIndex(0);
      persist({ phase: "CASE_PRE", preTrialIndex: 0 });
    }
    bump();
  }

  // CASE_C: mandatory challenge
  function handleCAnswer(_id: string, correct: boolean) {
    const newDone = cDoneCount + 1;
    const newPassed = cPassedCount + (correct ? 1 : 0);
    setCDoneCount(newDone);
    setCPassedCount(newPassed);
    if (correct) {
      setPhase("C_SOLVED_CHOICE");
      persist({ phase: "C_SOLVED_CHOICE" });
      bump();
    } else {
      const nextC = cTrialIndex + 1;
      if (nextC >= cQuestions.length) {
        finishCurrentB(newDone, newPassed);
      } else {
        setCTrialIndex(nextC);
        persist({ cTrialIndex: nextC });
        bump();
      }
    }
  }

  // C_SOLVED_CHOICE: more C or next B
  function handleMoreC() {
    const nextC = cTrialIndex + 1;
    if (nextC >= cQuestions.length) {
      finishCurrentB(cDoneCount, cPassedCount);
    } else {
      setCTrialIndex(nextC);
      setPhase("CASE_C");
      persist({ phase: "CASE_C", cTrialIndex: nextC });
      bump();
    }
  }

  function handleNextB() { finishCurrentB(cDoneCount, cPassedCount); }

  // ─────────────────────────────────────────────────────────────────────────
  // Current question data
  // ─────────────────────────────────────────────────────────────────────────
  if (!dna && phase !== "LESSON_COMPLETE") {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <p>No question data for this lesson.</p>
      </div>
    );
  }

  const bSlide = dna?.bQuestion as { questionText?: string; choices?: MCQChoice[] } | undefined;
  const bText = bSlide?.questionText ?? "Question unavailable";
  const bChoices: MCQChoice[] = bSlide?.choices ?? [];
  const currentPre = preTrials[preTrialIndex];
  const currentC = cQuestions[cTrialIndex];

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-sm px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <button onClick={onBack} className="text-neutral-400 hover:text-white text-sm flex items-center gap-1.5 transition-colors">
            ← Back
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-neutral-500 truncate">{lessonTitle}</p>
            <p className="text-sm font-semibold truncate">
              Question {Math.min(currentBIndex + 1, totalB)} of {totalB}
            </p>
          </div>
          <PhaseBadge phase={phase} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <ProgressStrip total={totalB} currentIndex={currentBIndex} results={bResults} />

        {/* ── CASE_B ── */}
        {phase === "CASE_B" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">CASE B</span>
              <p className="text-neutral-400 text-sm">Answer the core question correctly to proceed.</p>
            </div>
            {bChoices.length > 0
              ? <MCQCard key={cardKey} questionText={bText} choices={bChoices} note="Correct → mandatory Challenge. Wrong → Simplification path first." noteColor="amber" onSubmit={handleBAnswer} />
              : <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6"><p>{bText}</p></div>
            }
          </div>
        )}

        {/* ── CASE_PRE ── */}
        {phase === "CASE_PRE" && currentPre && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 text-xs font-bold">CASE PRE</span>
              <span className="text-neutral-400 text-sm">Step {preTrialIndex + 1} of {preTrials.length}</span>
            </div>
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 px-4 py-3 text-sm text-sky-300">
              🔍 {currentPre.simplificationNote ?? "We are breaking this into simpler steps."}
            </div>
            {(currentPre.choices?.length ?? 0) > 0
              ? <MCQCard key={cardKey} questionText={currentPre.questionText} choices={currentPre.choices!} note="Get this right to return to the main question." noteColor="sky" onSubmit={handlePreAnswer} />
              : <p className="text-neutral-400 text-sm">No choices for this Pre trial.</p>
            }
          </div>
        )}

        {/* ── PRE_MASTERED ── */}
        {phase === "PRE_MASTERED" && (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-8 text-center space-y-5">
            <div className="text-5xl">🎉</div>
            <h2 className="text-xl font-bold text-emerald-300">Great job!</h2>
            <p className="text-neutral-300 text-sm max-w-md mx-auto">
              You mastered the simplified version. Now apply it to the original question — you are ready!
            </p>
            <button onClick={handleRetryB} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all">
              Retry Case B →
            </button>
          </div>
        )}

        {/* ── CASE_B_RETRY ── */}
        {phase === "CASE_B_RETRY" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-bold">
                CASE B — RETRY #{bAttempts}
              </span>
              <p className="text-neutral-400 text-sm">Apply what you just practised.</p>
            </div>
            <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 px-4 py-3 text-sm text-orange-300">
              💪 The question is the same — you simplified it, now tackle the full version.
            </div>
            {bChoices.length > 0
              ? <MCQCard key={cardKey} questionText={bText} choices={bChoices} note="Get this right to unlock the Challenge questions." noteColor="amber" onSubmit={handleBRetryAnswer} />
              : <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-6"><p>{bText}</p></div>
            }
          </div>
        )}

        {/* ── CASE_C ── */}
        {phase === "CASE_C" && currentC && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-300 text-xs font-bold">CASE C — CHALLENGE</span>
              <span className="text-neutral-400 text-sm">Q{cTrialIndex + 1} of {cQuestions.length} — required to advance</span>
            </div>
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3 text-sm text-violet-300">
              🚀 {currentC.challengeNote ?? "A harder application of the same concept."}
            </div>
            {(currentC.choices?.length ?? 0) > 0
              ? <MCQCard key={cardKey} questionText={currentC.questionText} choices={currentC.choices!} note="Solve at least one Challenge to advance to the next question." noteColor="violet" onSubmit={handleCAnswer} />
              : <p className="text-neutral-400 text-sm">No choices for this C question.</p>
            }
          </div>
        )}

        {/* ── C_SOLVED_CHOICE ── */}
        {phase === "C_SOLVED_CHOICE" && (
          <div className="rounded-2xl border border-violet-500/40 bg-violet-500/10 p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="text-5xl">⭐</div>
              <h2 className="text-xl font-bold text-violet-300">Challenge Solved!</h2>
              <p className="text-neutral-300 text-sm">What would you like to do next?</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cTrialIndex + 1 < cQuestions.length && (
                <button onClick={handleMoreC} className="flex flex-col items-center gap-2 rounded-xl border border-violet-500/40 bg-violet-500/10 hover:bg-violet-500/20 px-5 py-4 text-center transition-all">
                  <span className="text-2xl">🔥</span>
                  <span className="text-violet-300 font-semibold text-sm">Try Another Challenge</span>
                  <span className="text-neutral-400 text-xs">{cQuestions.length - cTrialIndex - 1} more available</span>
                </button>
              )}
              <button onClick={handleNextB} className="flex flex-col items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-5 py-4 text-center transition-all">
                <span className="text-2xl">➡️</span>
                <span className="text-amber-300 font-semibold text-sm">
                  {currentBIndex + 1 < totalB ? "Next Question" : "Finish Lesson"}
                </span>
                <span className="text-neutral-400 text-xs">
                  {currentBIndex + 1 < totalB ? `${totalB - currentBIndex - 1} remaining` : "View results"}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ── LESSON_COMPLETE ── */}
        {phase === "LESSON_COMPLETE" && (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-8 space-y-6 text-center">
            <div className="text-6xl">🏆</div>
            <h2 className="text-2xl font-bold text-emerald-300">Lesson Complete!</h2>
            <p className="text-neutral-300">
              Score: <span className="font-bold text-white text-xl">{computeScore(bResults, totalB)}%</span>
            </p>
            <p className="text-neutral-400 text-sm">
              {bResults.filter((r) => r.bPassed).length} of {totalB} core questions passed.{" "}
              {bResults.reduce((s, r) => s + r.cQuestionsPassed, 0)} challenge questions solved.
            </p>
            <button onClick={onBack} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all">
              Return to Lessons
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
