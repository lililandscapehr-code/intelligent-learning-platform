"use client";

import React, { ChangeEvent, useState, useEffect } from "react";
import {
  Activity, BookOpen, CreditCard, Database, ShieldCheck,
  Upload, Users, Lock, Sparkles, UserCheck, Trash2,
  PlusCircle, Settings, ChevronDown, ChevronUp, AlertTriangle,
  CheckCircle, X, Info, ToggleLeft, ToggleRight, Edit3,
  Cpu, Server, Key, RefreshCw, MessageSquare, Video, Mic,
  Sliders, Eye, EyeOff, Layers
} from "lucide-react";
import { 
  uploadCurriculumPackage,
  getAIConfigAction,
  saveAIConfigAction,
  testAIConnectionAction
} from "../../app/actions";
import type { CurriculumPackage } from "../../contracts/curriculum";
import {
  ClassRegistry,
  REGISTERED_CURRICULUM_SPECS,
  CurriculumSpec,
  CurriculumPolicy,
  CurriculumRemovalReport,
  DEFAULT_CURRICULUM_POLICY,
  TeacherAssignment,
  TeacherPermissions
} from "../../core/services/class-registry";
import { AIConfiguration, DEFAULT_AI_CONFIG } from "../../core/services/ai-provider";

interface AdminControlCenterProps {
  onCurriculumAdded: (curriculum: CurriculumPackage) => void;
}

type AdminTab = "registry" | "add" | "teachers" | "ai";

