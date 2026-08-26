"use client";

import { Compass, PlayCircle } from "lucide-react";

interface StudentHomeProps {
  onBrowseServices: () => void;
  onStartLesson: () => void;
  curriculumName: string;
}

export default function StudentHome({ onBrowseServices, onStartLesson, curriculumName }: StudentHomeProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-500">Student home</p><h2 className="mt-1 text-2xl font-bold text-white">Welcome back, Daniel</h2><p className="mt-1 text-sm text-neutral-400">Your next best action is ready.</p></div><button onClick={onBrowseServices} className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-bold text-neutral-950"><Compass className="h-4 w-4" /> Explore programs</button></div>
      <section className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Recommended next action</p><h3 className="mt-2 text-lg font-bold text-white">Continue {curriculumName}</h3><p className="mt-1 text-xs text-neutral-400">Your next lesson is prepared for the curriculum assigned to your account.</p></div><button onClick={onStartLesson} className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-neutral-950"><PlayCircle className="h-4 w-4" /> Start lesson</button></div></section>
      <section className="rounded-xl border border-neutral-800 bg-neutral-950 p-5"><h3 className="text-sm font-bold text-white">My program</h3><div className="mt-4 rounded-lg bg-neutral-900 p-4"><div className="flex items-start justify-between"><div><p className="text-sm font-semibold text-white">{curriculumName}</p><p className="mt-1 text-xs text-neutral-500">Your assigned learning curriculum</p></div><span className="text-[10px] font-bold text-emerald-400">ACTIVE</span></div><div className="mt-4 h-1.5 rounded-full bg-neutral-800"><div className="h-full w-[62%] rounded-full bg-emerald-500" /></div><p className="mt-2 text-right text-[10px] text-neutral-500">Assigned curriculum · 62%</p></div></section>
    </div>
  );
}
