"use client";

import React, { useState, useEffect } from "react";
import { 
  ClassRegistry, 
  ClassRecord, 
  StudentProfile, 
  PackageScopeType,
  REGISTERED_CURRICULUM_SPECS,
  CurriculumSpec,
  PendingRegistration
} from "../../core/services/class-registry";
import { 
  Users, 
  GraduationCap, 
  Plus, 
  BookOpen, 
  DollarSign, 
  Layers, 
  X,
  Sparkles,
  ShieldCheck,
  Check,
  Globe,
  EyeOff,
  Eye,
  Megaphone,
  CheckCircle,
  XCircle,
  Bell,
  Edit3,
  Video
} from "lucide-react";
import CarouselPresentationStudio from "../carousel/presentation/CarouselPresentationStudio";

export default function ClassManager() {
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassRecord | null>(null);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRecordingStudio, setShowRecordingStudio] = useState(false);
  const [activePanel, setActivePanel] = useState<"details" | "announce" | "inbox">("details");
  const [pendingRegs, setPendingRegs] = useState<PendingRegistration[]>([]);

  // New Class Form State
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<string>("egypt-baccalaureate-second-year-physics-part1");
  const [newClassName, setNewClassName] = useState("");
  const [newScopeType, setNewScopeType] = useState<PackageScopeType>("SEMESTER");
  const [selectedTermId, setSelectedTermId] = useState<"term1" | "term2" | "full">("term1");
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
  const [newQuotaInput, setNewQuotaInput] = useState(5);
  const [newBasePrice, setNewBasePrice] = useState(50);
  const [newTier1Price, setNewTier1Price] = useState(60);
  const [newTier2Price, setNewTier2Price] = useState(45);

  // Announcement editor state
  const [announceDesc, setAnnounceDesc] = useState("");
  const [announcePrereqs, setAnnouncePrereqs] = useState<string[]>([]);
  const [newPrereqInput, setNewPrereqInput] = useState("");
  const [announceSaved, setAnnounceSaved] = useState(false);

  const approvedCurriculums = ClassRegistry.getApprovedCurriculumsForTeacher("teacher_1");
  const activeCurriculumSpec: CurriculumSpec = approvedCurriculums.find(c => c.id === selectedCurriculumId) || approvedCurriculums[0] || REGISTERED_CURRICULUM_SPECS["egypt-baccalaureate-second-year-physics-part1"];

  const loadClasses = () => {
    const teacherId = "teacher_1";
    const teacherClasses = ClassRegistry.getClassesByTeacher(teacherId);
    setClasses(teacherClasses);
  };

  const loadPendingRegs = () => {
    setPendingRegs(ClassRegistry.getPendingRegistrationsForTeacher("teacher_1"));
  };

  useEffect(() => {
    loadClasses();
    loadPendingRegs();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      setStudents(ClassRegistry.getStudentsForClass(selectedClass.id));
      setAnnounceDesc(selectedClass.announcement?.description || "");
      setAnnouncePrereqs([...(selectedClass.announcement?.prerequisites || [])]);
    }
  }, [selectedClass]);

  const handleCurriculumChange = (curriculumId: string) => {
    setSelectedCurriculumId(curriculumId);
    const spec = REGISTERED_CURRICULUM_SPECS[curriculumId];
    if (spec) {
      if (spec.terms.length > 0) setSelectedTermId(spec.terms[0].id as any);
      setSelectedChapters([]);
      setSelectedLessonIds([]);
    }
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName) return;

    const created = ClassRegistry.createClass({
      teacherId: "teacher_1",
      name: newClassName,
      curriculumPackageId: activeCurriculumSpec.id,
      curriculumPackageName: activeCurriculumSpec.name,
      gradeLevel: activeCurriculumSpec.gradeLevel,
      scope: {
        scopeType: newScopeType,
        semesterId: selectedTermId,
        chapterNames: selectedChapters.length > 0 ? selectedChapters : activeCurriculumSpec.chapters,
        lessonIds: selectedLessonIds.length > 0 ? selectedLessonIds : activeCurriculumSpec.lessons.map(l => l.id),
        maxLessonCount: newScopeType === "LESSON_QUANTITY" ? newQuotaInput : undefined,
        includedLiveSessions: newScopeType === "SINGLE_SESSION" ? 1 : -1
      },
      financials: {
        pricingModel: "VOLUME_TIERED",
        basePricePerStudent: newBasePrice,
        tiers: [
          { minStudents: 1, maxStudents: 5, pricePerStudent: newTier1Price },
          { minStudents: 6, maxStudents: 50, pricePerStudent: newTier2Price }
        ],
        currency: "USD"
      },
      studentIds: []
    });

    loadClasses();
    setSelectedClass(created);
    setShowCreateModal(false);
    setNewClassName("");
    setSelectedChapters([]);
    setSelectedLessonIds([]);
    setActivePanel("announce");
  };

  const handleToggleAnnouncement = (isPublic: boolean) => {
    if (!selectedClass) return;
    ClassRegistry.toggleAnnouncement(selectedClass.id, isPublic);
    loadClasses();
    setSelectedClass({ ...selectedClass, announcement: { ...(selectedClass.announcement as any), isPubliclyAnnounced: isPublic } });
  };

  const handleSaveAnnouncement = () => {
    if (!selectedClass) return;
    ClassRegistry.updateAnnouncement(selectedClass.id, {
      description: announceDesc,
      prerequisites: announcePrereqs,
      teacherName: "Dr. Hassan Youssef",
      teacherTitle: "Master Educator",
      isPubliclyAnnounced: selectedClass.announcement?.isPubliclyAnnounced ?? false
    });
    setAnnounceSaved(true);
    setTimeout(() => setAnnounceSaved(false), 2000);
    loadClasses();
  };

  const handleApproveReg = (reg: PendingRegistration) => {
    ClassRegistry.approveRegistration(reg.id, "std_001");
    loadPendingRegs();
    loadClasses();
  };

  const handleRejectReg = (reg: PendingRegistration) => {
    ClassRegistry.rejectRegistration(reg.id, "Not meeting prerequisites.");
    loadPendingRegs();
  };

  const getScopeBadge = (scopeType: PackageScopeType) => {
    const map: Record<string, React.ReactElement> = {
      FULL_PACKAGE: <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">Full Package</span>,
      SEMESTER: <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold text-[10px]">Semester</span>,
      CHAPTER_BUNDLE: <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold text-[10px]">Chapter Bundle</span>,
      LESSON_BUNDLE: <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">Lesson Bundle</span>,
      LESSON_QUANTITY: <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold text-[10px]">Quota Pass</span>,
      SINGLE_SESSION: <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold text-[10px]">Single Session</span>,
    };
    return map[scopeType] || <span className="px-2 py-0.5 rounded bg-neutral-700 text-neutral-300 font-bold text-[10px]">Custom</span>;
  };

  return (
    <div className="flex h-[calc(100vh-100px)] gap-6">
      {/* Left Sidebar - Package List */}
      <div className="w-1/3 border-r border-neutral-800 pr-6 overflow-y-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber-500" /> My Packages
            </h2>
            <p className="text-[11px] text-neutral-400">Create per-curriculum class packages</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition"
          >
            <Plus className="h-4 w-4" /> New Package
          </button>
        </div>

        {/* Pending Inbox Banner */}
        {pendingRegs.length > 0 && (
          <div 
            onClick={() => { setActivePanel("inbox"); }}
            className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl cursor-pointer hover:bg-red-500/20 transition flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-red-400">
              <Bell className="h-4 w-4 animate-pulse" />
              <span className="text-xs font-bold">{pendingRegs.length} Pending Registration Request{pendingRegs.length > 1 ? "s" : ""}</span>
            </div>
            <span className="text-[10px] text-red-400 font-semibold">Review →</span>
          </div>
        )}

        {/* Class List */}
        <div className="space-y-3">
          {classes.map((cls) => {
            const metrics = ClassRegistry.getPackageMetrics(cls.id);
            const isPublic = cls.announcement?.isPubliclyAnnounced ?? false;
            return (
              <button
                key={cls.id}
                onClick={() => { setSelectedClass(cls); setActivePanel("details"); }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedClass?.id === cls.id
                    ? "border-amber-500/50 bg-amber-500/10"
                    : "border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  {getScopeBadge(cls.scope.scopeType)}
                  {isPublic ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                      <Globe className="h-3 w-3" /> Public
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-neutral-500">
                      <EyeOff className="h-3 w-3" /> Not Announced
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-white text-sm mb-0.5 truncate">{cls.name}</h3>
                <p className="text-[11px] text-neutral-400 truncate">{cls.curriculumPackageName}</p>
                <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-neutral-800/60 mt-2">
                  <span><Users className="h-3 w-3 inline mr-0.5" /> {cls.studentIds.length} enrolled</span>
                  <span className="font-mono text-white">${metrics?.effectiveRate}/student</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 overflow-y-auto pl-2">
        {selectedClass ? (
          <>
            {/* Panel Tabs */}
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 mb-5">
              <h2 className="text-lg font-bold text-white flex-1 truncate">{selectedClass.name}</h2>
              <button
                onClick={() => setShowRecordingStudio(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-md transition"
              >
                <Video className="h-4 w-4" /> Record Full-Screen Demo
              </button>
              {[
                { key: "details", label: "Package Details", icon: Layers },
                { key: "announce", label: "Announce on Homepage", icon: Megaphone },
                { key: "inbox", label: `Registrations${pendingRegs.length > 0 ? ` (${pendingRegs.length})` : ""}`, icon: Bell }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActivePanel(key as any)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    activePanel === key
                      ? "bg-amber-500 text-black"
                      : "bg-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {label}
                </button>
              ))}
            </div>

            {/* ─── PANEL: PACKAGE DETAILS ─── */}
            {activePanel === "details" && (
              <div className="space-y-5">
                <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
                    <ShieldCheck className="h-5 w-5 text-amber-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">Curriculum Specification Contract</h3>
                    <span className="ml-auto text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">VERIFIED</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div><span className="text-neutral-500 block">Grade</span><strong className="text-white">{selectedClass.gradeLevel}</strong></div>
                    <div><span className="text-neutral-500 block">Scope</span><strong className="text-amber-400">{selectedClass.scope.scopeType}</strong></div>
                    <div><span className="text-neutral-500 block">Chapters</span><strong className="text-sky-400">{selectedClass.scope.chapterNames?.length ?? "All"}</strong></div>
                    <div><span className="text-neutral-500 block">Live Sessions</span><strong className="text-purple-400">{selectedClass.scope.includedLiveSessions === -1 ? "Unlimited" : selectedClass.scope.includedLiveSessions}</strong></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Enrolled Students", value: `${selectedClass.studentIds.length}`, sub: "Active volume", color: "text-white" },
                    { label: "Volume Rate", value: `$${ClassRegistry.calculateEffectiveRate(selectedClass)}`, sub: "Per student", color: "text-emerald-400" },
                    { label: "Total Revenue", value: `$${ClassRegistry.getPackageMetrics(selectedClass.id)?.totalRevenue}`, sub: "Auto-updated", color: "text-amber-400" }
                  ].map(({ label, value, sub, color }) => (
                    <div key={label} className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
                      <span className="text-xs text-neutral-400">{label}</span>
                      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{sub}</p>
                    </div>
                  ))}
                </div>

                {/* ── QUESTION TANKS & TEACHER CUSTOM CAROUSELS ── */}
                <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        Package Carousels & Question Tanks
                      </h3>
                      <p className="text-[11px] text-neutral-400">Inherits official Admin-pushed 3-Case Question DNA + teacher custom package carousels.</p>
                    </div>
                    <span className="text-[10px] bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full font-bold">
                      TEACHER CUSTOMIZABLE
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Admin Pushed Official Tank */}
                    <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <ShieldCheck className="h-4 w-4 text-emerald-400" /> Official Admin Question Tank
                        </span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">LOCKED TANK</span>
                      </div>
                      <p className="text-neutral-400 text-[11px]">7 Official Case B Problems · 70 Pre Trials · 35 Case C Challenges</p>
                      <p className="text-[10px] text-neutral-500 italic">Pushed by Admin for {selectedClass.curriculumPackageName}</p>
                    </div>

                    {/* Teacher Package Custom Carousels */}
                    <div className="p-3.5 bg-neutral-950 border border-amber-500/30 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4 text-amber-400" /> Teacher Package Carousels
                        </span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold">CUSTOM EXTRAS</span>
                      </div>
                      <p className="text-neutral-400 text-[11px]">Teacher can add package-specific explanation slides, worked examples & custom quizzes.</p>
                      <button
                        onClick={() => setShowRecordingStudio(true)}
                        className="w-full py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold rounded-lg text-[11px] transition"
                      >
                        + Record Demo / Add Custom Carousel
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white">Enrolled Students ({students.length})</h3>
                  <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-900 text-neutral-400 border-b border-neutral-800">
                        <tr>
                          <th className="px-5 py-3 font-semibold">Student</th>
                          <th className="px-5 py-3 font-semibold">Parent</th>
                          <th className="px-5 py-3 font-semibold">Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800 text-neutral-300">
                        {students.map((s) => (
                          <tr key={s.id} className="hover:bg-neutral-800/50">
                            <td className="px-5 py-3"><p className="font-bold text-white">{s.name}</p><p className="text-neutral-400">{s.email}</p></td>
                            <td className="px-5 py-3"><p className="font-medium text-white">{s.parent.name}</p><p className="text-neutral-400">{s.parent.phone}</p></td>
                            <td className="px-5 py-3 font-bold text-emerald-400">${ClassRegistry.calculateEffectiveRate(selectedClass)}</td>
                          </tr>
                        ))}
                        {students.length === 0 && (
                          <tr><td colSpan={3} className="px-5 py-6 text-center text-neutral-500">No students enrolled yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ─── PANEL: ANNOUNCE ON HOMEPAGE ─── */}
            {activePanel === "announce" && (
              <div className="space-y-5">
                {/* Public Toggle */}
                <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Globe className="h-4 w-4 text-emerald-400" />
                      Announce This Package on Public Homepage
                    </h3>
                    <p className="text-xs text-neutral-400">
                      When enabled, students can search and find this package on the platform's public homepage and request to register.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleAnnouncement(!selectedClass.announcement?.isPubliclyAnnounced)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition ${
                      selectedClass.announcement?.isPubliclyAnnounced
                        ? "bg-emerald-600 hover:bg-red-600 text-white"
                        : "bg-neutral-700 hover:bg-emerald-600 text-neutral-300 hover:text-white"
                    }`}
                  >
                    {selectedClass.announcement?.isPubliclyAnnounced ? (
                      <><Eye className="h-4 w-4" /> Published — Click to Hide</>
                    ) : (
                      <><EyeOff className="h-4 w-4" /> Hidden — Click to Publish</>
                    )}
                  </button>
                </div>

                {/* Announcement Content Editor */}
                <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Edit3 className="h-4 w-4 text-amber-400" /> Package Announcement Content
                  </h3>

                  <div>
                    <label className="block text-neutral-400 font-semibold text-xs mb-1">Package Description (shown publicly)</label>
                    <textarea
                      rows={4}
                      value={announceDesc}
                      onChange={(e) => setAnnounceDesc(e.target.value)}
                      placeholder="Describe what students will learn, what sessions are included, and what makes this package unique..."
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-semibold text-xs mb-2">Student Prerequisites (what students must meet to register)</label>
                    <div className="space-y-2">
                      {announcePrereqs.map((req, i) => (
                        <div key={i} className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2">
                          <ShieldCheck className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          <span className="text-xs text-neutral-300 flex-1">{req}</span>
                          <button onClick={() => setAnnouncePrereqs(prev => prev.filter((_, j) => j !== i))} className="text-neutral-500 hover:text-red-400">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newPrereqInput}
                          onChange={(e) => setNewPrereqInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newPrereqInput.trim()) {
                              setAnnouncePrereqs(prev => [...prev, newPrereqInput.trim()]);
                              setNewPrereqInput("");
                            }
                          }}
                          placeholder="Type a prerequisite and press Enter..."
                          className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                        />
                        <button
                          onClick={() => {
                            if (newPrereqInput.trim()) {
                              setAnnouncePrereqs(prev => [...prev, newPrereqInput.trim()]);
                              setNewPrereqInput("");
                            }
                          }}
                          className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs"
                        >+ Add</button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                    {announceSaved && <span className="text-emerald-400 font-bold text-xs flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Saved!</span>}
                    <button onClick={handleSaveAnnouncement} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs transition">
                      Save Announcement
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ─── PANEL: REGISTRATION INBOX ─── */}
            {activePanel === "inbox" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-amber-500" />
                  <h3 className="text-sm font-bold text-white">Pending Student Registrations</h3>
                  <span className="ml-auto text-xs text-neutral-400">{pendingRegs.length} awaiting review</span>
                </div>

                {pendingRegs.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-neutral-800 rounded-2xl space-y-2">
                    <CheckCircle className="h-8 w-8 mx-auto text-emerald-500 opacity-50" />
                    <p className="text-white font-bold">No pending registrations</p>
                    <p className="text-neutral-500 text-xs">When students register from the public homepage, they appear here for approval.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingRegs.map((reg) => {
                      const cls = ClassRegistry.getClassById(reg.classId);
                      return (
                        <div key={reg.id} className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="font-bold text-white text-sm">{reg.studentName}</h4>
                              <p className="text-xs text-neutral-400">{reg.studentEmail}</p>
                            </div>
                            <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">PENDING</span>
                          </div>
                          <div className="text-xs bg-neutral-950 border border-neutral-800 rounded-xl p-3 space-y-1">
                            <p><span className="text-neutral-500">Requested Package:</span> <strong className="text-white">{reg.className}</strong></p>
                            <p><span className="text-neutral-500">Curriculum:</span> <span className="text-amber-400">{reg.curriculumPackageName}</span></p>
                            <p><span className="text-neutral-500">Submitted:</span> <span className="text-neutral-300">{new Date(reg.submittedAt).toLocaleString()}</span></p>
                            {cls && <p><span className="text-neutral-500">Current Volume Rate:</span> <span className="text-emerald-400 font-bold">${ClassRegistry.calculateEffectiveRate(cls)}/student</span></p>}
                          </div>
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => handleApproveReg(reg)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition"
                            >
                              <CheckCircle className="h-4 w-4" /> Accept & Enrol Student
                            </button>
                            <button
                              onClick={() => handleRejectReg(reg)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 border border-neutral-700 font-semibold rounded-xl text-xs transition"
                            >
                              <XCircle className="h-4 w-4" /> Reject
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-neutral-500 text-sm">
            Select a package from the list or create a new one.
          </div>
        )}
      </div>

      {/* ── CREATE CLASS MODAL ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="h-5 w-5 text-amber-500" /> Create Package from Registered Curriculum
                </h2>
                <p className="text-xs text-neutral-400">Select an official curriculum, define scope, and set volume pricing</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-neutral-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-5 text-xs">
              {/* Curriculum Selection */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-amber-400 font-bold uppercase tracking-wider text-[11px]">1. Select Admin-Approved Curriculum Base</label>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">🛡️ ADMIN AUTHORIZED</span>
                </div>
                <select 
                  value={selectedCurriculumId} onChange={(e) => handleCurriculumChange(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2.5 text-white font-semibold outline-none focus:border-amber-500"
                >
                  {approvedCurriculums.map((spec) => (
                    <option key={spec.id} value={spec.id}>{spec.name} ({spec.gradeLevel})</option>
                  ))}
                </select>
                <div className="p-3 bg-black/40 border border-neutral-800 rounded-lg space-y-1.5 text-[11px]">
                  <div className="flex justify-between"><span className="text-neutral-400">Publisher:</span><span className="text-white font-semibold">{activeCurriculumSpec.publisher}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Subject & Grade:</span><span className="text-amber-300 font-semibold">{activeCurriculumSpec.subject} · {activeCurriculumSpec.gradeLevel}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Version:</span><span className="text-sky-300 font-semibold">{activeCurriculumSpec.version}</span></div>
                </div>
              </div>

              {/* Package Title & Scope */}
              <div className="space-y-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Package Title</label>
                  <input 
                    type="text" required value={newClassName} onChange={(e) => setNewClassName(e.target.value)}
                    placeholder={`e.g. ${activeCurriculumSpec.name} - Group A`}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">Scope Mode</label>
                    <select value={newScopeType} onChange={(e) => setNewScopeType(e.target.value as PackageScopeType)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500">
                      <option value="SEMESTER">Semester / Term</option>
                      <option value="CHAPTER_BUNDLE">Chapter Bundle</option>
                      <option value="LESSON_BUNDLE">Lesson Bundle</option>
                      <option value="LESSON_QUANTITY">Lesson Quota Pass</option>
                      <option value="SINGLE_SESSION">Single Session Workshop</option>
                      <option value="FULL_PACKAGE">Full Academic Package</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">Academic Term</label>
                    <select value={selectedTermId} onChange={(e) => setSelectedTermId(e.target.value as any)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500">
                      {activeCurriculumSpec.terms.map((t) => (
                        <option key={t.id} value={t.id}>{t.label} ({t.dateRange})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Dynamic Chapter Picker */}
              {newScopeType === "CHAPTER_BUNDLE" && (
                <div className="bg-neutral-900/40 p-3 rounded-xl border border-neutral-800 space-y-2">
                  <label className="block text-amber-400 font-bold text-xs">Select Chapters:</label>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {activeCurriculumSpec.chapters.map((ch) => {
                      const sel = selectedChapters.includes(ch);
                      return (
                        <div key={ch} onClick={() => setSelectedChapters(prev => sel ? prev.filter(c => c !== ch) : [...prev, ch])}
                          className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition ${sel ? "border-amber-500 bg-amber-500/10 text-white" : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white"}`}>
                          <span>{ch}</span>
                          {sel && <Check className="h-4 w-4 text-amber-500" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dynamic Lesson Picker */}
              {newScopeType === "LESSON_BUNDLE" && (
                <div className="bg-neutral-900/40 p-3 rounded-xl border border-neutral-800 space-y-2">
                  <label className="block text-amber-400 font-bold text-xs">Select Lessons:</label>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {activeCurriculumSpec.lessons.map((lesson) => {
                      const sel = selectedLessonIds.includes(lesson.id);
                      return (
                        <div key={lesson.id} onClick={() => setSelectedLessonIds(prev => sel ? prev.filter(l => l !== lesson.id) : [...prev, lesson.id])}
                          className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition ${sel ? "border-amber-500 bg-amber-500/10 text-white" : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white"}`}>
                          <span>{lesson.title}</span>
                          {sel && <Check className="h-4 w-4 text-amber-500" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pricing Tiers */}
              <div className="border-t border-neutral-800 pt-3 space-y-2">
                <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-emerald-400" /> Volume Pricing Tiers
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Tier 1 (1–5 Students)</label>
                    <input type="number" value={newTier1Price} onChange={(e) => setNewTier1Price(Number(e.target.value))}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Tier 2 (6–50 Students)</label>
                    <input type="number" value={newTier2Price} onChange={(e) => setNewTier2Price(Number(e.target.value))}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500" />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-800">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg bg-neutral-800 text-white font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-amber-500 text-black font-bold hover:bg-amber-400">
                  Save & Go to Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── RECORDING STUDIO MODAL ── */}
      {showRecordingStudio && selectedClass && (
        <CarouselPresentationStudio
          carousel={{
            id: `CAROUSEL-${selectedClass.id}`,
            title: selectedClass.name,
            skillId: "SKILL-PHYS-VECTORS",
            blueprintId: "BLUEPRINT-BAC-2",
            showProgressBar: true,
            showScoreTally: true,
            sequenceMode: "SEQUENTIAL",
            slides: [
              {
                id: "slide-1",
                type: "lesson_text",
                title: selectedClass.name,
                body: selectedClass.announcement?.description || "Welcome to this interactive presentation.",
                learningObjective: "Master the key concepts covered in this curriculum package.",
                keyTerms: ["Vectors", "Relative Velocity", "Forces"],
                theme: "default"
              }
            ]
          }}
          onClose={() => setShowRecordingStudio(false)}
          onSaveRecordingToPackage={(url, title) => {
            alert(`Demo video "${title}" attached to ${selectedClass.name}!`);
            setShowRecordingStudio(false);
          }}
        />
      )}
    </div>
  );
}
