"use client";

import React, { useState, useRef, useCallback } from "react";
import { QuestionMCQSlide, SlideAnswerRecord, MCQChoice, QuestionImageLayout } from "../CarouselTypes";
import {
  Image as ImageIcon, ZoomIn, CheckCircle, XCircle,
  LayoutPanelLeft, Maximize2,
  PanelTop, PanelBottom, PanelLeft, PanelRight,
  UploadCloud, Trash2
} from "lucide-react";

interface Props {
  slide: QuestionMCQSlide;
  existingAnswer?: SlideAnswerRecord;
  onAnswer: (record: SlideAnswerRecord) => void;
  startTime: number;
  showMarks?: boolean;
  viewerRole?: "STUDENT" | "TEACHER" | "ADMIN";
  onSlideUpdate?: (patch: Partial<QuestionMCQSlide>) => void; // authoring callback
}

const LAYOUT_OPTIONS: { key: QuestionImageLayout; label: string; icon: React.ReactNode }[] = [
  { key: "left",       label: "Image Left",   icon: <PanelLeft    className="h-3.5 w-3.5" /> },
  { key: "right",      label: "Image Right",  icon: <PanelRight   className="h-3.5 w-3.5" /> },
  { key: "top",        label: "Image Top",    icon: <PanelTop     className="h-3.5 w-3.5" /> },
  { key: "bottom",     label: "Image Bottom", icon: <PanelBottom  className="h-3.5 w-3.5" /> },
  { key: "fullscreen", label: "Background",   icon: <Maximize2    className="h-3.5 w-3.5" /> },
];

