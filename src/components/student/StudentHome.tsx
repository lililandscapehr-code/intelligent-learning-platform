"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  CheckCircle2,
  Compass,
  GraduationCap,
  Layers,
  Lock,
  PlayCircle,
  Plus,
  Rocket,
  ShieldCheck,
  Sparkles,
  Zap,
  Video,
  Calendar,
  ExternalLink,
} from "lucide-react";

export interface StudentTrackInfo {
  curriculumId: string;
  curriculumName: string;
  part: "part1" | "part2" | "full";
  partLabel: string;
  publisher: string;
  progressPct: number;
  stageName: string;
  status: "ACTIVE" | "ENROLLED" | "COMPLETED";
  lessonsCount: number;
  completedLessonsCount: number;
}

const DEFAULT_TRACKS: StudentTrackInfo[] = [
  {
    curriculumId: "egypt-baccalaureate-second-year-physics",
    curriculumName: "Egyptian Baccalaureate 2nd Year Physics",
    part: "part1",
    partLabel: "Part 1 · Term 1 (Mechanics, Waves & Vectors)",
    publisher: "Egyptian Ministry of Education",
    progressPct: 68,
    stageName: "Stage 1: Mechanics & Projectiles",
    status: "ACTIVE",
    lessonsCount: 12,
    completedLessonsCount: 8,
  },
  {
    curriculumId: "egypt-baccalaureate-second-year-physics",
    curriculumName: "Egyptian Baccalaureate 2nd Year Physics",
    part: "part2",
    partLabel: "Part 2 · Term 2 (Gases, Electricity & Quantum)",
    publisher: "Egyptian Ministry of Education",
    progressPct: 15,
    stageName: "Stage 2: Gases & Boyle-Charles",
    status: "ENROLLED",
    lessonsCount: 10,
    completedLessonsCount: 1,
  },
  {
    curriculumId: "cambridge-igcse-0580",
    curriculumName: "Cambridge IGCSE Mathematics 0580",
    part: "full",
    partLabel: "Full Core & Extended Syllabus",
    publisher: "Cambridge Assessment International Education",
    progressPct: 45,
    stageName: "Stage 1: Fractions & Number Skills",
    status: "ENROLLED",
    lessonsCount: 16,
    completedLessonsCount: 7,
  },
  {
    curriculumId: "egypt-secondary1-integrated-science",
    curriculumName: "Egyptian Secondary 1 Integrated Science",
    part: "part1",
    partLabel: "Part 1 · Environmental Systems & Chemistry",
    publisher: "Egyptian Ministry of Education",
    progressPct: 85,
    stageName: "Stage 3: Ecosystem Energy Flow",
    status: "ENROLLED",
    lessonsCount: 8,
    completedLessonsCount: 7,
  },
];

const AVAILABLE_CATALOG_PACKAGES: Omit<StudentTrackInfo, "progressPct" | "status" | "completedLessonsCount">[] = [
  {
    curriculumId: "drama-201",
    curriculumName: "Advanced Dramatic Arts & Monologue Performance",
    part: "full",
    partLabel: "Full Performance & Voice Modules",
    publisher: "National Theatre Arts Board",
    stageName: "Stage 1: Voice Projection & Articulation",
    lessonsCount: 6,
  },
];

interface StudentHomeProps {
  onBrowseServices: () => void;
  onStartLesson: () => void;
  curriculumName: string;
  selectedCurriculumId?: string;
  onSelectTrack?: (curriculumId: string, part: "part1" | "part2" | "full") => void;
}

