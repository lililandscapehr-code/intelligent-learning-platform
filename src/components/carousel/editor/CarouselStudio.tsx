"use client";

import React, { Suspense, useCallback, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Download,
  Eye,
  EyeOff,
  FilePlus2,
  FolderOpen,
  RotateCcw,
  Save,
  Upload,
  Crop,
  Sparkles,
} from "lucide-react";
import PdfCropAssistant from "./PdfCropAssistant";
import AIStoryboardBuilder from "./AIStoryboardBuilder";
import EducationalCarousel from "../EducationalCarousel";
import { applyStandardStepDefaults, validateLearningProcess } from "../CarouselValidation";
import type { EduCarouselConfig, EduSlide, EduSlideType } from "../CarouselTypes";
import {
  createBlankSlide,
  checkSlideCompletion,
  type CarouselLibraryEntry,
} from "./CarouselEditorTypes";
import {
  approveContentDraftAction,
  createContentDraft,
  publishContentDraftAction,
} from "../../../app/actions";

// ── Lazy-loaded panels ────────────────────────────────────────
const SlideManagerPanel = React.lazy(() => import("./SlideManagerPanel"));
const SlideEditorPanel = React.lazy(() => import("./SlideEditorPanel"));
const CarouselSettingsPanel = React.lazy(() => import("./CarouselSettingsPanel"));

// ── Spinner fallback ──────────────────────────────────────────
function PanelLoader() {
  return (
    <div className="flex h-40 items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
    </div>
  );
}

// ── Default blank carousel ────────────────────────────────────
function createBlankCarousel(): EduCarouselConfig {
  return {
    id: `CAROUSEL-${Date.now()}`,
    title: "New Carousel",
    skillId: "",
    blueprintId: "",
    showProgressBar: true,
    showScoreTally: true,
    sequenceMode: "SEQUENTIAL",
    autoAdvanceMs: 0,
    allowSkipQuestions: false,
    accessPolicy: {
      scope: "ALL_ENROLLED",
      minimumScorePercentage: 70,
      showCorrectAnswers: true,
      showMarks: true,
      trackTiming: true,
    },
    slides: [
      {
        id: `slide-intro-${Date.now()}`,
        type: "lesson_text",
        title: "Lesson Introduction",
        body: "Write your lesson introduction here.",
        learningObjective: "Describe what students will learn.",
        keyTerms: [],
        theme: "default",
      },
    ],
  };
}

// ── Props ─────────────────────────────────────────────────────
export interface CarouselStudioProps {
  curriculumId: string;
  viewerRole?: "TEACHER" | "ADMIN";
  /** Pre-loaded carousel library entries from the lesson registry */
  library?: CarouselLibraryEntry[];
}

