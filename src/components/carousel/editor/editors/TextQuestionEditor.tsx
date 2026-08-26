"use client";

import React from "react";
import RichTextEditor from "../RichTextEditor";
import { QuestionTextSlide } from "../../CarouselTypes";

interface Props {
  slide: QuestionTextSlide;
  onChange: (update: Partial<QuestionTextSlide>) => void;
}

export default function TextQuestionEditor({ slide, onChange }: Props) {
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

      <label className="block text-xs font-semibold text-neutral-400">
        Placeholder hint for student
        <input
          type="text"
          value={slide.placeholder || ""}
          onChange={(e) => onChange({ placeholder: e.target.value })}
          className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
        />
      </label>

      <div>
        <RichTextEditor
          label="Sample answer (teacher reference only)"
          value={slide.sampleAnswer || ""}
          onChange={(val) => onChange({ sampleAnswer: val })}
          accentColor="violet"
          rows={5}
        />
      </div>

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
