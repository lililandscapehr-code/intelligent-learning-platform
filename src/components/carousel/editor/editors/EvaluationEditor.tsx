"use client";

import React from "react";
import RichTextEditor from "../RichTextEditor";
import { EvaluationSlide } from "../../CarouselTypes";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  slide: EvaluationSlide;
  onChange: (update: Partial<EvaluationSlide>) => void;
}

export default function EvaluationEditor({ slide, onChange }: Props) {
  const rubricPoints = slide.rubricPoints || [];

  const updateRubricPoint = (index: number, label: string, earned: boolean) => {
    const newPoints = [...rubricPoints];
    newPoints[index] = { label, earned };
    onChange({ rubricPoints: newPoints });
  };

  const removeRubricPoint = (index: number) => {
    const newPoints = [...rubricPoints];
    newPoints.splice(index, 1);
    onChange({ rubricPoints: newPoints });
  };

  const addRubricPoint = () => {
    onChange({ rubricPoints: [...rubricPoints, { label: "", earned: false }] });
  };

  return (
    <div className="space-y-5">
      <label className="block text-xs font-semibold text-neutral-400">
        Linked Question Slide ID
        <input
          type="text"
          value={slide.questionRef || ""}
          onChange={(e) => onChange({ questionRef: e.target.value })}
          placeholder="e.g. slide-question_mcq-12345"
          className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
        />
      </label>

      <div>
        <RichTextEditor
          label="Correct answer summary"
          value={slide.correctAnswerText || ""}
          onChange={(val) => onChange({ correctAnswerText: val })}
          accentColor="emerald"
          rows={3}
        />
      </div>

      <div>
        <RichTextEditor
          label="Explanation (step-by-step)"
          value={slide.explanation || ""}
          onChange={(val) => onChange({ explanation: val })}
          accentColor="emerald"
          rows={8}
        />
      </div>

      <div>
        <RichTextEditor
          label="Misconception note"
          value={slide.misconceptionNote || ""}
          onChange={(val) => onChange({ misconceptionNote: val })}
          accentColor="emerald"
          rows={4}
        />
      </div>

      <label className="block text-xs font-semibold text-neutral-400">
        Mastery implication
        <input
          type="text"
          value={slide.masteryImplication || ""}
          onChange={(e) => onChange({ masteryImplication: e.target.value })}
          className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
        />
      </label>

      <div>
        <label className="block text-xs font-semibold text-neutral-400 mb-2">
          Rubric Points
        </label>
        
        <div className="space-y-2">
          {rubricPoints.map((point, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={point.earned}
                onChange={(e) => updateRubricPoint(i, point.label, e.target.checked)}
                className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 accent-emerald-500"
              />
              <input
                type="text"
                value={point.label}
                onChange={(e) => updateRubricPoint(i, e.target.value, point.earned)}
                placeholder="Rubric criterion..."
                className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-white outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => removeRubricPoint(i)}
                className="p-1.5 text-neutral-400 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addRubricPoint}
          className="mt-3 flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-emerald-400 hover:bg-emerald-400/10"
        >
          <Plus className="h-3 w-3" />
          Add rubric point
        </button>
      </div>
    </div>
  );
}
