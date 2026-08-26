"use client";

import React, { useState } from "react";
import { VideoSlide } from "../../CarouselTypes";

interface Props {
  slide: VideoSlide;
  onChange: (update: Partial<VideoSlide>) => void;
}

export default function VideoEditor({ slide, onChange }: Props) {
  const [tab, setTab] = useState<"upload" | "url">("upload");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange({ videoUrl: url });
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-neutral-400 mb-2">Video Source</label>
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`px-3 py-1.5 text-sm rounded-lg border ${
              tab === "upload"
                ? "border-amber-500 bg-amber-500/10 text-amber-500"
                : "border-neutral-700 text-neutral-400 hover:text-white"
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setTab("url")}
            className={`px-3 py-1.5 text-sm rounded-lg border ${
              tab === "url"
                ? "border-amber-500 bg-amber-500/10 text-amber-500"
                : "border-neutral-700 text-neutral-400 hover:text-white"
            }`}
          >
            Paste URL
          </button>
        </div>

        {tab === "upload" ? (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-700 bg-neutral-900 py-6 hover:border-amber-500">
            <span className="text-sm text-neutral-400">Click to upload video</span>
            <input type="file" accept="video/*" className="hidden" onChange={handleFileUpload} />
          </label>
        ) : (
          <input
            type="text"
            value={slide.videoUrl || ""}
            onChange={(e) => onChange({ videoUrl: e.target.value })}
            placeholder="https://..."
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
          />
        )}
      </div>

      <label className="block text-xs font-semibold text-neutral-400">
        Caption
        <input
          type="text"
          value={slide.caption || ""}
          onChange={(e) => onChange({ caption: e.target.value })}
          className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
        />
      </label>

      <label className="block text-xs font-semibold text-neutral-400">
        Alt text
        <input
          type="text"
          value={(slide as any).videoAlt || ""}
          onChange={(e) => onChange({ videoAlt: e.target.value } as any)}
          className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
        <input
          type="checkbox"
          checked={(slide as any).autoAdvance || false}
          onChange={(e) => onChange({ autoAdvance: e.target.checked } as any)}
          className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 accent-amber-500"
        />
        Auto-advance to next slide when video ends
      </label>

      <label className="block text-xs font-semibold text-neutral-400">
        Max display time (seconds, 0 = no limit)
        <input
          type="number"
          min="0"
          value={slide.timerSeconds || 0}
          onChange={(e) => onChange({ timerSeconds: parseInt(e.target.value) || 0 })}
          className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
        />
      </label>
    </div>
  );
}
