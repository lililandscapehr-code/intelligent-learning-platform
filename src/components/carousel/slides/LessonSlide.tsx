"use client";

import React from "react";
import { LessonTextSlide, LessonImageSlide } from "../CarouselTypes";

export function LessonTextSlideView({ slide }: { slide: LessonTextSlide }) {
  const highlightKeyTerms = (text: string, terms: string[] = []) => {
    if (!terms.length) return <span>{text}</span>;
    const pattern = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
    const parts = text.split(pattern);
    return (
      <>
        {parts.map((part, i) =>
          terms.some((t) => t.toLowerCase() === part.toLowerCase()) ? (
            <mark key={i} className="bg-amber-500/20 text-amber-300 px-1 rounded font-semibold not-italic">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div className="p-8 md:p-12 flex flex-col gap-6 min-h-[420px] justify-center bg-gradient-to-br from-neutral-950 to-neutral-900">
      {slide.learningObjective && (
        <div className="inline-flex items-center gap-2 self-start">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
            🎯 Learning Objective
          </span>
          <span className="text-xs text-neutral-400">{slide.learningObjective}</span>
        </div>
      )}

      {slide.title && (
        <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
          {slide.title}
        </h2>
      )}

      <div className="text-base md:text-lg text-neutral-300 leading-relaxed max-w-3xl">
        {slide.body.split("\n\n").map((para, i) => (
          <p key={i} className="mb-4 last:mb-0">
            {highlightKeyTerms(para, slide.keyTerms)}
          </p>
        ))}
      </div>

      {slide.keyTerms && slide.keyTerms.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-800">
          <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider self-center mr-1">Key Terms:</span>
          {slide.keyTerms.map((term) => (
            <span key={term} className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full font-medium">
              {term}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function LessonImageSlideView({ slide }: { slide: LessonImageSlide }) {
  return (
    <div className="relative w-full min-h-[420px] bg-neutral-950">
      <img
        src={slide.imageUrl}
        alt={slide.title || "Lesson image"}
        className="w-full h-80 object-cover"
      />
      {/* Annotation overlays */}
      {slide.annotations?.map((ann, i) => (
        <div
          key={i}
          className="absolute z-10"
          style={{ left: `${ann.x}%`, top: `${ann.y}%` }}
        >
          <div className="relative group">
            <div className="w-6 h-6 bg-amber-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-black text-neutral-950 cursor-pointer">
              {i + 1}
            </div>
            <div className="absolute left-8 top-0 bg-neutral-950 border border-amber-500/30 text-neutral-200 text-xs p-2 rounded-lg w-40 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-20">
              {ann.text}
            </div>
          </div>
        </div>
      ))}
      {(slide.title || slide.subtitle) && (
        <div className="p-6 bg-neutral-950 border-t border-neutral-800">
          {slide.title && <h3 className="text-white font-bold text-lg">{slide.title}</h3>}
          {slide.subtitle && <p className="text-neutral-400 text-sm mt-1">{slide.subtitle}</p>}
        </div>
      )}
    </div>
  );
}
