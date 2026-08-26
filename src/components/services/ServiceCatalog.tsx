"use client";

import { useState } from "react";
import { BadgeCheck, CalendarDays, CheckCircle2, Clock, CreditCard, Gift, HeartHandshake, ShoppingBag, ShieldCheck } from "lucide-react";

interface ServiceOffer {
  id: string;
  title: string;
  category: "DIAGNOSTIC" | "ONE_TIME" | "CHAPTER" | "PACKAGE" | "PROGRAM";
  description: string;
  duration: string;
  sessions: string;
  price: string;
  access: string[];
  bestFor: string;
  recommended?: boolean;
  paymentRequired: boolean;
}

interface CarouselPackage {
  id: string;
  scale: "MINI" | "MEDIUM" | "LARGE";
  title: string;
  subtitle: string;
  scope: string;
  price: string;
  includes: string[];
  bestFor: string;
}

const carouselPackages: CarouselPackage[] = [
  { id: "CAROUSEL-MINI", scale: "MINI", title: "Lesson Carousel", subtitle: "One focused learning process", scope: "One lesson or one key idea", price: "$9", includes: ["Any number of slides", "One demonstration", "One practice check", "One evaluation", "Teacher review"], bestFor: "A single gap or a first learning experience." },
  { id: "CAROUSEL-MEDIUM", scale: "MEDIUM", title: "Lesson Group", subtitle: "Connected carousels with one learning route", scope: "One section or related lessons", price: "$29", includes: ["Any number of slides and carousels", "Multiple demonstrations", "Readiness and retry checks", "Section progress report", "Teacher review for each process"], bestFor: "A student who needs a complete section with support." },
  { id: "CAROUSEL-LARGE", scale: "LARGE", title: "Chapter Journey", subtitle: "A complete chapter learning experience", scope: "One chapter or several connected sections", price: "$79", includes: ["Any number of slides and carousels", "Chapter process map", "Differentiated routes", "Chapter evaluation", "Parent-safe progress summary", "Teacher and AI preparation support"], bestFor: "Families ready for a structured chapter pathway." }
];

const offers: ServiceOffer[] = [
  {
    id: "OFFER-DIAGNOSTIC-0580",
    title: "Free readiness diagnostic",
    category: "DIAGNOSTIC",
    description: "A calm first step to understand what the learner already knows and what support will help next.",
    duration: "20 minutes",
    sessions: "1 assessment",
    price: "Free",
    access: ["Readiness result", "Starting-stage recommendation", "Private teacher note", "No paid commitment"],
    bestFor: "Families who want evidence before choosing.",
    paymentRequired: false
  },
  {
    id: "OFFER-ONE-LESSON",
    title: "One focused lesson",
    category: "ONE_TIME",
    description: "A single, low-pressure lesson built around one readiness gap or one difficult idea.",
    duration: "60 minutes",
    sessions: "1 live session",
    price: "$12",
    access: ["One teacher session", "Simple explanation and practice", "Session evaluation", "Next-step recommendation"],
    bestFor: "A learner who needs one clear win.",
    paymentRequired: true
  },
  {
    id: "OFFER-CHAPTER-FOCUS",
    title: "Chapter Focus",
    category: "CHAPTER",
    description: "A complete guided route through one chapter, with readiness, lessons, practice, and a gentle review.",
    duration: "3-4 weeks",
    sessions: "6-8 sessions",
    price: "$69",
    access: ["Chapter readiness check", "Teacher-guided lessons", "Practice and feedback", "Parent progress summary"],
    bestFor: "A family testing the learning partnership.",
    paymentRequired: true
  },
  {
    id: "OFFER-SEMESTER-PATH",
    title: "Semester Learning Path",
    category: "PACKAGE",
    description: "Several connected chapters with space for retrieval, support, and progress conversations.",
    duration: "One semester",
    sessions: "24 sessions",
    price: "$179",
    access: ["All semester chapters", "Assigned teacher", "Readiness and progress checks", "Monthly parent update"],
    bestFor: "Learners who benefit from steady weekly rhythm.",
    recommended: true,
    paymentRequired: true
  },
  {
    id: "OFFER-FULL-YEAR",
    title: "Full Guided Year",
    category: "PROGRAM",
    description: "A complete year of supported learning, with chapter choices guided by evidence rather than pressure.",
    duration: "Full academic year",
    sessions: "48 sessions",
    price: "$299",
    access: ["All selected chapters", "Assigned teacher", "Evaluations and tests", "Family progress reviews", "Flexible support route"],
    bestFor: "Families looking for continuity and one trusted plan.",
    paymentRequired: true
  }
];

