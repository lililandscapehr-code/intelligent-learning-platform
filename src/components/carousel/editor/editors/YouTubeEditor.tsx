"use client";

import React from "react";
import RichTextEditor from "../RichTextEditor";
import { YouTubeSlide } from "../../CarouselTypes";

interface Props {
  slide: YouTubeSlide;
  onChange: (update: Partial<YouTubeSlide>) => void;
}

export default function YouTubeEditor({ slide, onChange }: Props) {
  const getYoutubeVideoId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : null;
  };

  const videoId = getYoutubeVideoId(slide.youtubeUrl || "");

  return (
    <div className="space-y-5">
      <label className="block text-xs font-semibold text-neutral-400">
        YouTube URL
        <input
          type="text"
          value={slide.youtubeUrl || ""}
          onChange={(e) => onChange({ youtubeUrl: e.target.value })}
          placeholder="https://www.youtube.com/watch?v=..."
          className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
        />
      </label>

      {videoId && (
        <div className="overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900">
          <img
            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
            alt="YouTube thumbnail preview"
            className="h-32 w-full object-cover opacity-80"
          />
        </div>
      )}

      <div className="flex gap-4">
        <label className="block flex-1 text-xs font-semibold text-neutral-400">
          Start at (seconds)
          <input
            type="number"
            min="0"
            value={slide.startAt || 0}
            onChange={(e) => onChange({ startAt: parseInt(e.target.value) || 0 })}
            className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
          />
        </label>
        <label className="block flex-1 text-xs font-semibold text-neutral-400">
          End at / Max duration (seconds)
          <input
            type="number"
            min="0"
            value={slide.maxDuration || 0}
            onChange={(e) => onChange({ maxDuration: parseInt(e.target.value) || 0 })}
            className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
          />
        </label>
      </div>

      <label className="block text-xs font-semibold text-neutral-400">
        Mandatory watch seconds (0 = student can skip freely)
        <input
          type="number"
          min="0"
          value={slide.timerSeconds || 0}
          onChange={(e) => onChange({ timerSeconds: parseInt(e.target.value) || 0 })}
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

      <div>
        <RichTextEditor
          label="Subtitle / watch instruction"
          value={slide.subtitle || ""}
          onChange={(val) => onChange({ subtitle: val })}
          accentColor="amber"
          rows={4}
        />
      </div>

      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
        <p className="text-sm font-medium text-amber-200">
          Verify this video is age-appropriate, accurate, and accessible before publishing.
        </p>
      </div>
    </div>
  );
}
