"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ChevronRight, Compass, RotateCcw, Target } from "lucide-react";

type Choice = { id: string; text: string; correct: boolean };
type ReadinessQuestion = { skill: string; prompt: string; hint: string; choices: Choice[] };

const questions: ReadinessQuestion[] = [
  { skill: "Units", prompt: "Which unit measures acceleration?", hint: "Acceleration describes how velocity changes with time.", choices: [{ id: "A", text: "m/s", correct: false }, { id: "B", text: "m/s²", correct: true }, { id: "C", text: "N", correct: false }] },
  { skill: "Graphs", prompt: "What does the slope of a position-time graph represent?", hint: "Think about how quickly position changes.", choices: [{ id: "A", text: "Velocity", correct: true }, { id: "B", text: "Mass", correct: false }, { id: "C", text: "Energy", correct: false }] },
  { skill: "Vectors", prompt: "Which quantity has both magnitude and direction?", hint: "An arrow is useful for representing it.", choices: [{ id: "A", text: "Speed", correct: false }, { id: "B", text: "Distance", correct: false }, { id: "C", text: "Velocity", correct: true }] },
  { skill: "Algebra", prompt: "If v = u + at, which expression gives a?", hint: "Undo the addition first, then divide.", choices: [{ id: "A", text: "(v - u) / t", correct: true }, { id: "B", text: "v - u × t", correct: false }, { id: "C", text: "v + u + t", correct: false }] },
  { skill: "Trigonometry", prompt: "A vector is resolved into perpendicular horizontal and vertical parts. What must be true?", hint: "The parts rebuild the original vector.", choices: [{ id: "A", text: "Their directions are the same", correct: false }, { id: "B", text: "Their resultant equals the original vector", correct: true }, { id: "C", text: "Both parts must have equal size", correct: false }] },
  { skill: "Free fall", prompt: "Ignoring air resistance, what causes the vertical acceleration of a dropped object?", hint: "The same force acts on every falling object near Earth.", choices: [{ id: "A", text: "Gravity", correct: true }, { id: "B", text: "Its horizontal speed", correct: false }, { id: "C", text: "Its colour", correct: false }] }
];

