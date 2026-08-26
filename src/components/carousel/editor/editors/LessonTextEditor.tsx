"use client";

import React, { useState } from "react";
import RichTextEditor from "../RichTextEditor";
import { LessonTextSlide } from "../../CarouselTypes";
import { X } from "lucide-react";

interface Props {
  slide: LessonTextSlide;
  onChange: (update: Partial<LessonTextSlide>) => void;
}

export default function LessonTextEditor({ slide, onChange }: Props) {
  const [newTerm, setNewTerm] = useState("");

  const handleAddTerm = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTerm.trim()) {
      e.preventDefault();
      const currentTerms = slide.keyTerms || [];
      if (!currentTerms.includes(newTerm.trim())) {
        onChange({ keyTerms: [...currentTerms, newTerm.trim()] });
      }
      setNewTerm("");
    }
  };

  const removeTerm = (term: string) => {
    const currentTerms = slide.keyTerms || [];
    onChange({ keyTerms: currentTerms.filter((t) => t !== term) });
  };

  const themes = [
    { value: "default", color: "bg-neutral-800" },
    { value: "amber", color: "bg-amber-500" },
    { value: "sky", color: "bg-sky-500" },
    { value: "emerald", color: "bg-emerald-500" },
    { value: "violet", color: "bg-violet-500" },
    { value: "rose", color: "bg-rose-500" },
  ] as const;

  return (
    <div className="space-y-5">
      <label className="block text-xs font-semibold text-neutral-400">
        Title
        <input
          type="text"
          value={slide.title || ""}
          onChange={(e) => onChange({ title: e.target.value })}
          className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
        />
      </label>

      <label className="block text-xs font-semibold text-neutral-400">
        Subtitle
        <input
          type="text"
          value={slide.subtitle || ""}
          onChange={(e) => onChange({ subtitle: e.target.value })}
          className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
        />
      </label>

      <label className="block text-xs font-semibold text-neutral-400">
        Learning objective
        <input
          type="text"
          value={slide.learningObjective || ""}
          onChange={(e) => onChange({ learningObjective: e.target.value })}
          className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
        />
      </label>

      <div>
        <RichTextEditor
          label="Body"
          value={slide.body || ""}
          onChange={(val) => onChange({ body: val })}
          accentColor="amber"
          rows={6}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-400">
          Key Terms
          <input
            type="text"
            value={newTerm}
            onChange={(e) => setNewTerm(e.target.value)}
            onKeyDown={handleAddTerm}
            placeholder="Type a term and press Enter..."
            className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
          />
        </label>
        {slide.keyTerms && slide.keyTerms.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {slide.keyTerms.map((term) => (
              <span
                key={term}
                className="flex items-center gap-1 rounded bg-amber-500/20 px-2 py-1 text-xs font-medium text-amber-300"
              >
                {term}
                <button
                  type="button"
                  onClick={() => removeTerm(term)}
                  className="rounded-full p-0.5 hover:bg-amber-500/30"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-400 mb-2">
          Theme
        </label>
        <div className="flex gap-4">
          {themes.map((t) => (
            <label key={t.value} className="flex cursor-pointer items-center gap-2 text-sm text-white">
              <input
                type="radio"
                name="theme"
                value={t.value}
                checked={(slide.theme || "default") === t.value}
                onChange={() => onChange({ theme: t.value as any })}
                className="h-4 w-4 accent-amber-500"
              />
              <span className={`h-3 w-3 rounded-full ${t.color}`} />
              <span className="capitalize">{t.value}</span>
            </label>
          ))}
        </div>
      </div>

      <label className="block text-xs font-semibold text-neutral-400">
        Auto-advance timer (seconds, 0 = disabled)
        <input
          type="number"
          min="0"
          value={slide.timerSeconds || 0}
          onChange={(e) => onChange({ timerSeconds: parseInt(e.target.value) || 0 })}
          className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
        />
      </label>
    </div>
  );
}
