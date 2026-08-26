"use client";

import React, { useState } from "react";
import type { EduSlide, EduSlideType } from "../CarouselTypes";
import { SLIDE_TYPE_COLORS, SLIDE_TYPE_OPTIONS, checkSlideCompletion } from "./CarouselEditorTypes";
import {
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  Plus,
  X,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

interface SlideManagerPanelProps {
  slides: EduSlide[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDuplicate: (index: number) => void;
  onDelete: (index: number) => void;
  onAddSlide: (type: EduSlideType) => void;
}

export default function SlideManagerPanel({
  slides,
  selectedIndex,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onAddSlide,
}: SlideManagerPanelProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  return (
    <div className="flex flex-col h-full bg-neutral-900 border-r border-neutral-800 relative">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between shrink-0">
        <h2 className="text-white font-semibold flex items-center gap-2">
          Slides
          <span className="bg-neutral-800 text-neutral-400 text-xs px-2 py-0.5 rounded-full">
            {slides.length}
          </span>
        </h2>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {slides.map((slide, index) => {
          const isSelected = selectedIndex === index;
          const completion = checkSlideCompletion(slide);
          const typeColor = SLIDE_TYPE_COLORS[slide.type] || SLIDE_TYPE_COLORS.lesson_text;

          return (
            <div
              key={slide.id}
              onClick={() => onSelect(index)}
              className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                isSelected
                  ? "bg-neutral-800/80 border-l-2 border-amber-500"
                  : "hover:bg-neutral-800 border-l-2 border-transparent"
              }`}
            >
              <span className="text-xs text-neutral-500 w-4 text-right">
                {index + 1}
              </span>
              
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded border ${typeColor.bg} ${typeColor.text} ${typeColor.border} uppercase tracking-wider shrink-0`}
              >
                {slide.type.replace("question_", "")}
              </span>

              <span
                className={`flex-1 text-sm truncate ${
                  isSelected ? "text-amber-400" : "text-neutral-300"
                }`}
              >
                {slide.title || "Untitled"}
              </span>

              {/* Completion Indicator */}
              <div
                className="shrink-0 relative flex items-center justify-center w-5 h-5"
                title={completion.warnings.join("\n")}
              >
                {completion.isComplete ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
              </div>

              {/* Action Buttons (Hover) */}
              <div
                className={`shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                  isSelected ? "opacity-100" : ""
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onMoveUp(index)}
                  disabled={index === 0}
                  className="p-1 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 rounded hover:bg-neutral-700 transition-colors"
                  title="Move Up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onMoveDown(index)}
                  disabled={index === slides.length - 1}
                  className="p-1 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 rounded hover:bg-neutral-700 transition-colors"
                  title="Move Down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDuplicate(index)}
                  className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-700 transition-colors"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(index)}
                  disabled={slides.length === 1}
                  className="p-1 text-neutral-400 hover:text-red-400 disabled:opacity-30 disabled:hover:text-neutral-400 rounded hover:bg-neutral-700 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer / Add Slide Button */}
      <div className="p-4 border-t border-neutral-800 shrink-0">
        <button
          onClick={() => setShowAddMenu(true)}
          className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Slide
        </button>
      </div>

      {/* Add Slide Modal/Overlay */}
      {showAddMenu && (
        <div className="absolute inset-0 bg-neutral-950/80 z-10 flex flex-col backdrop-blur-sm">
          <div className="p-4 border-b border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-900">
            <h3 className="text-white font-medium">Add New Slide</h3>
            <button
              onClick={() => setShowAddMenu(false)}
              className="p-1 text-neutral-400 hover:text-white rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-neutral-900 grid grid-cols-1 gap-2 content-start">
            {SLIDE_TYPE_OPTIONS.map((option) => (
              <button
                key={option.type}
                onClick={() => {
                  onAddSlide(option.type);
                  setShowAddMenu(false);
                }}
                className="text-left flex flex-col p-3 rounded-lg border border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-800 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{option.emoji}</span>
                  <span className="text-neutral-200 font-medium group-hover:text-amber-400 transition-colors">
                    {option.label}
                  </span>
                </div>
                <span className="text-xs text-neutral-500 leading-tight">
                  {option.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
