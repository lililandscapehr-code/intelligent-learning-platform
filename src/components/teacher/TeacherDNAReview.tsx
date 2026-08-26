"use client";

import React, { useState } from "react";
import {
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
  Save,
  Check,
  X
} from "lucide-react";
import type { QuestionDNA, QuestionAlternative, MCQChoice } from "../carousel/CarouselTypes";

// Import DNA static data
import { lesson11QuestionDNA } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-1-question-dna";
import { lesson12QuestionDNA } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-2-question-dna";
import { lesson13QuestionDNA } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-3-question-dna";
import { lesson14QuestionDNA } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-4-question-dna";
import { lesson15QuestionDNA } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-5-question-dna";
import { lesson16QuestionDNA } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-6-question-dna";
import { lesson17QuestionDNA } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-7-question-dna";
import { lesson18QuestionDNA } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-8-question-dna";
import { lesson19QuestionDNA } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-9-question-dna";
import { lesson110QuestionDNA } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-10-question-dna";
import { lesson111QuestionDNA } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-11-question-dna";
import { lesson112QuestionDNA } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-12-question-dna";

interface LessonReviewInfo {
  id: string;
  title: string;
  dna: QuestionDNA[];
}

export default function TeacherDNAReview() {
  const [lessons, setLessons] = useState<LessonReviewInfo[]>([
    { id: "1-1", title: "1-1 Velocity Vectors", dna: lesson11QuestionDNA },
    { id: "1-2", title: "1-2 Horizontal Projectiles", dna: lesson12QuestionDNA },
    { id: "1-3", title: "1-3 Angled Projectiles", dna: lesson13QuestionDNA },
    { id: "1-4", title: "1-4 Moments of Forces", dna: lesson14QuestionDNA },
    { id: "1-5", title: "1-5 Equilibrium", dna: lesson15QuestionDNA },
    { id: "1-6", title: "1-6 Power & Efficiency", dna: lesson16QuestionDNA },
    { id: "1-7", title: "1-7 Momentum & Impulse", dna: lesson17QuestionDNA },
    { id: "1-8", title: "1-8 Conservation of Momentum", dna: lesson18QuestionDNA },
    { id: "1-9", title: "1-9 Momentum & Energy", dna: lesson19QuestionDNA },
    { id: "1-10", title: "1-10 Circular Motion", dna: lesson110QuestionDNA },
    { id: "1-11", title: "1-11 Circular H & V", dna: lesson111QuestionDNA },
    { id: "1-12", title: "1-12 Kepler & Gravitation", dna: lesson112QuestionDNA },
  ]);

  const [activeLessonId, setActiveLessonId] = useState("1-1");
  const [expandedBIndex, setExpandedBIndex] = useState<number | null>(0);
  const [activeSubTab, setActiveSubTab] = useState<"PRE" | "B" | "C">("B");

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editChoices, setEditChoices] = useState<MCQChoice[]>([]);

  // Approval status state (mock persistence)
  const [approvedLessons, setApprovedLessons] = useState<Record<string, boolean>>({});

  const activeLesson = lessons.find((l) => l.id === activeLessonId)!;

  function toggleExpandB(index: number) {
    setExpandedBIndex(expandedBIndex === index ? null : index);
  }

  function handleApproveLesson(lessonId: string) {
    setApprovedLessons((prev) => ({ ...prev, [lessonId]: true }));
  }

  function handleStartEdit(q: QuestionAlternative | any, id: string) {
    setEditingId(id);
    setEditText(q.questionText);
    setEditChoices(q.choices ?? []);
  }

  function handleSaveEdit(bIndex: number, group: "PRE" | "B" | "C", qId: string) {
    const updatedLessons = lessons.map((l) => {
      if (l.id !== activeLessonId) return l;

      const updatedDNA = l.dna.map((d, idx) => {
        if (idx !== bIndex) return d;

        if (group === "B") {
          return {
            ...d,
            bQuestion: {
              ...d.bQuestion,
              questionText: editText,
              choices: editChoices,
            },
          };
        } else if (group === "PRE") {
          return {
            ...d,
            preTrials: d.preTrials.map((p) =>
              p.id === qId ? { ...p, questionText: editText, choices: editChoices } : p
            ),
          };
        } else {
          return {
            ...d,
            cQuestions: d.cQuestions.map((c) =>
              c.id === qId ? { ...c, questionText: editText, choices: editChoices } : c
            ),
          };
        }
      });

      return { ...l, dna: updatedDNA };
    });

    setLessons(updatedLessons);
    setEditingId(null);
  }

  function handleDeleteQuestion(bIndex: number, group: "PRE" | "C", qId: string) {
    const updatedLessons = lessons.map((l) => {
      if (l.id !== activeLessonId) return l;

      const updatedDNA = l.dna.map((d, idx) => {
        if (idx !== bIndex) return d;

        if (group === "PRE") {
          return {
            ...d,
            preTrials: d.preTrials.filter((p) => p.id !== qId),
          };
        } else {
          return {
            ...d,
            cQuestions: d.cQuestions.filter((c) => c.id !== qId),
          };
        }
      });

      return { ...l, dna: updatedDNA };
    });

    setLessons(updatedLessons);
  }

  function handleAddQuestion(bIndex: number, group: "PRE" | "C") {
    const updatedLessons = lessons.map((l) => {
      if (l.id !== activeLessonId) return l;

      const updatedDNA = l.dna.map((d, idx) => {
        if (idx !== bIndex) return d;

        if (group === "PRE") {
          const nextLevel = d.preTrials.length + 1;
          const newPre: QuestionAlternative = {
            id: `PRE-ADDED-${Date.now()}`,
            group: "PRE",
            level: nextLevel,
            tierName: "Case Pre",
            questionText: `New Level ${nextLevel} Pre Trial Question`,
            diagnosticTarget: "concept",
            choices: [
              { id: "A", text: "Correct Option", isCorrect: true, explanation: "Correct answer choice." },
              { id: "B", text: "Incorrect Option A", isCorrect: false, explanation: "Incorrect option." },
              { id: "C", text: "Incorrect Option B", isCorrect: false, explanation: "Incorrect option." },
              { id: "D", text: "Incorrect Option C", isCorrect: false, explanation: "Incorrect option." },
            ],
          };
          return { ...d, preTrials: [...d.preTrials, newPre] };
        } else {
          const nextLevel = d.cQuestions.length + 1;
          const newC: QuestionAlternative = {
            id: `C-ADDED-${Date.now()}`,
            group: "C",
            level: nextLevel,
            tierName: "Case C",
            questionText: `New Level ${nextLevel} Case C Challenge Question`,
            diagnosticTarget: "procedure",
            choices: [
              { id: "A", text: "Correct Option", isCorrect: true, explanation: "Correct challenge answer." },
              { id: "B", text: "Incorrect Option A", isCorrect: false, explanation: "Incorrect option." },
              { id: "C", text: "Incorrect Option B", isCorrect: false, explanation: "Incorrect option." },
              { id: "D", text: "Incorrect Option C", isCorrect: false, explanation: "Incorrect option." },
            ],
          };
          return { ...d, cQuestions: [...d.cQuestions, newC] };
        }
      });

      return { ...l, dna: updatedDNA };
    });

    setLessons(updatedLessons);
  }

  return (
    <div className="space-y-6 text-white">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
        <div className="flex items-center gap-3">
          <FileCheck2 className="h-6 w-6 text-amber-500" />
          <div>
            <h2 className="text-base font-bold">Question DNA Reviewer</h2>
            <p className="text-xs text-neutral-400">
              Inspect adaptive pre-trials, core Case B questions, and challenge Case C questions for all Part 1 lessons.
            </p>
          </div>
        </div>
        <button
          onClick={() => handleApproveLesson(activeLessonId)}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
            approvedLessons[activeLessonId]
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
              : "bg-amber-500 text-neutral-950 hover:bg-amber-400"
          }`}
        >
          {approvedLessons[activeLessonId] ? (
            <>
              <CheckCircle2 className="h-4 w-4" /> Lesson Approved ✓
            </>
          ) : (
            <>
              <Check className="h-4 w-4" /> Approve Lesson & Publish
            </>
          )}
        </button>
      </div>

      {/* Lesson tabs layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left side Lesson navigator */}
        <div className="lg:col-span-1 space-y-2">
          <p className="text-xs font-semibold text-neutral-500 uppercase px-2">Part 1 Lessons</p>
          <div className="space-y-1">
            {lessons.map((l) => {
              const isApproved = approvedLessons[l.id];
              return (
                <button
                  key={l.id}
                  onClick={() => {
                    setActiveLessonId(l.id);
                    setExpandedBIndex(0);
                  }}
                  className={`w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-xs transition ${
                    activeLessonId === l.id
                      ? "bg-neutral-850 text-amber-500 font-bold border-l-2 border-amber-500"
                      : "text-neutral-400 hover:bg-neutral-900/60 hover:text-white"
                  }`}
                >
                  <span className="truncate">{l.title}</span>
                  {isApproved && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right side Question details */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-sm font-bold text-neutral-300">
            {activeLesson.title} — Adaptive DNA ({activeLesson.dna.length} Core Questions)
          </h3>

          <div className="space-y-3">
            {activeLesson.dna.map((d, bIdx) => {
              const isExpanded = expandedBIndex === bIdx;
              return (
                <div key={d.id} className="rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden">
                  {/* Collapsible header */}
                  <div
                    onClick={() => toggleExpandB(bIdx)}
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-900/30 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-neutral-850 border border-neutral-700 flex items-center justify-center text-xs font-bold text-amber-400">
                        {bIdx + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{d.concept}</h4>
                        <p className="text-[10px] text-neutral-500">
                          {d.preTrials.length} Pre trials · 1 B question · {d.cQuestions.length} C challenges
                        </p>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>

                  {isExpanded && (
                    <div className="border-t border-neutral-850 p-4 space-y-4">
                      {/* Sub tabs: Pre | B | C */}
                      <div className="flex border-b border-neutral-800">
                        {(["PRE", "B", "C"] as const).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveSubTab(tab)}
                            className={`px-4 py-2 text-xs font-semibold border-b-2 transition ${
                              activeSubTab === tab
                                ? "border-amber-500 text-amber-400 font-bold"
                                : "border-transparent text-neutral-500 hover:text-neutral-300"
                            }`}
                          >
                            {tab === "PRE" ? `Case Pre (${d.preTrials.length})` : tab === "B" ? "Case B (Core)" : `Case C (${d.cQuestions.length})`}
                          </button>
                        ))}
                      </div>

                      {/* Tab contents */}
                      <div className="space-y-4">
                        {/* CASE B */}
                        {activeSubTab === "B" && (
                          <div className="space-y-3">
                            {editingId === d.bQuestion.id ? (
                              <div className="space-y-3 p-4 rounded-xl border border-amber-500/25 bg-amber-500/5">
                                <label className="block text-xs font-semibold text-neutral-400">
                                  Edit Question Text
                                  <textarea
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                                    rows={3}
                                  />
                                </label>
                                <div className="space-y-2">
                                  <p className="text-[11px] font-bold text-neutral-400">Answer Choices (Check correct option)</p>
                                  {editChoices.map((ch, chIdx) => (
                                    <div key={ch.id} className="flex items-center gap-2">
                                      <input
                                        type="radio"
                                        name={`correct-b-${d.id}`}
                                        checked={ch.isCorrect}
                                        onChange={() => {
                                          setEditChoices(editChoices.map((c, i) => ({ ...c, isCorrect: i === chIdx })));
                                        }}
                                      />
                                      <input
                                        type="text"
                                        value={ch.text}
                                        onChange={(e) => {
                                          setEditChoices(editChoices.map((c, i) => i === chIdx ? { ...c, text: e.target.value } : c));
                                        }}
                                        className="flex-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-white outline-none focus:border-amber-500"
                                      />
                                    </div>
                                  ))}
                                </div>
                                <div className="flex gap-2 justify-end">
                                  <button onClick={() => setEditingId(null)} className="rounded border border-neutral-700 px-3 py-1 text-xs hover:bg-neutral-900 transition">Cancel</button>
                                  <button onClick={() => handleSaveEdit(bIdx, "B", d.bQuestion.id)} className="rounded bg-amber-500 text-neutral-950 px-3 py-1 text-xs font-bold hover:bg-amber-400 transition">Save</button>
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/30 space-y-3">
                                <div className="flex justify-between gap-3">
                                  <p className="text-xs font-medium leading-relaxed">{d.bQuestion.questionText}</p>
                                  <button onClick={() => handleStartEdit(d.bQuestion, d.bQuestion.id)} className="text-neutral-500 hover:text-white transition flex-shrink-0">
                                    <Edit3 className="h-4 w-4" />
                                  </button>
                                </div>
                                <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
                                  {(d.bQuestion as any).choices?.map((ch: any) => (
                                    <div key={ch.id} className={`flex items-start gap-2 rounded px-3 py-2 text-[11px] border ${ch.isCorrect ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-neutral-800 bg-neutral-900 text-neutral-400"}`}>
                                      <span className="font-bold uppercase">{ch.id}:</span>
                                      <span>{ch.text}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* CASE PRE */}
                        {activeSubTab === "PRE" && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <p className="text-[11px] text-neutral-500">Scaffold trials shown one-by-one to struggling students.</p>
                              <button onClick={() => handleAddQuestion(bIdx, "PRE")} className="flex items-center gap-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 text-[10px] font-bold text-amber-400 transition">
                                <Plus className="h-3 w-3" /> Add Pre Trial
                              </button>
                            </div>

                            {d.preTrials.map((pre, pIdx) => (
                              <div key={pre.id} className="p-4 rounded-xl border border-neutral-850 bg-neutral-900/20 space-y-3">
                                {editingId === pre.id ? (
                                  <div className="space-y-3">
                                    <label className="block text-xs font-semibold text-neutral-400">
                                      Edit Trial {pIdx + 1} Text
                                      <textarea
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                                        rows={3}
                                      />
                                    </label>
                                    <div className="space-y-2">
                                      {editChoices.map((ch, chIdx) => (
                                        <div key={ch.id} className="flex items-center gap-2">
                                          <input
                                            type="radio"
                                            name={`correct-pre-${pre.id}`}
                                            checked={ch.isCorrect}
                                            onChange={() => {
                                              setEditChoices(editChoices.map((c, i) => ({ ...c, isCorrect: i === chIdx })));
                                            }}
                                          />
                                          <input
                                            type="text"
                                            value={ch.text}
                                            onChange={(e) => {
                                              setEditChoices(editChoices.map((c, i) => i === chIdx ? { ...c, text: e.target.value } : c));
                                            }}
                                            className="flex-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-white outline-none focus:border-amber-500"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                      <button onClick={() => setEditingId(null)} className="rounded border border-neutral-700 px-3 py-1 text-xs hover:bg-neutral-900 transition">Cancel</button>
                                      <button onClick={() => handleSaveEdit(bIdx, "PRE", pre.id)} className="rounded bg-amber-500 text-neutral-950 px-3 py-1 text-xs font-bold hover:bg-amber-400 transition">Save</button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">Level {pre.level} Trial</span>
                                      <div className="flex items-center gap-2">
                                        <button onClick={() => handleStartEdit(pre, pre.id)} className="text-neutral-500 hover:text-white transition">
                                          <Edit3 className="h-3.5 w-3.5" />
                                        </button>
                                        <button onClick={() => handleDeleteQuestion(bIdx, "PRE", pre.id)} className="text-neutral-500 hover:text-red-400 transition">
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                    <p className="text-xs text-neutral-200 leading-relaxed">{pre.questionText}</p>
                                    <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
                                      {pre.choices?.map((ch) => (
                                        <div key={ch.id} className={`flex items-start gap-2 rounded px-3 py-2 text-[10px] border ${ch.isCorrect ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-neutral-800 bg-neutral-900 text-neutral-500"}`}>
                                          <span className="font-bold uppercase">{ch.id}:</span>
                                          <span>{ch.text}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* CASE C */}
                        {activeSubTab === "C" && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <p className="text-[11px] text-neutral-500">Escalated challenge questions unlocked upon B correction.</p>
                              <button onClick={() => handleAddQuestion(bIdx, "C")} className="flex items-center gap-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 text-[10px] font-bold text-amber-400 transition">
                                <Plus className="h-3 w-3" /> Add Challenge
                              </button>
                            </div>

                            {d.cQuestions.map((cQ, cIdx) => (
                              <div key={cQ.id} className="p-4 rounded-xl border border-neutral-855 bg-neutral-900/20 space-y-3">
                                {editingId === cQ.id ? (
                                  <div className="space-y-3">
                                    <label className="block text-xs font-semibold text-neutral-400">
                                      Edit Challenge {cIdx + 1} Text
                                      <textarea
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                                        rows={3}
                                      />
                                    </label>
                                    <div className="space-y-2">
                                      {editChoices.map((ch, chIdx) => (
                                        <div key={ch.id} className="flex items-center gap-2">
                                          <input
                                            type="radio"
                                            name={`correct-c-${cQ.id}`}
                                            checked={ch.isCorrect}
                                            onChange={() => {
                                              setEditChoices(editChoices.map((c, i) => ({ ...c, isCorrect: i === chIdx })));
                                            }}
                                          />
                                          <input
                                            type="text"
                                            value={ch.text}
                                            onChange={(e) => {
                                              setEditChoices(editChoices.map((c, i) => i === chIdx ? { ...c, text: e.target.value } : c));
                                            }}
                                            className="flex-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-white outline-none focus:border-amber-500"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                      <button onClick={() => setEditingId(null)} className="rounded border border-neutral-700 px-3 py-1 text-xs hover:bg-neutral-900 transition">Cancel</button>
                                      <button onClick={() => handleSaveEdit(bIdx, "C", cQ.id)} className="rounded bg-amber-500 text-neutral-950 px-3 py-1 text-xs font-bold hover:bg-amber-400 transition">Save</button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">Level {cQ.level} Challenge</span>
                                      <div className="flex items-center gap-2">
                                        <button onClick={() => handleStartEdit(cQ, cQ.id)} className="text-neutral-500 hover:text-white transition">
                                          <Edit3 className="h-3.5 w-3.5" />
                                        </button>
                                        <button onClick={() => handleDeleteQuestion(bIdx, "C", cQ.id)} className="text-neutral-500 hover:text-red-400 transition">
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                    <p className="text-xs text-neutral-200 leading-relaxed">{cQ.questionText}</p>
                                    <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
                                      {cQ.choices?.map((ch) => (
                                        <div key={ch.id} className={`flex items-start gap-2 rounded px-3 py-2 text-[10px] border ${ch.isCorrect ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-neutral-800 bg-neutral-900 text-neutral-500"}`}>
                                          <span className="font-bold uppercase">{ch.id}:</span>
                                          <span>{ch.text}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