// ── Helper ────────────────────────────────────────────────────────────────────
function PolicyBadge({ on, label }: { on: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
      on ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
         : "bg-neutral-800 text-neutral-500 border-neutral-700"
    }`}>
      {on ? "✓" : "✗"} {label}
    </span>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)} className="focus:outline-none transition">
      {value
        ? <ToggleRight className="h-6 w-6 text-emerald-400" />
        : <ToggleLeft className="h-6 w-6 text-neutral-500" />}
    </button>
  );
}

// ── Policy Editor Panel ───────────────────────────────────────────────────────
function PolicyEditor({
  policy, onChange
}: { policy: CurriculumPolicy; onChange: (p: CurriculumPolicy) => void }) {
  const set = <K extends keyof CurriculumPolicy>(k: K, v: CurriculumPolicy[K]) =>
    onChange({ ...policy, [k]: v });

  return (
    <div className="space-y-3 text-xs">
      <div className="grid grid-cols-2 gap-3">
        {[
          { key: "allowTeacherCustomSlides" as const, label: "Teacher Custom Slides" },
          { key: "allowTeacherCustomQuestions" as const, label: "Teacher Custom Questions" },
          { key: "aiTankEnabled" as const, label: "AI Tank Enabled" },
          { key: "teacherMustBeVerified" as const, label: "Require Verified Teacher" },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2">
            <span className="text-neutral-300 font-medium">{label}</span>
            <Toggle value={policy[key] as boolean} onChange={v => set(key, v)} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-neutral-400 block mb-1">Max Authorized Teachers <span className="text-neutral-500">(0 = unlimited)</span></span>
          <input type="number" min={0} value={policy.maxAuthorizedTeachers}
            onChange={e => set("maxAuthorizedTeachers", Number(e.target.value))}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500" />
        </label>
        <label className="block">
          <span className="text-neutral-400 block mb-1">Expiry Date <span className="text-neutral-500">(leave blank = no expiry)</span></span>
          <input type="date" value={policy.expiryDate ?? ""}
            onChange={e => set("expiryDate", e.target.value || null)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500" />
        </label>
      </div>

      <label className="block">
        <span className="text-neutral-400 block mb-1">Admin Notes (internal)</span>
        <textarea rows={2} value={policy.notes} onChange={e => set("notes", e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500 resize-none" />
      </label>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AdminControlCenter({ onCurriculumAdded }: AdminControlCenterProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("registry");

  // Registry state
  const [specs, setSpecs] = useState<CurriculumSpec[]>(() => Object.values(REGISTERED_CURRICULUM_SPECS));
  const [editingPolicyFor, setEditingPolicyFor] = useState<string | null>(null);
  const [editedPolicy, setEditedPolicy] = useState<CurriculumPolicy>(DEFAULT_CURRICULUM_POLICY);

  // Remove modal state
  const [removeTarget, setRemoveTarget] = useState<CurriculumSpec | null>(null);
  const [removeDeps, setRemoveDeps] = useState<{ authorizedTeachers: TeacherAssignment[]; affectedPackages: { name: string }[] } | null>(null);
  const [removalReport, setRemovalReport] = useState<CurriculumRemovalReport | null>(null);

  // Add curriculum form state
  const [newSpec, setNewSpec] = useState<Partial<CurriculumSpec>>({
    id: "", name: "", publisher: "", subject: "", gradeLevel: "", version: "",
    terms: [], chapters: [], lessons: [], policy: { ...DEFAULT_CURRICULUM_POLICY }
  });
  const [newChapter, setNewChapter] = useState("");
  const [addResult, setAddResult] = useState<{ success: boolean; message: string } | null>(null);

  // Upload state
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Teacher assignments & permissions state
  const [teacherAssignments, setTeacherAssignments] = useState<TeacherAssignment[]>(() =>
    ClassRegistry.getAllTeacherAssignments()
  );

  // AI Configuration state
  const [aiConfig, setAIConfig] = useState<AIConfiguration>(DEFAULT_AI_CONFIG);
  const [aiTesting, setAITesting] = useState(false);
  const [aiTestResult, setAITestResult] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [aiSaveMsg, setAISaveMsg] = useState<string | null>(null);

  const refreshSpecs = () => setSpecs(Object.values(REGISTERED_CURRICULUM_SPECS));
  const refreshTeachers = () => setTeacherAssignments([...ClassRegistry.getAllTeacherAssignments()]);

  // Load AI configuration on mount
  useEffect(() => {
    getAIConfigAction().then(res => {
      if (res.success && res.data) {
        setAIConfig(res.data);
      }
    });
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handlePackageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setIsUploading(true);
    setUploadStatus(`Verifying ${file.name}...`);
    try {
      const packageData = JSON.parse(await file.text()) as CurriculumPackage;
      const result = await uploadCurriculumPackage(packageData);
      if (!result.success) { setUploadStatus(`Upload failed: ${result.errors.join("; ")}`); return; }
      onCurriculumAdded(packageData);
      setUploadStatus(`✓ ${packageData.identity.name} imported and registered.`);
      refreshSpecs();
    } catch { setUploadStatus("Upload failed: choose a valid curriculum package JSON file."); }
    finally { setIsUploading(false); }
  };

  const openRemoveModal = (spec: CurriculumSpec) => {
    setRemoveTarget(spec);
    setRemovalReport(null);
    const deps = ClassRegistry.getCurriculumDependencies(spec.id);
    setRemoveDeps(deps as any);
  };

  const confirmRemove = () => {
    if (!removeTarget) return;
    const result = ClassRegistry.removeCurriculumSpec(removeTarget.id);
    if (result.success) {
      setRemovalReport(result.report);
      refreshSpecs();
      refreshTeachers();
    }
  };

  const handleSavePolicy = (curriculumId: string) => {
    ClassRegistry.updateCurriculumPolicy(curriculumId, editedPolicy);
    setEditingPolicyFor(null);
    refreshSpecs();
  };

  const handleAddCurriculum = () => {
    if (!newSpec.id || !newSpec.name || !newSpec.publisher || !newSpec.subject || !newSpec.gradeLevel) {
      setAddResult({ success: false, message: "Please fill in all required fields (ID, Name, Publisher, Subject, Grade Level)." });
      return;
    }
    const result = ClassRegistry.addCurriculumSpec(newSpec as CurriculumSpec);
    setAddResult(result);
    if (result.success) {
      refreshSpecs();
      setNewSpec({ id: "", name: "", publisher: "", subject: "", gradeLevel: "", version: "", terms: [], chapters: [], lessons: [], policy: { ...DEFAULT_CURRICULUM_POLICY } });
      setNewChapter("");
    }
  };

  const handleToggleTeacherCurriculum = (teacherId: string, curriculumId: string, isAuthorized: boolean) => {
    if (isAuthorized) ClassRegistry.revokeCurriculumFromTeacher(teacherId, curriculumId);
    else ClassRegistry.assignCurriculumToTeacher(teacherId, curriculumId);
    refreshTeachers();
  };

  const handleUpdateTeacherPermission = (teacherId: string, permKey: keyof TeacherPermissions, value: boolean) => {
    ClassRegistry.updateTeacherPermissions(teacherId, { [permKey]: value });
    refreshTeachers();
  };

  // ── AI Configuration Handlers ─────────────────────────────────────────────
  const handleTestAIConnection = async () => {
    setAITesting(true);
    setAITestResult(null);
    try {
      const res = await testAIConnectionAction(aiConfig);
      if (res.success && res.data) {
        setAITestResult({
          success: true,
          message: res.data.message,
          latencyMs: res.data.latencyMs
        });
      } else {
        setAITestResult({
          success: false,
          message: res.errors[0] || "Connection test failed."
        });
      }
    } catch (err: any) {
      setAITestResult({
        success: false,
        message: err?.message || "Failed to reach AI provider."
      });
    } finally {
      setAITesting(false);
    }
  };

  const handleSaveAIConfig = async () => {
    const res = await saveAIConfigAction(aiConfig);
    if (res.success) {
      setAISaveMsg("✓ AI Configuration updated successfully.");
      setTimeout(() => setAISaveMsg(null), 4000);
    } else {
      setAISaveMsg(`Error: ${res.errors.join(", ")}`);
    }
  };

  // ── Tabs ──────────────────────────────────────────────────────────────────
  const tabs: { key: AdminTab; label: string; icon: React.ElementType }[] = [
    { key: "registry", label: "📋 Curriculum Registry", icon: BookOpen },
    { key: "add", label: "➕ Add New Curriculum", icon: PlusCircle },
    { key: "teachers", label: "👩‍🏫 Teacher Governance & Permissions", icon: UserCheck },
    { key: "ai", label: "🤖 AI & Ollama Engine Settings", icon: Cpu },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-400">Administration & Governance</p>
        <h2 className="mt-1 text-2xl font-bold text-white">Platform Control Center</h2>
        <p className="mt-1 text-sm text-neutral-400">Complete governance over Curricula, Teacher Capabilities, Permissions, and AI / Ollama Infrastructure.</p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Registered Curricula", value: `${specs.length}`, icon: BookOpen },
          { label: "Managed Teachers", value: `${teacherAssignments.length}`, icon: UserCheck },
          { label: "AI Provider Active", value: aiConfig.provider.toUpperCase(), icon: Cpu },
          { label: "Governance Status", value: "100% Locked", icon: ShieldCheck },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
            <Icon className="h-5 w-5 text-red-400" />
            <p className="mt-4 text-xs text-neutral-500">{label}</p>
            <p className="mt-1 text-xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-800 pb-0 overflow-x-auto">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg border-b-2 transition whitespace-nowrap ${
              activeTab === key
                ? "border-amber-500 text-amber-400 bg-amber-500/5"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}>
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {/* ── TAB 1: CURRICULUM REGISTRY ─────────────────────────────────── */}
      {activeTab === "registry" && (
        <div className="space-y-4">
          {/* Import JSON button */}
          <div className="flex items-center justify-between bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-red-400" />
              <span className="text-xs text-neutral-300 font-semibold">Import Official Curriculum JSON</span>
              <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">ADMIN ONLY</span>
            </div>
            <label className={`inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-500 transition ${isUploading ? "opacity-60 pointer-events-none" : ""}`}>
              <Upload className="h-3.5 w-3.5" />
              {isUploading ? "Verifying..." : "Upload JSON"}
              <input type="file" accept="application/json,.json" className="sr-only" onChange={handlePackageUpload} disabled={isUploading} />
            </label>
          </div>
          {uploadStatus && <p className="text-xs p-3 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-300">{uploadStatus}</p>}

          {/* Curriculum table */}
          <div className="space-y-3">
            {specs.map(spec => {
              const deps = ClassRegistry.getCurriculumDependencies(spec.id);
              const isEditingThis = editingPolicyFor === spec.id;

              return (
                <div key={spec.id} className="bg-neutral-900/70 border border-neutral-800 rounded-2xl overflow-hidden">
                  {/* Spec header row */}
                  <div className="flex items-start gap-4 p-5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white text-sm">{spec.name}</h3>
                        <span className="text-[10px] bg-sky-500/15 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full">{spec.subject}</span>
                        <span className="text-[10px] bg-neutral-800 text-neutral-400 border border-neutral-700 px-2 py-0.5 rounded-full">{spec.gradeLevel}</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-1">{spec.publisher} · v{spec.version}</p>

                      {/* Policy badges */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <PolicyBadge on={spec.policy?.aiTankEnabled !== false} label="AI Tank" />
                        <PolicyBadge on={spec.policy?.allowTeacherCustomSlides !== false} label="Custom Slides" />
                        <PolicyBadge on={spec.policy?.allowTeacherCustomQuestions !== false} label="Custom Questions" />
                        {spec.policy?.maxAuthorizedTeachers ? (
                          <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                            Max {spec.policy.maxAuthorizedTeachers} Teachers
                          </span>
                        ) : null}
                        {spec.policy?.expiryDate && (
                          <span className="text-[10px] bg-red-500/15 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">
                            Expires {spec.policy.expiryDate}
                          </span>
                        )}
                      </div>

                      {/* Dependency counts */}
                      <div className="flex gap-4 mt-2 text-[11px] text-neutral-400">
                        <span><span className="text-amber-400 font-bold">{deps.authorizedTeachers.length}</span> authorized teachers</span>
                        <span><span className="text-sky-400 font-bold">{deps.affectedPackages.length}</span> active packages</span>
                        <span><span className="text-neutral-500">{spec.chapters.length}</span> chapters · <span className="text-neutral-500">{spec.lessons.length}</span> lessons</span>
                        {spec.registeredAt && <span>Registered {spec.registeredAt}</span>}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => {
                          if (isEditingThis) { setEditingPolicyFor(null); }
                          else { setEditingPolicyFor(spec.id); setEditedPolicy(spec.policy ?? { ...DEFAULT_CURRICULUM_POLICY }); }
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-amber-500/20 text-neutral-300 hover:text-amber-300 border border-neutral-700 hover:border-amber-500/40 rounded-lg text-[11px] font-bold transition"
                      >
                        <Edit3 className="h-3 w-3" /> {isEditingThis ? "Cancel" : "Edit Policy"}
                      </button>
                      <button
                        onClick={() => openRemoveModal(spec)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-300 border border-neutral-700 hover:border-red-500/40 rounded-lg text-[11px] font-bold transition"
                      >
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  </div>

                  {/* Inline policy editor */}
                  {isEditingThis && (
                    <div className="border-t border-neutral-800 bg-neutral-950/60 p-5 space-y-4">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                        <Settings className="h-3.5 w-3.5" /> Editing Policy for: {spec.name}
                      </h4>
                      <PolicyEditor policy={editedPolicy} onChange={setEditedPolicy} />
                      <button
                        onClick={() => handleSavePolicy(spec.id)}
                        className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs transition"
                      >
                        ✓ Save Policy
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 2: ADD NEW CURRICULUM ──────────────────────────────────── */}
      {activeTab === "add" && (
        <div className="space-y-5">
          <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PlusCircle className="h-4 w-4 text-emerald-400" /> Register New Official Curriculum
            </h3>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {[
                { key: "id", label: "Curriculum ID *", placeholder: "e.g. egypt-physics-grade9-2027", hint: "Unique slug, no spaces" },
                { key: "name", label: "Full Name *", placeholder: "e.g. Egyptian Secondary Physics Grade 9" },
                { key: "publisher", label: "Publisher *", placeholder: "e.g. Egyptian Ministry of Education" },
                { key: "subject", label: "Subject *", placeholder: "e.g. Physics, Mathematics, Biology" },
                { key: "gradeLevel", label: "Grade Level *", placeholder: "e.g. Secondary 1 (Grade 10)" },
                { key: "version", label: "Version / Edition", placeholder: "e.g. 2027-2028 Syllabus" },
              ].map(({ key, label, placeholder, hint }) => (
                <label key={key} className="block">
                  <span className="text-neutral-400 block mb-1 font-semibold">{label}</span>
                  {hint && <span className="text-[10px] text-neutral-500 block mb-1">{hint}</span>}
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={(newSpec as any)[key] ?? ""}
                    onChange={e => setNewSpec(s => ({ ...s, [key]: e.target.value }))}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                </label>
              ))}
            </div>

            {/* Chapters */}
            <div className="space-y-2 text-xs">
              <label className="text-neutral-400 font-semibold block">Chapters / Modules</label>
              <div className="flex gap-2">
                <input
                  type="text" placeholder="Add a chapter name..."
                  value={newChapter}
                  onChange={e => setNewChapter(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && newChapter.trim()) { setNewSpec(s => ({ ...s, chapters: [...(s.chapters ?? []), newChapter.trim()] })); setNewChapter(""); } }}
                  className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => { if (newChapter.trim()) { setNewSpec(s => ({ ...s, chapters: [...(s.chapters ?? []), newChapter.trim()] })); setNewChapter(""); } }}
                  className="px-4 py-2 bg-neutral-800 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg font-bold transition"
                >
                  + Add
                </button>
              </div>
              {(newSpec.chapters ?? []).length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {(newSpec.chapters ?? []).map((ch, i) => (
                    <span key={i} className="flex items-center gap-1.5 bg-neutral-800 border border-neutral-700 text-neutral-300 px-2.5 py-1 rounded-lg text-[11px]">
                      {ch}
                      <button onClick={() => setNewSpec(s => ({ ...s, chapters: s.chapters?.filter((_, j) => j !== i) }))} className="text-neutral-500 hover:text-red-400">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Policy */}
            <div className="border-t border-neutral-800 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Settings className="h-3.5 w-3.5" /> Curriculum Policies
              </h4>
              <PolicyEditor
                policy={newSpec.policy ?? DEFAULT_CURRICULUM_POLICY}
                onChange={p => setNewSpec(s => ({ ...s, policy: p }))}
              />
            </div>

            {addResult && (
              <div className={`p-3 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                addResult.success ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300" : "bg-red-950/40 border-red-500/40 text-red-300"
              }`}>
                {addResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                {addResult.message}
              </div>
            )}

            <button
              onClick={handleAddCurriculum}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-lg"
            >
              ✓ Register Curriculum
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 3: TEACHER GOVERNANCE & PERMISSIONS ────────────────────── */}
      {activeTab === "teachers" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-amber-500" />
                Teacher Capability & Permissions Governance
              </h3>
              <p className="text-xs text-neutral-400">Admin decides: whom of teachers can add custom carousels, whom can contact parents, and which curriculums each teacher can package.</p>
            </div>
            <span className="text-[11px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold">
              PER-TEACHER CONTROLS
            </span>
          </div>

          <div className="space-y-4">
            {teacherAssignments.map(assignment => (
              <div key={assignment.teacherId} className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4">
                {/* Teacher Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base">{assignment.teacherName}</h4>
                    <p className="text-xs text-neutral-400">{assignment.teacherEmail} · ID: {assignment.teacherId}</p>
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                    {assignment.approvedCurriculumIds.length} / {specs.length} Curricula Authorized
                  </span>
                </div>

                {/* Granular Teacher Permissions Section */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                    🛡️ Teacher Action & Capability Permissions
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    {/* Permission 1: Add Custom Carousels */}
                    <div className={`p-3 rounded-xl border flex items-center justify-between transition ${
                      assignment.permissions.canAddCarousels
                        ? "bg-amber-950/20 border-amber-500/40 text-amber-200"
                        : "bg-neutral-900 border-neutral-800 text-neutral-500"
                    }`}>
                      <div className="pr-2">
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          <Layers className="h-4 w-4 text-amber-400" />
                          <span>Add Carousels</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-0.5">Author custom slides/quizzes</p>
                      </div>
                      <Toggle 
                        value={assignment.permissions.canAddCarousels} 
                        onChange={v => handleUpdateTeacherPermission(assignment.teacherId, "canAddCarousels", v)} 
                      />
                    </div>

                    {/* Permission 2: Contact Parents */}
                    <div className={`p-3 rounded-xl border flex items-center justify-between transition ${
                      assignment.permissions.canContactParents
                        ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-200"
                        : "bg-neutral-900 border-neutral-800 text-neutral-500"
                    }`}>
                      <div className="pr-2">
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          <MessageSquare className="h-4 w-4 text-emerald-400" />
                          <span>Contact Parents</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-0.5">Direct messaging & updates</p>
                      </div>
                      <Toggle 
                        value={assignment.permissions.canContactParents} 
                        onChange={v => handleUpdateTeacherPermission(assignment.teacherId, "canContactParents", v)} 
                      />
                    </div>

                    {/* Permission 3: Record Screen Demos */}
                    <div className={`p-3 rounded-xl border flex items-center justify-between transition ${
                      assignment.permissions.canRecordDemos
                        ? "bg-purple-950/20 border-purple-500/40 text-purple-200"
                        : "bg-neutral-900 border-neutral-800 text-neutral-500"
                    }`}>
                      <div className="pr-2">
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          <Mic className="h-4 w-4 text-purple-400" />
                          <span>Record Studio</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-0.5">Screen & voice DSP enhancer</p>
                      </div>
                      <Toggle 
                        value={assignment.permissions.canRecordDemos} 
                        onChange={v => handleUpdateTeacherPermission(assignment.teacherId, "canRecordDemos", v)} 
                      />
                    </div>

                    {/* Permission 4: Host Live Hybrid Sessions */}
                    <div className={`p-3 rounded-xl border flex items-center justify-between transition ${
                      assignment.permissions.canHostLiveSessions
                        ? "bg-sky-950/20 border-sky-500/40 text-sky-200"
                        : "bg-neutral-900 border-neutral-800 text-neutral-500"
                    }`}>
                      <div className="pr-2">
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          <Video className="h-4 w-4 text-sky-400" />
                          <span>Host Live Classes</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-0.5">Google Meet & Zoom setup</p>
                      </div>
                      <Toggle 
                        value={assignment.permissions.canHostLiveSessions} 
                        onChange={v => handleUpdateTeacherPermission(assignment.teacherId, "canHostLiveSessions", v)} 
                      />
                    </div>
                  </div>
                </div>

                {/* Curriculum Assignment Matrix for this teacher */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Curriculum Packaging Authorization
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {specs.map(spec => {
                      const isAuthorized = assignment.approvedCurriculumIds.includes(spec.id);
                      return (
                        <div key={spec.id} className={`p-3 rounded-xl border flex items-center justify-between text-xs transition ${
                          isAuthorized ? "bg-emerald-950/30 border-emerald-500/40" : "bg-neutral-950 border-neutral-800"
                        }`}>
                          <div className="truncate pr-2">
                            <p className="font-bold text-white truncate">{spec.name}</p>
                            <p className="text-[10px] text-neutral-400">{spec.gradeLevel}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleTeacherCurriculum(assignment.teacherId, spec.id, isAuthorized)}
                            className={`shrink-0 px-3 py-1 rounded-lg font-bold text-[11px] transition ${
                              isAuthorized ? "bg-emerald-600 hover:bg-red-600 text-white" : "bg-neutral-800 hover:bg-emerald-600 text-neutral-300 hover:text-white"
                            }`}
                          >
                            {isAuthorized ? "✓ Authorized" : "+ Authorize"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: AI & OLLAMA ENGINE SETTINGS ─────────────────────────── */}
      {activeTab === "ai" && (
        <div className="space-y-5">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 font-bold">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    AI & Ollama Engine Configuration
                    <span className="text-[10px] bg-violet-500/20 text-violet-400 border border-violet-500/30 px-2 py-0.5 rounded-full font-bold">
                      ADMIN MANAGED
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400">Admin selects AI engine provider, model parameters, API credentials, and local Ollama endpoint.</p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-violet-500/10 text-violet-300 border border-violet-500/20">
                Provider: {aiConfig.provider.toUpperCase()}
              </span>
            </div>

            {/* Provider Selection Cards */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">1. Select AI Backend Provider</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    id: "ollama" as const,
                    title: "Ollama (Local LLM)",
                    sub: "100% On-Premise, zero API cost",
                    icon: Server,
                    tag: "LOCAL PRIVACY"
                  },
                  {
                    id: "gemini" as const,
                    title: "Google Gemini API",
                    sub: "Gemini 2.5 Flash, Multimodal vision & reasoning",
                    icon: Sparkles,
                    tag: "CLOUD FAST"
                  },
                  {
                    id: "openai" as const,
                    title: "OpenAI / Custom REST",
                    sub: "Compatible with GPT-4o, Azure, vLLM, DeepSeek",
                    icon: Key,
                    tag: "REST API"
                  }
                ].map(({ id, title, sub, icon: Icon, tag }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setAIConfig(prev => ({ ...prev, provider: id }))}
                    className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                      aiConfig.provider === id
                        ? "bg-violet-950/40 border-violet-500 text-white shadow-lg shadow-violet-950/50"
                        : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`h-5 w-5 ${aiConfig.provider === id ? "text-violet-400" : "text-neutral-500"}`} />
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        aiConfig.provider === id
                          ? "bg-violet-500/20 text-violet-300 border-violet-500/40"
                          : "bg-neutral-800 text-neutral-500 border-neutral-700"
                      }`}>
                        {tag}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white">{title}</p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Provider Configuration Forms */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 space-y-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                2. {aiConfig.provider.toUpperCase()} Provider Parameters
              </span>

              {aiConfig.provider === "ollama" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <label className="block">
                    <span className="text-neutral-300 block mb-1 font-semibold">Ollama Server Endpoint URL</span>
                    <input
                      type="text"
                      value={aiConfig.ollamaEndpoint}
                      onChange={e => setAIConfig(prev => ({ ...prev, ollamaEndpoint: e.target.value }))}
                      placeholder="http://127.0.0.1:11434"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500"
                    />
                    <span className="text-[10px] text-neutral-500 mt-1 block">Default local port is 11434</span>
                  </label>

                  <label className="block">
                    <span className="text-neutral-300 block mb-1 font-semibold">Ollama Model Name</span>
                    <input
                      type="text"
                      value={aiConfig.ollamaModel}
                      onChange={e => setAIConfig(prev => ({ ...prev, ollamaModel: e.target.value }))}
                      placeholder="e.g. qwen2.5:3b, llama3.2, deepseek-r1:7b, mistral"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500"
                    />
                    <div className="flex gap-1.5 mt-1.5">
                      {["qwen2.5:3b", "llama3.2", "deepseek-r1:7b", "mistral"].map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setAIConfig(prev => ({ ...prev, ollamaModel: m }))}
                          className="text-[10px] bg-neutral-800 hover:bg-violet-900/40 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700"
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </label>
                </div>
              )}

              {aiConfig.provider === "gemini" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <label className="block">
                    <span className="text-neutral-300 block mb-1 font-semibold">Google Gemini API Key</span>
                    <div className="relative">
                      <input
                        type={showApiKey ? "text" : "password"}
                        value={aiConfig.apiKey}
                        onChange={e => setAIConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                        placeholder="AIzaSy..."
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 pr-9 text-white outline-none focus:border-violet-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-white"
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-neutral-500 mt-1 block">Leave blank to use environment AI_API_KEY</span>
                  </label>

                  <label className="block">
                    <span className="text-neutral-300 block mb-1 font-semibold">Gemini Model</span>
                    <select
                      value={aiConfig.apiModel}
                      onChange={e => setAIConfig(prev => ({ ...prev, apiModel: e.target.value }))}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500 font-semibold"
                    >
                      <option value="gemini-2.5-flash">gemini-2.5-flash (Fast, Recommended)</option>
                      <option value="gemini-2.5-pro">gemini-2.5-pro (Deep Reasoning)</option>
                      <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                      <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                    </select>
                  </label>
                </div>
              )}

              {aiConfig.provider === "openai" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <label className="block">
                    <span className="text-neutral-300 block mb-1 font-semibold">API Base URL</span>
                    <input
                      type="text"
                      value={aiConfig.apiBaseUrl}
                      onChange={e => setAIConfig(prev => ({ ...prev, apiBaseUrl: e.target.value }))}
                      placeholder="https://api.openai.com/v1"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500"
                    />
                  </label>

                  <label className="block">
                    <span className="text-neutral-300 block mb-1 font-semibold">API Key</span>
                    <div className="relative">
                      <input
                        type={showApiKey ? "text" : "password"}
                        value={aiConfig.apiKey}
                        onChange={e => setAIConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                        placeholder="sk-..."
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 pr-9 text-white outline-none focus:border-violet-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-white"
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-neutral-300 block mb-1 font-semibold">Model Identifier</span>
                    <input
                      type="text"
                      value={aiConfig.apiModel}
                      onChange={e => setAIConfig(prev => ({ ...prev, apiModel: e.target.value }))}
                      placeholder="gpt-4o-mini, deepseek-chat, mistral-large"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500"
                    />
                  </label>
                </div>
              )}

              {/* Generation Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-neutral-800/80 text-xs">
                <div>
                  <div className="flex justify-between text-neutral-300 font-semibold mb-1">
                    <span>Creativity Temperature</span>
                    <span className="text-amber-400">{aiConfig.temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={aiConfig.temperature}
                    onChange={e => setAIConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                    className="w-full accent-amber-500"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500">
                    <span>0.0 (Strict & Factual)</span>
                    <span>1.0 (Creative)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-neutral-300 font-semibold mb-1">
                    <span>Max Output Tokens</span>
                    <span className="text-sky-400">{aiConfig.maxTokens}</span>
                  </div>
                  <input
                    type="number"
                    min="512"
                    max="8192"
                    step="256"
                    value={aiConfig.maxTokens}
                    onChange={e => setAIConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) || 4096 }))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            </div>

            {/* Test Connection Output */}
            {aiTestResult && (
              <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
                aiTestResult.success
                  ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                  : "bg-red-950/40 border-red-500/40 text-red-300"
              }`}>
                {aiTestResult.success ? <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" /> : <AlertTriangle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />}
                <div className="space-y-0.5">
                  <p className="font-bold">{aiTestResult.success ? "Connection Verified" : "Connection Failed"}</p>
                  <p className="text-neutral-300">{aiTestResult.message}</p>
                  {aiTestResult.latencyMs !== undefined && (
                    <p className="text-[10px] text-neutral-400">Round-trip latency: {aiTestResult.latencyMs}ms</p>
                  )}
                </div>
              </div>
            )}

            {aiSaveMsg && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold">
                {aiSaveMsg}
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={handleTestAIConnection}
                disabled={aiTesting}
                className="flex items-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl text-xs transition border border-neutral-700 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 text-violet-400 ${aiTesting ? "animate-spin" : ""}`} />
                {aiTesting ? "Testing Connection..." : "⚡ Test AI Connection"}
              </button>

              <button
                type="button"
                onClick={handleSaveAIConfig}
                className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-violet-900/40"
              >
                <Sparkles className="h-4 w-4" /> Save AI Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REMOVE MODAL ─────────────────────────────────────────────────── */}
      {removeTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 max-w-lg w-full space-y-5 animate-in fade-in zoom-in-95">
            {!removalReport ? (
              <>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Remove Curriculum</h3>
                    <p className="text-xs text-neutral-400 mt-1">You are about to permanently remove:</p>
                    <p className="text-sm font-bold text-red-300 mt-1">"{removeTarget.name}"</p>
                  </div>
                </div>

                {/* Dependency impact */}
                <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-4 space-y-3 text-xs">
                  <p className="font-bold text-red-300 uppercase tracking-wide text-[11px]">⚠️ Cascade Impact Preview</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-neutral-300">
                      <UserCheck className="h-3.5 w-3.5 text-amber-400" />
                      <span>Revoke authorization from <strong className="text-amber-300">{removeDeps?.authorizedTeachers.length ?? 0} teacher(s)</strong>:</span>
                    </div>
                    {removeDeps?.authorizedTeachers.map(t => (
                      <p key={t.teacherId} className="ml-6 text-neutral-400">• {t.teacherName} ({t.teacherEmail})</p>
                    ))}
                    <div className="flex items-center gap-2 text-neutral-300">
                      <Database className="h-3.5 w-3.5 text-sky-400" />
                      <span>Archive <strong className="text-sky-300">{removeDeps?.affectedPackages.length ?? 0} active package(s)</strong>:</span>
                    </div>
                    {removeDeps?.affectedPackages.map((p: any) => (
                      <p key={p.id ?? p.name} className="ml-6 text-neutral-400">• {p.name}</p>
                    ))}
                    {(removeDeps?.affectedPackages.length ?? 0) > 0 && (
                      <p className="ml-6 text-[10px] text-emerald-400 italic">✓ Existing students keep access — packages archived, not deleted.</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setRemoveTarget(null)} className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl text-xs transition">
                    Cancel
                  </button>
                  <button type="button" onClick={confirmRemove} className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition">
                    Confirm Remove & Cascade
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-emerald-400 shrink-0" />
                  <div>
                    <h3 className="font-bold text-white">Curriculum Removed</h3>
                    <p className="text-xs text-neutral-400">All dependencies handled successfully.</p>
                  </div>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-xs space-y-2">
                  <p className="text-neutral-400">✓ Removed: <strong className="text-white">{removalReport.curriculumName}</strong></p>
                  <p className="text-neutral-400">✓ Revoked from <strong className="text-amber-300">{removalReport.revokedFromTeachers.length}</strong> teacher(s): {removalReport.revokedFromTeachers.join(", ") || "none"}</p>
                  <p className="text-neutral-400">✓ Archived <strong className="text-sky-300">{removalReport.archivedPackages.length}</strong> package(s): {removalReport.archivedPackages.join(", ") || "none"}</p>
                </div>
                <button type="button" onClick={() => { setRemoveTarget(null); setRemovalReport(null); }} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition">
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}