export default function PhysicsReadinessSession({ studentId }: { studentId: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const currentQuestion = questions[currentIndex];
  const score = questions.filter((question, index) => answers[index] && question.choices.find((choice) => choice.id === answers[index])?.correct).length;
  const answeredCurrent = answers[currentIndex] !== undefined;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(`physics-readiness:${studentId}`);
      if (!saved) return;
      const state = JSON.parse(saved) as { answers?: Record<number, string>; showResults?: boolean };
      if (state.answers) setAnswers(state.answers);
      if (state.showResults) setShowResults(true);
    } catch {
      // A failed local restore should never block the student session.
    }
  }, [studentId]);

  useEffect(() => {
    window.localStorage.setItem(`physics-readiness:${studentId}`, JSON.stringify({ answers, showResults }));
  }, [answers, showResults, studentId]);

  function chooseAnswer(choice: Choice) {
    if (answeredCurrent) return;
    setAnswers((existing) => ({ ...existing, [currentIndex]: choice.id }));
  }

  function restart() {
    setAnswers({});
    setCurrentIndex(0);
    setShowResults(false);
  }

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    const support = percentage < 70;
    const missedSkills = questions.filter((question, index) => !question.choices.find((choice) => choice.id === answers[index])?.correct).map((question) => question.skill);
    return (
      <section className="mx-auto max-w-4xl space-y-5">
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-6">
          <div className="flex items-center gap-3"><Target className="h-5 w-5 text-amber-400" /><div><p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Physics preparation complete</p><h2 className="mt-1 text-xl font-bold text-white">Your starting route</h2></div></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-lg bg-neutral-950 p-4"><p className="text-2xl font-black text-white">{percentage}%</p><p className="mt-1 text-xs text-neutral-500">Readiness evidence</p></div><div className="rounded-lg bg-neutral-950 p-4"><p className="text-2xl font-black text-white">{score}/{questions.length}</p><p className="mt-1 text-xs text-neutral-500">Correct checks</p></div><div className="rounded-lg bg-neutral-950 p-4"><p className={`text-sm font-black ${support ? "text-amber-400" : "text-emerald-400"}`}>{support ? "BRIDGE FIRST" : "START MECHANICS"}</p><p className="mt-1 text-xs text-neutral-500">Recommended route</p></div></div>
          <p className="mt-5 text-sm leading-6 text-neutral-300">{support ? "Your plan starts with the skills that need more practice. You will retry only those checks before moving into Mechanics." : "Your plan starts with Mechanics Lesson 1-1. You can still use support practice whenever a new idea feels difficult."}</p>
          {support ? <div className="mt-4 space-y-3 rounded-lg border border-amber-500/20 bg-neutral-950 p-4"><p className="text-xs font-bold uppercase tracking-wider text-amber-400">Your bridge route</p>{missedSkills.map((skill, index) => <div key={skill} className="flex items-center gap-3 rounded-lg bg-neutral-900 p-3"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/15 text-[10px] font-bold text-amber-300">{index + 1}</span><div><p className="text-sm font-semibold text-white">{skill} practice</p><p className="mt-1 text-xs text-neutral-500">Short explanation, one example, and a retry check.</p></div></div>)}<p className="pt-1 text-[11px] text-neutral-500">After the retry checks are secure, your teacher can unlock Mechanics.</p></div> : <div className="mt-4 space-y-3 rounded-lg border border-emerald-500/20 bg-neutral-950 p-4"><p className="text-xs font-bold uppercase tracking-wider text-emerald-300">Your starting route</p>{["Lesson 1-1: Velocity vectors", "Prediction before the explanation", "Practice with a new context", "Teacher check and next lesson"].map((step, index) => <div key={step} className="flex items-center gap-3 rounded-lg bg-neutral-900 p-3"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-[10px] font-bold text-emerald-300">{index + 1}</span><p className="text-sm text-white">{step}</p></div>)}</div>}
          <button type="button" onClick={restart} className="mt-5 flex items-center gap-2 rounded-lg border border-neutral-700 px-3 py-2 text-xs font-bold text-neutral-300 hover:border-amber-500"><RotateCcw className="h-3.5 w-3.5" /> Try again</button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-6"><div className="flex items-start gap-3"><Compass className="mt-0.5 h-5 w-5 text-amber-400" /><div><p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Before Chapter 1 · 10-15 minutes</p><h2 className="mt-1 text-xl font-bold text-white">Get ready for Mechanics</h2><p className="mt-2 text-sm leading-6 text-neutral-400">Answer by thinking first. This is a low-stakes preparation check, not a final exam.</p></div></div></div>
      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6"><div className="flex items-center justify-between gap-3"><span className="text-xs font-bold text-amber-400">Check {currentIndex + 1} of {questions.length} · {currentQuestion.skill}</span><span className="text-xs text-neutral-500">{score} correct</span></div><div className="mt-4 h-1.5 rounded-full bg-neutral-800"><div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} /></div><h3 className="mt-6 text-lg font-bold text-white">{currentQuestion.prompt}</h3><div className="mt-4 grid gap-3">{currentQuestion.choices.map((choice) => { const selected = answers[currentIndex] === choice.id; const style = selected ? choice.correct ? "border-emerald-500 bg-emerald-500/10 text-emerald-300" : "border-red-500 bg-red-500/10 text-red-300" : "border-neutral-800 bg-neutral-900 text-neutral-200 hover:border-amber-500"; return <button type="button" key={choice.id} onClick={() => chooseAnswer(choice)} className={`rounded-lg border p-4 text-left text-sm ${style}`}><span className="mr-2 font-bold">{choice.id}.</span>{choice.text}</button>; })}</div>{answeredCurrent && <p className="mt-4 rounded-lg bg-neutral-900 p-3 text-xs leading-5 text-neutral-400"><span className="font-bold text-amber-400">Think about it:</span> {currentQuestion.hint}</p>}<div className="mt-5 flex justify-end">{answeredCurrent && currentIndex < questions.length - 1 && <button type="button" onClick={() => setCurrentIndex((index) => index + 1)} className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-neutral-950">Next check <ChevronRight className="h-4 w-4" /></button>}{answeredCurrent && currentIndex === questions.length - 1 && <button type="button" onClick={() => setShowResults(true)} className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-neutral-950"><CheckCircle2 className="h-4 w-4" /> See starting route</button>}</div></div>
    </section>
  );
}
