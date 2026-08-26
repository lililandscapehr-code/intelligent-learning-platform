"use client";

import React, { useState } from "react";
import { ImageSlide } from "../../CarouselTypes";

interface Props {
  slide: ImageSlide;
  onChange: (update: Partial<ImageSlide>) => void;
}

export default function ImageEditor({ slide, onChange }: Props) {
  const [tab, setTab] = useState<"upload" | "url">("upload");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange({ imageUrl: url });
    }
  };

  const layouts = ["left", "right", "top", "bottom", "fullscreen"] as const;

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-neutral-400 mb-2">Image Source</label>
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
            <span className="text-sm text-neutral-400">Click to upload image</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
        ) : (
          <input
            type="text"
            value={slide.imageUrl || ""}
            onChange={(e) => onChange({ imageUrl: e.target.value })}
            placeholder="https://..."
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
          />
        )}
      </div>

      {slide.imageUrl && (
        <img
          src={slide.imageUrl}
          alt="Preview"
          className="max-h-48 w-full object-contain rounded-lg border border-neutral-700 bg-neutral-950"
        />
      )}

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
          value={(slide as any).imageAlt || ""}
          onChange={(e) => onChange({ imageAlt: e.target.value } as any)}
          className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
        />
      </label>

      <div>
        <label className="block text-xs font-semibold text-neutral-400 mb-2">Layout</label>
        <div className="flex gap-2">
          {layouts.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => onChange({ imageLayout: l } as any)}
              className={`px-3 py-1.5 text-sm capitalize rounded-lg border ${
                (slide as any).imageLayout === l || (!("imageLayout" in slide) && l === "top")
                  ? "border-amber-500 bg-amber-500/10 text-amber-500"
                  : "border-neutral-700 text-neutral-400 hover:text-white"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {["left", "right"].includes((slide as any).imageLayout || "top") && (
        <label className="block text-xs font-semibold text-neutral-400">
          Image size % ({(slide as any).imageSizePct || 42}%)
          <input
            type="range"
            min="20"
            max="70"
            value={(slide as any).imageSizePct || 42}
            onChange={(e) => onChange({ imageSizePct: parseInt(e.target.value) } as any)}
            className="mt-2 w-full accent-amber-500"
          />
        </label>
      )}

      <label className="block text-xs font-semibold text-neutral-400">
        Slide display timer (seconds, 0 = manual advance)
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
