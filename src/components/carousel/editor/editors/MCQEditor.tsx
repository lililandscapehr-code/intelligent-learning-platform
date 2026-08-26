"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Trash2,
  Plus,
  Upload,
  Link,
  X,
  Image as ImageIcon,
} from "lucide-react";
import type { MCQChoice, QuestionMCQSlide } from "../../CarouselTypes";
import RichTextEditor from "../RichTextEditor";

interface MCQEditorProps {
  slide: QuestionMCQSlide;
  onChange: (update: Partial<QuestionMCQSlide>) => void;
}

export default function MCQEditor({ slide, onChange }: MCQEditorProps) {
  const [expandedChoiceIds, setExpandedChoiceIds] = useState<Set<string>>(new Set());
  const [isImageSectionOpen, setIsImageSectionOpen] = useState(false);
  const [activeImageTab, setActiveImageTab] = useState<"upload" | "url">("upload");

  const toggleChoiceExpanded = (id: string) => {
    setExpandedChoiceIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const updateChoice = (id: string, updates: Partial<MCQChoice>) => {
    const newChoices = slide.choices.map((c) => (c.id === id ? { ...c, ...updates } : c));
    onChange({ choices: newChoices });
  };

  const setChoiceCorrect = (id: string, isCorrect: boolean) => {
    let newChoices = [...slide.choices];
    if (slide.allowMultiple) {
      newChoices = newChoices.map((c) => (c.id === id ? { ...c, isCorrect } : c));
    } else {
      newChoices = newChoices.map((c) => ({ ...c, isCorrect: c.id === id ? isCorrect : false }));
    }
    onChange({ choices: newChoices });
  };

  const addChoice = () => {
    if (slide.choices.length >= 6) return;
    const newChoice: MCQChoice = {
      id: crypto.randomUUID(),
      text: "",
      isCorrect: false,
    };
    onChange({ choices: [...slide.choices, newChoice] });
  };

  const deleteChoice = (id: string) => {
    if (slide.choices.length <= 2) return;
    onChange({ choices: slide.choices.filter((c) => c.id !== id) });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      onChange({ imageUrl: url });
    }
  };

  const getLetter = (index: number) => String.fromCharCode(65 + index);

  return (
    <div className="space-y-8">
      {/* 1. Question Text */}
      <section>
        <RichTextEditor
          label="Question"
          accentColor="violet"
          rows={6}
          value={slide.questionText || ""}
          onChange={(text) => onChange({ questionText: text })}
        />
      </section>

      {/* 2. Choices Manager */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-sm font-semibold text-white">Answer Choices</h3>
          <div className="h-px flex-1 bg-neutral-800" />
          <div className="h-1 w-12 rounded bg-amber-500/50" />
        </div>

        <div className="space-y-3">
          {slide.choices.map((choice, idx) => {
            const isExpanded = expandedChoiceIds.has(choice.id);
            const canDelete = slide.choices.length > 2;
            const letter = getLetter(idx);

            return (
              <div
                key={choice.id}
                className="rounded-lg border border-neutral-800 bg-neutral-900 overflow-hidden"
              >
                <div className="flex items-center gap-3 p-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sm font-bold ${
                      choice.isCorrect
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                    }`}
                  >
                    {letter}
                  </div>

                  <input
                    type="text"
                    value={choice.text}
                    onChange={(e) => updateChoice(choice.id, { text: e.target.value })}
                    placeholder={`Choice ${letter}...`}
                    className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-neutral-600"
                  />

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type={slide.allowMultiple ? "checkbox" : "radio"}
                        checked={choice.isCorrect}
                        onChange={(e) => setChoiceCorrect(choice.id, e.target.checked)}
                        className="h-4 w-4 rounded border-neutral-700 bg-neutral-800 text-amber-500 focus:ring-amber-500 focus:ring-offset-neutral-900"
                        name={slide.allowMultiple ? undefined : `correct-choice-${slide.id}`}
                      />
                      <span className="text-xs text-neutral-400">Correct</span>
                    </label>

                    <div className="h-4 w-px bg-neutral-800 mx-1" />

                    <button
                      type="button"
                      onClick={() => toggleChoiceExpanded(choice.id)}
                      className="text-neutral-400 hover:text-white transition-colors p-1 rounded hover:bg-neutral-800"
                      title="Toggle explanation & misconception"
                    >
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteChoice(choice.id)}
                      disabled={!canDelete}
                      className="text-neutral-500 hover:text-red-400 disabled:opacity-30 disabled:hover:text-neutral-500 transition-colors p-1 rounded hover:bg-neutral-800"
                      title={canDelete ? "Delete choice" : "Minimum 2 choices required"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-neutral-800 bg-neutral-950 p-3 space-y-3">
                    <div>
                      <label className="text-xs font-medium text-neutral-400 mb-1 block">Explanation</label>
                      <input
                        type="text"
                        value={choice.explanation || ""}
                        onChange={(e) => updateChoice(choice.id, { explanation: e.target.value })}
                        placeholder="Why is this correct or incorrect?"
                        className="w-full rounded bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-sm text-white outline-none focus:border-amber-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-neutral-400 mb-1 block">Misconception ID</label>
                      <input
                        type="text"
                        value={choice.misconceptionId || ""}
                        onChange={(e) => updateChoice(choice.id, { misconceptionId: e.target.value })}
                        placeholder="e.g. math.frac.add.denom"
                        className="w-full rounded bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-sm text-white outline-none focus:border-amber-500/50"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {slide.choices.length < 6 && (
          <button
            type="button"
            onClick={addChoice}
            className="mt-3 flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add choice</span>
          </button>
        )}
      </section>

      {/* 3. Question Options */}
      <section className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Points</label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={slide.points ?? 1}
              onChange={(e) => onChange({ points: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">⏱ Timer (seconds, 0 = unlimited)</label>
            <input
              type="number"
              min="0"
              step="1"
              value={slide.timerSeconds ?? 0}
              onChange={(e) => onChange({ timerSeconds: parseInt(e.target.value, 10) || 0 })}
              className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div className="flex gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!slide.allowMultiple}
              onChange={(e) => onChange({ allowMultiple: e.target.checked })}
              className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-violet-500 focus:ring-violet-500 focus:ring-offset-neutral-950"
            />
            <span className="text-sm text-neutral-300">Allow multiple correct answers</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!slide.shuffleChoices}
              onChange={(e) => onChange({ shuffleChoices: e.target.checked })}
              className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-violet-500 focus:ring-violet-500 focus:ring-offset-neutral-950"
            />
            <span className="text-sm text-neutral-300">Shuffle choices for each student</span>
          </label>
        </div>
      </section>

      {/* 4. Image Attachment */}
      <section className="rounded-lg border border-neutral-800 bg-neutral-900/50 overflow-hidden">
        <button
          type="button"
          onClick={() => setIsImageSectionOpen(!isImageSectionOpen)}
          className="flex w-full items-center justify-between p-3 text-sm font-medium text-neutral-300 hover:bg-neutral-800/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-neutral-400" />
            <span>📎 Attach Image</span>
          </div>
          {isImageSectionOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        {isImageSectionOpen && (
          <div className="border-t border-neutral-800 p-4 space-y-4">
            <div className="flex gap-2 border-b border-neutral-800 pb-2">
              <button
                type="button"
                onClick={() => setActiveImageTab("upload")}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
                  activeImageTab === "upload" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                <Upload className="h-4 w-4" /> Upload
              </button>
              <button
                type="button"
                onClick={() => setActiveImageTab("url")}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
                  activeImageTab === "url" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                <Link className="h-4 w-4" /> URL
              </button>
            </div>

            {activeImageTab === "upload" ? (
              <div>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-neutral-700 border-dashed rounded-lg cursor-pointer bg-neutral-900/50 hover:bg-neutral-800/50 hover:border-neutral-500 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-neutral-400">
                    <Upload className="w-8 h-8 mb-2" />
                    <p className="mb-2 text-sm">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Image URL</label>
                <input
                  type="text"
                  value={slide.imageUrl || ""}
                  onChange={(e) => onChange({ imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
                />
              </div>
            )}

            {slide.imageUrl && (
              <div className="space-y-4 pt-4 border-t border-neutral-800">
                <div className="flex items-start justify-between">
                  <img
                    src={slide.imageUrl}
                    alt={slide.imageAlt || "Preview"}
                    className="max-h-36 rounded-md object-contain bg-neutral-950"
                  />
                  <button
                    type="button"
                    onClick={() => onChange({ imageUrl: undefined })}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-red-400 hover:bg-red-400/10 rounded transition-colors"
                  >
                    <X className="h-3 w-3" /> Remove image
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">Alt text</label>
                    <input
                      type="text"
                      value={slide.imageAlt || ""}
                      onChange={(e) => onChange({ imageAlt: e.target.value })}
                      className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm text-white outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">Caption</label>
                    <input
                      type="text"
                      value={slide.imageCaption || ""}
                      onChange={(e) => onChange({ imageCaption: e.target.value })}
                      className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm text-white outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-2">Layout</label>
                  <div className="flex gap-2">
                    {(["left", "right", "top", "bottom", "fullscreen"] as const).map((layout) => (
                      <button
                        key={layout}
                        type="button"
                        onClick={() => onChange({ imageLayout: layout })}
                        className={`px-3 py-1.5 text-xs rounded-md capitalize transition-colors ${
                          (slide.imageLayout || "left") === layout
                            ? "bg-violet-500 text-white"
                            : "bg-neutral-800 text-neutral-400 hover:text-white"
                        }`}
                      >
                        {layout}
                      </button>
                    ))}
                  </div>
                </div>

                {["left", "right"].includes(slide.imageLayout || "left") && (
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">
                      Image Size: {slide.imageSizePct || 42}%
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="70"
                      value={slide.imageSizePct || 42}
                      onChange={(e) => onChange({ imageSizePct: parseInt(e.target.value, 10) })}
                      className="w-full accent-violet-500"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
