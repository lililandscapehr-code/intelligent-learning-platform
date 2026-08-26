"use client";

import React, { Suspense } from "react";
import type { EduSlide } from "../CarouselTypes";
import { SLIDE_TYPE_COLORS } from "./CarouselEditorTypes";

interface SlideEditorPanelProps {
  slide: EduSlide;
  onChange: (update: Partial<EduSlide>) => void;
  slideIndex: number;
  totalSlides: number;
}

const LessonTextEditor = React.lazy(() => import("./editors/LessonTextEditor"));
const YouTubeEditor = React.lazy(() => import("./editors/YouTubeEditor"));
const ImageEditor = React.lazy(() => import("./editors/ImageEditor"));
const VideoEditor = React.lazy(() => import("./editors/VideoEditor"));
const MCQEditor = React.lazy(() => import("./editors/MCQEditor"));
const TextQuestionEditor = React.lazy(() => import("./editors/TextQuestionEditor"));
const NumericEditor = React.lazy(() => import("./editors/NumericEditor"));
const EvaluationEditor = React.lazy(() => import("./editors/EvaluationEditor"));

export default function SlideEditorPanel({
  slide,
  onChange,
  slideIndex,
  totalSlides,
}: SlideEditorPanelProps) {
  const typeColor = SLIDE_TYPE_COLORS[slide.type] || SLIDE_TYPE_COLORS.lesson_text;

  const renderEditor = () => {
    switch (slide.type) {
      case "lesson_text":
        return <LessonTextEditor slide={slide as any} onChange={onChange as any} />;
      case "youtube":
        return <YouTubeEditor slide={slide as any} onChange={onChange as any} />;
      case "image":
        return <ImageEditor slide={slide as any} onChange={onChange as any} />;
      case "video":
        return <VideoEditor slide={slide as any} onChange={onChange as any} />;
      case "question_mcq":
        return <MCQEditor slide={slide as any} onChange={onChange as any} />;
      case "question_text":
        return <TextQuestionEditor slide={slide as any} onChange={onChange as any} />;
      case "question_numeric":
        return <NumericEditor slide={slide as any} onChange={onChange as any} />;
      case "evaluation":
        return <EvaluationEditor slide={slide as any} onChange={onChange as any} />;
      case "lesson_image":
      case "upload_zone":
        return (
          <div className="py-20 text-center text-neutral-500">
            {slide.type === "lesson_image"
              ? "Use the Image editor for images."
              : "Upload zone slide (Not implemented yet)"}
          </div>
        );
      default:
        return <div className="py-20 text-center text-neutral-500">Unknown slide type.</div>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-950 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-neutral-800 shrink-0">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-neutral-500 text-sm font-medium">
            Slide {slideIndex + 1} of {totalSlides}
          </span>
          <span
            className={`text-xs px-2 py-1 rounded border ${typeColor.bg} ${typeColor.text} ${typeColor.border} uppercase tracking-wider`}
          >
            {slide.type.replace("question_", "")}
          </span>
        </div>
        <input
          type="text"
          value={slide.title || ""}
          onChange={(e) => onChange({ title: e.target.value })}
          className="w-full bg-transparent text-2xl font-semibold text-white placeholder-neutral-600 focus:outline-none focus:border-b focus:border-amber-500/50 pb-1"
          placeholder="Slide Title"
        />
      </div>

      {/* Editor Content */}
      <div className="flex-1 p-6">
        <Suspense
          fallback={
            <div className="py-10 text-center text-neutral-500">Loading editor...</div>
          }
        >
          {renderEditor()}
        </Suspense>
      </div>

      {/* Footer / Advanced */}
      <div className="p-4 border-t border-neutral-800 shrink-0 mt-auto bg-neutral-900/50">
        <div className="flex items-center justify-between">
          <label className="text-xs text-neutral-400 font-medium">Process Step ID (Advanced)</label>
          <input
            type="text"
            value={slide.processStepId || ""}
            onChange={(e) => onChange({ processStepId: e.target.value })}
            className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-300 focus:border-amber-500 focus:outline-none font-mono"
            placeholder="e.g. step-1-explain"
          />
        </div>
      </div>
    </div>
  );
}
