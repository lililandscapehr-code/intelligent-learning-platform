"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  PenTool,
  Eraser,
  Highlighter,
  Square,
  Circle,
  ArrowRight,
  Type,
  Grid,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Video,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Play,
  Pause,
  Square as StopSquare,
  Sparkles,
  Maximize2,
  Minimize2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Palette,
  CheckCircle,
  FileVideo,
  MonitorPlay,
  Layers,
  HelpCircle,
  X
} from "lucide-react";

type ToolType = "pen" | "highlighter" | "eraser" | "arrow" | "line" | "rect" | "circle" | "laser";
type BgType = "dark" | "grid" | "lines" | "light";

interface Point {
  x: number;
  y: number;
  pressure?: number;
}

interface Stroke {
  tool: ToolType;
  color: string;
  size: number;
  points: Point[];
  pageIndex: number;
}

const COLOR_PALETTE = [
  { name: "White", hex: "#ffffff" },
  { name: "Amber Yellow", hex: "#f59e0b" },
  { name: "Cyan / Sky", hex: "#38bdf8" },
  { name: "Emerald Green", hex: "#34d399" },
  { name: "Rose Red", hex: "#fb7185" },
  { name: "Electric Violet", hex: "#a855f7" },
  { name: "Chalk Yellow", hex: "#fef08a" },
  { name: "Dark Neutral", hex: "#171717" }
];

