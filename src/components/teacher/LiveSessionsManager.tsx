"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Video, Calendar, Link as LinkIcon, Plus, PlayCircle, CheckCircle, Trash2, Loader2 } from "lucide-react";

interface LiveSession {
  id: string;
  teacher_email: string;
  title: string;
  class_name: string;
  scheduled_time: string;
  meeting_link: string;
  status: "scheduled" | "live" | "completed";
}

interface LiveSessionsManagerProps {
  teacherEmail?: string;
}

export default function LiveSessionsManager({ teacherEmail }: LiveSessionsManagerProps) {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newClassName, setNewClassName] = useState("");
  const [error, setError] = useState("");

  // Resolve teacher email from prop or browser storage (set during login)
  const email = teacherEmail || (typeof window !== "undefined" ? localStorage.getItem("teacher_email") || "teacher@example.com" : "teacher@example.com");

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sessions?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch {
      setError("Could not load sessions.");
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate || !newLink || !newClassName) return;
    setSaving(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherEmail: email,
          title: newTitle,
          className: newClassName,
          scheduledTime: newDate,
          meetingLink: newLink,
        }),
      });
      const data = await res.json();
      if (data.id) {
        setIsCreating(false);
        setNewTitle(""); setNewDate(""); setNewLink(""); setNewClassName("");
        await fetchSessions();
      }
    } catch { setError("Could not create session."); }
    finally { setSaving(false); }
  };

  const updateStatus = async (id: string, status: LiveSession["status"]) => {
    await fetch("/api/sessions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setSessions(s => s.map(x => x.id === id ? { ...x, status } : x));
  };

  const deleteSession = async (id: string) => {
    if (!confirm("Delete this session?")) return;
    await fetch(`/api/sessions?id=${id}`, { method: "DELETE" });
    setSessions(s => s.filter(x => x.id !== id));
  };

  const getStatusBadge = (status: LiveSession["status"]) => {
    switch (status) {
      case "scheduled": return <span className="px-2 py-1 bg-sky-500/20 text-sky-400 text-xs rounded-md font-medium">Scheduled</span>;
      case "live": return <span className="px-2 py-1 bg-red-500/20 text-red-400 font-bold text-xs rounded-md animate-pulse">🔴 LIVE NOW</span>;
      case "completed": return <span className="px-2 py-1 bg-neutral-700 text-neutral-400 text-xs rounded-md">Completed</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Live Online Sessions</h1>
          <p className="text-neutral-400 text-sm">
            Schedule Zoom/Teams/Meet sessions for your classes. Sessions are saved to your account and accessible from any machine.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-colors text-sm"
        >
          <Plus className="h-4 w-4" /> Schedule Session
        </button>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {/* Create Form */}
      {isCreating && (
        <div className="bg-neutral-900 border border-amber-500/30 rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-bold text-white mb-2">New Session</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Session Title</label>
                <input
                  required type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Chapter 2 Live Review"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Class Name</label>
                <input
                  required type="text" value={newClassName} onChange={e => setNewClassName(e.target.value)}
                  placeholder="e.g. Year 11 Physics - Section A"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Date & Time</label>
                <input
                  required type="datetime-local" value={newDate} onChange={e => setNewDate(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Meeting Link (Zoom / Teams / Meet)</label>
                <input
                  required type="url" value={newLink} onChange={e => setNewLink(e.target.value)}
                  placeholder="https://zoom.us/j/..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit" disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors text-sm disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                {saving ? "Saving..." : "Save Session"}
              </button>
              <button
                type="button" onClick={() => setIsCreating(false)}
                className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sessions Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-neutral-500">
          <Loader2 className="h-6 w-6 animate-spin mr-3" /> Loading sessions...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {sessions.map(session => (
            <div key={session.id} className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 hover:border-neutral-600 transition-colors flex flex-col">
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="bg-neutral-800 p-2 rounded-lg">
                  <Video className="h-5 w-5 text-amber-400" />
                </div>
                {getStatusBadge(session.status)}
              </div>

              <h3 className="text-base font-bold text-white mb-1 leading-snug">{session.title}</h3>
              <p className="text-sm text-neutral-400 mb-4">{session.class_name}</p>

              <div className="space-y-2 mb-5 flex-1">
                <div className="flex items-center gap-2 text-sm text-neutral-300">
                  <Calendar className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                  {new Date(session.scheduled_time).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                </div>
                <div className="flex items-center gap-2 text-sm truncate">
                  <LinkIcon className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                  <a href={session.meeting_link} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline truncate">
                    {session.meeting_link}
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-neutral-800 pt-3 flex gap-2">
                {session.status === "scheduled" && (
                  <button
                    onClick={() => updateStatus(session.id, "live")}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded-lg font-semibold text-xs transition-colors"
                  >
                    <PlayCircle className="h-4 w-4" /> Go Live
                  </button>
                )}
                {session.status === "live" && (
                  <button
                    onClick={() => updateStatus(session.id, "completed")}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg font-semibold text-xs transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" /> End Session
                  </button>
                )}
                {session.status === "completed" && (
                  <span className="flex-1 text-center text-xs text-neutral-500 py-2">Session ended</span>
                )}
                <button
                  onClick={() => deleteSession(session.id)}
                  className="p-2 text-neutral-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete session"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {sessions.length === 0 && !isCreating && (
            <div className="col-span-full py-16 text-center border border-dashed border-neutral-800 rounded-xl text-neutral-500">
              <Video className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No sessions yet.</p>
              <p className="text-sm mt-1">Click <strong className="text-amber-500">Schedule Session</strong> to create your first one.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
