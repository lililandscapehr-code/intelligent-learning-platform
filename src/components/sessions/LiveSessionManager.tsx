"use client";

import React, { useState, useEffect } from "react";
import { ClassRegistry, LiveSession, ClassRecord } from "../../core/services/class-registry";
import EducationalCarousel from "../carousel/EducationalCarousel";
import { 
  Video, 
  Calendar, 
  Clock, 
  ExternalLink, 
  Plus, 
  Users, 
  CheckCircle, 
  Sparkles, 
  Radio, 
  X, 
  Layers, 
  BookOpen, 
  Tv, 
  ClipboardCheck,
  Globe,
  Share2
} from "lucide-react";

interface LiveSessionManagerProps {
  userRole: "TEACHER" | "STUDENT" | "ADMIN";
  studentId?: string;
  teacherId?: string;
  onOpenCompanionCarousel?: (carouselId: string) => void;
}

export default function LiveSessionManager({
  userRole,
  studentId = "std_001",
  teacherId = "teacher_1",
  onOpenCompanionCarousel
}: LiveSessionManagerProps) {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [teacherClasses, setTeacherClasses] = useState<ClassRecord[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [activeCompanionSession, setActiveCompanionSession] = useState<LiveSession | null>(null);

  // New Session Form State
  const [selectedClassId, setSelectedClassId] = useState("");
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDesc, setSessionDesc] = useState("");
  const [meetingPlatform, setMeetingPlatform] = useState<"google-meet" | "zoom" | "teams" | "custom">("google-meet");
  const [meetingLink, setMeetingLink] = useState("https://meet.google.com/abc-defg-hij");
  const [scheduledDateTime, setScheduledDateTime] = useState("");
  const [durationMins, setDurationMins] = useState(60);

  const loadSessions = () => {
    if (userRole === "STUDENT") {
      setSessions(ClassRegistry.getSessionsForStudent(studentId));
    } else {
      const clsList = ClassRegistry.getClassesByTeacher(teacherId);
      setTeacherClasses(clsList);
      if (clsList.length > 0) {
        setSelectedClassId(clsList[0].id);
        const allSessions = clsList.flatMap(c => ClassRegistry.getSessionsForClass(c.id));
        setSessions(allSessions);
      }
    }
  };

  useEffect(() => {
    loadSessions();
  }, [userRole, studentId, teacherId]);

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId || !sessionTitle || !meetingLink) return;

    ClassRegistry.createSession({
      classId: selectedClassId,
      title: sessionTitle,
      description: sessionDesc,
      scheduledTime: scheduledDateTime || new Date(Date.now() + 3600000).toISOString(),
      meetingLink,
      platform: meetingPlatform,
      durationMinutes: durationMins,
      status: "scheduled",
      attendeeStudentIds: []
    });

    loadSessions();
    setShowScheduleModal(false);
    setSessionTitle("");
    setSessionDesc("");
  };

  const handleJoinSession = (session: LiveSession) => {
    ClassRegistry.joinLiveSession(session.id, studentId);
    window.open(session.meetingLink, "_blank");
    loadSessions();
  };

  const getPlatformBadge = (platform: LiveSession["platform"]) => {
    switch (platform) {
      case "google-meet":
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center gap-1 border border-emerald-500/30">🟢 Google Meet</span>;
      case "zoom":
        return <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px] flex items-center gap-1 border border-sky-500/30">🔵 Zoom</span>;
      case "teams":
        return <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 font-bold text-[10px] flex items-center gap-1 border border-purple-500/30">🟣 MS Teams</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px] flex items-center gap-1 border border-amber-500/30">🔗 Direct Link</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER & ACTION BAR ── */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Video className="h-6 w-6 text-amber-500" />
            Live Classroom Sessions
            <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
              SMART HYBRID MODEL
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Google Meet & Zoom video streams paired with in-platform interactive slides and real-time quizzes.
          </p>
        </div>

        {userRole !== "STUDENT" && (
          <button
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition shadow-lg"
          >
            <Plus className="h-4 w-4" /> Schedule New Live Class
          </button>
        )}
      </div>

      {/* ── LIVE & UPCOMING SESSIONS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((session) => {
          const isLive = session.status === "live";
          const isAttending = session.attendeeStudentIds?.includes(studentId);

          return (
            <div 
              key={session.id}
              className={`bg-neutral-900/90 border rounded-2xl p-5 space-y-4 transition-all relative ${
                isLive ? "border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.15)]" : "border-neutral-800 hover:border-neutral-700"
              }`}
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                {getPlatformBadge(session.platform)}
                {isLive ? (
                  <span className="flex items-center gap-1.5 text-xs font-extrabold text-red-500 bg-red-950/80 border border-red-500/40 px-3 py-1 rounded-full animate-pulse">
                    <Radio className="h-3.5 w-3.5 animate-spin" /> LIVE NOW
                  </span>
                ) : (
                  <span className="text-[11px] text-neutral-400 flex items-center gap-1 font-medium">
                    <Clock className="h-3.5 w-3.5 text-amber-500" /> {new Date(session.scheduledTime).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-bold text-white text-base mb-1">{session.title}</h3>
                {session.description && <p className="text-xs text-neutral-400 leading-relaxed">{session.description}</p>}
              </div>

              {/* Attendance & Duration */}
              <div className="flex items-center justify-between text-xs text-neutral-400 pt-3 border-t border-neutral-800">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-sky-400" />
                  <strong>{session.attendeeStudentIds?.length || 0}</strong> students joined
                </span>
                <span>⏱️ {session.durationMinutes || 60} mins</span>
              </div>

              {/* Actions: Join Video & Companion Overlay */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  onClick={() => handleJoinSession(session)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-md"
                >
                  <ExternalLink className="h-4 w-4" />
                  Join {session.platform === "google-meet" ? "Google Meet" : session.platform === "zoom" ? "Zoom" : "Live Video"}
                </button>

                <button
                  onClick={() => setActiveCompanionSession(session)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700 font-bold rounded-xl text-xs transition"
                >
                  <Tv className="h-4 w-4" /> Open In-Platform Companion
                </button>
              </div>
            </div>
          );
        })}

        {sessions.length === 0 && (
          <div className="col-span-full py-16 text-center border border-dashed border-neutral-800 rounded-2xl space-y-2">
            <Video className="h-8 w-8 mx-auto text-neutral-600" />
            <p className="text-white font-bold text-sm">No live sessions scheduled</p>
            <p className="text-neutral-500 text-xs">Teachers can schedule Google Meet or Zoom live classes anytime.</p>
          </div>
        )}
      </div>

      {/* ── HYBRID COMPANION MODAL (LIVE SLIDES & QUIZ SYNC WHILE ON MEET) ── */}
      {activeCompanionSession && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col p-4 animate-in fade-in">
          {/* Companion Header */}
          <header className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-amber-500 flex items-center justify-center text-neutral-950 font-black">Ω</div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  {activeCompanionSession.title}
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    IN-PLATFORM LIVE COMPANION
                  </span>
                </h3>
                <p className="text-xs text-neutral-400">Keep this tab open next to your Google Meet / Zoom window for live interactive slides & quizzes.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.open(activeCompanionSession.meetingLink, "_blank")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Launch Video Window
              </button>
              <button
                onClick={() => setActiveCompanionSession(null)}
                className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-xl text-xs"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Interactive Companion View */}
          <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 overflow-y-auto flex items-center justify-center">
            <div className="w-full max-w-4xl space-y-4">
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-300 text-xs flex items-center justify-between">
                <span>⚡ Interactive slides and real-time diagnostic questions are synchronized with the live class.</span>
                <span className="font-bold text-emerald-400">✓ Attendance Logged</span>
              </div>
              <EducationalCarousel
                config={{
                  id: activeCompanionSession.attachedCarouselId || "CAROUSEL-LIVE-COMPANION",
                  title: activeCompanionSession.title,
                  skillId: "SKILL-PHYS-VECTORS",
                  blueprintId: "BLUEPRINT-BAC-2",
                  showProgressBar: true,
                  showScoreTally: true,
                  sequenceMode: "SEQUENTIAL",
                  slides: [
                    {
                      id: "comp-1",
                      type: "lesson_text",
                      title: activeCompanionSession.title,
                      body: "Follow along on this interactive slide while the teacher presents on Google Meet / Zoom.",
                      learningObjective: "Participate in real-time worked examples and questions.",
                      keyTerms: ["Live Classroom", "Synchronized Companion", "3-Case Diagnostic"],
                      theme: "amber"
                    }
                  ]
                }}
                onComplete={() => {}}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── SCHEDULE NEW SESSION MODAL ── */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Video className="h-5 w-5 text-amber-500" /> Schedule Live Package Class
                </h3>
                <p className="text-xs text-neutral-400">Attach Google Meet, Zoom, or Teams link to package</p>
              </div>
              <button onClick={() => setShowScheduleModal(false)} className="text-neutral-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Select Package</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                >
                  {teacherClasses.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.curriculumPackageName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Session Title</label>
                <input
                  type="text" required value={sessionTitle} onChange={(e) => setSessionTitle(e.target.value)}
                  placeholder="e.g. Problem Solving: Trajectories & Forces"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Description (optional)</label>
                <textarea
                  rows={2} value={sessionDesc} onChange={(e) => setSessionDesc(e.target.value)}
                  placeholder="What topics will be covered live..."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Video Platform</label>
                  <select
                    value={meetingPlatform}
                    onChange={(e) => setMeetingPlatform(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                  >
                    <option value="google-meet">🟢 Google Meet</option>
                    <option value="zoom">🔵 Zoom</option>
                    <option value="teams">🟣 MS Teams</option>
                    <option value="custom">🔗 Custom Link</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Duration (minutes)</label>
                  <input
                    type="number" value={durationMins} onChange={(e) => setDurationMins(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Meeting URL</label>
                <input
                  type="url" required value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-neutral-800">
                <button type="button" onClick={() => setShowScheduleModal(false)} className="px-4 py-2 rounded-lg bg-neutral-800 text-white font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold">
                  Schedule Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
