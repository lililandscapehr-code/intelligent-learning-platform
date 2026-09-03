"use client";

import React, { useState, useEffect } from "react";
import { ClassRegistry, TeacherAnnouncement, PackageScopeType, HomepageConfig } from "../../core/services/class-registry";
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  CheckCircle, 
  Sparkles, 
  ArrowRight, 
  Video, 
  ShieldCheck, 
  Search, 
  User, 
  Lock, 
  CheckCircle2, 
  Layers, 
  PlayCircle,
  X,
  UserPlus,
  LogIn,
  Radio,
  AlertOctagon,
  Info
} from "lucide-react";

interface PublicTeacherShowcaseProps {
  onDirectLaunchPackage: (curriculumId: string, classId: string) => void;
  onOpenLoginModal?: () => void;
}

export default function PublicTeacherShowcase({ onDirectLaunchPackage, onOpenLoginModal }: PublicTeacherShowcaseProps) {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [subjectFilter, setSubjectFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig>(() => ClassRegistry.getHomepageConfig());
  
  // Registration Modal State
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);
  const [studentIdInput, setStudentIdInput] = useState("std_001");
  const [studentNameInput, setStudentNameInput] = useState("Ahmed Youssef");
  const [prereqMet, setPrereqMet] = useState(false);
  const [enrollStatus, setEnrollStatus] = useState("");

  const [studentEmailInput, setStudentEmailInput] = useState("ahmed@student.com");
  
  // Dual-Parent / Two Follow-up Relatives Registration
  const [parent1Name, setParent1Name] = useState("Tarek Youssef");
  const [parent1Relationship, setParent1Relationship] = useState("Father");
  const [parent1Email, setParent1Email] = useState("tarek.youssef@parent.com");
  const [parent1Phone, setParent1Phone] = useState("+20 100 123 4567");

  const [parent2Name, setParent2Name] = useState("Nouran Youssef");
  const [parent2Relationship, setParent2Relationship] = useState("Mother");
  const [parent2Email, setParent2Email] = useState("nouran.youssef@parent.com");
  const [parent2Phone, setParent2Phone] = useState("+20 100 987 6543");

  const loadAnnouncements = () => {
    setAnnouncements(ClassRegistry.getPublicPackageAnnouncements());
    setHomepageConfig(ClassRegistry.getHomepageConfig());
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const isSectionVisible = (sectionId: string) => {
    const s = homepageConfig.sections.find(sec => sec.id === sectionId);
    return s ? s.visible : true;
  };

  const filteredAnnouncements = announcements.filter((pkg) => {
    const matchesSubject = subjectFilter === "ALL" || pkg.curriculumPackageId.includes(subjectFilter);
    const matchesQuery = pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pkg.announcement.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pkg.curriculumPackageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pkg.gradeLevel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesQuery;
  });

  const handleRegisterPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage || !prereqMet) return;

    const result = ClassRegistry.submitRegistrationRequest(
      selectedPackage.classId,
      studentNameInput,
      studentEmailInput,
      prereqMet,
      {
        name: parent1Name,
        relationship: parent1Relationship,
        email: parent1Email,
        phone: parent1Phone,
        preferredChannel: "WHATSAPP",
        verified: true,
        receiveReports: true
      },
      parent2Name ? {
        name: parent2Name,
        relationship: parent2Relationship,
        email: parent2Email,
        phone: parent2Phone,
        preferredChannel: "EMAIL",
        verified: true,
        receiveReports: true
      } : undefined
    );
    if (result.success) {
      setEnrollStatus("✅ " + result.message);
      setTimeout(() => {
        setEnrollStatus("");
        setSelectedPackage(null);
        loadAnnouncements();
      }, 3000);
    } else {
      setEnrollStatus("❌ " + result.message);
    }
  };

  const getScopeBadge = (scopeType: PackageScopeType) => {
    switch (scopeType) {
      case "FULL_PACKAGE": return <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] uppercase">Full Package</span>;
      case "SEMESTER": return <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-400 font-extrabold text-[10px] uppercase">Semester / Term</span>;
      case "CHAPTER_BUNDLE": return <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 font-extrabold text-[10px] uppercase">Chapter Bundle</span>;
      case "LESSON_BUNDLE": return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 font-extrabold text-[10px] uppercase">Lesson Bundle</span>;
      case "LESSON_QUANTITY": return <span className="px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 font-extrabold text-[10px] uppercase">Quota Pass</span>;
      case "SINGLE_SESSION": return <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 font-extrabold text-[10px] uppercase">Single Workshop</span>;
      default: return <span className="px-2.5 py-1 rounded-full bg-neutral-700 text-neutral-300 font-extrabold text-[10px] uppercase">Custom</span>;
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8 animate-in fade-in zoom-in-95 duration-200">
      {/* ── Global Announcement Banner (Admin Governed) ──────── */}
      {homepageConfig.announcementBanner.enabled && isSectionVisible("announcement_banner") && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-lg ${
          homepageConfig.announcementBanner.type === "promo" ? "bg-gradient-to-r from-amber-950/80 to-neutral-900 border-amber-500/50 text-amber-200" :
          homepageConfig.announcementBanner.type === "success" ? "bg-gradient-to-r from-emerald-950/80 to-neutral-900 border-emerald-500/50 text-emerald-200" :
          homepageConfig.announcementBanner.type === "warning" ? "bg-gradient-to-r from-orange-950/80 to-neutral-900 border-orange-500/50 text-orange-200" :
          "bg-gradient-to-r from-sky-950/80 to-neutral-900 border-sky-500/50 text-sky-200"
        }`}>
          <div className="flex items-center gap-3">
            <Radio className="h-5 w-5 shrink-0 text-amber-400 animate-pulse" />
            <p className="text-xs sm:text-sm font-semibold">{homepageConfig.announcementBanner.message}</p>
          </div>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/40 border border-white/10 shrink-0">
            {homepageConfig.announcementBanner.type}
          </span>
        </div>
      )}

      {/* ── Homepage Hero Banner (Admin Dynamic CMS) ──────────── */}
      {isSectionVisible("hero_banner") && (
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/50 via-neutral-950 to-neutral-900 p-5 sm:p-8 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-400">
                <Sparkles className="h-3.5 w-3.5" /> {homepageConfig.heroBadgeText}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {homepageConfig.heroTitle}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {homepageConfig.heroSubtitle}
              </p>
            </div>

            {onOpenLoginModal && homepageConfig.heroCtaVisible && (
              <button 
                onClick={onOpenLoginModal}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs shadow-lg shadow-amber-500/20 transition shrink-0"
              >
                <LogIn className="h-4 w-4" /> {homepageConfig.heroCtaText}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Search & Subject Filter Bar (Admin Dynamic Filters) ─ */}
      {isSectionVisible("search_filters") && (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 bg-neutral-950 border border-neutral-800 rounded-2xl p-3 sm:p-4">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Search by Teacher Name, Curriculum Package, or Grade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0">
            {homepageConfig.subjectFilters.filter(f => f.visible).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSubjectFilter(tab.matchKey)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  subjectFilter === tab.matchKey
                    ? "bg-amber-500 text-black shadow-md shadow-amber-500/10"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Package Announcements Grid (Admin Controlled) ───── */}
      {isSectionVisible("package_grid") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredAnnouncements.map((pkg) => {
          const ann: TeacherAnnouncement = pkg.announcement;

          return (
            <div 
              key={pkg.classId}
              className="bg-neutral-950 border border-neutral-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:border-amber-500/40 transition-all shadow-xl flex flex-col justify-between space-y-4 sm:space-y-6"
            >
              {/* Header Info */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  {getScopeBadge(pkg.scope.scopeType)}
                  <span className="text-xs font-mono text-neutral-400">
                    Grade: <strong className="text-white">{pkg.gradeLevel}</strong>
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1 leading-snug">{pkg.title}</h3>
                  <p className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" /> Base: {pkg.curriculumPackageName}
                  </p>
                </div>

                {/* Teacher Profile Box */}
                <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-3 sm:p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-amber-300 text-sm shrink-0">
                    {ann.teacherName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{ann.teacherName}</h4>
                    <p className="text-[11px] text-neutral-400 truncate">{ann.teacherTitle}</p>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed bg-black/30 p-3 rounded-xl border border-neutral-900">
                  {ann.description}
                </p>

                {/* Prerequisites & Requirements Box */}
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-3 sm:p-4 space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" /> Student Requirements for Package Registration
                  </h4>
                  <ul className="space-y-1 text-xs text-neutral-300">
                    {ann.prerequisites.map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Package Metrics & Scope Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs">
                  <div className="bg-neutral-900/50 p-3 rounded-xl border border-neutral-800">
                    <span className="text-neutral-500 block text-[10px]">Live Sessions Included</span>
                    <strong className="text-purple-400 font-bold text-sm">
                      {pkg.scope.includedLiveSessions === -1 ? "Unlimited" : `${pkg.scope.includedLiveSessions} Sessions`}
                    </strong>
                  </div>
                  <div className="bg-neutral-900/50 p-3 rounded-xl border border-neutral-800">
                    <span className="text-neutral-500 block text-[10px]">Volume Package Price</span>
                    <strong className="text-emerald-400 font-bold text-sm">
                      ${pkg.effectiveRate} <span className="text-[10px] font-normal text-neutral-400">/ student</span>
                    </strong>
                  </div>
                </div>
              </div>

              {/* Package Direct Actions */}
              <div className="border-t border-neutral-800 pt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button 
                  onClick={() => setSelectedPackage(pkg)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition"
                >
                  <UserPlus className="h-4 w-4" /> Register (${pkg.effectiveRate})
                </button>
                <button 
                  onClick={() => {
                    if (onOpenLoginModal) onOpenLoginModal();
                    else onDirectLaunchPackage(pkg.curriculumPackageId, pkg.classId);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 hover:brightness-110 transition"
                >
                  <PlayCircle className="h-4 w-4" /> Login & Launch Package
                </button>
              </div>
            </div>
          );
        })}

        {filteredAnnouncements.length === 0 && (
          <div className="col-span-full py-16 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-3xl space-y-2">
            <BookOpen className="h-10 w-10 mx-auto opacity-40 text-neutral-400" />
            <p className="font-bold text-white">No teacher package announcements found.</p>
            <p className="text-xs text-neutral-400">Try searching for a different teacher name or subject.</p>
          </div>
        )}
      </div>
      )}

      {/* ── Dynamic Footer (Admin Governed) ───────────────────── */}
      {isSectionVisible("footer") && homepageConfig.footerVisible && (
        <footer className="border-t border-neutral-800/80 pt-6 pb-4 text-center text-xs text-neutral-500 font-medium">
          {homepageConfig.footerText}
        </footer>
      )}

      {/* ── REGISTRATION MODAL WITH REQUIREMENTS CHECK ──────────── */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-lg w-full max-h-[92vh] overflow-y-auto space-y-4 sm:space-y-5 animate-in fade-in zoom-in-95 shadow-2xl">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-emerald-400 shrink-0" /> Package Student Registration
                </h2>
                <p className="text-xs text-neutral-400">{selectedPackage.title}</p>
              </div>
              <button onClick={() => setSelectedPackage(null)} className="text-neutral-400 hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {enrollStatus ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center font-bold text-sm">
                {enrollStatus}
              </div>
            ) : (
              <form onSubmit={handleRegisterPackage} className="space-y-4 text-xs">
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-[11px] leading-relaxed">
                  📋 Your request will be sent to the teacher for review. Once approved, you'll be enrolled and the package rate will be auto-calculated.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 font-semibold mb-1">Student Full Name</label>
                    <input 
                      type="text" required value={studentNameInput} onChange={(e) => setStudentNameInput(e.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-semibold mb-1">Student Email Address</label>
                    <input 
                      type="email" required value={studentEmailInput} onChange={(e) => setStudentEmailInput(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* 1st Registered Parent / Guardian */}
                <div className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-2">
                  <span className="font-bold text-amber-400 block text-[11px] uppercase tracking-wider">
                    👤 Primary Parent / Guardian 1
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input 
                      type="text" required placeholder="Parent 1 Name (e.g. Tarek Youssef)" value={parent1Name} onChange={(e) => setParent1Name(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-amber-500 text-xs"
                    />
                    <select
                      value={parent1Relationship} onChange={(e) => setParent1Relationship(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-amber-500 text-xs"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Guardian">Legal Guardian</option>
                    </select>
                    <input 
                      type="email" required placeholder="Parent 1 Email" value={parent1Email} onChange={(e) => setParent1Email(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-amber-500 text-xs"
                    />
                    <input 
                      type="tel" required placeholder="Parent 1 Phone (WhatsApp)" value={parent1Phone} onChange={(e) => setParent1Phone(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-amber-500 text-xs"
                    />
                  </div>
                </div>

                {/* 2nd Registered Parent / Follow-up Relative */}
                <div className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-2">
                  <span className="font-bold text-sky-400 block text-[11px] uppercase tracking-wider">
                    👥 Secondary Parent / Follow-up Relative 2 (Optional / Backup)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input 
                      type="text" placeholder="Relative 2 Name (e.g. Nouran Youssef)" value={parent2Name} onChange={(e) => setParent2Name(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-amber-500 text-xs"
                    />
                    <select
                      value={parent2Relationship} onChange={(e) => setParent2Relationship(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-amber-500 text-xs"
                    >
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Uncle">Uncle</option>
                      <option value="Aunt">Aunt</option>
                      <option value="Grandparent">Grandparent</option>
                      <option value="Relative">Other Relative</option>
                    </select>
                    <input 
                      type="email" placeholder="Relative 2 Email" value={parent2Email} onChange={(e) => setParent2Email(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-amber-500 text-xs"
                    />
                    <input 
                      type="tel" placeholder="Relative 2 Phone" value={parent2Phone} onChange={(e) => setParent2Phone(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-amber-500 text-xs"
                    />
                  </div>
                </div>

                <div className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-800 space-y-2">
                  <span className="font-bold text-amber-400 block text-[11px]">Confirm Package Requirements</span>
                  <label className="flex items-start gap-2.5 text-neutral-300 cursor-pointer">
                    <input 
                      type="checkbox" required checked={prereqMet} onChange={(e) => setPrereqMet(e.target.checked)}
                      className="mt-0.5 accent-amber-500 shrink-0"
                    />
                    <span className="leading-snug">
                      I confirm that I meet all stated prerequisites for this package ({selectedPackage.announcement.prerequisites.length} items verified).
                    </span>
                  </label>
                </div>

                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 flex justify-between items-center font-bold flex-wrap gap-2">
                  <span>Current Volume Rate (if accepted):</span>
                  <span className="text-base">${selectedPackage.effectiveRate} USD / student</span>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2 border-t border-neutral-800">
                  <button type="button" onClick={() => setSelectedPackage(null)} className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-neutral-800 text-white font-semibold">
                    Cancel
                  </button>
                  <button type="submit" disabled={!prereqMet} className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold disabled:opacity-50 transition">
                    Send Registration Request to Teacher
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