export function QuestionMCQSlideView({
  slide,
  existingAnswer,
  onAnswer,
  startTime,
  showMarks = true,
  viewerRole = "STUDENT",
  onSlideUpdate,
}: Props) {
  const [selected, setSelected]       = useState<string | null>(existingAnswer?.value as string ?? null);
  const [submitted, setSubmitted]     = useState(!!existingAnswer);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  // ── Layout / resize state ──────────────────────────────────
  const [layout, setLayout]           = useState<QuestionImageLayout>(slide.imageLayout ?? "left");
  const [imageSizePct, setImageSizePct] = useState<number>(
    Math.min(70, Math.max(20, slide.imageSizePct ?? 42))
  );
  const [isResizing, setIsResizing]   = useState(false);
  const resizeDividerRef              = useRef<HTMLDivElement>(null);
  const containerRef                  = useRef<HTMLDivElement>(null);

  // ── Teacher image upload state ─────────────────────────────
  const [liveImageUrl, setLiveImageUrl]       = useState(slide.imageUrl ?? "");
  const [liveDiagramSvg, setLiveDiagramSvg]   = useState(slide.diagramSvg ?? "");
  const [liveCaption, setLiveCaption]         = useState(slide.imageCaption ?? "");
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAuthor = viewerRole === "TEACHER" || viewerRole === "ADMIN";
  const isAnswered = !!existingAnswer || submitted;
  const hasVisual = Boolean(liveImageUrl || liveDiagramSvg || slide.diagramSvg);

  // ── Drag-resize divider logic ──────────────────────────────
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    e.preventDefault();
    setIsResizing(true);

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerSize = layout === "top" || layout === "bottom"
      ? containerRect.height
      : containerRect.width;

    const onMove = (ev: MouseEvent) => {
      const pos = layout === "top" || layout === "bottom"
        ? ev.clientY - containerRect.top
        : ev.clientX - containerRect.left;
      const pct = Math.round((pos / containerSize) * 100);
      setImageSizePct(Math.min(70, Math.max(20, pct)));
    };
    const onUp = () => {
      setIsResizing(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [layout]);

  // Propagate layout/image changes back to authoring layer
  const propagateUpdate = (patch: Partial<QuestionMCQSlide>) => {
    onSlideUpdate?.({ ...patch });
  };

  // ── Teacher image upload handling ──────────────────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLiveImageUrl(url);
    propagateUpdate({ imageUrl: url, diagramSvg: undefined });
  };

  const handleRemoveImage = () => {
    setLiveImageUrl("");
    propagateUpdate({ imageUrl: undefined });
  };

  const handleLayoutChange = (l: QuestionImageLayout) => {
    setLayout(l);
    propagateUpdate({ imageLayout: l });
  };

  // ── Answer logic ───────────────────────────────────────────
  const handleSelect = (choice: MCQChoice) => { if (!isAnswered) setSelected(choice.id); };

  const handleSubmit = () => {
    if (!selected || isAnswered) return;
    const choice = slide.choices.find((c) => c.id === selected)!;
    setSubmitted(true);
    onAnswer({
      slideId: slide.id,
      sequenceNumber: slide.sequenceNumber ?? 0,
      type: "mcq",
      value: selected,
      isCorrect: choice.isCorrect,
      responseTimeMs: Date.now() - startTime,
      misconceptionId: choice.misconceptionId,
      points: choice.isCorrect ? (slide.points ?? 1) : 0,
    });
  };

  // ── Visual panel renderer ──────────────────────────────────
  const VisualPanel = () => (
    <div className="relative rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-inner group w-full h-full min-h-[180px] flex flex-col">
      {liveImageUrl ? (
        <div className="flex-1 relative bg-neutral-900 overflow-hidden">
          <img
            src={liveImageUrl}
            alt={slide.imageAlt ?? slide.title ?? "Question diagram"}
            className="absolute inset-0 w-full h-full object-contain cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
            onClick={() => setIsImageZoomed(true)}
          />
          <button
            onClick={() => setIsImageZoomed(true)}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-neutral-950/80 text-neutral-300 hover:text-white border border-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          {isAuthor && (
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 left-2 p-1.5 rounded-lg bg-red-950/80 text-red-300 hover:text-red-100 border border-red-800 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              title="Remove image"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ) : liveDiagramSvg || slide.diagramSvg ? (
        <div
          className="flex-1 p-3 bg-neutral-950 flex items-center justify-center text-neutral-200 overflow-auto"
          dangerouslySetInnerHTML={{ __html: liveDiagramSvg || slide.diagramSvg || "" }}
        />
      ) : isAuthor ? (
        <button
          onClick={() => setShowUploadPanel(true)}
          className="flex-1 flex flex-col items-center justify-center gap-2 text-neutral-600 hover:text-neutral-400 transition cursor-pointer p-6"
        >
          <UploadCloud className="h-8 w-8" />
          <span className="text-xs font-semibold">Click to upload image or diagram</span>
        </button>
      ) : null}

      {liveCaption && (
        <div className="px-3 py-2 bg-neutral-900/90 border-t border-neutral-800 text-[11px] text-neutral-400 font-medium shrink-0">
          {liveCaption}
        </div>
      )}
    </div>
  );

  // ── Choices renderer ───────────────────────────────────────
  const QuestionPanel = () => (
    <div className="flex flex-col gap-4 h-full">
      <h3 className="text-sm sm:text-base md:text-lg font-bold text-white leading-relaxed">
        {slide.questionText}
      </h3>

      <div className="grid grid-cols-1 gap-2">
        {slide.choices.map((choice) => {
          const isSel = selected === choice.id;
          const isCorrect = choice.isCorrect;
          let cls = "border-neutral-800 bg-neutral-900/90 text-neutral-200 hover:border-amber-500/50 hover:bg-neutral-800";
          if (isAnswered) {
            if (isCorrect)             cls = "border-emerald-500 bg-emerald-950/40 text-emerald-100 shadow shadow-emerald-950/40";
            else if (isSel && !isCorrect) cls = "border-red-500 bg-red-950/40 text-red-100 shadow shadow-red-950/40";
            else                       cls = "border-neutral-800/50 bg-neutral-950/40 text-neutral-500 opacity-40";
          } else if (isSel)            cls = "border-amber-500 bg-amber-500/10 text-amber-100 shadow shadow-amber-500/10";

          return (
            <button
              key={choice.id}
              onClick={() => handleSelect(choice)}
              disabled={isAnswered}
              className={`relative p-3 rounded-xl border-2 text-left transition-all duration-150 flex items-start gap-3 group ${cls} ${!isAnswered ? "cursor-pointer" : "cursor-default"}`}
            >
              <span className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all ${
                isSel && !isAnswered   ? "bg-amber-500 border-amber-500 text-neutral-950"
                : isAnswered && isCorrect ? "bg-emerald-500 border-emerald-500 text-white"
                : isAnswered && isSel     ? "bg-red-500 border-red-500 text-white"
                : "border-neutral-700 text-neutral-400 group-hover:border-neutral-500"
              }`}>{choice.id}</span>
              <span className="text-xs sm:text-sm font-medium leading-relaxed flex-1">{choice.text}</span>
              {isAnswered && (
                <span className="shrink-0">
                  {isCorrect ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : isSel ? <XCircle className="h-4 w-4 text-red-400" /> : null}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!isAnswered && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={handleSubmit}
            disabled={!selected}
            className={`px-5 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition ${
              selected ? "bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 hover:brightness-110 shadow-lg shadow-amber-500/20 cursor-pointer"
                       : "bg-neutral-800 text-neutral-600 cursor-not-allowed border border-neutral-700"
            }`}
          >
            Submit Answer
          </button>
          {selected && <span className="text-[11px] text-neutral-400">Choice <strong className="text-amber-400">{selected}</strong> selected</span>}
        </div>
      )}

      {isAnswered && (
        <div className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-800 text-xs text-neutral-300 animate-in fade-in duration-300">
          <span className="font-bold text-amber-400">Feedback: </span>
          {slide.choices.find((c) => c.id === (existingAnswer?.value || selected))?.explanation || "Evidence recorded."}
        </div>
      )}
    </div>
  );

  // ── Drag handle between panels ─────────────────────────────
  const isHorizontal = layout === "left" || layout === "right";
  const DragHandle = () => (
    <div
      ref={resizeDividerRef}
      onMouseDown={onMouseDown}
      className={`shrink-0 flex items-center justify-center bg-neutral-800/50 hover:bg-amber-500/20 transition-colors group cursor-${isHorizontal ? "col-resize" : "row-resize"} select-none z-10 ${
        isHorizontal ? "w-2.5 rounded-full mx-0.5" : "h-2.5 rounded-full my-0.5"
      } ${isResizing ? "bg-amber-500/30" : ""}`}
      title="Drag to resize"
    >
      <div className={`bg-neutral-600 group-hover:bg-amber-500 transition-colors rounded-full ${isHorizontal ? "w-0.5 h-8" : "h-0.5 w-8"}`} />
    </div>
  );

  // ── Author toolbar ─────────────────────────────────────────
  const AuthorToolbar = () => isAuthor ? (
    <div className="flex flex-wrap items-center gap-2 mb-3 p-2 rounded-xl bg-neutral-900 border border-neutral-800">
      <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider mr-1">Teacher Controls:</span>

      {/* Layout picker */}
      {LAYOUT_OPTIONS.map((opt) => (
        <button
          key={opt.key}
          onClick={() => handleLayoutChange(opt.key)}
          title={opt.label}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition border ${
            layout === opt.key
              ? "bg-amber-500 text-neutral-950 border-amber-500"
              : "bg-neutral-800 text-neutral-400 border-neutral-700 hover:border-amber-500/50 hover:text-neutral-200"
          }`}
        >
          {opt.icon}
          <span className="hidden sm:inline">{opt.label}</span>
        </button>
      ))}

      <div className="w-px h-5 bg-neutral-700 mx-1" />

      {/* Upload button */}
      <button
        onClick={() => setShowUploadPanel(!showUploadPanel)}
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 transition"
      >
        <UploadCloud className="h-3.5 w-3.5" />
        <span>Upload Image</span>
      </button>

      {/* Size slider */}
      {(layout === "left" || layout === "right") && (
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[10px] text-neutral-500">Size: {imageSizePct}%</span>
          <input
            type="range" min={20} max={70} value={imageSizePct}
            onChange={(e) => setImageSizePct(Number(e.target.value))}
            className="w-20 accent-amber-500"
          />
        </div>
      )}
    </div>
  ) : null;

  // ── Upload panel ───────────────────────────────────────────
  const UploadPanel = () => (showUploadPanel && isAuthor) ? (
    <div className="mb-3 p-3 rounded-xl border border-sky-500/30 bg-sky-500/5 space-y-2">
      <p className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Image Upload</p>

      <div className="flex flex-wrap gap-2">
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 text-white text-xs font-bold hover:bg-sky-400 transition"
        >
          <UploadCloud className="h-3.5 w-3.5" /> Upload from computer
        </button>
        {liveImageUrl && (
          <button onClick={handleRemoveImage} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/50 border border-red-700 text-red-300 text-xs font-bold hover:bg-red-800/50 transition">
            <Trash2 className="h-3.5 w-3.5" /> Remove image
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={liveImageUrl}
          onChange={(e) => { setLiveImageUrl(e.target.value); propagateUpdate({ imageUrl: e.target.value }); }}
          placeholder="Or paste an image URL…"
          className="flex-1 bg-neutral-900 border border-neutral-700 text-xs text-neutral-200 rounded-lg px-3 py-1.5 outline-none focus:border-sky-500"
        />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={liveCaption}
          onChange={(e) => { setLiveCaption(e.target.value); propagateUpdate({ imageCaption: e.target.value }); }}
          placeholder="Caption / Figure label (optional)…"
          className="flex-1 bg-neutral-900 border border-neutral-700 text-xs text-neutral-200 rounded-lg px-3 py-1.5 outline-none focus:border-sky-500"
        />
        <button onClick={() => setShowUploadPanel(false)} className="px-3 py-1.5 rounded-lg text-xs bg-neutral-800 text-neutral-400 hover:text-neutral-200">Done</button>
      </div>
    </div>
  ) : null;

  // ── Main layout render ─────────────────────────────────────
  const renderLayout = () => {
    if (!hasVisual) {
      return <QuestionPanel />;
    }

    if (layout === "fullscreen") {
      return (
        <div className="relative w-full min-h-[360px] rounded-xl overflow-hidden">
          {liveImageUrl && (
            <img
              src={liveImageUrl}
              alt={slide.imageAlt ?? "Background"}
              className="absolute inset-0 w-full h-full object-cover opacity-25"
            />
          )}
          {(liveDiagramSvg || slide.diagramSvg) && (
            <div className="absolute inset-0 opacity-20 flex items-center justify-center overflow-hidden"
              dangerouslySetInnerHTML={{ __html: liveDiagramSvg || slide.diagramSvg || "" }}
            />
          )}
          <div className="relative z-10 p-4 bg-neutral-950/70 rounded-xl">
            <QuestionPanel />
          </div>
        </div>
      );
    }

    if (layout === "top" || layout === "bottom") {
      const visualH = `${imageSizePct}%`;
      const panels = [
        <div key="img" style={{ height: "auto" }} className="w-full">
          <VisualPanel />
        </div>,
        <DragHandle key="div" />,
        <div key="q" className="w-full">
          <QuestionPanel />
        </div>,
      ];
      return (
        <div ref={containerRef} className="flex flex-col gap-0 w-full" style={{ minHeight: "360px" }}>
          {layout === "bottom" ? [...panels].reverse() : panels}
        </div>
      );
    }

    // left / right
    const imgStyle: React.CSSProperties = { width: `${imageSizePct}%`, flexShrink: 0 };
    const qStyle: React.CSSProperties   = { flex: 1, minWidth: 0 };
    const imgPanel = <div key="img" style={imgStyle}><VisualPanel /></div>;
    const dragHandle = <DragHandle key="div" />;
    const qPanel = <div key="q" style={qStyle}><QuestionPanel /></div>;

    return (
      <div
        ref={containerRef}
        className={`flex gap-0 w-full items-stretch ${isResizing ? "select-none" : ""}`}
        style={{ minHeight: "320px" }}
      >
        {layout === "right"
          ? [qPanel, dragHandle, imgPanel]
          : [imgPanel, dragHandle, qPanel]}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-3 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500 text-neutral-950 px-3 py-1 rounded-full shadow shadow-amber-500/20">
            Question
          </span>
          {showMarks && slide.points && (
            <span className="text-xs font-bold text-amber-400/90 bg-neutral-900 border border-neutral-800 px-2.5 py-0.5 rounded-full">
              {slide.points} pt{slide.points > 1 ? "s" : ""}
            </span>
          )}
          {slide.skillId && <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline">{slide.skillId}</span>}
        </div>
        {hasVisual && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded">
            <ImageIcon className="h-3 w-3" /> Visual: {layout}
          </span>
        )}
      </div>

      {/* Author toolbar */}
      <AuthorToolbar />
      <UploadPanel />

      {/* Main layout */}
      {renderLayout()}

      {/* Fullscreen Image Modal */}
      {isImageZoomed && liveImageUrl && (
        <div
          className="fixed inset-0 z-[60] bg-neutral-950/92 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in fade-in duration-200"
          onClick={() => setIsImageZoomed(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] bg-neutral-900 p-2 rounded-2xl border border-neutral-700 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsImageZoomed(false)}
              className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-amber-500 text-neutral-950 font-black text-sm flex items-center justify-center hover:bg-amber-400 shadow-lg z-10"
            >✕</button>
            <img src={liveImageUrl} alt={slide.imageAlt ?? "Zoomed"} className="max-h-[80vh] max-w-full w-auto object-contain rounded-xl" />
            {liveCaption && <p className="p-3 text-center text-xs text-neutral-300 font-medium">{liveCaption}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
