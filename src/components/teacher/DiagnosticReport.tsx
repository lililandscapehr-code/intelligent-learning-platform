"use client";

import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  Filter,
  Loader2,
  RefreshCw,
  Sparkles,
  TrendingDown,
  Users,
  XCircle,
  HelpCircle,
} from "lucide-react";

interface StudentSummary {
  id: string;
  name: string;
  email: string;
  totalAttempts: number;
  correctCount: number;
  wrongCount: number;
  maxAltLevel: number;
  diagnosticHits: Record<string, number>;
}

interface QuestionSummary {
  slideId: string;
  carouselId: string;
  totalAttempts: number;
  uniqueStudentCount: number;
  failingStudentCount: number;
  passRate: number;
  highestAltUsed: number;
  diagnosticCounts: Record<string, number>;
  commonWrongAnswers: string[];
}

interface ReportData {
  totalLogs: number;
  students: StudentSummary[];
  questionSummaries: QuestionSummary[];
  strugglingCount: number;
  aiDiagnosticInsight?: string;
}

export default function DiagnosticReport() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentSummary | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/teacher/diagnostic-report");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load report");
      setData(json);
    } catch (err: any) {
      setError(err.message || "Error fetching diagnostic data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center gap-3 text-sm text-neutral-400">
        <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
        Analysing student learning patterns & failure diagnostics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-800/40 bg-rose-950/20 p-6 text-center">
        <p className="text-sm font-semibold text-rose-300">Failed to load diagnostics</p>
        <p className="mt-1 text-xs text-rose-400/80">{error}</p>
        <button
          onClick={fetchReport}
          className="mt-4 rounded-lg bg-neutral-800 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const students = data?.students || [];
  const questions = data?.questionSummaries || [];

  return (
    <div className="space-y-6">
      {/* ── Top Metric Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Total Attempts Tracked</span>
            <Users className="h-4 w-4 text-sky-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white font-mono">{data?.totalLogs || 0}</p>
          <p className="mt-1 text-[11px] text-neutral-500">Across all carousels & alternatives</p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Students Flagged</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-300 font-mono">{data?.strugglingCount || 0}</p>
          <p className="mt-1 text-[11px] text-neutral-500">Used Level A-2+ scaffolds or had repeated misses</p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Questions Analyzed</span>
            <HelpCircle className="h-4 w-4 text-violet-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-violet-300 font-mono">{questions.length}</p>
          <p className="mt-1 text-[11px] text-neutral-500">Active interactive assessment items</p>
        </div>
      </div>

      {/* ── AI Diagnostic Synthesis Card ────────────────────── */}
      {data?.aiDiagnosticInsight && (
        <div className="rounded-xl border border-violet-700/40 bg-gradient-to-r from-violet-950/40 via-neutral-900/60 to-violet-950/20 p-5 space-y-3 shadow-lg shadow-violet-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-violet-300">
                AI Cognitive Root Cause Synthesis
              </h3>
            </div>
            <button
              onClick={fetchReport}
              className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white transition"
            >
              <RefreshCw className="h-3 w-3" /> Refresh
            </button>
          </div>

          <div className="whitespace-pre-line text-xs text-neutral-200 leading-relaxed font-sans bg-neutral-950/50 p-4 rounded-lg border border-neutral-800">
            {data.aiDiagnosticInsight}
          </div>
        </div>
      )}

      {/* ── Students Diagnostic Heatmap / Matrix ─────────────── */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden">
        <div className="border-b border-neutral-800 px-5 py-3.5 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
            👨‍🎓 Student Failure Patterns & Scaffolding Reached
          </h3>
          <span className="text-[11px] text-neutral-500">{students.length} students enrolled</span>
        </div>

        {students.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500">
            No student attempts logged yet. As students take carousels, failure patterns and diagnostic data will populate here automatically.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 font-semibold">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Attempts</th>
                  <th className="px-4 py-3">Accuracy</th>
                  <th className="px-4 py-3">Max Scaffold Reached</th>
                  <th className="px-4 py-3">Dominant Vulnerability</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {students.map((student) => {
                  const accuracy = student.totalAttempts > 0
                    ? Math.round((student.correctCount / student.totalAttempts) * 100)
                    : 100;
                  
                  // Top diagnostic hit
                  const topTarget = Object.entries(student.diagnosticHits || {}).sort((a, b) => b[1] - a[1])[0]?.[0];

                  const isStruggling = student.wrongCount > 0 || student.maxAltLevel >= 2;

                  return (
                    <tr
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className="cursor-pointer hover:bg-neutral-800/40 transition"
                    >
                      <td className="px-4 py-3 font-semibold text-white">
                        {student.name}
                        <span className="block text-[10px] text-neutral-500 font-normal">{student.email}</span>
                      </td>
                      <td className="px-4 py-3 text-neutral-300 font-mono">{student.totalAttempts}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-mono font-bold ${
                            accuracy >= 80 ? "text-emerald-400" : accuracy >= 50 ? "text-amber-400" : "text-rose-400"
                          }`}
                        >
                          {accuracy}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {student.maxAltLevel > 1 ? (
                          <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                            Level A-{student.maxAltLevel}
                          </span>
                        ) : (
                          <span className="text-neutral-500 text-[11px]">Level 1 (Master)</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {topTarget ? (
                          <span className="rounded bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-violet-300">
                            {topTarget}
                          </span>
                        ) : (
                          <span className="text-neutral-500 text-[11px]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isStruggling ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                            <AlertTriangle className="h-3 w-3" /> Needs Review
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> On Track
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Question Diagnostics Summary ──────────────────────── */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
          🎯 Question-Level Failure Hotspots
        </h3>

        {questions.length === 0 ? (
          <p className="text-xs text-neutral-500">No question analytics recorded yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {questions.map((q) => (
              <div
                key={q.slideId}
                className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-400">{q.slideId}</span>
                  <span
                    className={`text-xs font-mono font-bold ${
                      q.passRate >= 75 ? "text-emerald-400" : q.passRate >= 50 ? "text-amber-400" : "text-rose-400"
                    }`}
                  >
                    {q.passRate}% Pass Rate
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span>{q.totalAttempts} total trials</span>
                  <span>{q.failingStudentCount} students needed scaffolding</span>
                </div>

                {q.commonWrongAnswers.length > 0 && (
                  <div className="rounded bg-neutral-900 p-2 text-[10px] text-neutral-400">
                    <span className="font-bold text-neutral-300">Common Wrong Answers: </span>
                    {q.commonWrongAnswers.join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
