"use client";

import React, { useState, useEffect } from "react";
import { 
  ClassRegistry, 
  StudentProfile, 
  ClassRecord, 
  FollowUpRecord 
} from "../../core/services/class-registry";
import { 
  Target, 
  Activity, 
  Search, 
  AlertTriangle, 
  ArrowLeft, 
  Users, 
  DollarSign, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar, 
  Repeat, 
  CheckCircle2, 
  ShieldCheck,
  Send,
  Sparkles,
  Plus,
  Lock
} from "lucide-react";

export default function StudentFollowUp() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"academics" | "financials" | "parents">("academics");
  const [searchQuery, setSearchQuery] = useState("");
  const teacherPermissions = ClassRegistry.getTeacherPermissions("teacher_1");

  // Swapping State
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapFromClassId, setSwapFromClassId] = useState("");
  const [swapToClassId, setSwapToClassId] = useState("");

  // Parent Note State
  const [noteTitle, setNoteTitle] = useState("");
  const [noteMessage, setNoteMessage] = useState("");
  const [noteCategory, setNoteCategory] = useState<FollowUpRecord["category"]>("TEACHER_NOTE");
  const [noteTargetGuardian, setNoteTargetGuardian] = useState<"PRIMARY" | "SECONDARY" | "BOTH">("BOTH");

  const loadData = () => {
    const teacherId = "teacher_1";
    setClasses(ClassRegistry.getClassesByTeacher(teacherId));
    setStudents(ClassRegistry.getAllStudents());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.primaryParent?.name || s.parent?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.secondaryParent?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSwapSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !swapFromClassId || !swapToClassId) return;

    const result = ClassRegistry.swapStudentClass(selectedStudent.id, swapFromClassId, swapToClassId);
    if (result.success) {
      loadData();
      // Refresh selected student ref
      setSelectedStudent(ClassRegistry.getStudentById(selectedStudent.id) || null);
      setShowSwapModal(false);
    }
  };

  const handleSendParentNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !noteTitle || !noteMessage) return;

    ClassRegistry.addFollowUpNote({
      studentId: selectedStudent.id,
      createdAt: new Date().toISOString(),
      authorRole: "TEACHER",
      authorName: "Dr. Hassan",
      category: noteCategory,
      title: noteTitle,
      message: noteMessage,
      targetGuardian: noteTargetGuardian,
      status: "SENT"
    });

    loadData();
    setSelectedStudent(ClassRegistry.getStudentById(selectedStudent.id) || null);
    setNoteTitle("");
    setNoteMessage("");
  };

  if (selectedStudent) {
    const ledger = ClassRegistry.getStudentFinancialLedger(selectedStudent.id);

    return (
      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Back Navigation */}
        <button 
          onClick={() => setSelectedStudent(null)}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-semibold"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Student Roster
        </button>

        {/* ── Student 360° Profile Header ────────────────────────── */}
        <header className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-white">{selectedStudent.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                selectedStudent.status === "ACTIVE" ? "bg-emerald-500/20 text-emerald-400" : "bg-neutral-800 text-neutral-400"
              }`}>
                {selectedStudent.status}
              </span>
            </div>
            <p className="text-xs text-neutral-400 flex flex-wrap items-center gap-4">
              <span>Registration Date: <strong className="text-neutral-200">{selectedStudent.registrationDate}</strong></span>
              <span>Grade Level: <strong className="text-neutral-200">Grade {selectedStudent.gradeLevel}</strong></span>
              <span>Attendance: <strong className="text-emerald-400">{selectedStudent.attendanceRate}%</strong></span>
              <span>Overall Grade: <strong className="text-amber-400">{selectedStudent.overallGrade}%</strong></span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowSwapModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition"
            >
              <Repeat className="h-4 w-4" /> Swap Package / Class
            </button>
          </div>
        </header>

        {/* ── Navigation Tabs ──────────────────────────────────── */}
        <div className="flex gap-2 border-b border-neutral-800 pb-2">
          <button
            onClick={() => setActiveTab("academics")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "academics" ? "bg-amber-500 text-black" : "bg-neutral-900 text-neutral-400 hover:text-white"
            }`}
          >
            <Activity className="h-4 w-4" /> Academics & Diagnostics
          </button>
          <button
            onClick={() => setActiveTab("financials")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "financials" ? "bg-amber-500 text-black" : "bg-neutral-900 text-neutral-400 hover:text-white"
            }`}
          >
            <DollarSign className="h-4 w-4" /> Financial Ledger & Tied Packages ({ledger?.packageBreakdown.length})
          </button>
          <button
            onClick={() => setActiveTab("parents")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "parents" ? "bg-amber-500 text-black" : "bg-neutral-900 text-neutral-400 hover:text-white"
            }`}
          >
            <MessageSquare className="h-4 w-4" /> Parent 360 & Follow-up Logs ({selectedStudent.followUpLogs.length})
          </button>
        </div>

        {/* ── TAB 1: ACADEMICS & DIAGNOSTICS ───────────────────── */}
        {activeTab === "academics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
                <Target className="h-4 w-4" /> Flagged Weaknesses & Need Care Areas
              </h2>
              {selectedStudent.weaknesses.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.weaknesses.map(w => (
                    <span key={w} className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
                      ⚠️ {w}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-500">No active weaknesses flagged by diagnostic engine.</p>
              )}
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Enrolled Class Packages
              </h2>
              <div className="space-y-2">
                {ledger?.packageBreakdown.map((pkg) => (
                  <div key={pkg.classId} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-white">{pkg.className}</p>
                      <p className="text-neutral-400">{pkg.packageName} · Scope: <strong className="text-sky-400">{pkg.scopeType}</strong></p>
                    </div>
                    <span className="font-bold text-emerald-400">${pkg.effectiveRatePerStudent}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: FINANCIAL LEDGER & TIED PACKAGES ──────────── */}
        {activeTab === "financials" && ledger && (
          <div className="space-y-6">
            {/* Total Summary */}
            <div className="bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-950 border border-amber-500/30 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">Combined Student Financial Balance</p>
                <h3 className="text-3xl font-black text-white mt-1">${ledger.totalBalance} <span className="text-xs font-normal text-neutral-400">USD</span></h3>
                <p className="text-xs text-neutral-400 mt-1">Calculated across {ledger.packageBreakdown.length} individually tied package(s)</p>
              </div>
              <button onClick={() => setShowSwapModal(true)} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition">
                Swap Package & Adjust Billing
              </button>
            </div>

            {/* Individual Tied Packages Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Individually Calculated Package Costs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ledger.packageBreakdown.map((item) => (
                  <div key={item.classId} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 text-[10px] font-bold uppercase">{item.scopeType}</span>
                        <h4 className="font-bold text-white text-sm mt-1">{item.className}</h4>
                      </div>
                      <span className="text-lg font-bold text-emerald-400">${item.individualPackageCost}</span>
                    </div>
                    <div className="text-xs text-neutral-400 space-y-1 border-t border-neutral-800 pt-2">
                      <p>Active Class Student Volume: <strong className="text-white">{item.studentVolumeInClass} Students</strong></p>
                      <p>Volume Tier Effective Rate: <strong className="text-emerald-400">${item.effectiveRatePerStudent} / student</strong></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Billing Transaction History */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Billing & Swap Transaction History</h3>
              <div className="divide-y divide-neutral-800 text-xs">
                {ledger.billingTransactions.map((tx) => (
                  <div key={tx.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white">{tx.description}</p>
                      <p className="text-neutral-500">{new Date(tx.timestamp).toLocaleString()}</p>
                    </div>
                    <span className={`font-mono font-bold ${tx.amount > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                      {tx.amount > 0 ? `+$${tx.amount}` : `-$${Math.abs(tx.amount)}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: PARENT 360 & FOLLOW-UP LOGS ──────────────── */}
        {activeTab === "parents" && (
          <div className="space-y-6">
            {/* Dual Parent & Follow-up Relatives Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Primary Parent */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    Primary Parent / Guardian 1
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> {(selectedStudent.primaryParent || selectedStudent.parent).preferredChannel}
                  </span>
                </div>
                <div>
                  <p className="text-base font-bold text-white">{(selectedStudent.primaryParent || selectedStudent.parent).name}</p>
                  <p className="text-xs text-neutral-400">Relationship: <strong className="text-neutral-200">{(selectedStudent.primaryParent || selectedStudent.parent).relationship}</strong></p>
                </div>
                <div className="space-y-1.5 text-xs text-neutral-300">
                  <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-neutral-500" /> {(selectedStudent.primaryParent || selectedStudent.parent).email}</p>
                  <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-neutral-500" /> {(selectedStudent.primaryParent || selectedStudent.parent).phone}</p>
                </div>
                <div className="flex gap-2 pt-2 border-t border-neutral-800/80 text-[11px]">
                  <a href={`tel:${(selectedStudent.primaryParent || selectedStudent.parent).phone}`} className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-center font-bold text-white transition">
                    Call
                  </a>
                  <a href={`https://wa.me/${(selectedStudent.primaryParent || selectedStudent.parent).phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="flex-1 py-1.5 bg-emerald-600/30 border border-emerald-500/40 hover:bg-emerald-600/50 rounded-lg text-center font-bold text-emerald-300 transition">
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Secondary Parent / Follow-up Relative */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                    Secondary Parent / Relative 2
                  </span>
                  {selectedStudent.secondaryParent ? (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" /> {selectedStudent.secondaryParent.preferredChannel}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-neutral-500">Unregistered</span>
                  )}
                </div>
                {selectedStudent.secondaryParent ? (
                  <>
                    <div>
                      <p className="text-base font-bold text-white">{selectedStudent.secondaryParent.name}</p>
                      <p className="text-xs text-neutral-400">Relationship: <strong className="text-neutral-200">{selectedStudent.secondaryParent.relationship}</strong></p>
                    </div>
                    <div className="space-y-1.5 text-xs text-neutral-300">
                      <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-neutral-500" /> {selectedStudent.secondaryParent.email}</p>
                      <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-neutral-500" /> {selectedStudent.secondaryParent.phone}</p>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-neutral-800/80 text-[11px]">
                      <a href={`tel:${selectedStudent.secondaryParent.phone}`} className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-center font-bold text-white transition">
                        Call
                      </a>
                      <a href={`https://wa.me/${selectedStudent.secondaryParent.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="flex-1 py-1.5 bg-emerald-600/30 border border-emerald-500/40 hover:bg-emerald-600/50 rounded-lg text-center font-bold text-emerald-300 transition">
                        WhatsApp
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="py-6 text-center text-neutral-500 text-xs">
                    No secondary relative registered. Student can add a 2nd guardian during registration.
                  </div>
                )}
              </div>
            </div>

            {/* Send Follow-up Note */}
            {teacherPermissions.canContactParents ? (
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Send className="h-4 w-4 text-amber-500" /> Log Teacher Follow-up / Send Parent Update
                </h3>
                <form onSubmit={handleSendParentNote} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input 
                      type="text" required placeholder="Note Title..." value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)}
                      className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500 sm:col-span-1"
                    />
                    <select 
                      value={noteCategory} onChange={(e) => setNoteCategory(e.target.value as any)}
                      className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                    >
                      <option value="TEACHER_NOTE">Teacher Note</option>
                      <option value="PARENT_NOTIFICATION">Parent Notification</option>
                      <option value="ACADEMIC_WARNING">Academic Warning</option>
                      <option value="COMMENDATION">Commendation / Praise</option>
                    </select>
                    <select 
                      value={noteTargetGuardian} onChange={(e) => setNoteTargetGuardian(e.target.value as any)}
                      className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-amber-400 font-bold outline-none focus:border-amber-500"
                    >
                      <option value="BOTH">👥 Send to Both Guardians</option>
                      <option value="PRIMARY">👤 Primary Parent Only</option>
                      <option value="SECONDARY">👤 Secondary Relative Only</option>
                    </select>
                  </div>
                  <textarea 
                    required rows={3} placeholder="Write evaluation detail or guidance for parent..." value={noteMessage} onChange={(e) => setNoteMessage(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                  <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition">
                    Save & Dispatch to Guardians
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-neutral-950 border border-red-500/30 rounded-2xl p-5 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-red-400 font-bold">
                  <Lock className="h-4 w-4" /> Direct Parent Messaging Restricted
                </div>
                <p className="text-neutral-400">
                  Platform Admin has disabled outbound parent communication for your teacher account. You can view student contact info and communication logs, but direct messages cannot be dispatched.
                </p>
              </div>
            )}

            {/* Logs List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Communication & Evaluation Logs</h3>
              <div className="space-y-3">
                {selectedStudent.followUpLogs.map((log) => (
                  <div key={log.id} className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-amber-400">{log.category.replace("_", " ")}</span>
                      <span className="text-neutral-500">{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm">{log.title}</h4>
                    <p className="text-neutral-300 leading-relaxed">{log.message}</p>
                    <div className="flex justify-between items-center text-neutral-500 border-t border-neutral-800/60 pt-2 mt-2">
                      <span>Author: {log.authorName} ({log.authorRole})</span>
                      <span className="text-emerald-400 font-semibold">{log.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL: ONE-CLICK PACKAGE SWAPPER ──────────────────── */}
        {showSwapModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 max-w-md w-full space-y-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Repeat className="h-5 w-5 text-amber-500" /> Swap Student Package / Class
              </h2>

              <form onSubmit={handleSwapSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Swap OUT of (Current Class):</label>
                  <select 
                    required value={swapFromClassId} onChange={(e) => setSwapFromClassId(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                  >
                    <option value="">Select current class...</option>
                    {selectedStudent.enrolledClassIds.map((cid) => {
                      const c = ClassRegistry.getClassById(cid);
                      return c ? <option key={c.id} value={c.id}>{c.name} (${ClassRegistry.calculateEffectiveRate(c)})</option> : null;
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Swap INTO (Target Class):</label>
                  <select 
                    required value={swapToClassId} onChange={(e) => setSwapToClassId(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                  >
                    <option value="">Select new target class...</option>
                    {classes.filter((c) => !selectedStudent.enrolledClassIds.includes(c.id)).map((c) => (
                      <option key={c.id} value={c.id}>{c.name} (${ClassRegistry.calculateEffectiveRate(c)})</option>
                    ))}
                  </select>
                </div>

                {/* Financial Adjustment Preview */}
                {swapFromClassId && swapToClassId && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
                    <p className="font-bold text-xs">Financial Adjustment Preview:</p>
                    <p>Credit From Class: <strong className="text-emerald-400">-${ClassRegistry.calculateEffectiveRate(ClassRegistry.getClassById(swapFromClassId)!)}</strong></p>
                    <p>Debit To Class: <strong className="text-red-400">+${ClassRegistry.calculateEffectiveRate(ClassRegistry.getClassById(swapToClassId)!)}</strong></p>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                  <button type="button" onClick={() => setShowSwapModal(false)} className="px-4 py-2 rounded-lg bg-neutral-800 text-white font-semibold">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-amber-500 text-black font-bold hover:bg-amber-400">
                    Confirm Swap & Adjust Billing
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Roster View
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Student 360° Roster & Follow-up</h1>
          <p className="text-neutral-400 text-xs">Inspect registration timelines, parent details, tied packages, and financial ledgers.</p>
        </div>
      </header>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
        <input 
          type="text" 
          placeholder="Search students or parent names..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-amber-500"
        />
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-900 text-neutral-400 border-b border-neutral-800">
            <tr>
              <th className="px-6 py-4 font-semibold">Student Name</th>
              <th className="px-6 py-4 font-semibold">Parent & Contact</th>
              <th className="px-6 py-4 font-semibold">Tied Packages</th>
              <th className="px-6 py-4 font-semibold">Total Balance</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 text-neutral-300">
            {filteredStudents.map((student) => {
              const ledger = ClassRegistry.getStudentFinancialLedger(student.id);
              return (
                <tr key={student.id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">
                    {student.name}
                    <p className="text-[10px] text-neutral-500 font-normal">Reg: {student.registrationDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-neutral-200">{student.parent.name}</p>
                    <p className="text-[10px] text-neutral-400">{student.parent.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold text-[10px]">
                      {student.enrolledClassIds.length} Tied Packages
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-400">
                    ${ledger?.totalBalance} USD
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedStudent(student)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold transition text-xs"
                    >
                      View 360° Profile
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
