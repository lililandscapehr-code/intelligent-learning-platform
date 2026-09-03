"use client";

import { useState, useEffect } from "react";
import {
  Plus, Copy, Trash2, Eye, EyeOff, Share2, QrCode,
  CheckCircle, XCircle, Clock, Pause, Play, Edit3,
  ShieldCheck, Zap, Lock, Globe, Users, BookOpen,
  ToggleLeft, ToggleRight, ChevronDown, ChevronUp, RefreshCw
} from "lucide-react";
import {
  ClassRegistry,
  DemoAccessCode, DemoCodeStatus, DemoCodeType,
  PackageServicePolicy,
  FULL_ACCESS_POLICY, DEMO_TRIAL_POLICY, PREVIEW_POLICY
} from "@/core/services/class-registry";

// ─── Toggle row for policy flags ─────────────────────────────────────────────
function PolicyToggle({
  label, value, onChange, description
}: { label: string; value: boolean; onChange: (v: boolean) => void; description?: string }) {
  return (
    <div
      className={`flex items-start justify-between gap-3 p-3 rounded-xl border transition cursor-pointer ${
        value ? "bg-emerald-500/5 border-emerald-500/30" : "bg-neutral-900/60 border-neutral-800"
      }`}
      onClick={() => onChange(!value)}
    >
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-bold ${value ? "text-emerald-300" : "text-neutral-400"}`}>{label}</p>
        {description && <p className="text-[10px] text-neutral-500 mt-0.5 leading-tight">{description}</p>}
      </div>
      {value
        ? <ToggleRight className="h-5 w-5 text-emerald-400 shrink-0" />
        : <ToggleLeft  className="h-5 w-5 text-neutral-600 shrink-0" />
      }
    </div>
  );
}

// ─── Package Service Policy Editor ───────────────────────────────────────────
function PolicyEditor({
  policy, onChange, compact = false
}: { policy: PackageServicePolicy; onChange: (p: PackageServicePolicy) => void; compact?: boolean }) {
  const set = <K extends keyof PackageServicePolicy>(key: K, value: PackageServicePolicy[K]) =>
    onChange({ ...policy, [key]: value });

  const groups: { title: string; icon: React.ReactNode; fields: { key: keyof PackageServicePolicy; label: string; desc: string }[] }[] = [
    {
      title: "Answers & Marks",
      icon: <CheckCircle className="h-3.5 w-3.5 text-amber-400" />,
      fields: [
        { key: "showAnswers", label: "Show Correct Answers", desc: "Display correct answer after submission" },
        { key: "showMarks", label: "Show Marks / Score", desc: "Show numeric score and grade" },
        { key: "showExplanations", label: "Show Explanations", desc: "Step-by-step solution walkthrough" },
        { key: "showEvaluationSlides", label: "Show Evaluation Slides", desc: "Full solution carousel after question" },
        { key: "showMisconceptionNotes", label: "Show Misconception Notes", desc: "Common errors and how to avoid them" },
        { key: "showRubricPoints", label: "Show Rubric Grading", desc: "Detailed rubric breakdown per mark" },
      ]
    },
    {
      title: "Slide & Content Access",
      icon: <BookOpen className="h-3.5 w-3.5 text-sky-400" />,
      fields: [
        { key: "allowAllSlides", label: "Unlimited Slide Access", desc: "Access all slides (off = limited by max count)" },
        { key: "allowVideoSlides", label: "Allow Video Slides", desc: "Watch embedded YouTube / recorded lectures" },
        { key: "allowImageSlides", label: "Allow Image Slides", desc: "View diagram and illustration slides" },
        { key: "allowReplay", label: "Allow Lesson Replay", desc: "Student can redo a lesson or rewatch videos" },
      ]
    },
    {
      title: "Navigation & Lessons",
      icon: <Globe className="h-3.5 w-3.5 text-violet-400" />,
      fields: [
        { key: "allowFreeNavigation", label: "Free Lesson Navigation", desc: "Jump between any lesson freely" },
        { key: "showProgressTracker", label: "Show Progress Tracker", desc: "Show mastery bars and learning progress" },
      ]
    },
    {
      title: "Questions & Assessments",
      icon: <Zap className="h-3.5 w-3.5 text-orange-400" />,
      fields: [
        { key: "allowQuestions", label: "Allow Questions & MCQs", desc: "Attempt interactive questions during lesson" },
        { key: "allowRetries", label: "Allow Retries", desc: "Retry wrong answers before seeing solution" },
        { key: "allowDiagnosticSessions", label: "Allow 3-Case Diagnostic", desc: "Run full adaptive diagnostic engine session" },
        { key: "allowLiveSessions", label: "Allow Live Sessions", desc: "Join scheduled live classroom via Meet/Zoom" },
      ]
    },
    {
      title: "Download & Export",
      icon: <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />,
      fields: [
        { key: "allowPdfDownload", label: "Allow PDF Download", desc: "Download lesson summaries or progress reports" },
      ]
    },
  ];

  return (
    <div className="space-y-4">
      {/* Numeric limits */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
            Max Slides Per Lesson <span className="text-neutral-600">(0 = unlimited)</span>
          </label>
          <input
            type="number" min={0} value={policy.maxSlidesPerLesson}
            onChange={e => set("maxSlidesPerLesson", Number(e.target.value))}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
            Max Lessons Accessible <span className="text-neutral-600">(0 = all)</span>
          </label>
          <input
            type="number" min={0} value={policy.maxLessonsAccessible}
            onChange={e => set("maxLessonsAccessible", Number(e.target.value))}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Toggle groups */}
      {groups.map(group => (
        <div key={group.title} className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 pb-1 border-b border-neutral-800">
            {group.icon} {group.title}
          </div>
          <div className={`grid gap-2 ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
            {group.fields.map(f => (
              <PolicyToggle
                key={f.key}
                label={f.label}
                description={f.desc}
                value={policy[f.key] as boolean}
                onChange={v => set(f.key, v as any)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: DemoCodeStatus }) {
  const map: Record<DemoCodeStatus, { cls: string; label: string }> = {
    ACTIVE:  { cls: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400", label: "🟢 Active" },
    PAUSED:  { cls: "bg-amber-500/10 border-amber-500/30 text-amber-400",       label: "⏸ Paused" },
    EXPIRED: { cls: "bg-neutral-800/60 border-neutral-700 text-neutral-500",    label: "⌛ Expired" },
    REVOKED: { cls: "bg-red-500/10 border-red-500/30 text-red-400",             label: "🚫 Revoked" },
  };
  const { cls, label } = map[status];
  return (
    <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DemoCodeManager() {
  const [codes, setCodes]           = useState<DemoAccessCode[]>([]);
  const [classes, setClasses]       = useState<any[]>([]);
  const [showCreateForm, setShowCreate] = useState(false);
  const [editingPolicyId, setEditingPolicyId] = useState<string | null>(null);
  const [expandedCodeId, setExpandedCodeId]   = useState<string | null>(null);
  const [copiedId, setCopiedId]     = useState<string | null>(null);
  const [toast, setToast]           = useState("");

  // Create form state
  const [newCode,        setNewCode]        = useState("");
  const [newLabel,       setNewLabel]       = useState("");
  const [newType,        setNewType]        = useState<DemoCodeType>("SOCIAL_TRIAL");
  const [newClassId,     setNewClassId]     = useState("");
  const [newPreset,      setNewPreset]      = useState<"FULL" | "DEMO_TRIAL" | "PREVIEW" | "CUSTOM">("DEMO_TRIAL");
  const [newCustomPolicy,setNewCustomPolicy] = useState<PackageServicePolicy>({ ...DEMO_TRIAL_POLICY });
  const [newExpiresAt,   setNewExpiresAt]   = useState("");
  const [newMaxUses,     setNewMaxUses]     = useState(500);
  const [newNotes,       setNewNotes]       = useState("");
  const [createError,    setCreateError]    = useState("");

  // Package policy tab
  const [activeTab, setActiveTab]   = useState<"codes" | "package-policy">("codes");
  const [policyClassId, setPolicyClassId]   = useState("");
  const [editedPolicy, setEditedPolicy]     = useState<PackageServicePolicy>({ ...FULL_ACCESS_POLICY });
  const [policyPreset, setPolicyPreset]     = useState<"FULL" | "DEMO_TRIAL" | "PREVIEW" | "CUSTOM">("FULL");

  const loadData = () => {
    setCodes(ClassRegistry.getAllDemoAccessCodes());
    setClasses(ClassRegistry.getPublicPackageAnnouncements());
  };

  useEffect(() => {
    loadData();
    // read ?demo= from URL
    const url = new URLSearchParams(window.location.search);
    const demoParam = url.get("demo");
    if (demoParam) setNewCode(demoParam);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    if (!newCode.trim() || !newLabel.trim() || !newClassId) {
      setCreateError("Code, label, and package are required.");
      return;
    }
    const result = ClassRegistry.createDemoAccessCode({
      code: newCode.trim(),
      label: newLabel.trim(),
      type: newType,
      classId: newClassId,
      policyPreset: newPreset,
      customPolicy: newPreset === "CUSTOM" ? newCustomPolicy : undefined,
      expiresAt: newExpiresAt ? new Date(newExpiresAt).toISOString() : null,
      maxUses: newMaxUses,
      notes: newNotes.trim() || undefined,
    });
    if (!result.success) { setCreateError(result.message); return; }
    showToast(`✅ Demo code "${result.code?.code}" created and ready to share!`);
    setShowCreate(false);
    setNewCode(""); setNewLabel(""); setNewClassId(""); setNewNotes("");
    loadData();
  };

  const handleStatusToggle = (code: DemoAccessCode) => {
    const next: DemoCodeStatus = code.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    ClassRegistry.updateDemoCodeStatus(code.id, next);
    showToast(next === "ACTIVE" ? `▶️ Code "${code.code}" resumed.` : `⏸ Code "${code.code}" paused.`);
    loadData();
  };

  const handleRevoke = (code: DemoAccessCode) => {
    ClassRegistry.updateDemoCodeStatus(code.id, "REVOKED");
    showToast(`🚫 Code "${code.code}" revoked.`);
    loadData();
  };

  const handleDelete = (code: DemoAccessCode) => {
    ClassRegistry.deleteDemoCode(code.id);
    showToast(`🗑️ Code "${code.code}" deleted.`);
    loadData();
  };

  const handleLoadPackagePolicy = () => {
    if (!policyClassId) return;
    const policy = ClassRegistry.getPackageServicePolicy(policyClassId);
    setEditedPolicy({ ...policy });
    setPolicyPreset("CUSTOM");
  };

  const handleApplyPreset = (preset: "FULL" | "DEMO_TRIAL" | "PREVIEW") => {
    const map = { FULL: FULL_ACCESS_POLICY, DEMO_TRIAL: DEMO_TRIAL_POLICY, PREVIEW: PREVIEW_POLICY };
    setEditedPolicy({ ...map[preset] });
    setPolicyPreset(preset);
  };

  const handleSavePolicy = () => {
    if (!policyClassId) { showToast("⚠️ Please select a package first."); return; }
    const result = ClassRegistry.updatePackageServicePolicy(policyClassId, editedPolicy);
    if (result.success) showToast(`✅ ${result.message}`);
    else showToast(`❌ ${result.message}`);
  };

  const presetDescription: Record<string, string> = {
    FULL: "Full enrolled-student access — all content, answers, marks, diagnostics, PDFs.",
    DEMO_TRIAL: "Trial user sees answers & 2 lessons, but no diagnostics, live sessions, or PDF.",
    PREVIEW: "Teaser only — 1 lesson, 2 slides, no answers, no video, no questions.",
    CUSTOM: "Manually configured per toggle below."
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-5 py-3 bg-neutral-900 border border-emerald-500/40 text-emerald-300 text-sm font-bold rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2">
          {toast}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">Admin Control Center</p>
          <h2 className="mt-1 text-2xl font-black text-white">Demo Codes & Package Access Policies</h2>
          <p className="text-xs text-neutral-400 mt-1">Create shareable access codes for social media trials. Configure exactly what each package allows students to access.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("codes")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === "codes" ? "bg-amber-500 text-black" : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"}`}
          >
            🔑 Demo Codes
          </button>
          <button
            onClick={() => setActiveTab("package-policy")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === "package-policy" ? "bg-amber-500 text-black" : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"}`}
          >
            🛡️ Package Policies
          </button>
        </div>
      </div>

      {/* ── TAB: Demo Codes ──────────────────────────────────────────────── */}
      {activeTab === "codes" && (
        <div className="space-y-5">
          {/* Create Code Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowCreate(!showCreateForm)}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl text-xs transition shadow-lg shadow-amber-500/20"
            >
              <Plus className="h-4 w-4" /> Generate New Demo Code
            </button>
          </div>

          {/* Create Form */}
          {showCreateForm && (
            <div className="bg-neutral-950 border border-amber-500/30 rounded-2xl p-6 space-y-5 animate-in fade-in slide-in-from-top-2">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <QrCode className="h-4 w-4 text-amber-400" /> Create New Demo / Trial Access Code
              </h3>
              <form onSubmit={handleCreate} className="space-y-4 text-xs">
                {createError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">{createError}</div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">Access Code <span className="text-neutral-600">(shareable, ALL CAPS)</span></label>
                    <input
                      type="text" required placeholder="e.g. PHYS2026, TRIAL100"
                      value={newCode} onChange={e => setNewCode(e.target.value.toUpperCase())}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-amber-400 font-mono font-black tracking-widest outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">Code Type</label>
                    <select
                      value={newType} onChange={e => setNewType(e.target.value as DemoCodeType)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                    >
                      <option value="SOCIAL_TRIAL">📱 Social Media Trial</option>
                      <option value="PROMO">🎁 Promotional Code</option>
                      <option value="DEMO_CLASS">🏫 Demo Class Session</option>
                      <option value="INFLUENCER">🌟 Influencer / Partner</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Code Label / Description</label>
                  <input
                    type="text" required placeholder="e.g. Facebook September 2026 Physics Trial"
                    value={newLabel} onChange={e => setNewLabel(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Assign to Package / Class</label>
                  <select
                    required value={newClassId} onChange={e => setNewClassId(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                  >
                    <option value="">— Select a package —</option>
                    {classes.map(c => (
                      <option key={c.classId} value={c.classId}>{c.title} ({c.gradeLevel})</option>
                    ))}
                  </select>
                </div>

                {/* Access Policy Preset */}
                <div className="space-y-2">
                  <label className="block text-neutral-400 font-bold">Access Policy Preset</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(["FULL", "DEMO_TRIAL", "PREVIEW", "CUSTOM"] as const).map(p => (
                      <button
                        key={p} type="button"
                        onClick={() => {
                          setNewPreset(p);
                          if (p !== "CUSTOM") {
                            const m = { FULL: FULL_ACCESS_POLICY, DEMO_TRIAL: DEMO_TRIAL_POLICY, PREVIEW: PREVIEW_POLICY };
                            setNewCustomPolicy({ ...m[p as keyof typeof m] ?? DEMO_TRIAL_POLICY });
                          }
                        }}
                        className={`py-2 rounded-lg border text-[11px] font-bold transition ${
                          newPreset === p
                            ? "bg-amber-500 border-amber-400 text-black"
                            : "bg-neutral-900 border-neutral-700 text-neutral-400 hover:border-neutral-600"
                        }`}
                      >
                        {p === "FULL" ? "🔓 Full Access" : p === "DEMO_TRIAL" ? "🎯 Demo Trial" : p === "PREVIEW" ? "👁 Preview Only" : "⚙️ Custom"}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2">
                    {presetDescription[newPreset]}
                  </p>
                </div>

                {/* Custom policy toggles */}
                {newPreset === "CUSTOM" && (
                  <div className="border border-neutral-800 rounded-xl p-4 bg-neutral-900/40 max-h-96 overflow-y-auto">
                    <PolicyEditor policy={newCustomPolicy} onChange={setNewCustomPolicy} compact />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">Expires At <span className="text-neutral-600">(leave blank = never)</span></label>
                    <input
                      type="datetime-local" value={newExpiresAt} onChange={e => setNewExpiresAt(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">Max Uses <span className="text-neutral-600">(0 = unlimited)</span></label>
                    <input
                      type="number" min={0} value={newMaxUses} onChange={e => setNewMaxUses(Number(e.target.value))}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Internal Notes <span className="text-neutral-600">(optional)</span></label>
                  <textarea
                    rows={2} placeholder="e.g. Shared on Instagram Reels by @physics_tutor"
                    value={newNotes} onChange={e => setNewNotes(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                  <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 bg-neutral-800 text-white rounded-xl text-xs font-bold">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-black transition">
                    🚀 Generate & Activate Code
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Codes Table */}
          <div className="space-y-3">
            {codes.length === 0 ? (
              <div className="text-center py-16 text-neutral-500 text-sm bg-neutral-900/40 border border-neutral-800 rounded-2xl">
                No demo codes yet. Generate your first trial code to share on social media.
              </div>
            ) : codes.map(code => (
              <div key={code.id} className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden">
                {/* Code Header Row */}
                <div className="p-4 flex flex-wrap items-center gap-3">
                  {/* Code badge */}
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="font-mono font-black text-xl text-amber-400 tracking-widest">{code.code}</span>
                    <button
                      onClick={() => handleCopy(code.code, code.id + "-code")}
                      className="text-neutral-500 hover:text-white transition"
                      title="Copy code"
                    >
                      {copiedId === code.id + "-code" ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>

                  <StatusBadge status={code.status} />

                  <div className="text-[10px] text-neutral-500 font-bold uppercase">
                    {code.type.replace("_", " ")}
                  </div>

                  {/* Usage */}
                  <div className="text-xs text-neutral-400">
                    <span className="font-bold text-white">{code.usedCount}</span>
                    {code.maxUses > 0 ? ` / ${code.maxUses}` : " uses"} used
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 ml-auto">
                    {code.shareUrl && (
                      <button
                        onClick={() => handleCopy(code.shareUrl!, code.id + "-url")}
                        className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 transition"
                        title="Copy share URL"
                      >
                        {copiedId === code.id + "-url" ? <CheckCircle className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                      </button>
                    )}
                    {(code.status === "ACTIVE" || code.status === "PAUSED") && (
                      <button
                        onClick={() => handleStatusToggle(code)}
                        className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition"
                        title={code.status === "ACTIVE" ? "Pause code" : "Resume code"}
                      >
                        {code.status === "ACTIVE" ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                      </button>
                    )}
                    {code.status !== "REVOKED" && (
                      <button
                        onClick={() => handleRevoke(code)}
                        className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition"
                        title="Revoke code"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => setExpandedCodeId(expandedCodeId === code.id ? null : code.id)}
                      className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:bg-neutral-700 transition"
                      title="View details"
                    >
                      {expandedCodeId === code.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(code)}
                      className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-red-400 hover:border-red-500/30 transition"
                      title="Delete code"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtitle */}
                <div className="px-4 pb-3 text-[11px] text-neutral-400 border-t border-neutral-900 pt-2.5 flex flex-wrap gap-3 items-center">
                  <span className="font-bold text-neutral-200">{code.label}</span>
                  <span className="text-neutral-600">→</span>
                  <span>{code.className}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                    code.policyLabel.includes("Full") ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                    code.policyLabel.includes("Demo") ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
                    "bg-neutral-800 border-neutral-700 text-neutral-400"
                  }`}>{code.policyLabel}</span>
                  {code.expiresAt && (
                    <span className="flex items-center gap-1 text-neutral-500">
                      <Clock className="h-3 w-3" />
                      Expires {new Date(code.expiresAt).toLocaleDateString()}
                    </span>
                  )}
                  {!code.expiresAt && <span className="text-neutral-600">No expiry</span>}
                </div>

                {/* Expanded details */}
                {expandedCodeId === code.id && (
                  <div className="border-t border-neutral-800 p-4 space-y-4 bg-neutral-900/40 animate-in fade-in">
                    {/* Share URL */}
                    {code.shareUrl && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                        <code className="text-[10px] font-mono text-sky-300 break-all flex-1">{code.shareUrl}</code>
                        <button
                          onClick={() => handleCopy(code.shareUrl!, code.id + "-url2")}
                          className="shrink-0 text-neutral-500 hover:text-sky-400 transition"
                        >
                          {copiedId === code.id + "-url2" ? <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    )}

                    {/* Policy summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                      {[
                        { label: "Answers", ok: code.policy.showAnswers },
                        { label: "Marks",   ok: code.policy.showMarks },
                        { label: "Explanations", ok: code.policy.showExplanations },
                        { label: "Videos",  ok: code.policy.allowVideoSlides },
                        { label: "All Slides", ok: code.policy.allowAllSlides },
                        { label: "Questions", ok: code.policy.allowQuestions },
                        { label: "Retries", ok: code.policy.allowRetries },
                        { label: "Diagnostic", ok: code.policy.allowDiagnosticSessions },
                        { label: "Live Sessions", ok: code.policy.allowLiveSessions },
                        { label: "PDF Download", ok: code.policy.allowPdfDownload },
                        { label: "Free Nav", ok: code.policy.allowFreeNavigation },
                        { label: "Progress", ok: code.policy.showProgressTracker },
                      ].map(({ label, ok }) => (
                        <div key={label} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border ${ok ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" : "bg-neutral-900 border-neutral-800 text-neutral-600"}`}>
                          {ok ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {label}
                        </div>
                      ))}
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      Slide limit: <strong className="text-neutral-300">{code.policy.maxSlidesPerLesson === 0 ? "Unlimited" : `${code.policy.maxSlidesPerLesson} slides/lesson`}</strong>
                      &nbsp;·&nbsp;
                      Lessons: <strong className="text-neutral-300">{code.policy.maxLessonsAccessible === 0 ? "All" : `${code.policy.maxLessonsAccessible} lesson(s)`}</strong>
                    </div>
                    {code.notes && (
                      <p className="text-[10px] text-neutral-500 italic">{code.notes}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: Package Service Policies ───────────────────────────────── */}
      {activeTab === "package-policy" && (
        <div className="space-y-5">
          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-xs text-amber-200 leading-relaxed">
            <strong className="text-amber-400 block mb-1">📋 Package Service Policy</strong>
            For each package/class, configure exactly what enrolled students can access: show answers, marks, explanations, video slides, how many lessons/slides, retries, diagnostics, live sessions, and PDF downloads.
          </div>

          {/* Package selector */}
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-48">
              <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">Select Package</label>
              <select
                value={policyClassId} onChange={e => setPolicyClassId(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-white text-xs outline-none focus:border-amber-500"
              >
                <option value="">— Select a package to configure —</option>
                {classes.map(c => (
                  <option key={c.classId} value={c.classId}>{c.title}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleLoadPackagePolicy}
              disabled={!policyClassId}
              className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-40 flex items-center gap-2"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Load Current Policy
            </button>
          </div>

          {policyClassId && (
            <>
              {/* Preset buttons */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-neutral-400 uppercase">Quick Presets</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["FULL", "DEMO_TRIAL", "PREVIEW"] as const).map(p => (
                    <button
                      key={p} type="button" onClick={() => handleApplyPreset(p)}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition ${
                        policyPreset === p
                          ? "bg-amber-500 border-amber-400 text-black"
                          : "bg-neutral-900 border-neutral-700 text-neutral-400 hover:border-neutral-600"
                      }`}
                    >
                      {p === "FULL" ? "🔓 Full Access" : p === "DEMO_TRIAL" ? "🎯 Demo Trial" : "👁 Preview Only"}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2">
                  {presetDescription[policyPreset]}
                </p>
              </div>

              {/* Custom policy editor */}
              <div className="border border-neutral-800 rounded-2xl p-5 bg-neutral-950">
                <h3 className="text-xs font-black text-white mb-4 flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-amber-400" /> Fine-tune Access Controls
                </h3>
                <PolicyEditor policy={editedPolicy} onChange={p => { setEditedPolicy(p); setPolicyPreset("CUSTOM"); }} />
              </div>

              {/* Save */}
              <div className="flex justify-end">
                <button
                  onClick={handleSavePolicy}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl text-xs transition shadow-lg shadow-amber-500/20"
                >
                  💾 Save Policy for This Package
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