const categoryLabels: Record<ServiceOffer["category"], string> = {
  DIAGNOSTIC: "Start here",
  ONE_TIME: "One session",
  CHAPTER: "One chapter",
  PACKAGE: "Short package",
  PROGRAM: "Long-term program"
};

export default function ServiceCatalog({ curriculumName }: { curriculumName: string }) {
  const [selectedOffer, setSelectedOffer] = useState<ServiceOffer | null>(null);
  const [enrollment, setEnrollment] = useState<ServiceOffer | null>(null);
  const [audience, setAudience] = useState<"STUDENT" | "PARENT">("PARENT");

  function registerOffer() {
    if (!selectedOffer) return;
    setEnrollment(selectedOffer);
    setSelectedOffer(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-500">Learning services</p>
          <h2 className="mt-1 text-2xl font-bold text-white">Choose how you want to learn</h2>
          <p className="mt-1 max-w-2xl text-sm text-neutral-400">Choose the smallest helpful next step for {curriculumName}. Every paid path starts with clear goals and teacher-visible progress.</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-400"><ShoppingBag className="h-4 w-4 text-amber-400" /> Student service catalog</div>
      </div>

      <section className="grid gap-3 md:grid-cols-3">
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4"><ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" /><div><p className="text-xs font-bold text-white">Private and respectful</p><p className="mt-1 text-xs leading-5 text-neutral-400">Only approved progress is shared with the family.</p></div></div>
        <div className="flex items-start gap-3 rounded-xl border border-sky-500/20 bg-sky-500/5 p-4"><HeartHandshake className="h-5 w-5 shrink-0 text-sky-400" /><div><p className="text-xs font-bold text-white">No pressure to upgrade</p><p className="mt-1 text-xs leading-5 text-neutral-400">Start with one useful step and decide later.</p></div></div>
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4"><Gift className="h-5 w-5 shrink-0 text-amber-400" /><div><p className="text-xs font-bold text-white">Evidence before commitment</p><p className="mt-1 text-xs leading-5 text-neutral-400">The free readiness check recommends a suitable route.</p></div></div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Who is choosing?</p><p className="mt-1 text-xs text-neutral-400">The learning experience stays the same; the view emphasizes what matters to you.</p></div><div className="flex rounded-lg border border-neutral-800 bg-neutral-950 p-1"><button type="button" onClick={() => setAudience("STUDENT")} className={`rounded-md px-3 py-2 text-xs font-bold ${audience === "STUDENT" ? "bg-amber-500 text-neutral-950" : "text-neutral-400"}`}>Student</button><button type="button" onClick={() => setAudience("PARENT")} className={`rounded-md px-3 py-2 text-xs font-bold ${audience === "PARENT" ? "bg-emerald-500 text-neutral-950" : "text-neutral-400"}`}>Parent</button></div></div>

      <section className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-wider text-sky-300">Carousel learning packages</p><h3 className="mt-1 text-lg font-bold text-white">Pay for the learning scope, not every slide</h3><p className="mt-1 text-xs leading-5 text-neutral-400">There is no platform limit on slides or carousels. The teacher and AI can build as many learning steps as the student needs within the selected lesson, section, or chapter scope.</p></div><span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold text-emerald-300">No per-slide fees</span></div><div className="mt-4 grid gap-4 lg:grid-cols-3">{carouselPackages.map((pack) => <article key={pack.id} className="rounded-lg border border-neutral-800 bg-neutral-950 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-sky-300">{pack.scale} scale</p><h4 className="mt-2 text-base font-bold text-white">{pack.title}</h4><p className="mt-1 text-xs font-semibold text-neutral-400">{pack.subtitle}</p><p className="mt-3 text-sm text-amber-400">{pack.price}</p><p className="mt-1 text-xs text-neutral-500">{pack.scope}</p><ul className="mt-4 space-y-2">{pack.includes.map((item) => <li key={item} className="flex gap-2 text-xs text-neutral-300"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />{item}</li>)}</ul><p className="mt-4 border-t border-neutral-800 pt-3 text-[11px] leading-5 text-neutral-500">{pack.bestFor}</p></article>)}</div></section>

      {enrollment && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-400" /><div><p className="text-sm font-bold text-white">Registration created: {enrollment.title}</p><p className="mt-1 text-xs text-neutral-400">{enrollment.paymentRequired ? "Payment is required before access is activated." : "Your diagnostic is ready to start."}</p></div></div>
          <button onClick={() => setEnrollment(null)} className="text-xs font-bold text-emerald-400">Dismiss</button>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-5">
        {offers.map((offer) => (
          <article key={offer.id} className={`relative flex flex-col rounded-xl border bg-neutral-950 p-5 ${offer.recommended ? "border-amber-500/60" : "border-neutral-800"}`}>
            {offer.recommended && <span className="absolute -top-3 left-4 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold text-neutral-950">Recommended path</span>}
            <div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">{categoryLabels[offer.category]}</span>{offer.category === "DIAGNOSTIC" ? <Gift className="h-4 w-4 text-emerald-400" /> : offer.category === "PROGRAM" ? <BadgeCheck className="h-4 w-4 text-amber-400" /> : <CalendarDays className="h-4 w-4 text-sky-400" />}</div>
            <h3 className="mt-5 text-lg font-bold text-white">{offer.title}</h3>
            <p className="mt-2 min-h-12 text-xs leading-5 text-neutral-400">{offer.description}</p>
            <p className="mt-3 text-[11px] font-semibold text-neutral-500">{offer.bestFor}</p>
            <div className="mt-5 space-y-2 border-y border-neutral-800 py-4 text-xs"><div className="flex items-center gap-2 text-neutral-400"><Clock className="h-3.5 w-3.5" /> {offer.duration}</div><div className="flex items-center gap-2 text-neutral-400"><CalendarDays className="h-3.5 w-3.5" /> {offer.sessions}</div><div className="flex items-center gap-2 font-bold text-white"><CreditCard className="h-3.5 w-3.5 text-amber-400" /> {offer.price}</div></div>
            <ul className="mt-4 flex-1 space-y-2">{offer.access.map((item) => <li key={item} className="flex gap-2 text-xs text-neutral-300"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" /> {item}</li>)}</ul>
            <button onClick={() => setSelectedOffer(offer)} className={`mt-6 w-full rounded-lg px-3 py-2.5 text-xs font-bold ${offer.recommended ? "bg-amber-500 text-neutral-950 hover:bg-amber-400" : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"}`}>{offer.paymentRequired ? "View enrollment" : "Start free diagnostic"}</button>
          </article>
        ))}
      </div>

      {selectedOffer && (
        <div className="rounded-xl border border-amber-500/30 bg-neutral-950 p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Confirm registration</p><h3 className="mt-1 text-lg font-bold text-white">{selectedOffer.title}</h3><p className="mt-1 text-xs text-neutral-400">{selectedOffer.paymentRequired ? "This is a preview enrollment. Connect a payment provider before activating paid access." : "No payment is required for this diagnostic."}</p></div><div className="flex gap-2"><button onClick={() => setSelectedOffer(null)} className="rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-400">Cancel</button><button onClick={registerOffer} className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-neutral-950">Confirm registration</button></div></div></div>
      )}
    </div>
  );
}
