"use client";

import React, { useState, useEffect } from "react";
import { 
  ClassRegistry, 
  ClassRecord, 
  StudentProfile, 
  PackageScopeType,
  REGISTERED_CURRICULUM_SPECS,
  CurriculumSpec
} from "../../core/services/class-registry";
import { 
  Users, 
  GraduationCap, 
  Plus, 
  BookOpen, 
  ChevronRight, 
  DollarSign, 
  Layers, 
  CheckCircle, 
  Calendar,
  X,
  Sparkles,
  ShieldCheck,
  FileText,
  Check
} from "lucide-react";

export default function ClassManager() {
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassRecord | null>(null);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  const activeCurriculumSpec: CurriculumSpec = REGISTERED_CURRICULUM_SPECS[selectedCurriculumId] || REGISTERED_CURRICULUM_SPECS["egypt-baccalaureate-second-year-physics-part1"];

  const loadClasses = () => {
    const teacherId = "teacher_1";
    const teacherClasses = ClassRegistry.getClassesByTeacher(teacherId);
    setClasses(teacherClasses);
    if (!selectedClass && teacherClasses.length > 0) {
      setSelectedClass(teacherClasses[0]);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      setStudents(ClassRegistry.getStudentsForClass(selectedClass.id));
    }
  }, [selectedClass]);

  // When changing curriculum selection, auto-select first term & reset chapters
  const handleCurriculumChange = (curriculumId: string) => {
    setSelectedCurriculumId(curriculumId);
    const spec = REGISTERED_CURRICULUM_SPECS[curriculumId];
    if (spec) {
      if (spec.terms.length > 0) setSelectedTermId(spec.terms[0].id);
      setSelectedChapters([]);
      setSelectedLessonIds([]);
    }
  };

  const toggleChapterSelection = (chapter: string) => {
    setSelectedChapters(prev => 
      prev.includes(chapter) ? prev.filter(c => c !== chapter) : [...prev, chapter]
    );
  };

  const toggleLessonSelection = (lessonId: string) => {
    setSelectedLessonIds(prev => 
      prev.includes(lessonId) ? prev.filter(l => l !== lessonId) : [...prev, lessonId]
    );
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
  };

  const getScopeBadge = (scopeType: PackageScopeType) => {
    switch (scopeType) {
      case "FULL_PACKAGE": return <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">Full Package</span>;
      case "SEMESTER": return <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold text-[10px]">Semester / Term</span>;
      case "CHAPTER_BUNDLE": return <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold text-[10px]">Chapter Bundle</span>;
      case "LESSON_BUNDLE": return <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">Lesson Bundle</span>;
      case "LESSON_QUANTITY": return <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold text-[10px]">Quota Pass</span>;
      case "SINGLE_SESSION": return <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold text-[10px]">Single Session</span>;
      default: return <span className="px-2 py-0.5 rounded bg-neutral-700 text-neutral-300 font-bold text-[10px]">Custom</span>;
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] gap-6">
      {/* Left Sidebar - Class & Package List */}
      <div className="w-1/3 border-r border-neutral-800 pr-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber-500" />
              Classes & Packages
            </h2>
            <p className="text-xs text-neutral-400">Curriculum-driven scoped learning groups</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors"
          >
            <Plus className="h-4 w-4" /> Create Class
          </button>
        </div>

        <div className="space-y-3">
          {classes.map((cls) => {
            const metrics = ClassRegistry.getPackageMetrics(cls.id);
            return (
              <button
                key={cls.id}
                onClick={() => setSelectedClass(cls)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedClass?.id === cls.id
                    ? "border-amber-500/50 bg-amber-500/10"
                    : "border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  {getScopeBadge(cls.scope.scopeType)}
                  <span className="text-[11px] font-bold text-emerald-400">
                    ${metrics?.effectiveRate}/student
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm mb-1">{cls.name}</h3>
                <p className="text-[11px] text-neutral-400 truncate mb-2">{cls.curriculumPackageName}</p>
                <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-800/60">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {cls.studentIds.length} Enrolled
                  </span>
                  <span className="font-mono text-white font-semibold">
                    Rev: ${metrics?.totalRevenue}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Area - Class Details & Formal Curriculum Specifications */}
      <div className="flex-1 overflow-y-auto pl-2 space-y-6">
        {selectedClass ? (
          <>
            <header className="border-b border-neutral-800 pb-6 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {getScopeBadge(selectedClass.scope.scopeType)}
                  <span className="text-xs text-neutral-400 font-mono">ID: {selectedClass.id}</span>
                </div>
                <h1 className="text-2xl font-bold text-white">{selectedClass.name}</h1>
                <p className="text-neutral-400 text-xs mt-1">
                  Selected Base Curriculum: <strong className="text-amber-400">{selectedClass.curriculumPackageName}</strong>
                </p>
              </div>
            </header>

            {/* Formal Curriculum Classification Spec Badge */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-amber-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">Curriculum Specification Contract</h3>
                </div>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  VERIFIED CURRICULUM BASE
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-neutral-500 block">Grade / Level</span>
                  <strong className="text-white">{selectedClass.gradeLevel}</strong>
                </div>
                <div>
                  <span className="text-neutral-500 block">Scoped Chapters</span>
                  <strong className="text-sky-400">{selectedClass.scope.chapterNames?.length || "All"} Chapter(s)</strong>
                </div>
                <div>
                  <span className="text-neutral-500 block">Scoped Lessons</span>
                  <strong className="text-amber-400">{selectedClass.scope.lessonIds?.length || "All Catalog"} Lesson(s)</strong>
                </div>
                <div>
                  <span className="text-neutral-500 block">Live Sessions Included</span>
                  <strong className="text-purple-400">{selectedClass.scope.includedLiveSessions === -1 ? "Unlimited" : selectedClass.scope.includedLiveSessions}</strong>
                </div>
              </div>
            </div>

            {/* Financial Volume Matrix */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
                <span className="text-xs text-neutral-400 flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-sky-400" /> Active Enrolled Volume
                </span>
                <p className="text-2xl font-bold text-white mt-1">{selectedClass.studentIds.length} Students</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">Calculates individual package rate</p>
              </div>

              <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
                <span className="text-xs text-neutral-400 flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-400" /> Volume Tier Rate
                </span>
                <p className="text-2xl font-bold text-emerald-400 mt-1">
                  ${ClassRegistry.calculateEffectiveRate(selectedClass)} <span className="text-xs text-neutral-400 font-normal">/ student</span>
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">Tiered volume pricing active</p>
              </div>

              <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
                <span className="text-xs text-neutral-400 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Total Package Revenue
                </span>
                <p className="text-2xl font-bold text-amber-400 mt-1">
                  ${ClassRegistry.getPackageMetrics(selectedClass.id)?.totalRevenue}
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">Auto-updates on student swaps</p>
              </div>
            </div>

            {/* Student Roster Table */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Enrolled Students ({students.length})</h2>
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-900 text-neutral-400 border-b border-neutral-800 text-xs">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Student Name</th>
                      <th className="px-6 py-3 font-semibold">Parent Contact</th>
                      <th className="px-6 py-3 font-semibold">Individual Package Rate</th>
                      <th className="px-6 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800 text-neutral-300">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-neutral-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-white">{student.name}</p>
                          <p className="text-xs text-neutral-400">{student.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-medium text-white">{student.parent.name} ({student.parent.relationship})</p>
                          <p className="text-xs text-neutral-400">{student.parent.phone}</p>
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-400">
                          ${ClassRegistry.calculateEffectiveRate(selectedClass)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-xs text-amber-500 font-semibold cursor-pointer hover:underline">
                            View 360° Profile
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-neutral-500">
            Select a class from the list to view details
          </div>
        )}
      </div>

      {/* ── MODAL: CURRICULUM-DRIVEN PACKAGE CREATOR ───────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="h-5 w-5 text-amber-500" /> Create Package from Registered Curriculum
                </h2>
                <p className="text-xs text-neutral-400">Select an official curriculum specification to build a scoped package</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-neutral-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-5 text-xs">
              {/* Step 1: Select Official Curriculum Base */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 space-y-3">
                <label className="block text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                  1. Select Base Registered Curriculum Package
                </label>
                <select 
                  value={selectedCurriculumId} 
                  onChange={(e) => handleCurriculumChange(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2.5 text-white font-semibold outline-none focus:border-amber-500 text-xs"
                >
                  {Object.values(REGISTERED_CURRICULUM_SPECS).map((spec) => (
                    <option key={spec.id} value={spec.id}>
                      {spec.name} ({spec.gradeLevel})
                    </option>
                  ))}
                </select>

                {/* Auto-Populated Curriculum Classification Card */}
                <div className="p-3 bg-black/40 border border-neutral-800 rounded-lg space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Publisher:</span>
                    <span className="text-white font-semibold">{activeCurriculumSpec.publisher}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Subject & Grade:</span>
                    <span className="text-amber-300 font-semibold">{activeCurriculumSpec.subject} · {activeCurriculumSpec.gradeLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Curriculum Version:</span>
                    <span className="text-sky-300 font-semibold">{activeCurriculumSpec.version}</span>
                  </div>
                </div>
              </div>

              {/* Step 2: Package Title & Scoping Mode */}
              <div className="space-y-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Class / Package Title</label>
                  <input 
                    type="text" required value={newClassName} onChange={(e) => setNewClassName(e.target.value)}
                    placeholder={`e.g. ${activeCurriculumSpec.name} - Group A`}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">Package Scope Mode</label>
                    <select 
                      value={newScopeType} onChange={(e) => setNewScopeType(e.target.value as PackageScopeType)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                    >
                      <option value="SEMESTER">Semester / Term Scope</option>
                      <option value="CHAPTER_BUNDLE">Chapter Bundle</option>
                      <option value="LESSON_BUNDLE">Specific Lesson Bundle</option>
                      <option value="LESSON_QUANTITY">Lesson Quota Pass</option>
                      <option value="SINGLE_SESSION">Single Live Session Workshop</option>
                      <option value="FULL_PACKAGE">Full Academic Package</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">Academic Term Range</label>
                    <select 
                      value={selectedTermId} onChange={(e) => setSelectedTermId(e.target.value as any)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                    >
                      {activeCurriculumSpec.terms.map((t) => (
                        <option key={t.id} value={t.id}>{t.label} ({t.dateRange})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Dynamic Curriculum Chapter Checkboxes */}
              {newScopeType === "CHAPTER_BUNDLE" && (
                <div className="space-y-2 bg-neutral-900/40 p-3 rounded-xl border border-neutral-800">
                  <label className="block text-amber-400 font-bold text-xs">
                    Select Chapters from {activeCurriculumSpec.name}:
                  </label>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {activeCurriculumSpec.chapters.map((chapter) => {
                      const isSelected = selectedChapters.includes(chapter);
                      return (
                        <div 
                          key={chapter}
                          onClick={() => toggleChapterSelection(chapter)}
                          className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition ${
                            isSelected ? "border-amber-500 bg-amber-500/10 text-white" : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white"
                          }`}
                        >
                          <span>{chapter}</span>
                          {isSelected && <Check className="h-4 w-4 text-amber-500" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dynamic Curriculum Lesson Selector */}
              {newScopeType === "LESSON_BUNDLE" && (
                <div className="space-y-2 bg-neutral-900/40 p-3 rounded-xl border border-neutral-800">
                  <label className="block text-amber-400 font-bold text-xs">
                    Select Specific Lessons from {activeCurriculumSpec.name}:
                  </label>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {activeCurriculumSpec.lessons.map((lesson) => {
                      const isSelected = selectedLessonIds.includes(lesson.id);
                      return (
                        <div 
                          key={lesson.id}
                          onClick={() => toggleLessonSelection(lesson.id)}
                          className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition ${
                            isSelected ? "border-amber-500 bg-amber-500/10 text-white" : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white"
                          }`}
                        >
                          <span>{lesson.title}</span>
                          {isSelected && <Check className="h-4 w-4 text-amber-500" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Dynamic Volume Pricing Tiers */}
              <div className="border-t border-neutral-800 pt-3 space-y-2">
                <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-emerald-400" /> Student Volume Pricing Tiers ($ USD)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Tier 1 Rate (1–5 Students)</label>
                    <input 
                      type="number" value={newTier1Price} onChange={(e) => setNewTier1Price(Number(e.target.value))}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Tier 2 Rate (6–50 Students)</label>
                    <input 
                      type="number" value={newTier2Price} onChange={(e) => setNewTier2Price(Number(e.target.value))}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-800">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg bg-neutral-800 text-white font-semibold hover:bg-neutral-700">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-amber-500 text-black font-bold hover:bg-amber-400">
                  Save & Launch Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