export default function VirtualWhiteboardStudio() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const webcamVideoRef = useRef<HTMLVideoElement | null>(null);
  
  // Whiteboard state
  const [currentTool, setCurrentTool] = useState<ToolType>("pen");
  const [currentColor, setCurrentColor] = useState<string>("#f59e0b");
  const [brushSize, setBrushSize] = useState<number>(3);
  const [backgroundType, setBackgroundType] = useState<BgType>("dark");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordMode, setRecordMode] = useState<"canvas" | "screen">("canvas");
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [recordedBlobs, setRecordedBlobs] = useState<Blob[]>([]);

  // MediaRecorder & Streams Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentStrokeRef = useRef<Stroke | null>(null);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Resize canvas to match display container
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const width = parent.clientWidth;
    const height = parent.clientHeight;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      redrawAll();
    }
  }, [backgroundType, currentPage, strokes]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // Render Background
  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (backgroundType === "dark") {
      ctx.fillStyle = "#121212";
      ctx.fillRect(0, 0, width, height);
    } else if (backgroundType === "light") {
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, width, height);
    } else if (backgroundType === "grid") {
      ctx.fillStyle = "#0f172a"; // dark slate
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
      ctx.lineWidth = 1;
      const gridSize = 30;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Main Axis highlight (for physics vector plotting)
      ctx.strokeStyle = "rgba(245, 158, 11, 0.3)";
      ctx.lineWidth = 1.5;
      const midY = Math.floor(height / 2 / gridSize) * gridSize;
      const midX = Math.floor(width / 2 / gridSize) * gridSize;

      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(midX, 0);
      ctx.lineTo(midX, height);
      ctx.stroke();
    } else if (backgroundType === "lines") {
      ctx.fillStyle = "#18181b";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      const lineGap = 28;
      for (let y = lineGap; y < height; y += lineGap) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }
  };

  // Redraw All Strokes for Active Page
  const redrawAll = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawBackground(ctx, canvas.width, canvas.height);

    const pageStrokes = strokes.filter(s => s.pageIndex === currentPage);

    for (const stroke of pageStrokes) {
      drawSingleStroke(ctx, stroke);
    }
  }, [strokes, currentPage, backgroundType]);

  useEffect(() => {
    redrawAll();
  }, [redrawAll]);

  // Helper to draw a single stroke
  const drawSingleStroke = (ctx: CanvasRenderingContext2D, stroke: Stroke) => {
    if (stroke.points.length === 0) return;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (stroke.tool === "eraser") {
      ctx.strokeStyle = backgroundType === "light" ? "#f8fafc" : backgroundType === "grid" ? "#0f172a" : "#121212";
      ctx.lineWidth = stroke.size * 5;
    } else if (stroke.tool === "highlighter") {
      ctx.strokeStyle = stroke.color;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = stroke.size * 4;
    } else {
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.globalAlpha = 1.0;
    }

    if (stroke.tool === "pen" || stroke.tool === "highlighter" || stroke.tool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    } else if (stroke.tool === "arrow" && stroke.points.length >= 2) {
      const p1 = stroke.points[0];
      const p2 = stroke.points[stroke.points.length - 1];

      // Draw line
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      // Draw arrowhead
      const headLen = 14 + stroke.size;
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

      ctx.beginPath();
      ctx.fillStyle = stroke.color;
      ctx.moveTo(p2.x, p2.y);
      ctx.lineTo(p2.x - headLen * Math.cos(angle - Math.PI / 6), p2.y - headLen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(p2.x - headLen * Math.cos(angle + Math.PI / 6), p2.y - headLen * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    } else if (stroke.tool === "line" && stroke.points.length >= 2) {
      const p1 = stroke.points[0];
      const p2 = stroke.points[stroke.points.length - 1];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    } else if (stroke.tool === "rect" && stroke.points.length >= 2) {
      const p1 = stroke.points[0];
      const p2 = stroke.points[stroke.points.length - 1];
      ctx.beginPath();
      ctx.strokeRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
    } else if (stroke.tool === "circle" && stroke.points.length >= 2) {
      const p1 = stroke.points[0];
      const p2 = stroke.points[stroke.points.length - 1];
      const radius = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  };

  // Pointer event handlers (Works for Stylus, Touch, & Mouse)
  const getCanvasCoordinates = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: e.pressure || 0.5
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const pt = getCanvasCoordinates(e);

    if (currentTool === "laser") {
      setLaserPos(pt);
      return;
    }

    setIsDrawing(true);
    const newStroke: Stroke = {
      tool: currentTool,
      color: currentColor,
      size: brushSize,
      points: [pt],
      pageIndex: currentPage
    };
    currentStrokeRef.current = newStroke;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.save();
      ctx.fillStyle = currentColor;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const pt = getCanvasCoordinates(e);

    if (currentTool === "laser") {
      setLaserPos(pt);
      return;
    }

    if (!isDrawing || !currentStrokeRef.current) return;

    const stroke = currentStrokeRef.current;
    stroke.points.push(pt);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (stroke.tool === "pen" || stroke.tool === "highlighter" || stroke.tool === "eraser") {
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (stroke.tool === "eraser") {
        ctx.strokeStyle = backgroundType === "light" ? "#f8fafc" : backgroundType === "grid" ? "#0f172a" : "#121212";
        ctx.lineWidth = stroke.size * 5;
      } else if (stroke.tool === "highlighter") {
        ctx.strokeStyle = stroke.color;
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = stroke.size * 4;
      } else {
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
      }

      const len = stroke.points.length;
      if (len >= 2) {
        ctx.beginPath();
        ctx.moveTo(stroke.points[len - 2].x, stroke.points[len - 2].y);
        ctx.lineTo(stroke.points[len - 1].x, stroke.points[len - 1].y);
        ctx.stroke();
      }
      ctx.restore();
    } else {
      redrawAll();
      drawSingleStroke(ctx, stroke);
    }
  };

  const handlePointerUp = () => {
    if (currentTool === "laser") {
      setLaserPos(null);
      return;
    }

    if (isDrawing && currentStrokeRef.current) {
      setStrokes(prev => [...prev, currentStrokeRef.current!]);
      setRedoStack([]);
      currentStrokeRef.current = null;
      setIsDrawing(false);
      redrawAll();
    }
  };

  // Undo / Redo
  const handleUndo = () => {
    const pageStrokes = strokes.filter(s => s.pageIndex === currentPage);
    if (pageStrokes.length === 0) return;

    const last = pageStrokes[pageStrokes.length - 1];
    setStrokes(prev => prev.filter(s => s !== last));
    setRedoStack(prev => [last, ...prev]);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setRedoStack(prev => prev.slice(1));
    setStrokes(prev => [...prev, next]);
  };

  const handleClearPage = () => {
    if (confirm("Are you sure you want to clear this entire board page?")) {
      setStrokes(prev => prev.filter(s => s.pageIndex !== currentPage));
      setRedoStack([]);
      redrawAll();
    }
  };

  // Export board as Image
  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `physics-whiteboard-page-${currentPage + 1}-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN & AUDIO RECORDER ENGINE
  // ════════════════════════════════════════════════════════════════════════════

  const startRecording = async () => {
    try {
      let combinedStream: MediaStream;

      if (recordMode === "canvas") {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const canvasStream = (canvas as any).captureStream(30);

        if (micEnabled) {
          try {
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioStream.getAudioTracks().forEach(track => canvasStream.addTrack(track));
          } catch (err) {
            console.warn("Could not capture microphone audio:", err);
          }
        }
        combinedStream = canvasStream;
      } else {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: { frameRate: 30 },
          audio: true
        });

        if (micEnabled) {
          try {
            const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            micStream.getAudioTracks().forEach(t => displayStream.addTrack(t));
          } catch (err) {
            console.warn("Microphone access denied or unavailable", err);
          }
        }
        combinedStream = displayStream;
      }

      streamRef.current = combinedStream;

      const chunks: Blob[] = [];
      const recorder = new MediaRecorder(combinedStream, {
        mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm"
      });

      recorder.ondataavailable = e => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedBlobs(chunks);
        setRecordedVideoUrl(url);
        setShowVideoModal(true);

        combinedStream.getTracks().forEach(track => track.stop());
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setIsPaused(false);
      setRecordSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordSeconds(s => s + 1);
      }, 1000);
    } catch (err) {
      console.error("Error starting video recording:", err);
      alert("Unable to start screen recording. Please check browser camera/screen sharing permissions.");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordSeconds(s => s + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const toggleWebcam = async () => {
    if (webcamEnabled) {
      setWebcamEnabled(false);
      if (webcamVideoRef.current && webcamVideoRef.current.srcObject) {
        const s = webcamVideoRef.current.srcObject as MediaStream;
        s.getTracks().forEach(t => t.stop());
        webcamVideoRef.current.srcObject = null;
      }
    } else {
      try {
        const camStream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
        if (webcamVideoRef.current) {
          webcamVideoRef.current.srcObject = camStream;
        }
        setWebcamEnabled(true);
      } catch (err) {
        alert("Could not access webcam camera.");
      }
    }
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col bg-neutral-950 text-white select-none ${
        isFullscreen ? "fixed inset-0 z-50 p-4" : "h-[85vh] rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden"
      }`}
    >
      {/* ── TOP STUDIO TOOLBAR ─────────────────────────────────── */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 bg-neutral-900/90 px-4 py-3 shrink-0">
        
        {/* Left: Branding & Page Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center text-black font-black text-sm">
              Ω
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                Virtual Board &amp; Studio Recorder
                <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">
                  STYLUS PEN
                </span>
              </h2>
            </div>
          </div>

          {/* Page Selector */}
          <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded-xl px-2 py-1 text-xs">
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="p-1 text-neutral-400 hover:text-white disabled:opacity-30"
              title="Previous Board Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-mono text-amber-400 px-1 font-bold text-[11px]">
              Page {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() => {
                if (currentPage + 1 < totalPages) {
                  setCurrentPage(p => p + 1);
                } else {
                  setTotalPages(t => t + 1);
                  setCurrentPage(t => t);
                }
              }}
              className="p-1 text-neutral-400 hover:text-white"
              title="Next or Add Page"
            >
              {currentPage + 1 === totalPages ? <Plus className="h-4 w-4 text-emerald-400" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Center: Drawing Tools Palette */}
        <div className="flex items-center gap-1.5 bg-neutral-950/80 border border-neutral-800 rounded-2xl p-1.5">
          <button
            onClick={() => setCurrentTool("pen")}
            className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              currentTool === "pen" ? "bg-amber-500 text-black shadow-md" : "text-neutral-400 hover:text-white"
            }`}
            title="Electric Pen / Stylus (Pressure Sensitive)"
          >
            <PenTool className="h-4 w-4" />
            <span className="hidden sm:inline">Pen</span>
          </button>

          <button
            onClick={() => setCurrentTool("highlighter")}
            className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              currentTool === "highlighter" ? "bg-amber-500 text-black shadow-md" : "text-neutral-400 hover:text-white"
            }`}
            title="Highlighter"
          >
            <Highlighter className="h-4 w-4" />
            <span className="hidden sm:inline">Highlight</span>
          </button>

          <button
            onClick={() => setCurrentTool("eraser")}
            className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              currentTool === "eraser" ? "bg-amber-500 text-black shadow-md" : "text-neutral-400 hover:text-white"
            }`}
            title="Eraser"
          >
            <Eraser className="h-4 w-4" />
            <span className="hidden sm:inline">Eraser</span>
          </button>

          <div className="h-5 w-px bg-neutral-800 mx-1" />

          {/* Physics Shapes & Vector Arrow */}
          <button
            onClick={() => setCurrentTool("arrow")}
            className={`p-2 rounded-xl text-xs font-bold transition ${
              currentTool === "arrow" ? "bg-amber-500 text-black shadow-md" : "text-neutral-400 hover:text-white"
            }`}
            title="Physics Vector Arrow"
          >
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => setCurrentTool("rect")}
            className={`p-2 rounded-xl text-xs font-bold transition ${
              currentTool === "rect" ? "bg-amber-500 text-black shadow-md" : "text-neutral-400 hover:text-white"
            }`}
            title="Rectangle / Boundary Box"
          >
            <Square className="h-4 w-4" />
          </button>

          <button
            onClick={() => setCurrentTool("circle")}
            className={`p-2 rounded-xl text-xs font-bold transition ${
              currentTool === "circle" ? "bg-amber-500 text-black shadow-md" : "text-neutral-400 hover:text-white"
            }`}
            title="Circle / Orbit"
          >
            <Circle className="h-4 w-4" />
          </button>

          <button
            onClick={() => setCurrentTool("laser")}
            className={`p-2 rounded-xl text-xs font-bold transition ${
              currentTool === "laser" ? "bg-red-500 text-white shadow-md animate-pulse" : "text-neutral-400 hover:text-white"
            }`}
            title="Laser Pointer (Temporary Glow)"
          >
            <Sparkles className="h-4 w-4" />
          </button>

          <div className="h-5 w-px bg-neutral-800 mx-1" />

          {/* Color Palette Buttons */}
          <div className="flex items-center gap-1">
            {COLOR_PALETTE.map(c => (
              <button
                key={c.hex}
                onClick={() => {
                  setCurrentColor(c.hex);
                  if (currentTool === "eraser") setCurrentTool("pen");
                }}
                className={`h-5 w-5 rounded-full border transition transform ${
                  currentColor === c.hex ? "scale-125 border-white shadow-md ring-2 ring-amber-500/50" : "border-neutral-700 hover:scale-110"
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>

          {/* Line Size slider */}
          <input
            type="range"
            min="1"
            max="16"
            value={brushSize}
            onChange={e => setBrushSize(Number(e.target.value))}
            className="w-16 accent-amber-500 ml-1"
            title={`Brush Size: ${brushSize}px`}
          />
        </div>

        {/* Right: Background, Record, Fullscreen Controls */}
        <div className="flex items-center gap-2">
          {/* Background selector */}
          <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setBackgroundType("dark")}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold ${backgroundType === "dark" ? "bg-neutral-800 text-amber-400" : "text-neutral-400"}`}
              title="Blackboard Mode"
            >
              Chalk
            </button>
            <button
              onClick={() => setBackgroundType("grid")}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold ${backgroundType === "grid" ? "bg-neutral-800 text-amber-400" : "text-neutral-400"}`}
              title="Physics Coordinate Grid"
            >
              Grid
            </button>
            <button
              onClick={() => setBackgroundType("lines")}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold ${backgroundType === "lines" ? "bg-neutral-800 text-amber-400" : "text-neutral-400"}`}
              title="Ruled Notes"
            >
              Lines
            </button>
          </div>

          {/* Undo / Redo */}
          <button onClick={handleUndo} className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800" title="Undo (Ctrl+Z)">
            <Undo2 className="h-4 w-4" />
          </button>
          <button onClick={handleRedo} className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800" title="Redo (Ctrl+Y)">
            <Redo2 className="h-4 w-4" />
          </button>
          <button onClick={handleClearPage} className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-red-400 hover:bg-red-950/40" title="Clear Page">
            <Trash2 className="h-4 w-4" />
          </button>
          <button onClick={handleDownloadImage} className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-emerald-400 hover:bg-emerald-950/40" title="Download Screenshot">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* ── RECORDING CONTROLS SUB-HEADER ──────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-900/40 border-b border-neutral-800 px-6 py-2 text-xs shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <Video className="h-3.5 w-3.5 text-amber-500" /> Lesson Video Recording
          </span>

          <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded-lg p-0.5">
            <button
              onClick={() => setRecordMode("canvas")}
              disabled={isRecording}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition ${
                recordMode === "canvas" ? "bg-amber-500 text-black" : "text-neutral-400"
              }`}
            >
              Board Only
            </button>
            <button
              onClick={() => setRecordMode("screen")}
              disabled={isRecording}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition ${
                recordMode === "screen" ? "bg-amber-500 text-black" : "text-neutral-400"
              }`}
            >
              Full Screen &amp; App
            </button>
          </div>

          <button
            onClick={() => setMicEnabled(!micEnabled)}
            className={`p-1.5 rounded-lg border flex items-center gap-1 text-[11px] font-bold transition ${
              micEnabled ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300" : "bg-neutral-900 border-neutral-800 text-neutral-500"
            }`}
          >
            {micEnabled ? <Mic className="h-3.5 w-3.5 text-emerald-400" /> : <MicOff className="h-3.5 w-3.5" />}
            <span>Mic {micEnabled ? "On" : "Muted"}</span>
          </button>

          <button
            onClick={toggleWebcam}
            className={`p-1.5 rounded-lg border flex items-center gap-1 text-[11px] font-bold transition ${
              webcamEnabled ? "bg-sky-950/40 border-sky-500/40 text-sky-300" : "bg-neutral-900 border-neutral-800 text-neutral-500"
            }`}
          >
            {webcamEnabled ? <Camera className="h-3.5 w-3.5 text-sky-400" /> : <CameraOff className="h-3.5 w-3.5" />}
            <span>Webcam {webcamEnabled ? "Active" : "Off"}</span>
          </button>
        </div>

        {/* Live Recording Action Controls */}
        <div className="flex items-center gap-2">
          {isRecording ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1 bg-red-950/80 border border-red-500/50 rounded-xl text-red-300 font-mono font-bold text-xs animate-pulse">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                <span>REC {formatTime(recordSeconds)}</span>
              </div>

              {isPaused ? (
                <button
                  onClick={resumeRecording}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow"
                >
                  <Play className="h-3.5 w-3.5" /> Resume
                </button>
              ) : (
                <button
                  onClick={pauseRecording}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition border border-neutral-700"
                >
                  <Pause className="h-3.5 w-3.5" /> Pause
                </button>
              )}

              <button
                onClick={stopRecording}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-red-600/30"
              >
                <StopSquare className="h-3.5 w-3.5" /> Stop &amp; Save Recording
              </button>
            </>
          ) : (
            <button
              onClick={startRecording}
              className="px-4 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-red-600/20"
            >
              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
              <span>Start Screen Recording</span>
            </button>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Board"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* ── CANVAS DRAWING SURFACE (TOUCH & STYLUS ENABLED) ───── */}
      <div className="relative flex-1 bg-black overflow-hidden touch-none cursor-crosshair">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="absolute inset-0 w-full h-full"
          style={{ touchAction: "none" }}
        />

        {/* Laser Pointer Glow Effect */}
        {laserPos && (
          <div
            className="pointer-events-none absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/80 shadow-[0_0_20px_10px_rgba(239,68,68,0.8)] animate-ping"
            style={{ left: laserPos.x, top: laserPos.y }}
          />
        )}

        {/* Picture-in-Picture Webcam Bubble */}
        {webcamEnabled && (
          <div className="absolute bottom-6 right-6 w-48 h-36 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-2xl bg-neutral-950 z-20">
            <video
              ref={webcamVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[9px] font-mono text-amber-400 font-bold">
              CAMERA
            </div>
          </div>
        )}
      </div>

      {/* ── RECORDED VIDEO PREVIEW MODAL ───────────────────────── */}
      {showVideoModal && recordedVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <FileVideo className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Lesson Demonstration Video Ready!</h3>
                  <p className="text-xs text-neutral-400">Duration: {formatTime(recordSeconds)} · Format: WebM / MP4</p>
                </div>
              </div>
              <button onClick={() => setShowVideoModal(false)} className="text-neutral-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-black aspect-video flex items-center justify-center">
              <video src={recordedVideoUrl} controls autoPlay className="w-full h-full" />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <p className="text-xs text-neutral-400">
                💡 You can download this recording or upload it directly into your Egyptian Baccalaureate Physics carousel slides.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-xs transition"
                >
                  Close
                </button>
                <a
                  href={recordedVideoUrl}
                  download={`physics-lesson-demo-${Date.now()}.webm`}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-lg"
                >
                  <Download className="h-4 w-4" /> Download Video File
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
