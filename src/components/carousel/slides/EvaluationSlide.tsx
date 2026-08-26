"use client";

import React from "react";
import { CarouselAccessPolicy, EvaluationSlide, SlideAnswerRecord } from "../CarouselTypes";

interface Props {
  slide: EvaluationSlide;
  answers: SlideAnswerRecord[];
  policy: CarouselAccessPolicy;
}

export function EvaluationSlideView({ slide, answers, policy }: Props) {
  const linkedAnswer = answers.find((a) => a.slideId === slide.questionRef);
  const wasCorrect = linkedAnswer?.isCorrect;
  const responseSeconds = linkedAnswer ? (linkedAnswer.responseTimeMs / 1000).toFixed(1) : null;

  return (
    <div className="p-8 md:p-10 flex flex-col gap-6 min-h-[420px] bg-gradient-to-br from-neutral-950 to-neutral-900">

      {/* Status banner */}
      <div className={`flex items-center gap-3 p-4 rounded-xl border ${
        wasCorrect === true
          ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
          : wasCorrect === false
          ? "bg-red-950/30 border-red-500/30 text-red-300"
          : "bg-neutral-900 border-neutral-700 text-neutral-400"
      }`}>
        <span className="text-2xl">
          {wasCorrect === true ? "🎉" : wasCorrect === false ? "❌" : "📋"}
        </span>
        <div>
          <p className="font-black text-sm uppercase tracking-wider">
            {wasCorrect === true ? "Correct!" : wasCorrect === false ? "Incorrect" : "Evaluation"}
          </p>
          {responseSeconds && (
            <p className="text-xs opacity-70 mt-0.5">
              Responded in {responseSeconds}s ·
              {parseFloat(responseSeconds) > 60
                ? " Slow response — review this concept"
                : " Good response speed"}
            </p>
          )}
        </div>
        {linkedAnswer && (
          <span className="ml-auto text-sm font-black">
            {linkedAnswer.isCorrect ? `+${linkedAnswer.points}` : "0"} pts
          </span>
        )}
      </div>

      {/* Correct answer reveal */}
      {policy.showCorrectAnswers && <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Correct Answer</p>
        <div className="flex items-start gap-3 p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl">
          <span className="text-emerald-400 text-lg mt-0.5">✓</span>
          <p className="text-emerald-200 font-semibold text-base leading-snug">{slide.correctAnswerText}</p>
        </div>
      </div>}

      {/* Explanation */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Explanation</p>
        <p className="text-neutral-300 leading-relaxed text-sm md:text-base">{slide.explanation}</p>
      </div>

      {/* Misconception alert */}
      {slide.misconceptionNote && wasCorrect === false && (
        <div className="flex items-start gap-3 p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl">
          <span className="text-amber-400 text-base mt-0.5">⚠</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500 mb-1">Common Misconception Detected</p>
            <p className="text-amber-200 text-sm leading-relaxed">{slide.misconceptionNote}</p>
          </div>
        </div>
      )}

      {/* Mastery implication */}
      {slide.masteryImplication && (
        <div className="flex items-center gap-3 p-3 bg-neutral-900 border border-neutral-800 rounded-xl">
          <span className="text-purple-400 text-base">📊</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-0.5">Mastery Signal</p>
            <p className="text-neutral-400 text-xs">{slide.masteryImplication}</p>
          </div>
        </div>
      )}

      {/* Rubric points */}
      {slide.rubricPoints && slide.rubricPoints.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Marking Rubric</p>
          <div className="space-y-1.5">
            {slide.rubricPoints.map((rp, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className={rp.earned ? "text-emerald-400" : "text-red-400"}>{rp.earned ? "✓" : "✗"}</span>
                <span className={rp.earned ? "text-neutral-300" : "text-neutral-500"}>{rp.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