// ── Main component ─────────────────────────────────────────────
export default function CarouselStudio({
  curriculumId,
  viewerRole = "TEACHER",
  library = [],
}: CarouselStudioProps) {
  const [draft, setDraft] = useState<EduCarouselConfig>(createBlankCarousel);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [isDirty, setIsDirty] = useState(false);
  const [pdfCropOpen, setPdfCropOpen] = useState(false);
  const [storyboardOpen, setStoryboardOpen] = useState(false);

  // Registry state
  const [registryDraftId, setRegistryDraftId] = useState<string | null>(null);
  const [registryStatus, setRegistryStatus] = useState("Draft is local only. Save to the content registry when ready.");
  const [registryBusy, setRegistryBusy] = useState(false);
  const [reviewNote, setReviewNote] = useState("");

  // Library selector state
  const [libraryOpen, setLibraryOpen] = useState(false);
  const fileImportRef = useRef<HTMLInputElement>(null);

  // ── Helpers ──────────────────────────────────────────────────
  const selectedSlide = draft.slides[selectedIndex] ?? draft.slides[0];

  const validationErrors = useMemo(() => {
    const validation = validateLearningProcess(draft);
    return validation.errors;
  }, [draft]);

  const slideCompletions = useMemo(
    () => draft.slides.map((s) => checkSlideCompletion(s)),
    [draft.slides]
  );

  // ── Draft mutations ──────────────────────────────────────────
  function updateDraft(update: Partial<EduCarouselConfig>) {
    setDraft((prev) => ({ ...prev, ...update }));
    setIsDirty(true);
  }

  const updateSlide = useCallback(
    (update: Partial<EduSlide>) => {
      setDraft((prev) => ({
        ...prev,
        slides: prev.slides.map((slide, i) =>
          i === selectedIndex ? ({ ...slide, ...update } as EduSlide) : slide
        ),
      }));
      setIsDirty(true);
    },
    [selectedIndex]
  );

  function addSlide(type: EduSlideType) {
    const newSlide = createBlankSlide(type, draft.slides.length + 1);
    setDraft((prev) => ({ ...prev, slides: [...prev.slides, newSlide] }));
    setSelectedIndex(draft.slides.length);
    setIsDirty(true);
  }

  function duplicateSlide(index: number) {
    const original = draft.slides[index];
    const copy = { ...original, id: `${original.id}-copy-${Date.now()}` } as EduSlide;
    const slides = [...draft.slides];
    slides.splice(index + 1, 0, copy);
    setDraft((prev) => ({ ...prev, slides }));
    setSelectedIndex(index + 1);
    setIsDirty(true);
  }

  function deleteSlide(index: number) {
    if (draft.slides.length <= 1) return;
    setDraft((prev) => ({ ...prev, slides: prev.slides.filter((_, i) => i !== index) }));
    setSelectedIndex(Math.max(0, index - 1));
    setIsDirty(true);
  }

  function moveSlide(from: number, direction: "up" | "down") {
    const to = direction === "up" ? from - 1 : from + 1;
    if (to < 0 || to >= draft.slides.length) return;
    const slides = [...draft.slides];
    [slides[from], slides[to]] = [slides[to], slides[from]];
    setDraft((prev) => ({ ...prev, slides }));
    setSelectedIndex(to);
    setIsDirty(true);
  }

  // ── Load from library ─────────────────────────────────────────
  function loadFromLibrary(entry: CarouselLibraryEntry) {
    setDraft(JSON.parse(JSON.stringify(entry.carousel)));
    setSelectedIndex(0);
    setIsDirty(false);
    setRegistryDraftId(null);
    setRegistryStatus(`Loaded "${entry.label}" from the lesson registry. Make edits and save when ready.`);
    setLibraryOpen(false);
  }

  // ── New carousel ──────────────────────────────────────────────
  function newCarousel() {
    if (isDirty && !window.confirm("You have unsaved changes. Start a new carousel anyway?")) return;
    setDraft(createBlankCarousel());
    setSelectedIndex(0);
    setIsDirty(false);
    setRegistryDraftId(null);
    setRegistryStatus("New carousel created. Save to the content registry when ready.");
  }

  // ── Import / Export JSON ──────────────────────────────────────
  function exportJson() {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${draft.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as EduCarouselConfig;
        if (!parsed.id || !Array.isArray(parsed.slides)) {
          alert("Invalid carousel JSON file.");
          return;
        }
        setDraft(parsed);
        setSelectedIndex(0);
        setIsDirty(true);
        setRegistryStatus("Imported from JSON. Review and save to the registry when ready.");
      } catch {
        alert("Could not parse this JSON file.");
      }
    };
    reader.readAsText(file);
  }

  // ── Registry actions ──────────────────────────────────────────
  async function saveDraftToRegistry(): Promise<string | null> {
    const prepared = applyStandardStepDefaults(draft);
    setDraft(prepared);
    setRegistryBusy(true);
    setRegistryStatus("Saving draft to the content registry...");
    try {
      const result = await createContentDraft(
        curriculumId,
        "LESSON",
        draft.title || "New carousel",
        prepared as unknown as Record<string, unknown>,
        { kind: "MANUAL", provenance: "Teacher-authored carousel draft." }
      );
      if (!result.success || !result.data?.id) {
        setRegistryStatus(result.errors[0] || "Registry save failed.");
        return null;
      }
      setRegistryDraftId(result.data.id);
      setRegistryStatus(`Saved as draft ${result.data.id}. Awaiting approval.`);
      setIsDirty(false);
      return result.data.id;
    } catch {
      setRegistryStatus("Registry save failed. Draft remains local only.");
      return null;
    } finally {
      setRegistryBusy(false);
    }
  }

  async function handleRegistryDecision(decision: "APPROVE" | "REJECT" | "REQUEST_CHANGES") {
    const id = registryDraftId ?? (await saveDraftToRegistry());
    if (!id) return;
    setRegistryBusy(true);
    try {
      const result = await approveContentDraftAction(id, decision, reviewNote || undefined);
      if (!result.success) {
        setRegistryStatus(result.errors[0] || "Review decision failed.");
        return;
      }
      const label = decision === "APPROVE" ? "approved" : decision === "REJECT" ? "rejected" : "returned for changes";
      setRegistryStatus(`Draft ${label}.`);
      setReviewNote("");
    } finally {
      setRegistryBusy(false);
    }
  }

  async function publishDraft() {
    const id = registryDraftId ?? (await saveDraftToRegistry());
    if (!id) return;
    setRegistryBusy(true);
    setRegistryStatus("Publishing carousel...");
    try {
      const result = await publishContentDraftAction(id);
      if (!result.success) {
        setRegistryStatus(result.errors[0] || "Publish failed.");
        return;
      }
      setRegistryStatus(`Published as ${result.data?.id ?? id}.`);
    } finally {
      setRegistryBusy(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-0 rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden">

      {/* ── Top bar ──────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 border-b border-neutral-800 bg-neutral-900/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">Carousel Studio</span>
          {isDirty && (
            <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
              Unsaved
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 ml-0">
          {/* New */}
          <button onClick={newCarousel} title="Create new carousel"
            className="flex items-center gap-1.5 rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:border-amber-500 hover:text-white transition-colors">
            <FilePlus2 className="h-3.5 w-3.5" /> New
          </button>

          {/* AI Storyboard Builder */}
          <button
            onClick={() => setStoryboardOpen(true)}
            title="Generate lesson slides from curriculum PDFs using AI"
            className="flex items-center gap-1.5 rounded-lg border border-violet-600/60 bg-violet-600/10 px-3 py-1.5 text-xs font-bold text-violet-300 hover:bg-violet-600/20 hover:border-violet-400 hover:text-white transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" /> AI Builder
          </button>

          {/* Load from library */}
          {library.length > 0 && (
            <div className="relative">
              <button onClick={() => setLibraryOpen((v) => !v)} title="Load an existing carousel from the lesson registry"
                className="flex items-center gap-1.5 rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:border-sky-500 hover:text-white transition-colors">
                <FolderOpen className="h-3.5 w-3.5" /> Load
              </button>
              {libraryOpen && (
                <div className="absolute left-0 top-full z-50 mt-1 w-80 rounded-xl border border-neutral-700 bg-neutral-900 p-2 shadow-2xl">
                  <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    Carousel Library ({library.length} carousels)
                  </p>
                  <div className="max-h-72 overflow-y-auto space-y-1">
                    {library.map((entry) => (
                      <button key={entry.carouselId} onClick={() => loadFromLibrary(entry)}
                        className="w-full rounded-lg px-3 py-2 text-left hover:bg-neutral-800 transition-colors">
                        <p className="text-xs font-semibold text-white">{entry.label}</p>
                        {entry.lessonTitle && (
                          <p className="text-[10px] text-neutral-400">{entry.lessonTitle}</p>
                        )}
                        <p className="text-[10px] text-neutral-500">{entry.slideCount} slides</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PDF Snippet */}
          <button onClick={() => setPdfCropOpen(true)} title="Capture screenshot from PDF"
            className="flex items-center gap-1.5 rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:border-amber-500 hover:text-white transition-colors">
            <Crop className="h-3.5 w-3.5 text-amber-500" /> PDF Snippet
          </button>

          {/* Import JSON */}
          <label title="Import carousel from JSON file"
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:border-emerald-500 hover:text-white transition-colors">
            <Upload className="h-3.5 w-3.5" /> Import
            <input ref={fileImportRef} type="file" accept=".json" className="sr-only" onChange={handleImport} />
          </label>

          {/* Export JSON */}
          <button onClick={exportJson} title="Export carousel as JSON"
            className="flex items-center gap-1.5 rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:border-amber-500 hover:text-white transition-colors">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>

        {/* Validation summary */}
        <div className="flex items-center gap-2 ml-auto">
          {validationErrors.length === 0 ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> Ready to publish
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400">
              ⚠ {validationErrors.length} issue{validationErrors.length !== 1 ? "s" : ""}
            </span>
          )}

          {/* Save shortcut */}
          <button onClick={saveDraftToRegistry} disabled={registryBusy}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 disabled:opacity-50 transition-colors">
            <Save className="h-3.5 w-3.5" /> Save
          </button>

          {/* Preview toggle */}
          <button onClick={() => setMode((m) => m === "edit" ? "preview" : "edit")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
              mode === "preview"
                ? "bg-sky-500 text-white hover:bg-sky-400"
                : "border border-sky-500/50 text-sky-300 hover:bg-sky-500/10"
            }`}>
            {mode === "preview" ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {mode === "preview" ? "Back to Edit" : "Student Preview"}
          </button>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────── */}
      {mode === "preview" ? (
        <div className="p-6">
          <p className="mb-4 text-xs font-semibold text-sky-400 uppercase tracking-wider">
            Student Preview — This is exactly what students will see
          </p>
          <EducationalCarousel config={draft} viewerRole={viewerRole} />
        </div>
      ) : (
        <div className="grid h-[calc(100vh-180px)] min-h-[600px] grid-cols-[220px_minmax(0,1fr)_300px] divide-x divide-neutral-800 overflow-hidden">

          {/* Left — Slide Manager */}
          <div className="flex flex-col overflow-hidden bg-neutral-950">
            <Suspense fallback={<PanelLoader />}>
              <SlideManagerPanel
                slides={draft.slides}
                selectedIndex={selectedIndex}
                onSelect={setSelectedIndex}
                onMoveUp={(i) => moveSlide(i, "up")}
                onMoveDown={(i) => moveSlide(i, "down")}
                onDuplicate={duplicateSlide}
                onDelete={deleteSlide}
                onAddSlide={addSlide}
              />
            </Suspense>
          </div>

          {/* Center — Slide Editor */}
          <div className="flex flex-col overflow-y-auto bg-neutral-950 p-5">
            {selectedSlide && (
              <Suspense fallback={<PanelLoader />}>
                <SlideEditorPanel
                  slide={selectedSlide}
                  onChange={updateSlide}
                  slideIndex={selectedIndex}
                  totalSlides={draft.slides.length}
                />
              </Suspense>
            )}
          </div>

          {/* Right — Settings */}
          <div className="flex flex-col overflow-y-auto bg-neutral-950">
            <Suspense fallback={<PanelLoader />}>
              <CarouselSettingsPanel
                draft={draft}
                onChange={updateDraft}
                registryDraftId={registryDraftId}
                registryStatus={registryStatus}
                registryBusy={registryBusy}
                reviewNote={reviewNote}
                onReviewNoteChange={setReviewNote}
                onSaveDraft={saveDraftToRegistry}
                onApprove={() => handleRegistryDecision("APPROVE")}
                onReject={() => handleRegistryDecision("REJECT")}
                onRequestChanges={() => handleRegistryDecision("REQUEST_CHANGES")}
                onPublish={publishDraft}
                validationErrors={validationErrors}
              />
            </Suspense>
          </div>
        </div>
      )}

      {/* Click-away to close library dropdown */}
      {libraryOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setLibraryOpen(false)} />
      )}

      {/* PDF Screenshot Crop assistant */}
      {pdfCropOpen && (
        <PdfCropAssistant
          onClose={() => setPdfCropOpen(false)}
          onCapture={(croppedUrl) => {
            updateSlide({ imageUrl: croppedUrl });
          }}
        />
      )}

      {/* AI Storyboard Builder */}
      {storyboardOpen && (
        <AIStoryboardBuilder
          onClose={() => setStoryboardOpen(false)}
          onBuildSlides={(aiSlides: EduSlide[]) => {
            setDraft((prev) => ({
              ...prev,
              slides: [...prev.slides, ...aiSlides],
            }));
            setSelectedIndex(draft.slides.length);
            setIsDirty(true);
            setRegistryStatus(`AI added ${aiSlides.length} new slide${aiSlides.length !== 1 ? "s" : ""} to this carousel. Review and adjust as needed.`);
          }}
        />
      )}
    </div>
  );
}
