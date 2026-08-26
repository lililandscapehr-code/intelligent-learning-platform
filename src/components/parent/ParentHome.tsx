"use client";

import React, { useState } from "react";
import { 
  Bell, 
  CalendarDays, 
  CheckCircle2, 
  MessageSquare, 
  ShieldCheck, 
  Award, 
  BarChart3, 
  Zap, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  FileCheck,
  Download,
  Sparkles,
  ShoppingBag
} from "lucide-react";

interface ParentHomeProps {
  onChooseProgram: () => void;
}

export default function ParentHome({ onChooseProgram }: ParentHomeProps) {
  const [activeReportTab, setActiveReportTab] = useState<"overview" | "specialized-report">("specialized-report");

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400">Parent diagnostic portal</p>
          <h2 className="mt-1 text-2xl font-bold text-white">Daniel's Learning Evaluation</h2>
          <p className="mt-1 text-sm text-neutral-400">Detailed cognitive diagnostics, learning velocity, and specialized evaluations.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveReportTab("specialized-report")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeReportTab === "specialized-report"
                ? "bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20"
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Specialized Cognitive Report
          </button>
          <button 
            onClick={onChooseProgram} 
            className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-emerald-400 transition"
          >
            Manage Programs
          </button>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-neutral-300">
        <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
        <p>Verified Parent Portal: Multi-parameter cognitive evaluations are certified by educational AI diagnostic engines and educator audits.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Overall Mastery Index", value: "78%", sub: "Top quartile across peer group", icon: Award, color: "text-amber-400" },
          { label: "Cognitive Fluency", value: "Slow & Accurate", sub: "Thorough reasoning, needs speed drills", icon: Clock, color: "text-sky-400" },
          { label: "Scaffolding Dependency", value: "Low (1.2 retries)", sub: "Mostly solves on 1st or 2nd trial", icon: Zap, color: "text-emerald-400" },
          { label: "Active Misconceptions", value: "1 Resolved / 1 Active", sub: "Unit conversion check recommended", icon: AlertTriangle, color: "text-rose-400" }
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500">{label}</span>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <p className="text-lg font-bold text-white pt-1">{value}</p>
            <p className="text-[11px] text-neutral-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* SPECIALIZED MULTI-PARAMETER REPORT (PAID EVALUATION FEATURE) */}
      <section className="rounded-2xl border border-amber-500/30 bg-neutral-950 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Certified Multi-Parameter Evaluation
              </span>
              <span className="text-neutral-500 text-xs">Report ID: #EB-EVAL-2026-994</span>
            </div>
            <h3 className="mt-2 text-xl font-black text-white">Egyptian Baccalaureate Physics (2nd Secondary) — Diagnostic Profile</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Evaluation module: Boyle-Charles Law, Fluid Pressure & Mechanics Inquiry</p>
          </div>

          <button className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-3.5 py-2 text-xs font-bold text-neutral-200 hover:bg-neutral-800 transition">
            <Download className="h-3.5 w-3.5" />
            Download Official PDF Report
          </button>
        </div>

        {/* 6-Parameter Performance Radar Matrix */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">1. Multi-Parameter Cognitive Radar</h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Prerequisite Readiness", score: 85, color: "bg-emerald-500", desc: "Solid arithmetic, SI units, and basic algebra foundations." },
              { name: "Conceptual Depth", score: 80, color: "bg-sky-500", desc: "Understands physical models (gas kinetic collisions, equilibrium of forces)." },
              { name: "Mathematical Execution", score: 62, color: "bg-amber-500", desc: "Algebraic substitution error: substituted Celsius instead of Kelvin." },
              { name: "Inquiry & Prediction", score: 92, color: "bg-purple-500", desc: "Excellent scientific intuition: correctly committed prediction before observation." },
              { name: "Real-World Transfer", score: 75, color: "bg-rose-500", desc: "Successfully mapped law to cruising airplane cabin pressure changes." },
              { name: "Cognitive Fluency", score: 58, color: "bg-teal-500", desc: "Takes 52s avg per item (High precision, low automaticity)." }
            ].map((param) => (
              <div key={param.name} className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{param.name}</span>
                  <span className="font-black text-amber-400">{param.score}%</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div className={`h-full ${param.color}`} style={{ width: `${param.score}%` }} />
                </div>
                <p className="text-[11px] text-neutral-400 leading-4">{param.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trial-to-Solution Scaffolding Evaluation */}
        <div className="grid md:grid-cols-2 gap-5 pt-2">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              2. Trial & Scaffolding Dependency
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">First-Attempt Solves:</span>
                <span className="font-bold text-white">4 / 6 items (67%)</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Scaffolded Solves (after 1 hint):</span>
                <span className="font-bold text-white">2 / 6 items (33%)</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Average Response Time:</span>
                <span className="font-bold text-white">48.5 seconds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Scaffolding Dependency Index:</span>
                <span className="font-bold text-emerald-400">LOW (Independent learner)</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              3. Flagged Misconception & Root Cause
            </h4>
            <div className="space-y-2 text-xs">
              <p className="font-bold text-white">Temperature Unit Conversion (<code>PHYS-TEMP-CELSIUS-KELVIN</code>)</p>
              <p className="text-neutral-300 leading-relaxed">
                Daniel substituted 25 °C directly into pV/T = constant instead of converting to absolute temperature (25 + 273 = 298 K).
              </p>
              <div className="pt-2 border-t border-rose-500/20 text-[11px] text-amber-300">
                <strong>Recommended Home Check:</strong> Remind the student to check SI units before formula substitution.
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Next Steps */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-2 text-xs">
          <p className="font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Teacher & Home Action Guidance
          </p>
          <p className="text-neutral-200 leading-5">
            Daniel has strong conceptual curiosity and commits bold scientific predictions. To reach Grade 11 Baccalaureate distinction, encourage 15 minutes of Kelvin/Celsius unit drills and force-balance diagram practice before Chapter 2 (Oscillations and Waves).
          </p>
        </div>
      </section>

      {/* Program Summary & Teacher Notes */}
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
          <h3 className="text-sm font-bold text-white">Enrolled Programs</h3>
          <div className="mt-4 rounded-lg bg-neutral-900 p-4">
            <p className="text-sm font-semibold text-white">Egyptian Baccalaureate Physics — Year 1 (Grade 11)</p>
            <p className="mt-1 text-xs text-neutral-500">Teacher: Dr. Mahmoud · Semester 1 & 2 Unified Track</p>
            <div className="mt-4 h-1.5 rounded-full bg-neutral-800">
              <div className="h-full w-[78%] rounded-full bg-emerald-500" />
            </div>
            <p className="mt-2 text-right text-[10px] text-neutral-500">78% syllabus complete</p>
          </div>
        </section>

        <section className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
          <h3 className="text-sm font-bold text-white">Educator Communication</h3>
          <p className="mt-4 rounded-lg bg-neutral-900 p-4 text-xs leading-5 text-neutral-300">
            "Daniel is demonstrating excellent inquiry engagement during explore activities. His prediction accuracy is in the 90th percentile. We are reinforcing absolute temperature calculations."
          </p>
          <p className="mt-2 text-[10px] text-neutral-500">Certified by Dr. Mahmoud · Yesterday</p>
        </section>
      </div>
    </div>
  );
}