export default function StudentHome({
  onBrowseServices,
  onStartLesson,
  curriculumName,
  selectedCurriculumId = "egypt-baccalaureate-second-year-physics",
  onSelectTrack,
}: StudentHomeProps) {
  const [tracks, setTracks] = useState<StudentTrackInfo[]>(DEFAULT_TRACKS);
  const [activePart, setActivePart] = useState<"part1" | "part2" | "full">("part1");
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [liveSessions, setLiveSessions] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/sessions")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.sessions)) {
          setLiveSessions(data.sessions);
        }
      })
      .catch(() => {});
  }, []);

  // Active track identification
  const activeTrack =
    tracks.find((t) => t.curriculumId === selectedCurriculumId && t.part === activePart) ||
    tracks.find((t) => t.curriculumId === selectedCurriculumId) ||
    tracks[0];

  const handleSwitchTrack = (track: StudentTrackInfo) => {
    setActivePart(track.part);
    if (onSelectTrack) {
      onSelectTrack(track.curriculumId, track.part);
    }
  };

  const handleEnrollInNewPackage = (pkg: typeof AVAILABLE_CATALOG_PACKAGES[0]) => {
    const newTrack: StudentTrackInfo = {
      ...pkg,
      progressPct: 0,
      completedLessonsCount: 0,
      status: "ENROLLED",
    };
    setTracks((prev) => [...prev, newTrack]);
    setShowCatalogModal(false);
    handleSwitchTrack(newTrack);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ── Top Welcome & Overview ────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
              Student Dashboard
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" /> Session Isolated
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-white">Welcome back, Student</h2>
          <p className="mt-1 text-xs text-neutral-400">
            Select an enrolled study track below to launch a strictly isolated learning session.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowCatalogModal(true)}
            className="flex items-center gap-2 rounded-xl border border-sky-600/50 bg-sky-600/10 px-4 py-2.5 text-xs font-bold text-sky-300 hover:bg-sky-600/20 transition"
          >
            <Plus className="h-4 w-4" /> Register New Track
          </button>
          <button
            onClick={onBrowseServices}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition"
          >
            <Compass className="h-4 w-4" /> Explore Programs
          </button>
        </div>
      </div>

      {/* ── Active Session Lock Card ──────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-neutral-900/90 to-amber-950/20 p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Current Active Learning Session
              </p>
            </div>
            <h3 className="text-xl font-black text-white">
              {activeTrack.curriculumName}
            </h3>
            <p className="text-xs font-semibold text-amber-300/90">
              📌 {activeTrack.partLabel}
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <Lock className="h-3.5 w-3.5 text-amber-400" />
              <span>
                Session is locked strictly to this track. Diagnostic mastery, readiness questions, and lessons from other curriculums are paused with 0% interference.
              </span>
            </div>
          </div>

          <button
            onClick={onStartLesson}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3.5 text-sm font-black text-neutral-950 shadow-lg shadow-amber-500/20 hover:brightness-110 transition shrink-0"
          >
            <PlayCircle className="h-5 w-5" /> Launch Study Session
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400">{activeTrack.stageName}</span>
            <span className="font-mono font-bold text-amber-400">{activeTrack.progressPct}% Complete</span>
          </div>
          <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-500"
              style={{ width: `${activeTrack.progressPct}%` }}
            />
          </div>
        </div>
      </section>

      {/* ── Live Online Classes & Video Sessions ─────────────────── */}
      {liveSessions.length > 0 && (
        <section className="rounded-2xl border border-sky-500/30 bg-neutral-950 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Video className="h-4 w-4 text-sky-400" />
                Live Online Classes & Video Sessions
              </h3>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              {liveSessions.filter((s) => s.status === "live").length > 0 ? "🔴 Live classes in progress" : "Upcoming sessions"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveSessions.map((session) => (
              <div
                key={session.id}
                className={`flex flex-col justify-between rounded-xl border p-4 transition-all ${
                  session.status === "live"
                    ? "border-red-500/50 bg-red-950/20 shadow-lg shadow-red-500/10"
                    : "border-neutral-800 bg-neutral-900/60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        session.status === "live"
                          ? "bg-red-500 text-white animate-pulse"
                          : "bg-sky-500/10 text-sky-300 border border-sky-500/20"
                      }`}
                    >
                      {session.status === "live" ? "🔴 LIVE NOW" : "Scheduled"}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {session.class_name}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{session.title}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-4">
                    <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                    {new Date(session.scheduled_time).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </div>

                <a
                  href={session.meeting_link}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition ${
                    session.status === "live"
                      ? "bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30"
                      : "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700"
                  }`}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {session.status === "live" ? "Join Live Classroom (Zoom/Meet)" : "Meeting Link"}
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── My Registered Curriculum Tracks (Part by Part) ────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              📚 My Registered Curriculum Packages & Parts
            </h3>
            <p className="text-xs text-neutral-400">
              Switch study tracks anytime. Each part retains its own isolated progress and lesson registry.
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-500">{tracks.length} Registered Tracks</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {tracks.map((track, idx) => {
            const isSelected =
              track.curriculumId === selectedCurriculumId && track.part === activePart;

            return (
              <div
                key={`${track.curriculumId}-${track.part}-${idx}`}
                className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                  isSelected
                    ? "border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10"
                    : "border-neutral-800 bg-neutral-900/60 hover:border-neutral-700"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] font-bold uppercase text-neutral-300">
                        {track.part.toUpperCase()}
                      </span>
                      <h4 className="mt-1.5 text-base font-bold text-white">
                        {track.curriculumName}
                      </h4>
                      <p className="text-xs font-medium text-amber-300/80">
                        {track.partLabel}
                      </p>
                      <p className="mt-0.5 text-[11px] text-neutral-500">
                        {track.publisher}
                      </p>
                    </div>

                    {isSelected ? (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="h-3 w-3" /> ACTIVE TRACK
                      </span>
                    ) : (
                      <span className="rounded-full bg-neutral-800 px-2.5 py-1 text-[10px] font-bold text-neutral-400">
                        ENROLLED
                      </span>
                    )}
                  </div>

                  {/* Metrics */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-[11px] text-neutral-400">
                      <span>{track.stageName}</span>
                      <span className="font-mono font-bold text-white">{track.progressPct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isSelected ? "bg-amber-500" : "bg-neutral-600"
                        }`}
                        style={{ width: `${track.progressPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-neutral-500">
                      <span>{track.completedLessonsCount} of {track.lessonsCount} lessons finished</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-800/60 flex items-center justify-between">
                  {isSelected ? (
                    <button
                      onClick={onStartLesson}
                      className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
                    >
                      <PlayCircle className="h-4 w-4" /> Continue Active Session →
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSwitchTrack(track)}
                      className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800/80 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-neutral-700 transition"
                    >
                      <Rocket className="h-3.5 w-3.5 text-sky-400" /> Switch & Launch Session
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Catalog Registration Modal ───────────────────────── */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="max-h-[85vh] w-full max-w-2xl rounded-2xl border border-neutral-700 bg-neutral-950 p-6 shadow-2xl overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Register for a New Study Track</h3>
                <p className="text-xs text-neutral-400">
                  Select a curriculum package or part to add it to your enrolled tracks.
                </p>
              </div>
              <button
                onClick={() => setShowCatalogModal(false)}
                className="rounded-lg p-1.5 text-neutral-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {AVAILABLE_CATALOG_PACKAGES.map((pkg) => (
                <div
                  key={pkg.curriculumId}
                  className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white">{pkg.curriculumName}</h4>
                    <p className="text-xs text-sky-300">{pkg.partLabel}</p>
                    <p className="text-[11px] text-neutral-500">{pkg.publisher} · {pkg.lessonsCount} lessons</p>
                  </div>
                  <button
                    onClick={() => handleEnrollInNewPackage(pkg)}
                    className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-500 transition"
                  >
                    <Plus className="h-4 w-4" /> Enroll & Register
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
