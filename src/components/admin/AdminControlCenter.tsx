"use client";

import React, { ChangeEvent, useState, useEffect } from "react";
import {
  Activity, BookOpen, CreditCard, Database, ShieldCheck,
  Upload, Users, Lock, Sparkles, UserCheck, Trash2,
  PlusCircle, Settings, ChevronDown, ChevronUp, AlertTriangle,
  CheckCircle, X, Info, ToggleLeft, ToggleRight, Edit3,
  Cpu, Server, Key, RefreshCw, MessageSquare, Video, Mic,
  Sliders, Eye, EyeOff, Layers, ArrowUp, ArrowDown, Brain,
  Award, Zap, Check
} from "lucide-react";
import { 
  uploadCurriculumPackage,
  getAIProviderPoolAction,
  saveAIProviderPoolAction,
  testSingleProviderAction,
  getDistillationMemoryAction,
  clearDistillationMemoryAction
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
import { 
  AIProviderEntry, 
  AIProviderPoolConfig, 
  DEFAULT_AI_POOL_CONFIG,
  DistilledExemplar 
} from "../../core/services/ai-provider-types";

interface AdminControlCenterProps {
  onCurriculumAdded: (curriculum: CurriculumPackage) => void;
}

type AdminTab = "registry" | "add" | "teachers" | "ai";

// ── Helpers ────────────────────────────────────────────────────────────────────
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

  // AI Provider Pool state
  const [aiPoolConfig, setAIPoolConfig] = useState<AIProviderPoolConfig>(DEFAULT_AI_POOL_CONFIG);
  const [testingProviderId, setTestingProviderId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string; latencyMs?: number }>>({});
  const [showAddProviderModal, setShowAddProviderModal] = useState(false);
  const [newProviderForm, setNewProviderForm] = useState<Partial<AIProviderEntry>>({
    name: "",
    type: "gemini",
    model: "gemini-2.5-flash",
    apiKey: "",
    endpoint: "http://127.0.0.1:11434",
    apiBaseUrl: "https://api.openai.com/v1",
    enabled: true,
    priority: 1,
    temperature: 0.2,
    maxTokens: 4096
  });

  // Distillation memory state
  const [distillationMemory, setDistillationMemory] = useState<DistilledExemplar[]>([]);
  const [showDistillationViewer, setShowDistillationViewer] = useState(false);
  const [aiSaveMsg, setAISaveMsg] = useState<string | null>(null);
  const [showKeyMap, setShowKeyMap] = useState<Record<string, boolean>>({});

  const refreshSpecs = () => setSpecs(Object.values(REGISTERED_CURRICULUM_SPECS));
  const refreshTeachers = () => setTeacherAssignments([...ClassRegistry.getAllTeacherAssignments()]);

  // Load AI Pool & Distillation Memory on Mount
  useEffect(() => {
    getAIProviderPoolAction().then(res => {
      if (res.success && res.data) {
        setAIPoolConfig(res.data);
      }
    });

    getDistillationMemoryAction().then(res => {
      if (res.success && res.data) {
        setDistillationMemory(res.data);
      }
    });
  }, []);

  // ── Curriculum Handlers ───────────────────────────────────────────────────
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

  // ── AI Multi-Provider Pool Handlers ───────────────────────────────────────
  const handleTestSingleProvider = async (provider: AIProviderEntry) => {
    setTestingProviderId(provider.id);
    try {
      const res = await testSingleProviderAction(provider);
      setTestResults(prev => ({
        ...prev,
        [provider.id]: {
          success: res.success,
          message: res.success ? (res.data?.message || "Connected") : (res.errors[0] || "Failed"),
          latencyMs: res.data?.latencyMs
        }
      }));
    } catch (err: any) {
      setTestResults(prev => ({
        ...prev,
        [provider.id]: { success: false, message: err?.message || "Test error" }
      }));
    } finally {
      setTestingProviderId(null);
    }
  };

  const handleSavePoolConfig = async (updatedConfig: AIProviderPoolConfig) => {
    setAIPoolConfig(updatedConfig);
    const res = await saveAIProviderPoolAction(updatedConfig);
    if (res.success) {
      setAISaveMsg("✓ AI Multi-Provider configuration saved permanently to data/ai-config.json");
      setTimeout(() => setAISaveMsg(null), 4000);
    }
  };

  const handleToggleProvider = (providerId: string) => {
    const updated = {
      ...aiPoolConfig,
      providers: aiPoolConfig.providers.map(p => p.id === providerId ? { ...p, enabled: !p.enabled } : p)
    };
    handleSavePoolConfig(updated);
  };

  const handleMovePriority = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= aiPoolConfig.providers.length) return;

    const list = [...aiPoolConfig.providers];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // Reassign priority numbers
    list.forEach((p, i) => { p.priority = i + 1; });
    handleSavePoolConfig({ ...aiPoolConfig, providers: list });
  };

  const handleDeleteProvider = (providerId: string) => {
    const list = aiPoolConfig.providers.filter(p => p.id !== providerId);
    list.forEach((p, i) => { p.priority = i + 1; });
    handleSavePoolConfig({ ...aiPoolConfig, providers: list });
  };

  const handleAddProvider = () => {
    if (!newProviderForm.name || !newProviderForm.model) return;
    const newEntry: AIProviderEntry = {
      id: `prov-${Date.now()}`,
      name: newProviderForm.name,
      type: newProviderForm.type || "gemini",
      model: newProviderForm.model,
      apiKey: newProviderForm.apiKey || "",
      endpoint: newProviderForm.endpoint || "http://127.0.0.1:11434",
      apiBaseUrl: newProviderForm.apiBaseUrl || "https://api.openai.com/v1",
      priority: aiPoolConfig.providers.length + 1,
      enabled: true,
      temperature: 0.2,
      maxTokens: 4096,
      lastTestStatus: "untested"
    };

    const updated = {
      ...aiPoolConfig,
      providers: [...aiPoolConfig.providers, newEntry]
    };
    handleSavePoolConfig(updated);
    setShowAddProviderModal(false);
    setNewProviderForm({
      name: "",
      type: "gemini",
      model: "gemini-2.5-flash",
      apiKey: "",
      endpoint: "http://127.0.0.1:11434",
      apiBaseUrl: "https://api.openai.com/v1",
      enabled: true,
      priority: 1
    });
  };

  const handleClearDistillation = async () => {
    await clearDistillationMemoryAction();
    setDistillationMemory([]);
  };

  // ── Tabs Definition ───────────────────────────────────────────────────────
  const tabs: { key: AdminTab; label: string; icon: React.ElementType }[] = [
    { key: "registry", label: "📋 Curriculum Registry", icon: BookOpen },
    { key: "add", label: "➕ Add New Curriculum", icon: PlusCircle },
    { key: "teachers", label: "👩‍🏫 Teacher Governance & Permissions", icon: UserCheck },
    { key: "ai", label: "🤖 AI, Ollama & Multi-API Pool", icon: Cpu },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-400">Administration & Governance</p>
        <h2 className="mt-1 text-2xl font-bold text-white">Platform Control Center</h2>
        <p className="mt-1 text-sm text-neutral-400">Governance for Curricula, Multi-API Key Failover, Ollama Knowledge Distillation, and Teacher Capabilities.</p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Registered Curricula", value: `${specs.length}`, icon: BookOpen },
          { label: "Managed Teachers", value: `${teacherAssignments.length}`, icon: UserCheck },
          { label: "Active AI Providers in Pool", value: `${aiPoolConfig.providers.filter(p => p.enabled).length} / ${aiPoolConfig.providers.length}`, icon: Cpu },
          { label: "Ollama Distilled Memory", value: `${distillationMemory.length} Gold Pairs`, icon: Brain },
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

          <div className="space-y-3">
            {specs.map(spec => {
              const deps = ClassRegistry.getCurriculumDependencies(spec.id);
              const isEditingThis = editingPolicyFor === spec.id;

              return (
                <div key={spec.id} className="bg-neutral-900/70 border border-neutral-800 rounded-2xl overflow-hidden">
                  <div className="flex items-start gap-4 p-5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white text-sm">{spec.name}</h3>
                        <span className="text-[10px] bg-sky-500/15 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full">{spec.subject}</span>
                        <span className="text-[10px] bg-neutral-800 text-neutral-400 border border-neutral-700 px-2 py-0.5 rounded-full">{spec.gradeLevel}</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-1">{spec.publisher} · v{spec.version}</p>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <PolicyBadge on={spec.policy?.aiTankEnabled !== false} label="AI Tank" />
                        <PolicyBadge on={spec.policy?.allowTeacherCustomSlides !== false} label="Custom Slides" />
                        <PolicyBadge on={spec.policy?.allowTeacherCustomQuestions !== false} label="Custom Questions" />
                        {spec.policy?.maxAuthorizedTeachers ? (
                          <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                            Max {spec.policy.maxAuthorizedTeachers} Teachers
                          </span>
                        ) : null}
                      </div>

                      <div className="flex gap-4 mt-2 text-[11px] text-neutral-400">
                        <span><span className="text-amber-400 font-bold">{deps.authorizedTeachers.length}</span> authorized teachers</span>
                        <span><span className="text-sky-400 font-bold">{deps.affectedPackages.length}</span> active packages</span>
                        <span><span className="text-neutral-500">{spec.chapters.length}</span> chapters</span>
                      </div>
                    </div>

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
            </div>

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
              <p className="text-xs text-neutral-400">Admin decides: whom can add custom carousels, whom can contact parents, and whom is a Lead Curriculum Reviewer.</p>
            </div>
            <span className="text-[11px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold">
              PER-TEACHER CONTROLS
            </span>
          </div>

          <div className="space-y-4">
            {teacherAssignments.map(assignment => (
              <div key={assignment.teacherId} className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base">{assignment.teacherName}</h4>
                    <p className="text-xs text-neutral-400">{assignment.teacherEmail} · ID: {assignment.teacherId}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {assignment.permissions.canReviewCurriculumTanks && (
                      <span className="text-[10px] font-bold text-violet-300 bg-violet-950/60 border border-violet-500/40 px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <Award className="h-3 w-3 text-violet-400" /> Lead Reviewer
                      </span>
                    )}
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
                      {assignment.approvedCurriculumIds.length} / {specs.length} Curricula
                    </span>
                  </div>
                </div>

                {/* Granular Teacher Permissions Grid */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                    🛡️ Teacher Action & Capability Permissions
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
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
                        <p className="text-[10px] text-neutral-400 mt-0.5">Author custom slides</p>
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
                        <p className="text-[10px] text-neutral-400 mt-0.5">Direct parent updates</p>
                      </div>
                      <Toggle 
                        value={assignment.permissions.canContactParents} 
                        onChange={v => handleUpdateTeacherPermission(assignment.teacherId, "canContactParents", v)} 
                      />
                    </div>

                    {/* Permission 3: Lead Curriculum Reviewer */}
                    <div className={`p-3 rounded-xl border flex items-center justify-between transition ${
                      assignment.permissions.canReviewCurriculumTanks
                        ? "bg-violet-950/30 border-violet-500/50 text-violet-200"
                        : "bg-neutral-900 border-neutral-800 text-neutral-500"
                    }`}>
                      <div className="pr-2">
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          <Award className="h-4 w-4 text-violet-400" />
                          <span>Lead Reviewer</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-0.5">Verify AI Question Tanks</p>
                      </div>
                      <Toggle 
                        value={assignment.permissions.canReviewCurriculumTanks} 
                        onChange={v => handleUpdateTeacherPermission(assignment.teacherId, "canReviewCurriculumTanks", v)} 
                      />
                    </div>
                  </div>
                </div>

                {/* Curriculum Assignment Matrix */}
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

      {/* ── TAB 4: AI & OLLAMA MULTI-API POOL SETTINGS ───────────────────── */}
      {activeTab === "ai" && (
        <div className="space-y-6">
          {/* Main Pool Header */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 font-bold">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Multi-API Provider Pool & Auto-Failover Engine
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                      OFFLINE + ONLINE RESILIENT
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400">Configure multiple cloud API keys (Gemini / OpenAI) with automatic fallback to Local Ollama when offline or rate-limited.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddProviderModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-violet-950/40"
              >
                <PlusCircle className="h-4 w-4" /> Add API / Provider
              </button>
            </div>

            {/* Global Failover & Distillation Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-amber-400" />
                    Automatic Offline & Quota Failover
                  </h4>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Cascade through enabled keys, then fallback to Local Ollama if network is down.</p>
                </div>
                <Toggle
                  value={aiPoolConfig.failoverEnabled}
                  onChange={v => handleSavePoolConfig({ ...aiPoolConfig, failoverEnabled: v })}
                />
              </div>

              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Brain className="h-4 w-4 text-violet-400" />
                    Ollama Knowledge Distillation ("Learning")
                  </h4>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Injects gold teacher-verified Gemini exemplars into Ollama for superior offline reasoning.</p>
                </div>
                <Toggle
                  value={aiPoolConfig.distillationEnabled}
                  onChange={v => handleSavePoolConfig({ ...aiPoolConfig, distillationEnabled: v })}
                />
              </div>
            </div>

            {/* Providers Priority Table */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                1. Configured AI Providers & Priority Order (Highest Priority First)
              </span>

              <div className="space-y-2">
                {aiPoolConfig.providers.map((provider, index) => {
                  const testRes = testResults[provider.id];
                  const isTesting = testingProviderId === provider.id;
                  const isKeyShown = showKeyMap[provider.id];

                  return (
                    <div
                      key={provider.id}
                      className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs transition ${
                        provider.enabled
                          ? "bg-neutral-950/80 border-neutral-800"
                          : "bg-neutral-950/30 border-neutral-900 opacity-60"
                      }`}
                    >
                      {/* Priority badge & reordering */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            onClick={() => handleMovePriority(index, "up")}
                            disabled={index === 0}
                            className="text-neutral-500 hover:text-white disabled:opacity-20"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMovePriority(index, "down")}
                            disabled={index === aiPoolConfig.providers.length - 1}
                            className="text-neutral-500 hover:text-white disabled:opacity-20"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className={`px-2 py-1 rounded-lg font-bold text-[11px] ${
                          index === 0
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : "bg-neutral-800 text-neutral-400"
                        }`}>
                          #{index + 1}
                        </span>
                      </div>

                      {/* Provider Info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm truncate">{provider.name}</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                            provider.type === "gemini" ? "bg-sky-500/20 text-sky-300 border-sky-500/30" :
                            provider.type === "ollama" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
                            "bg-purple-500/20 text-purple-300 border-purple-500/30"
                          }`}>
                            {provider.type.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">Model: {provider.model}</span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-mono">
                          {provider.type === "ollama" ? (
                            <span>Endpoint: {provider.endpoint}</span>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span>Key: {isKeyShown ? (provider.apiKey || "None") : "••••••••••••••••"}</span>
                              <button
                                type="button"
                                onClick={() => setShowKeyMap(p => ({ ...p, [provider.id]: !p[provider.id] }))}
                                className="text-neutral-500 hover:text-neutral-300"
                              >
                                {isKeyShown ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Test status display */}
                        {testRes && (
                          <p className={`text-[10px] font-bold mt-1 ${testRes.success ? "text-emerald-400" : "text-red-400"}`}>
                            {testRes.message} {testRes.latencyMs ? `(${testRes.latencyMs}ms)` : ""}
                          </p>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleTestSingleProvider(provider)}
                          disabled={isTesting}
                          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded-lg text-[11px] transition flex items-center gap-1.5"
                        >
                          <RefreshCw className={`h-3 w-3 ${isTesting ? "animate-spin text-violet-400" : ""}`} />
                          {isTesting ? "Pinging..." : "Test"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleProvider(provider.id)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                            provider.enabled
                              ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 hover:bg-red-950/40 hover:text-red-300"
                              : "bg-neutral-800 text-neutral-500 hover:text-emerald-300"
                          }`}
                        >
                          {provider.enabled ? "Enabled" : "Disabled"}
                        </button>

                        {aiPoolConfig.providers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteProvider(provider.id)}
                            className="p-1.5 text-neutral-500 hover:text-red-400 rounded-lg hover:bg-neutral-800 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {aiSaveMsg && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold">
                {aiSaveMsg}
              </div>
            )}
          </div>

          {/* ── OLLAMA KNOWLEDGE DISTILLATION CARD ── */}
          <div className="bg-neutral-900/80 border border-violet-500/30 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    Ollama Knowledge Distillation Vault
                    <span className="text-[10px] bg-violet-500/20 text-violet-400 border border-violet-500/30 px-2 py-0.5 rounded-full font-bold">
                      FEW-SHOT LEARNING ACTIVE
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400">How Ollama learns from Gemini & Teachers: gold-standard verified outputs are captured and injected as Few-Shot in-context patterns when running offline.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDistillationViewer(!showDistillationViewer)}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold rounded-lg border border-neutral-700 transition"
                >
                  {showDistillationViewer ? "Hide Memory" : `Inspect Memory (${distillationMemory.length})`}
                </button>
                {distillationMemory.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearDistillation}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-red-950/50 text-neutral-400 hover:text-red-300 text-xs font-bold rounded-lg border border-neutral-700 transition"
                  >
                    Clear Memory
                  </button>
                )}
              </div>
            </div>

            {/* Distillation Memory Viewer */}
            {showDistillationViewer && (
              <div className="space-y-3 pt-2">
                {distillationMemory.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic p-3 bg-neutral-950 rounded-xl">No distilled exemplars stored yet. Cloud generations will automatically populate this buffer.</p>
                ) : (
                  distillationMemory.slice(0, 5).map(ex => (
                    <div key={ex.id} className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl text-xs space-y-2">
                      <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                        <span className="font-bold text-violet-400">Source: {ex.sourceModel}</span>
                        <span>{new Date(ex.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="font-semibold text-white">Prompt: {ex.instruction}</p>
                      <pre className="p-2.5 bg-neutral-900 rounded-lg text-[10px] text-neutral-300 overflow-x-auto whitespace-pre-wrap font-mono">
                        {ex.idealResponse.slice(0, 300)}...
                      </pre>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ADD PROVIDER MODAL ───────────────────────────────────────────── */}
      {showAddProviderModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 max-w-lg w-full space-y-5 animate-in fade-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PlusCircle className="h-4 w-4 text-violet-400" /> Add AI Provider / API Key
              </h3>
              <button type="button" onClick={() => setShowAddProviderModal(false)} className="text-neutral-500 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="text-neutral-400 font-semibold block mb-1">Provider Type</span>
                <select
                  value={newProviderForm.type}
                  onChange={e => setNewProviderForm(p => ({
                    ...p,
                    type: e.target.value as any,
                    model: e.target.value === "gemini" ? "gemini-2.5-flash" : e.target.value === "ollama" ? "qwen2.5:3b" : "gpt-4o-mini"
                  }))}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500"
                >
                  <option value="gemini">Google Gemini API (Cloud Fast)</option>
                  <option value="ollama">Ollama (Local Offline LLM)</option>
                  <option value="openai">OpenAI / DeepSeek / Custom REST</option>
                </select>
              </label>

              <label className="block">
                <span className="text-neutral-400 font-semibold block mb-1">Friendly Name</span>
                <input
                  type="text"
                  placeholder="e.g. Gemini Backup Key #2"
                  value={newProviderForm.name}
                  onChange={e => setNewProviderForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500"
                />
              </label>

              <label className="block">
                <span className="text-neutral-400 font-semibold block mb-1">Model Identifier</span>
                <input
                  type="text"
                  placeholder="gemini-2.5-flash, qwen2.5:3b, gpt-4o-mini"
                  value={newProviderForm.model}
                  onChange={e => setNewProviderForm(p => ({ ...p, model: e.target.value }))}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500"
                />
              </label>

              {newProviderForm.type !== "ollama" ? (
                <label className="block">
                  <span className="text-neutral-400 font-semibold block mb-1">API Key</span>
                  <input
                    type="password"
                    placeholder="AIzaSy... / sk-..."
                    value={newProviderForm.apiKey}
                    onChange={e => setNewProviderForm(p => ({ ...p, apiKey: e.target.value }))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500"
                  />
                </label>
              ) : (
                <label className="block">
                  <span className="text-neutral-400 font-semibold block mb-1">Ollama Server Endpoint</span>
                  <input
                    type="text"
                    placeholder="http://127.0.0.1:11434"
                    value={newProviderForm.endpoint}
                    onChange={e => setNewProviderForm(p => ({ ...p, endpoint: e.target.value }))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500"
                  />
                </label>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddProviderModal(false)}
                className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddProvider}
                className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition"
              >
                Add Provider to Pool
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REMOVE CURRICULUM MODAL ─────────────────────────────────────── */}
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

                <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-4 space-y-3 text-xs">
                  <p className="font-bold text-red-300 uppercase tracking-wide text-[11px]">⚠️ Cascade Impact Preview</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-neutral-300">
                      <UserCheck className="h-3.5 w-3.5 text-amber-400" />
                      <span>Revoke authorization from <strong className="text-amber-300">{removeDeps?.authorizedTeachers.length ?? 0} teacher(s)</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-300">
                      <Database className="h-3.5 w-3.5 text-sky-400" />
                      <span>Archive <strong className="text-sky-300">{removeDeps?.affectedPackages.length ?? 0} active package(s)</strong></span>
                    </div>
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