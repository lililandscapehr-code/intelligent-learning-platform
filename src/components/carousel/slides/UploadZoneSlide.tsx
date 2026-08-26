"use client";

import React, { useRef, useState } from "react";
import { UploadZoneSlide, EduSlide } from "../CarouselTypes";

interface Props {
  slide: UploadZoneSlide;
  onUpload: (newSlide: EduSlide) => void;
}

export function UploadZoneSlideView({ slide, onUpload }: Props) {
  const [youtubeInput, setYoutubeInput] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<{ type: "image" | "video"; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractYouTubeId = (url: string) => {
    const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleFile = (file: File) => {
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) return;
    const url = URL.createObjectURL(file);
    setPreview({ type: isVideo ? "video" : "image", url });
    const newSlide: EduSlide = isVideo
      ? { id: `uploaded-video-${Date.now()}`, type: "video", videoUrl: url, title: file.name }
      : { id: `uploaded-img-${Date.now()}`, type: "image", imageUrl: url, title: file.name };
    onUpload(newSlide);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleYouTubeAdd = () => {
    const id = extractYouTubeId(youtubeInput.trim());
    if (!id) return;
    const newSlide: EduSlide = {
      id: `youtube-${Date.now()}`,
      type: "youtube",
      youtubeUrl: youtubeInput.trim(),
      title: "YouTube Lesson",
      caption: "Video Lesson"
    };
    onUpload(newSlide);
    setYoutubeInput("");
  };

  return (
    <div className="p-8 md:p-10 flex flex-col gap-6 min-h-[420px] bg-gradient-to-br from-neutral-950 to-neutral-900">
      <div>
        <span className="text-[10px] font-black uppercase tracking-widest bg-purple-500 text-white px-3 py-1.5 rounded-full">
          📎 Media Upload
        </span>
        <h3 className="text-xl font-bold text-white mt-3">{slide.prompt || "Add media to this lesson"}</h3>
        <p className="text-neutral-400 text-sm mt-1">Drag a file, pick from device, or paste a YouTube URL</p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
          dragOver
            ? "border-amber-500 bg-amber-500/10"
            : "border-neutral-700 hover:border-neutral-500 bg-neutral-900"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        {preview ? (
          preview.type === "image" ? (
            <img src={preview.url} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain" />
          ) : (
            <video src={preview.url} className="max-h-48 mx-auto rounded-lg" controls />
          )
        ) : (
          <div className="space-y-3">
            <div className="text-5xl">📁</div>
            <p className="text-neutral-400 text-sm font-medium">
              Drop an image or video here, or click to browse
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {["JPG", "PNG", "GIF", "WEBP", "MP4", "WEBM"].map((ext) => (
                <span key={ext} className="text-[10px] bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded text-neutral-500 font-mono">{ext}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* YouTube URL input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.582,6.186a2.506,2.506,0,0,0-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418A2.506,2.506,0,0,0,2.418,6.186C2,7.746,2,12,2,12s0,4.254.418,5.814a2.506,2.506,0,0,0,1.768,1.768C5.746,20,12,20,12,20s6.254,0,7.814-.418a2.506,2.506,0,0,0,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186ZM10,15.464V8.536L16,12Z"/>
            </svg>
          </span>
          <input
            type="url"
            value={youtubeInput}
            onChange={(e) => setYoutubeInput(e.target.value)}
            placeholder="Paste YouTube URL (e.g. https://youtube.com/watch?v=...)"
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl pl-9 pr-4 py-3 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-red-500 transition"
          />
        </div>
        <button
          onClick={handleYouTubeAdd}
          disabled={!extractYouTubeId(youtubeInput.trim())}
          className="px-5 py-3 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Add Video
        </button>
      </div>
    </div>
  );
}
