"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Crop,
  FileDown,
  Loader2,
  Maximize2,
  Minimize2,
  Sparkles,
  Upload,
  X
} from "lucide-react";

interface PdfCropAssistantProps {
  onClose: () => void;
  onCapture: (imageUrl: string) => void;
}

export default function PdfCropAssistant({ onClose, onCapture }: PdfCropAssistantProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(false);
  const [pdfJsLoaded, setPdfJsLoaded] = useState(false);

  // Crop tracking states
  const [isDragging, setIsDragging] = useState(false);
  const [cropStart, setCropStart] = useState<{ x: number; y: number } | null>(null);
  const [cropEnd, setCropEnd] = useState<{ x: number; y: number } | null>(null);
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);

  // AI Assistant states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  // ── Load PDF.js dynamically from CDN ─────────────────────────
  useEffect(() => {
    if (window.hasOwnProperty("pdfjsLib")) {
      setPdfJsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
    script.async = true;
    script.onload = () => {
      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
      setPdfJsLoaded(true);
    };
    document.body.appendChild(script);
  }, []);

  // ── Render PDF Page to Canvas ────────────────────────────────
  const renderPage = async (pageNumber: number, documentInstance: any) => {
    if (!canvasRef.current || !documentInstance) return;
    setLoading(true);
    // Clear crop selection
    setCropStart(null);
    setCropEnd(null);
    setCroppedPreview(null);

    try {
      const page = await documentInstance.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Draw selection overlay canvas to match size
        if (overlayCanvasRef.current) {
          overlayCanvasRef.current.width = viewport.width;
          overlayCanvasRef.current.height = viewport.height;
          drawOverlay(null, null);
        }

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        await page.render(renderContext).promise;
      }
    } catch (error) {
      console.error("Error rendering PDF page:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Handle File Upload ───────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pdfJsLoaded) return;
    setPdfFile(file);
    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfjsLib = (window as any).pdfjsLib;
      const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPdfDoc(doc);
      setTotalPages(doc.numPages);
      setPageNum(1);
      // Wait for state updates then render first page
      await renderPage(1, doc);
    } catch (error) {
      alert("Failed to load PDF. Please make sure the file is not corrupted.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Render page when pageNum or scale changes
  useEffect(() => {
    if (pdfDoc) {
      renderPage(pageNum, pdfDoc);
    }
  }, [pageNum, scale]);

  // ── Drag & Crop Selection Handler ─────────────────────────────
  const getCanvasMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    // Scale coords to match internal canvas dimensions
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (loading || !pdfDoc) return;
    const pos = getCanvasMousePos(e);
    setCropStart(pos);
    setCropEnd(pos);
    setIsDragging(true);
    setCroppedPreview(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !cropStart) return;
    const pos = getCanvasMousePos(e);
    setCropEnd(pos);
    drawOverlay(cropStart, pos);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    generateCropPreview();
  };

  // ── Draw Crop Bounding Box ────────────────────────────────────
  const drawOverlay = (
    start: { x: number; y: number } | null,
    end: { x: number; y: number } | null
  ) => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (start && end) {
      const x = Math.min(start.x, end.x);
      const y = Math.min(start.y, end.y);
      const w = Math.abs(start.x - end.x);
      const h = Math.abs(start.y - end.y);

      // 1. Draw dim background
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Clear select box
      ctx.clearRect(x, y, w, h);

      // 3. Draw border selection line
      ctx.strokeStyle = "#f59e0b"; // amber-500
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);
    }
  };

  // ── Extract and Render Cropped Snippet ───────────────────────
  const generateCropPreview = () => {
    if (!cropStart || !cropEnd || !canvasRef.current) return;
    const originalCanvas = canvasRef.current;

    const x = Math.min(cropStart.x, cropEnd.x);
    const y = Math.min(cropStart.y, cropEnd.y);
    const w = Math.abs(cropStart.x - cropEnd.x);
    const h = Math.abs(cropStart.y - cropEnd.y);

    if (w < 10 || h < 10) return; // ignore tiny clicks

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = w;
    tempCanvas.height = h;
    const tempCtx = tempCanvas.getContext("2d");

    if (tempCtx) {
      tempCtx.drawImage(originalCanvas, x, y, w, h, 0, 0, w, h);
      setCroppedPreview(tempCanvas.toDataURL("image/png"));
    }
  };

  const handleCaptureToSlide = () => {
    if (croppedPreview) {
      onCapture(croppedPreview);
      onClose();
    }
  };

  const askAiToAnalyze = async () => {
    if (!croppedPreview) return;
    setAiLoading(true);
    setAiAnalysis(null);
    try {
      // Convert data URL to Blob
      const res = await fetch(croppedPreview);
      const blob = await res.blob();
      const file = new File([blob], "snippet.png", { type: "image/png" });

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/teacher/image-analysis", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.answer) {
        setAiAnalysis(result.answer);
      } else {
        setAiAnalysis(result.error || "The AI could not analyze the image.");
      }
    } catch (err) {
      setAiAnalysis("Network error or AI provider is not available.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6 backdrop-blur-md">
      <div className="flex h-[90vh] w-[95vw] flex-col rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-2xl">
        
        {/* Header toolbar */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/60 px-6 py-4">
          <div className="flex items-center gap-2">
            <Crop className="h-5 w-5 text-amber-500" />
            <div>
              <h3 className="text-base font-bold text-white">PDF Screenshot Snippet Assistant</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Load a PDF, drag a box over any diagram or text to capture, and insert it directly into your active slide.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-800 hover:text-white transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content body split pane */}
        <div className="flex-1 grid grid-cols-[1fr_320px] overflow-hidden">
          
          {/* Left panel: PDF Page canvas viewer */}
          <div className="flex flex-col overflow-hidden border-r border-neutral-800">
            {/* View controls */}
            <div className="flex items-center justify-between border-b border-neutral-900 bg-neutral-950 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <label className="flex cursor-pointer items-center gap-1.5 rounded bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 px-3 py-1.5 text-xs font-bold text-neutral-300">
                  <Upload className="h-3.5 w-3.5" /> Upload PDF
                  <input type="file" accept="application/pdf,.pdf" className="sr-only" onChange={handleFileChange} />
                </label>
                {pdfFile && (
                  <span className="text-xs text-neutral-400 truncate max-w-[200px] font-mono">
                    {pdfFile.name}
                  </span>
                )}
              </div>

              {pdfDoc && (
                <div className="flex items-center gap-4">
                  {/* Page selector */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPageNum(p => Math.max(1, p - 1))}
                      disabled={pageNum <= 1 || loading}
                      className="rounded p-1 text-neutral-400 hover:bg-neutral-900 hover:text-white disabled:opacity-30"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-xs font-semibold text-neutral-200">
                      Page {pageNum} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPageNum(p => Math.min(totalPages, p + 1))}
                      disabled={pageNum >= totalPages || loading}
                      className="rounded p-1 text-neutral-400 hover:bg-neutral-900 hover:text-white disabled:opacity-30"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="h-4 w-px bg-neutral-800" />

                  {/* Zoom controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setScale(s => Math.max(0.75, s - 0.25))}
                      disabled={scale <= 0.75 || loading}
                      className="rounded bg-neutral-900 border border-neutral-850 px-2.5 py-1 text-xs text-neutral-300 hover:bg-neutral-800"
                    >
                      A-
                    </button>
                    <span className="text-xs font-mono text-neutral-400 w-12 text-center">
                      {Math.round(scale * 100)}%
                    </span>
                    <button
                      onClick={() => setScale(s => Math.min(3, s + 0.25))}
                      disabled={scale >= 3 || loading}
                      className="rounded bg-neutral-900 border border-neutral-850 px-2.5 py-1 text-xs text-neutral-300 hover:bg-neutral-800"
                    >
                      A+
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Canvas Scroll Area */}
            <div className="flex-1 overflow-auto bg-neutral-950 flex items-center justify-center p-4 relative" ref={containerRef}>
              {!pdfJsLoaded && (
                <div className="text-center text-xs text-neutral-500 flex flex-col items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                  Loading PDF engine...
                </div>
              )}

              {pdfJsLoaded && !pdfFile && (
                <div className="text-center text-xs text-neutral-500">
                  <Upload className="h-8 w-8 text-neutral-600 mx-auto mb-2" />
                  Please select and upload a PDF file to begin cropping.
                </div>
              )}

              {loading && (
                <div className="absolute inset-0 bg-neutral-950/60 z-30 flex items-center justify-center text-xs text-amber-400 gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" /> Rendering page...
                </div>
              )}

              {/* Main rendering stack */}
              <div className="relative border border-neutral-800 select-none shadow-2xl">
                <canvas ref={canvasRef} className="block" />
                <canvas
                  ref={overlayCanvasRef}
                  className="absolute inset-0 cursor-crosshair z-10"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                />
              </div>
            </div>
          </div>

          {/* Right panel: Snippet capture preview & insert control */}
          <div className="flex flex-col bg-neutral-900/30 p-5 overflow-y-auto">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              Snippet Preview
            </h4>

            {croppedPreview ? (
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="rounded-lg border border-neutral-700 bg-neutral-950 p-2 overflow-hidden shadow-inner">
                    <img
                      src={croppedPreview}
                      alt="Cropped preview"
                      className="w-full object-contain max-h-[300px]"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-400 leading-normal">
                    This selection will replace the image field on the active slide. Width and height are configured to match aspect ratios.
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-neutral-800">
                  <button
                    onClick={handleCaptureToSlide}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2 text-xs font-bold text-neutral-950 hover:bg-emerald-400 transition"
                  >
                    <Crop className="h-4 w-4" /> Insert into Active Slide
                  </button>
                  <button
                    onClick={askAiToAnalyze}
                    disabled={aiLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-500 py-2 text-xs font-bold text-white hover:bg-sky-400 transition disabled:opacity-50"
                  >
                    {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {aiLoading ? "AI is thinking..." : "AI: Predict & Draft Slides"}
                  </button>
                  <button
                    onClick={() => {
                      setCropStart(null);
                      setCropEnd(null);
                      setCroppedPreview(null);
                      setAiAnalysis(null);
                      drawOverlay(null, null);
                    }}
                    className="w-full rounded-lg border border-neutral-800 hover:border-neutral-700 py-2 text-xs font-semibold text-neutral-400 hover:text-white transition"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed border-neutral-800 p-6 text-center text-xs text-neutral-500">
                <div>
                  <Crop className="h-6 w-6 text-neutral-600 mx-auto mb-2" />
                  Drag a selection box over the PDF page on the left to capture a screenshot preview.
                </div>
              </div>
            )}
            
            {/* AI Analysis Results Box */}
            {aiAnalysis && (
              <div className="mt-4 rounded-xl border border-sky-500/30 bg-sky-500/5 p-4 flex flex-col gap-2 max-h-64 overflow-y-auto">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                  <Sparkles className="h-4 w-4" /> AI Draft Proposal
                </div>
                <p className="whitespace-pre-wrap text-[11px] text-neutral-300 leading-relaxed">
                  {aiAnalysis}
                </p>
                <button
                  onClick={() => {
                    // Quick way for the teacher to copy the AI text to clipboard to paste into slides
                    navigator.clipboard.writeText(aiAnalysis);
                    alert("AI draft copied to clipboard! You can paste it into a new slide.");
                  }}
                  className="mt-2 rounded bg-sky-500/20 px-2 py-1.5 text-[10px] font-bold text-sky-300 hover:bg-sky-500/30 w-full"
                >
                  Copy AI Draft to Clipboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
