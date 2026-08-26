"use client";

import React from "react";
import type { EduCarouselConfig, CarouselAccessScope } from "../CarouselTypes";
import { CheckCircle2, AlertTriangle, RotateCcw } from "lucide-react";

interface CarouselSettingsPanelProps {
  draft: EduCarouselConfig;
  onChange: (update: Partial<EduCarouselConfig>) => void;
  registryDraftId: string | null;
  registryStatus: string;
  registryBusy: boolean;
  reviewNote: string;
  onReviewNoteChange: (note: string) => void;
  onSaveDraft: () => void;
  onApprove: () => void;
  onReject: () => void;
  onRequestChanges: () => void;
  onPublish: () => void;
  validationErrors: string[];
}

export default function CarouselSettingsPanel({
  draft,
  onChange,
  registryDraftId,
  registryStatus,
  registryBusy,
  reviewNote,
  onReviewNoteChange,
  onSaveDraft,
  onApprove,
  onReject,
  onRequestChanges,
  onPublish,
  validationErrors,
}: CarouselSettingsPanelProps) {
  return (
    <div className="flex flex-col h-full bg-neutral-900 border-l border-neutral-800 overflow-y-auto">
      <div className="p-5 space-y-6">
        
        {/* Section 1 — Carousel Identity */}
        <section className="space-y-4 border border-neutral-800 rounded-lg p-4">
          <h3 className="text-amber-400 text-sm font-semibold uppercase tracking-wider flex items-center gap-2 mb-2">
            Carousel Identity
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Carousel ID</label>
              <input
                type="text"
                value={draft.id}
                onChange={(e) => onChange({ id: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-sm text-neutral-300 font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Title</label>
              <input
                type="text"
                value={draft.title || ""}
                onChange={(e) => onChange({ title: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-sm text-neutral-200 focus:border-amber-500 focus:outline-none"
                placeholder="Lesson Title"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Skill ID</label>
              <input
                type="text"
                value={draft.skillId || ""}
                onChange={(e) => onChange({ skillId: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-sm text-neutral-300 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Blueprint ID</label>
              <input
                type="text"
                value={draft.blueprintId || ""}
                onChange={(e) => onChange({ blueprintId: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-sm text-neutral-300 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Section 2 — Playback & Layout */}
        <section className="space-y-4 border border-neutral-800 rounded-lg p-4">
          <h3 className="text-sky-400 text-sm font-semibold uppercase tracking-wider mb-2">
            Playback & Layout
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Sequence Mode</label>
              <div className="flex items-center gap-4 text-sm text-neutral-300 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sequenceMode"
                    checked={draft.sequenceMode === "OPEN"}
                    onChange={() => onChange({ sequenceMode: "OPEN" })}
                    className="accent-sky-500"
                  />
                  Any order
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sequenceMode"
                    checked={draft.sequenceMode === "SEQUENTIAL"}
                    onChange={() => onChange({ sequenceMode: "SEQUENTIAL" })}
                    className="accent-sky-500"
                  />
                  Must complete in order
                </label>
              </div>
            </div>
            <div className="pt-2">
              <label className="block text-xs font-medium text-neutral-400 mb-1">Auto-advance (seconds, 0 = off)</label>
              <input
                type="number"
                min="0"
                value={draft.autoAdvanceMs ? Math.floor(draft.autoAdvanceMs / 1000) : 0}
                onChange={(e) => onChange({ autoAdvanceMs: (parseInt(e.target.value) || 0) * 1000 })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-sm text-neutral-300 focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.allowSkipQuestions || false}
                  onChange={(e) => onChange({ allowSkipQuestions: e.target.checked })}
                  className="rounded border-neutral-700 text-sky-500 focus:ring-sky-500 bg-neutral-900"
                />
                Allow skip questions
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.showProgressBar !== false}
                  onChange={(e) => onChange({ showProgressBar: e.target.checked })}
                  className="rounded border-neutral-700 text-sky-500 focus:ring-sky-500 bg-neutral-900"
                />
                Show progress bar
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.showScoreTally !== false}
                  onChange={(e) => onChange({ showScoreTally: e.target.checked })}
                  className="rounded border-neutral-700 text-sky-500 focus:ring-sky-500 bg-neutral-900"
                />
                Show score tally
              </label>
            </div>
          </div>
        </section>

        {/* Section 3 — Grading & Assessment */}
        <section className="space-y-4 border border-neutral-800 rounded-lg p-4">
          <h3 className="text-violet-400 text-sm font-semibold uppercase tracking-wider mb-2">
            Grading & Assessment
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Minimum Pass Score (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={draft.accessPolicy?.minimumScorePercentage ?? 0}
                onChange={(e) =>
                  onChange({
                    accessPolicy: {
                      ...(draft.accessPolicy || { scope: "ALL_ENROLLED", showCorrectAnswers: true, showMarks: true, trackTiming: true, minimumScorePercentage: 0 }),
                      minimumScorePercentage: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-sm text-neutral-300 focus:border-violet-500 focus:outline-none"
              />
            </div>
            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.accessPolicy?.showCorrectAnswers ?? true}
                  onChange={(e) =>
                    onChange({
                      accessPolicy: {
                        ...(draft.accessPolicy || { scope: "ALL_ENROLLED", minimumScorePercentage: 0, showMarks: true, trackTiming: true, showCorrectAnswers: true }),
                        showCorrectAnswers: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-neutral-700 text-violet-500 focus:ring-violet-500 bg-neutral-900"
                />
                Show correct answers
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.accessPolicy?.showMarks ?? true}
                  onChange={(e) =>
                    onChange({
                      accessPolicy: {
                        ...(draft.accessPolicy || { scope: "ALL_ENROLLED", minimumScorePercentage: 0, showCorrectAnswers: true, trackTiming: true, showMarks: true }),
                        showMarks: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-neutral-700 text-violet-500 focus:ring-violet-500 bg-neutral-900"
                />
                Show marks
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.accessPolicy?.trackTiming ?? true}
                  onChange={(e) =>
                    onChange({
                      accessPolicy: {
                        ...(draft.accessPolicy || { scope: "ALL_ENROLLED", minimumScorePercentage: 0, showCorrectAnswers: true, showMarks: true, trackTiming: true }),
                        trackTiming: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-neutral-700 text-violet-500 focus:ring-violet-500 bg-neutral-900"
                />
                Track answer timing
              </label>
            </div>
          </div>
        </section>

        {/* Section 4 — Student Access */}
        <section className="space-y-4 border border-neutral-800 rounded-lg p-4">
          <h3 className="text-sky-400 text-sm font-semibold uppercase tracking-wider mb-2">
            Student Access
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Scope</label>
              <select
                value={draft.accessPolicy?.scope || "ALL_ENROLLED"}
                onChange={(e) =>
                  onChange({
                    accessPolicy: {
                      ...(draft.accessPolicy || { minimumScorePercentage: 0, showCorrectAnswers: true, showMarks: true, trackTiming: true, scope: "ALL_ENROLLED" }),
                      scope: e.target.value as CarouselAccessScope,
                    },
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-sm text-neutral-300 focus:border-sky-500 focus:outline-none"
              >
                <option value="ALL_ENROLLED">All Enrolled</option>
                <option value="SELECTED_STUDENTS">Selected Students</option>
                <option value="SELECTED_SUBSCRIPTION">Selected Subscription</option>
              </select>
            </div>
            {draft.accessPolicy?.scope === "SELECTED_STUDENTS" && (
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Student IDs (comma-separated)</label>
                <input
                  type="text"
                  value={draft.accessPolicy?.studentIds?.join(", ") || ""}
                  onChange={(e) =>
                    onChange({
                      accessPolicy: {
                        ...draft.accessPolicy!,
                        studentIds: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-sm text-neutral-300 focus:border-sky-500 focus:outline-none"
                />
              </div>
            )}
            {draft.accessPolicy?.scope === "SELECTED_SUBSCRIPTION" && (
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Subscription IDs (comma-separated)</label>
                <input
                  type="text"
                  value={draft.accessPolicy?.subscriptionIds?.join(", ") || ""}
                  onChange={(e) =>
                    onChange({
                      accessPolicy: {
                        ...draft.accessPolicy!,
                        subscriptionIds: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-sm text-neutral-300 focus:border-sky-500 focus:outline-none"
                />
              </div>
            )}
          </div>
        </section>

        {/* Section 5 — Validation Status */}
        <section className="space-y-4">
          {validationErrors.length === 0 ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-start gap-3 text-emerald-400 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <p>Carousel is complete and ready to publish.</p>
            </div>
          ) : (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-start gap-3 text-amber-400 text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium">Please fix the following issues:</p>
                <ul className="list-disc pl-4 opacity-80">
                  {validationErrors.slice(0, 5).map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                  {validationErrors.length > 5 && (
                    <li>...and {validationErrors.length - 5} more issues</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* Section 6 — Content Registry */}
        <section className="space-y-4 border border-neutral-800 rounded-lg p-4 bg-neutral-900/50">
          <h3 className="text-amber-400 text-sm font-semibold uppercase tracking-wider flex items-center gap-2 mb-2">
            <RotateCcw className="w-4 h-4" />
            Content Registry
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-400">Status:</span>
              <span className="text-neutral-200 capitalize">{registryStatus}</span>
            </div>
            {registryDraftId && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-400">Draft ID:</span>
                <span className="text-neutral-500 font-mono text-xs">{registryDraftId}</span>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onSaveDraft}
                disabled={registryBusy}
                className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded py-1.5 text-sm font-medium transition-colors disabled:opacity-50"
              >
                Save Draft
              </button>
              <button
                onClick={onPublish}
                disabled={registryBusy || validationErrors.length > 0}
                className="bg-sky-500/10 hover:bg-sky-500/20 text-sky-500 border border-sky-500/30 rounded py-1.5 text-sm font-medium transition-colors disabled:opacity-50"
              >
                Publish
              </button>
              <button
                onClick={onApprove}
                disabled={registryBusy || registryStatus !== "review"}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 rounded py-1.5 text-sm font-medium transition-colors disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={onReject}
                disabled={registryBusy || registryStatus !== "review"}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded py-1.5 text-sm font-medium transition-colors disabled:opacity-50"
              >
                Reject
              </button>
            </div>

            <div className="pt-2 border-t border-neutral-800 space-y-2">
              <label className="block text-xs font-medium text-neutral-400">Review Note</label>
              <textarea
                value={reviewNote}
                onChange={(e) => onReviewNoteChange(e.target.value)}
                disabled={registryBusy}
                rows={3}
                placeholder="Notes for reviewer or changes needed..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-300 focus:border-amber-500 focus:outline-none resize-none disabled:opacity-50"
              />
              <button
                onClick={onRequestChanges}
                disabled={registryBusy || !reviewNote.trim()}
                className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 rounded py-1.5 text-sm font-medium transition-colors disabled:opacity-50"
              >
                Request Changes
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
