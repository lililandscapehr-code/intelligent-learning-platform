// ============================================================
// CAROUSEL EDITOR — EDITOR-SPECIFIC STATE TYPES
// ============================================================
// These extend the runtime carousel types with editor-only concerns
// such as dirty state tracking, slide completeness, and registry metadata.

import type { EduCarouselConfig, EduSlide, EduSlideType } from "../CarouselTypes";

/** An entry in the carousel library available for loading into the editor */
export interface CarouselLibraryEntry {
  carouselId: string;
  lessonId?: string;
  lessonTitle?: string;
  curriculumId: string;
  label: string;
  slideCount: number;
  carousel: EduCarouselConfig;
}

/** Completeness check result for a single slide */
export interface SlideCompletion {
  slideId: string;
  isComplete: boolean;
  warnings: string[];
}

/** The full editor state owned by CarouselStudio */
export interface CarouselEditorState {
  draft: EduCarouselConfig;
  selectedIndex: number;
  isDirty: boolean;
  mode: "edit" | "preview";
  registryDraftId: string | null;
  registryStatus: string;
  registryBusy: boolean;
  reviewNote: string;
}

/** Options for the "Add slide" type picker */
export interface SlideTypeOption {
  type: EduSlideType;
  label: string;
  description: string;
  color: string;        // Tailwind border/text color token e.g. "amber"
  emoji: string;
}

export const SLIDE_TYPE_OPTIONS: SlideTypeOption[] = [
  { type: "lesson_text",    label: "Explanation",     description: "Rich text body with key terms, objectives, and themes",                color: "amber",   emoji: "📖" },
  { type: "youtube",        label: "YouTube Video",   description: "Embed a YouTube clip with a clipped range and watch timer",            color: "red",     emoji: "▶️" },
  { type: "image",          label: "Image",           description: "Upload or paste an image URL with caption and layout options",          color: "sky",     emoji: "🖼️" },
  { type: "video",          label: "Video File",      description: "Upload an mp4/webm file or paste a hosted video URL",                  color: "sky",     emoji: "🎬" },
  { type: "question_mcq",   label: "MCQ Question",   description: "Multiple-choice question with timer, shuffle, image, and grading",     color: "violet",  emoji: "❓" },
  { type: "question_text",  label: "Text Question",  description: "Open-ended text response with sample answer and timer",               color: "violet",  emoji: "✍️" },
  { type: "question_numeric", label: "Numeric Question", description: "Numeric answer with tolerance range, unit, and timer",            color: "violet",  emoji: "🔢" },
  { type: "evaluation",     label: "Evaluation",      description: "Answer reveal with step-by-step explanation, rubric, and misconceptions", color: "emerald", emoji: "✅" },
];

/** Color map for slide type badges in the slide manager */
export const SLIDE_TYPE_COLORS: Record<EduSlideType, { bg: string; text: string; border: string }> = {
  lesson_text:      { bg: "bg-amber-500/15",  text: "text-amber-300",   border: "border-amber-500/30" },
  lesson_image:     { bg: "bg-sky-500/15",    text: "text-sky-300",     border: "border-sky-500/30" },
  youtube:          { bg: "bg-red-500/15",    text: "text-red-300",     border: "border-red-500/30" },
  video:            { bg: "bg-sky-500/15",    text: "text-sky-300",     border: "border-sky-500/30" },
  image:            { bg: "bg-sky-500/15",    text: "text-sky-300",     border: "border-sky-500/30" },
  question_mcq:     { bg: "bg-violet-500/15", text: "text-violet-300",  border: "border-violet-500/30" },
  question_text:    { bg: "bg-violet-500/15", text: "text-violet-300",  border: "border-violet-500/30" },
  question_numeric: { bg: "bg-violet-500/15", text: "text-violet-300",  border: "border-violet-500/30" },
  evaluation:       { bg: "bg-emerald-500/15",text: "text-emerald-300", border: "border-emerald-500/30" },
  upload_zone:      { bg: "bg-neutral-500/15",text: "text-neutral-300", border: "border-neutral-500/30" },
};

/** Check whether a given slide has all required fields filled */
export function checkSlideCompletion(slide: EduSlide): SlideCompletion {
  const warnings: string[] = [];

  if (!slide.title?.trim()) warnings.push("Missing title");

  switch (slide.type) {
    case "lesson_text":
      if (!slide.body?.trim()) warnings.push("Missing body text");
      break;
    case "youtube":
      if (!slide.youtubeUrl?.trim()) warnings.push("Missing YouTube URL");
      break;
    case "image":
      if (!slide.imageUrl?.trim()) warnings.push("Missing image URL");
      break;
    case "video":
      if (!slide.videoUrl?.trim()) warnings.push("Missing video URL");
      break;
    case "question_mcq":
      if (!slide.questionText?.trim()) warnings.push("Missing question text");
      if (!slide.choices || slide.choices.length < 2) warnings.push("Need at least 2 choices");
      if (slide.choices && !slide.choices.some((c) => c.isCorrect)) warnings.push("No correct answer selected");
      break;
    case "question_text":
      if (!slide.questionText?.trim()) warnings.push("Missing question text");
      break;
    case "question_numeric":
      if (!slide.questionText?.trim()) warnings.push("Missing question text");
      if (slide.correctValue === undefined || slide.correctValue === null) warnings.push("Missing correct value");
      break;
    case "evaluation":
      if (!slide.correctAnswerText?.trim()) warnings.push("Missing correct answer text");
      if (!slide.explanation?.trim()) warnings.push("Missing explanation");
      break;
  }

  return { slideId: slide.id, isComplete: warnings.length === 0, warnings };
}

/** Create a new blank slide of a given type */
export function createBlankSlide(type: EduSlideType, index: number): EduSlide {
  const id = `slide-${type}-${Date.now()}-${index}`;
  switch (type) {
    case "lesson_text":
      return { id, type, title: "New explanation", body: "Write your explanation here.", learningObjective: "", keyTerms: [], theme: "default" };
    case "youtube":
      return { id, type, title: "Video", youtubeUrl: "", subtitle: "Watch and connect this to the lesson concept." };
    case "image":
      return { id, type, title: "Image", imageUrl: "", caption: "", imageAlt: "", imageLayout: "top" };
    case "video":
      return { id, type, title: "Video", videoUrl: "", caption: "" };
    case "question_mcq":
      return { id, type, title: "Practice question", questionText: "Write the question here.", points: 1, timerSeconds: 0, shuffleChoices: false, choices: [{ id: "A", text: "Correct answer", isCorrect: true }, { id: "B", text: "Distractor B", isCorrect: false }, { id: "C", text: "Distractor C", isCorrect: false }] };
    case "question_text":
      return { id, type, title: "Open question", questionText: "Write the question here.", points: 1, timerSeconds: 0, placeholder: "Write your answer...", sampleAnswer: "" };
    case "question_numeric":
      return { id, type, title: "Numeric question", questionText: "Write the question here.", points: 1, timerSeconds: 0, correctValue: 0, tolerance: 0.05, unit: "" };
    case "evaluation":
      return { id, type, title: "Answer evaluation", questionRef: "", correctAnswerText: "", explanation: "", misconceptionNote: "", masteryImplication: "", rubricPoints: [] };
    default:
      return { id, type: "lesson_text", title: "New slide", body: "", keyTerms: [] } as EduSlide;
  }
}
