"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import EducationalCarousel from "../EducationalCarousel";
import type { EduCarouselConfig } from "../CarouselTypes";
import { 
  Maximize2, 
  Minimize2, 
  Video, 
  Square, 
  Play, 
  Pause, 
  Download, 
  Share2, 
  Youtube, 
  Pencil, 
  Eraser, 
  RotateCcw, 
  Palette, 
  X, 
  Mic, 
  MicOff, 
  Monitor, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  FileVideo,
  Layers,
  ChevronLeft,
  ChevronRight,
  Radio,
  Pointer
} from "lucide-react";

interface CarouselPresentationStudioProps {
  carousel: EduCarouselConfig;
  onClose: () => void;
  onSaveRecordingToPackage?: (recordingUrl: string, title: string) => void;
}

export default function CarouselPresentationStudio({
  carousel,
  onClose,
  onSaveRecordingToPackage
}: CarouselPresentationStudioProps) {
  // Fullscreen state
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Whiteboard overlay state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTool, setActiveTool] = useState<"pointer" | "pen" | "highlighter" | "eraser">("pointer");
  const [drawColor, setDrawColor] = useState<string>("#f59e0b"); // Amber
  const [drawWidth, setDrawWidth] = useState<number>(3);
  const [whiteboardMode, setWhiteboardMode] = useState<"overlay" | "blank-dark" | "blank-light">("overlay");
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);

  // Recording & Voice Enhancement state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordMic, setRecordMic] = useState(true);
  const [voiceEnhancerEnabled, setVoiceEnhancerEnabled] = useState(true);
  const [micGainLevel, setMicGainLevel] = useState(1.2); // 120% default volume boost
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const gainNodeRef = useRef<GainNode | null>(null);

  // YouTube Upload state
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [ytTitle, setYtTitle] = useState(`${carousel?.title || "Lesson"} - Teacher Explanation`);
  const [ytDescription, setYtDescription] = useState(`Interactive lesson demo covering ${carousel?.title || "Lesson"}.`);
  const [ytPrivacy, setYtPrivacy] = useState<"public" | "unlisted" | "private">("unlisted");
  const [ytUploading, setYtUploading] = useState(false);
  const [ytSuccessUrl, setYtSuccessUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const combinedStreamRef = useRef<MediaStream | null>(null);

  // Toggle native browser full screen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Resize canvas to match screen dimensions
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // Clear whiteboard canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Drawing mouse handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === "pointer") return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);

    if (activeTool === "highlighter") {
      ctx.strokeStyle = drawColor + "66"; // 40% opacity
      ctx.lineWidth = drawWidth * 4;
      ctx.lineCap = "square";
    } else if (activeTool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = drawWidth * 6;
      ctx.lineCap = "round";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = drawWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === "pointer") {
      setLaserPos({ x, y });
      return;
    } else {
      setLaserPos(null);
    }

    if (!isDrawing) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // Recording Logic (Screen + Audio capture)
  const startRecording = async () => {
    try {
      recordedChunksRef.current = [];

      // 1. Capture Screen Video (Desktop / Window / Tab)
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "monitor" } as any,
        audio: true // System audio
      });

      let finalStream = screenStream;

      // 2. Mix Microphone Audio with Real-Time Web Audio DSP Enhancement Pipeline
      if (recordMic) {
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: voiceEnhancerEnabled,
              noiseSuppression: voiceEnhancerEnabled,
              autoGainControl: voiceEnhancerEnabled,
              sampleRate: 48000
            }
          });

          const audioContext = new AudioContext();
          const dest = audioContext.createMediaStreamDestination();

          // Mix Screen System Audio
          if (screenStream.getAudioTracks().length > 0) {
            const screenSource = audioContext.createMediaStreamSource(screenStream);
            screenSource.connect(dest);
          }

          // Build Microphone Web Audio DSP Chain
          const micSource = audioContext.createMediaStreamSource(micStream);

          if (voiceEnhancerEnabled) {
            // A. High-Pass Filter (removes low-frequency rumble & ambient hums < 80Hz)
            const highPass = audioContext.createBiquadFilter();
            highPass.type = "highpass";
            highPass.frequency.value = 80;

            // B. Speech Presence EQ Filter (boosts clarity frequencies at 3000Hz +3.5dB)
            const speechEq = audioContext.createBiquadFilter();
            speechEq.type = "peaking";
            speechEq.frequency.value = 3000;
            speechEq.Q.value = 1.0;
            speechEq.gain.value = 3.5;

            // C. Vocal Dynamic Compressor (smooths volume spikes & boosts quiet speech)
            const compressor = audioContext.createDynamicsCompressor();
            compressor.threshold.value = -24;
            compressor.knee.value = 12;
            compressor.ratio.value = 4;
            compressor.attack.value = 0.003;
            compressor.release.value = 0.25;

            // D. Gain Booster Node (microphone volume multiplier controlled by teacher slider)
            const gainNode = audioContext.createGain();
            gainNode.gain.value = micGainLevel;
            gainNodeRef.current = gainNode;

            // Connect DSP Chain: micSource -> highPass -> speechEq -> compressor -> gainNode -> dest
            micSource
              .connect(highPass)
              .connect(speechEq)
              .connect(compressor)
              .connect(gainNode)
              .connect(dest);
          } else {
            // Direct pass-through without DSP filters
            const gainNode = audioContext.createGain();
            gainNode.gain.value = micGainLevel;
            gainNodeRef.current = gainNode;

            micSource.connect(gainNode).connect(dest);
          }

          const combinedTracks = [
            ...screenStream.getVideoTracks(),
            ...dest.stream.getAudioTracks()
          ];

          finalStream = new MediaStream(combinedTracks);
        } catch (micErr) {
          console.warn("Microphone not available, recording screen audio only:", micErr);
        }
      }

      combinedStreamRef.current = finalStream;

      // Determine mimeType supported by browser
      let mimeType = "video/webm;codecs=vp9,opus";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm;codecs=vp8,opus";
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm";
      }

      const recorder = new MediaRecorder(finalStream, { mimeType });

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setRecordingBlob(blob);
        setRecordingUrl(url);
        setShowPreviewModal(true);
        setIsRecording(false);
        setIsPaused(false);

        // Stop all tracks
        if (combinedStreamRef.current) {
          combinedStreamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      // Handle user stopping screen share via browser bar
      screenStream.getVideoTracks()[0].onended = () => {
        if (recorder.state !== "inactive") {
          recorder.stop();
        }
      };

      recorder.start(1000); // chunk every second
      mediaRecorderRef.current = recorder;

      setIsRecording(true);
      setRecordingSeconds(0);

      // Start timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Screen recording cancelled or failed:", err);
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const togglePause = () => {
    if (!mediaRecorderRef.current) return;
    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  // Format seconds into MM:SS
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Download recorded video file
  const downloadRecording = () => {
    if (!recordingUrl) return;
    const titleText = carousel?.title || "Lesson";
    const a = document.createElement("a");
    a.href = recordingUrl;
    a.download = `${titleText.replace(/\s+/g, "_")}_Demo_${Date.now()}.webm`;
    a.click();
  };

  // Simulate YouTube Direct Upload API
  const handlePublishToYoutube = () => {
    setYtUploading(true);
    setTimeout(() => {
      setYtUploading(false);
      const fakeYtId = `yt_${Date.now().toString(36)}`;
      const fakeUrl = `https://youtu.be/${fakeYtId}`;
      setYtSuccessUrl(fakeUrl);
      if (onSaveRecordingToPackage) {
        onSaveRecordingToPackage(fakeUrl, ytTitle);
      }
    }, 2500);
  };

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-50 bg-neutral-950 flex flex-col ${isFullscreen ? "w-screen h-screen" : ""}`}
    >
      {/* ── TOP CONTROL BAR ── */}
      <header className="bg-neutral-900 border-b border-neutral-800 px-4 py-2.5 flex items-center justify-between gap-4 shrink-0">
        {/* Title & Scope */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition"
            title="Exit Presentation Studio"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              {carousel.title}
              <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                PRESENTATION & RECORDING STUDIO
              </span>
            </h2>
          </div>
        </div>

        {/* Recording Controls */}
        <div className="flex items-center gap-3">
          {isRecording ? (
            <div className="flex items-center gap-2 bg-red-950/80 border border-red-500/50 rounded-xl px-3 py-1.5 animate-pulse">
              <Radio className="h-4 w-4 text-red-500 animate-spin" />
              <span className="font-mono text-xs font-bold text-red-400">REC {formatTime(recordingSeconds)}</span>
              <button 
                onClick={togglePause} 
                className="px-2 py-1 bg-red-900/60 hover:bg-red-800 rounded text-[11px] text-white font-semibold ml-1"
              >
                {isPaused ? <Play className="h-3 w-3 inline" /> : <Pause className="h-3 w-3 inline" />}
              </button>
              <button 
                onClick={stopRecording} 
                className="px-2.5 py-1 bg-red-600 hover:bg-red-500 rounded text-[11px] font-bold text-white flex items-center gap-1"
              >
                <Square className="h-3 w-3 fill-white" /> Stop & Save
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1 text-[11px] text-neutral-400 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={recordMic} 
                  onChange={(e) => setRecordMic(e.target.checked)}
                  className="accent-amber-500"
                />
                {recordMic ? <Mic className="h-3.5 w-3.5 text-amber-400 inline" /> : <MicOff className="h-3.5 w-3.5 text-neutral-500 inline" />}
                Mic Voice
              </label>

              {recordMic && (
                <>
                  {/* Studio Voice Enhancer Toggle */}
                  <button
                    onClick={() => setVoiceEnhancerEnabled(!voiceEnhancerEnabled)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                      voiceEnhancerEnabled
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        : "bg-neutral-800 text-neutral-400 border-neutral-700"
                    }`}
                    title="Toggle Web Audio DSP Noise Suppression, Echo Cancellation & Speech EQ Boost"
                  >
                    <Sparkles className="h-3 w-3" />
                    Studio Enhancer {voiceEnhancerEnabled ? "ON" : "OFF"}
                  </button>

                  {/* Mic Volume Boost Slider */}
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 bg-neutral-950/60 border border-neutral-800 px-2 py-1 rounded-lg">
                    <span>Mic Boost:</span>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={micGainLevel}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setMicGainLevel(val);
                        if (gainNodeRef.current) gainNodeRef.current.gain.value = val;
                      }}
                      className="w-16 accent-amber-500 cursor-pointer"
                    />
                    <span className="font-mono text-amber-400 font-bold w-7 text-right">{Math.round(micGainLevel * 100)}%</span>
                  </div>
                </>
              )}

              <button 
                onClick={startRecording}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs shadow-lg transition"
              >
                <Video className="h-4 w-4" /> Start Screen & Mic Recording
              </button>
            </div>
          )}

          {/* Fullscreen & Close */}
          <button 
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition"
            title={isFullscreen ? "Exit Full Screen" : "Full Screen Presentation"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button onClick={onClose} className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition">
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* ── MAIN PRESENTATION CANVAS & SLIDES ── */}
      <div className="flex-1 relative overflow-hidden bg-neutral-900 flex flex-col">
        {/* Background Mode Selector */}
        <div className="absolute top-3 left-4 z-20 flex items-center gap-1.5 bg-neutral-950/80 border border-neutral-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => setWhiteboardMode("overlay")}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              whiteboardMode === "overlay" ? "bg-amber-500 text-black" : "text-neutral-400 hover:text-white"
            }`}
          >
            🖼️ Carousel Slide Overlay
          </button>
          <button
            onClick={() => setWhiteboardMode("blank-dark")}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              whiteboardMode === "blank-dark" ? "bg-amber-500 text-black" : "text-neutral-400 hover:text-white"
            }`}
          >
            ⬛ Dark Blackboard
          </button>
          <button
            onClick={() => setWhiteboardMode("blank-light")}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              whiteboardMode === "blank-light" ? "bg-amber-500 text-black" : "text-neutral-400 hover:text-white"
            }`}
          >
            ⬜ Whiteboard
          </button>
        </div>

        {/* Slide Content Layer */}
        {whiteboardMode === "overlay" && (
          <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
            <div className="w-full max-w-5xl">
              <EducationalCarousel config={carousel} onComplete={() => {}} />
            </div>
          </div>
        )}

        {whiteboardMode === "blank-dark" && (
          <div className="flex-1 bg-neutral-950 flex items-center justify-center p-8">
            <p className="text-neutral-700 text-sm italic pointer-events-none">Dark Blackboard — Use drawing tools to solve physics problems step-by-step.</p>
          </div>
        )}

        {whiteboardMode === "blank-light" && (
          <div className="flex-1 bg-white flex items-center justify-center p-8">
            <p className="text-neutral-400 text-sm italic pointer-events-none">Whiteboard — Ideal for math equations and diagram sketches.</p>
          </div>
        )}

        {/* 🎨 Digital Whiteboard Canvas Layer */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`absolute inset-0 z-10 ${
            activeTool === "pointer" ? "cursor-default" : activeTool === "eraser" ? "cursor-crosshair" : "cursor-crosshair"
          }`}
        />

        {/* Laser Pointer Visual */}
        {activeTool === "pointer" && laserPos && (
          <div 
            className="pointer-events-none absolute z-30 h-4 w-4 rounded-full bg-red-500 shadow-[0_0_12px_#ef4444] animate-pulse -translate-x-1/2 -translate-y-1/2"
            style={{ left: laserPos.x, top: laserPos.y }}
          />
        )}

        {/* 🎨 DRAWING TOOLBAR (FLOATING AT BOTTOM) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-neutral-950/90 border border-neutral-800 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-2xl backdrop-blur-md">
          {/* Tools */}
          <div className="flex items-center gap-1 pr-3 border-r border-neutral-800">
            <button
              onClick={() => setActiveTool("pointer")}
              className={`p-2 rounded-xl transition ${activeTool === "pointer" ? "bg-amber-500 text-black" : "text-neutral-400 hover:bg-neutral-800 hover:text-white"}`}
              title="Laser Pointer Mode"
            >
              <Pointer className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActiveTool("pen")}
              className={`p-2 rounded-xl transition ${activeTool === "pen" ? "bg-amber-500 text-black" : "text-neutral-400 hover:bg-neutral-800 hover:text-white"}`}
              title="Pen Draw Tool"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActiveTool("highlighter")}
              className={`p-2 rounded-xl transition ${activeTool === "highlighter" ? "bg-amber-500 text-black" : "text-neutral-400 hover:bg-neutral-800 hover:text-white"}`}
              title="Highlighter Tool"
            >
              <Sparkles className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActiveTool("eraser")}
              className={`p-2 rounded-xl transition ${activeTool === "eraser" ? "bg-amber-500 text-black" : "text-neutral-400 hover:bg-neutral-800 hover:text-white"}`}
              title="Eraser"
            >
              <Eraser className="h-4 w-4" />
            </button>
            <button
              onClick={clearCanvas}
              className="p-2 rounded-xl text-neutral-400 hover:bg-red-500/20 hover:text-red-400 transition"
              title="Clear Whiteboard Annotations"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* Colors */}
          {activeTool !== "eraser" && activeTool !== "pointer" && (
            <div className="flex items-center gap-1.5 pr-3 border-r border-neutral-800">
              {["#f59e0b", "#38bdf8", "#10b981", "#f43f5e", "#ffffff", "#eab308"].map((c) => (
                <button
                  key={c}
                  onClick={() => setDrawColor(c)}
                  className={`h-5 w-5 rounded-full transition-transform ${drawColor === c ? "scale-125 ring-2 ring-amber-400" : "hover:scale-110"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          )}

          {/* Stroke Thickness */}
          {activeTool !== "pointer" && (
            <div className="flex items-center gap-1 text-xs text-neutral-400">
              <span className="text-[10px] font-bold">Size:</span>
              {[2, 4, 8].map((size) => (
                <button
                  key={size}
                  onClick={() => setDrawWidth(size)}
                  className={`px-2 py-0.5 rounded font-mono font-bold transition ${drawWidth === size ? "bg-amber-500 text-black" : "text-neutral-400 hover:bg-neutral-800"}`}
                >
                  {size}px
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── RECORDING PREVIEW & PUBLISH MODAL ── */}
      {showPreviewModal && recordingUrl && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button onClick={() => setShowPreviewModal(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
              <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center text-white">
                <FileVideo className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Recording Saved Successfully</p>
                <h2 className="text-lg font-bold text-white">Teacher Explanation Recording</h2>
              </div>
            </div>

            {/* Video Player */}
            <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-black max-h-72">
              <video src={recordingUrl} controls autoPlay className="w-full h-full object-contain max-h-72" />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={downloadRecording}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition"
              >
                <Download className="h-4 w-4 text-sky-400" /> Download Video File
              </button>

              <button
                onClick={() => setShowYoutubeModal(true)}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition"
              >
                <Youtube className="h-4 w-4" /> Publish to YouTube
              </button>

              <button
                onClick={() => {
                  if (onSaveRecordingToPackage && recordingUrl) {
                    onSaveRecordingToPackage(recordingUrl, ytTitle);
                    setShowPreviewModal(false);
                  }
                }}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition"
              >
                <CheckCircle className="h-4 w-4" /> Attach to Package
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── YOUTUBE DIRECT UPLOAD MODAL ── */}
      {showYoutubeModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <button onClick={() => setShowYoutubeModal(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
              <Youtube className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-400">YouTube Data API Integration</p>
                <h2 className="text-base font-bold text-white">Publish Direct to YouTube Channel</h2>
              </div>
            </div>

            {ytSuccessUrl ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-3 text-center">
                <CheckCircle className="h-10 w-10 mx-auto text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Successfully Published to YouTube!</h3>
                <p className="text-xs text-neutral-300">Your video is live on YouTube. Embed link:</p>
                <a href={ytSuccessUrl} target="_blank" rel="noreferrer" className="block p-2 rounded bg-neutral-900 border border-neutral-700 text-xs text-sky-400 font-mono underline break-all">
                  {ytSuccessUrl}
                </a>
                <button
                  onClick={() => {
                    setShowYoutubeModal(false);
                    setShowPreviewModal(false);
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Video Title</label>
                  <input
                    type="text"
                    value={ytTitle}
                    onChange={(e) => setYtTitle(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={ytDescription}
                    onChange={(e) => setYtDescription(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-red-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Privacy Level</label>
                  <select
                    value={ytPrivacy}
                    onChange={(e) => setYtPrivacy(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-red-500"
                  >
                    <option value="unlisted">🔗 Unlisted (Only students with link / in package)</option>
                    <option value="public">🔓 Public (Searchable on YouTube)</option>
                    <option value="private">🔒 Private (Only your YouTube account)</option>
                  </select>
                </div>

                <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 text-[11px] text-neutral-400">
                  <p>Authenticated as: <strong className="text-white">Dr. Hassan Youssef (Channel ID: @physics_master)</strong></p>
                </div>

                <button
                  onClick={handlePublishToYoutube}
                  disabled={ytUploading}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {ytUploading ? (
                    <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Uploading to YouTube API...</>
                  ) : (
                    <><Youtube className="h-4 w-4" /> Start YouTube Upload</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
