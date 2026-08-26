"use client";

import React from "react";
import RichTextEditor from "../RichTextEditor";
import { QuestionNumericSlide } from "../../CarouselTypes";

interface Props {
  slide: QuestionNumericSlide;
  onChange: (update: Partial<QuestionNumericSlide>) => void;
}

export default function NumericEditor({ slide, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <RichTextEditor
          label="Question text"
          value={slide.questionText || ""}
          onChange={(val) => onChange({ questionText: val })}
          accentColor="violet"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="block text-xs font-semibold text-neutral-400">
          Correct value
          <input
            type="number"
            step="any"
            value={slide.correctValue ?? ""}
            onChange={(e) => onChange({ correctValue: parseFloat(e.target.value) })}
            className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
          />
        </label>

        <div>
          <label className="block text-xs font-semibold text-neutral-400">
            Tolerance ±
            <input
              type="number"
              step="any"
              value={slide.tolerance ?? ""}
              onChange={(e) => onChange({ tolerance: parseFloat(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
            />
          </label>
          <p className="mt-1 text-[10px] text-neutral-500">
            Student's answer must be within ±{slide.tolerance || 0} of the correct value
          </p>
        </div>
      </div>

      <label className="block text-xs font-semibold text-neutral-400">
        Unit label
        <input
          type="text"
          value={slide.unit || ""}
          onChange={(e) => onChange({ unit: e.target.value })}
          placeholder="e.g. m/s, kg, N"
          className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
        />
      </label>

      <div className="flex gap-4">
        <label className="block flex-1 text-xs font-semibold text-neutral-400">
          Points
          <input
            type="number"
            min="0"
            step="0.5"
            value={slide.points || 0}
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
  );
}
