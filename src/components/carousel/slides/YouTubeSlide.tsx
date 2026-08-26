"use client";

import React, { useRef, useState, useEffect } from "react";
import { YouTubeSlide } from "../CarouselTypes";

function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!["youtube.com", "www.youtube.com", "youtu.be"].includes(parsed.hostname)) return null;
    const id = parsed.hostname === "youtu.be"
      ? parsed.pathname.slice(1)
      : parsed.pathname.startsWith("/embed/") || parsed.pathname.startsWith("/shorts/")
        ? parsed.pathname.split("/")[2]
        : parsed.searchParams.get("v");
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export function YouTubeSlideView({ slide, isPaused }: { slide: YouTubeSlide; isPaused?: boolean }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isFrameLoaded, setIsFrameLoaded] = useState(false);
  const videoId = extractYouTubeId(slide.youtubeUrl);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  const [showPlayer, setShowPlayer] = useState(false);

  const startParam = slide.startAt ? `&start=${slide.startAt}` : "";
  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1${startParam}&mute=${isMuted ? 1 : 0}&playsinline=1`
    : null;

  return (
    <div className="relative w-full bg-neutral-950" style={{ minHeight: 420 }}>
      {!videoId && <div className="flex min-h-[420px] items-center justify-center p-6 text-center text-sm text-amber-300">Invalid YouTube URL. Use a full youtube.com or youtu.be video link.</div>}
      {/* Caption badge */}
      {slide.caption && (
        <div className="absolute top-4 left-4 z-20 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.582,6.186a2.506,2.506,0,0,0-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418A2.506,2.506,0,0,0,2.418,6.186C2,7.746,2,12,2,12s0,4.254.418,5.814a2.506,2.506,0,0,0,1.768,1.768C5.746,20,12,20,12,20s6.254,0,7.814-.418a2.506,2.506,0,0,0,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186ZM10,15.464V8.536L16,12Z"/>
          </svg>
          {slide.caption}
        </div>
      )}

      {/* Thumbnail / Player toggle */}
      {!showPlayer ? (
        <div
          className="relative cursor-pointer group"
          style={{ minHeight: 420 }}
          onClick={() => setShowPlayer(true)}
        >
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={slide.title || "YouTube lesson"}
              className="w-full h-full object-cover"
              style={{ minHeight: 420, maxHeight: 520 }}
            />
          ) : (
            <div className="w-full h-96 bg-neutral-900 flex items-center justify-center">
              <span className="text-neutral-600">No thumbnail</span>
            </div>
          )}
          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all" />
          {/* Play button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <div className="text-center px-6">
              {slide.title && <p className="text-white font-black text-xl text-shadow">{slide.title}</p>}
              {slide.subtitle && <p className="text-neutral-300 text-sm mt-1">{slide.subtitle}</p>}
              <p className="text-amber-400 text-xs mt-3 font-semibold">▶ Click to watch lesson</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative" style={{ paddingBottom: "56.25%", minHeight: 420 }}>
          {!isFrameLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-950">
              <div className="w-10 h-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            </div>
          )}
          {embedUrl && (
            <iframe
              key={embedUrl}
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setIsFrameLoaded(true)}
            />
          )}
          {/* Mute toggle */}
          <button
            onClick={() => setIsMuted((m) => !m)}
            className="absolute bottom-3 right-3 z-20 bg-black/60 border border-white/20 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-black/80 transition backdrop-blur-sm"
          >
            {isMuted ? "🔇 Unmute" : "🔊 Mute"}
          </button>
        </div>
      )}
    </div>
  );
}
