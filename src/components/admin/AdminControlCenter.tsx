"use client";

import React, { ChangeEvent, useState, useEffect } from "react";
import {
  Activity, BookOpen, CreditCard, Database, ShieldCheck,
  Upload, Users, Lock, Sparkles, UserCheck, Trash2,
  PlusCircle, Settings, ChevronDown, ChevronUp, AlertTriangle,
  CheckCircle, X, Info, ToggleLeft, ToggleRight, Edit3,
  Cpu, Server, Key, RefreshCw, MessageSquare, Video, Mic,
  Sliders, Eye, EyeOff, Layers, ArrowUp, ArrowDown, Brain,
  Award, Zap, Check, Bell, Send, FileText, BarChart2,
  TrendingUp, DollarSign, Target, Radio, AlertOctagon, Filter,
  RotateCcw, Copy, Package, Globe, FileEdit, Scale, Dna
} from "lucide-react";
import CurriculumAIStudio from "./CurriculumAIStudio";
import DemoCodeManager from "./DemoCodeManager";
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
  CurriculumPolicyProfile,
  CurriculumRemovalReport,
  DEFAULT_CURRICULUM_POLICY,
  DEFAULT_POLICY_PROFILES,
  TeacherAssignment,
  TeacherPermissions,
  AdminAlarm,
  AdminBroadcast,
  AdminDirectiveNote,
  ExecutiveAuditReport,
  ClassRecord,
  PackageScopeType,
  CurriculumDomainPolicies,
  DomainActionPolicy,
  DEFAULT_DOMAIN_POLICIES,
  CurriculumRules,
  DEFAULT_CURRICULUM_RULES,
  HomepageConfig,
  HomepageSubjectFilter,
  HomepageSectionConfig,
  DEFAULT_HOMEPAGE_CONFIG
} from "../../core/services/class-registry";
import { 
  AIProviderEntry, 
  AIProviderPoolConfig, 
  DEFAULT_AI_POOL_CONFIG,
  DistilledExemplar 
} from "../../core/services/ai-provider-types";
import type { QuestionDNA } from "../carousel/CarouselTypes";

interface AdminControlCenterProps {
  onCurriculumAdded: (curriculum: CurriculumPackage) => void;
}

type AdminTab = "reports" | "packages" | "tanks" | "alarms" | "broadcasts" | "notes" | "registry" | "add" | "teachers" | "ai" | "curriculum-studio" | "sovereign-rules" | "homepage-manager" | "demo-codes";

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

      {/* ── Granular Domain Action Policies ── */}
      <div className="space-y-2 pt-3 border-t border-neutral-800">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
            Domain Action Policies (Teacher Permissions)
          </span>
          <span className="text-[10px] text-neutral-400">Configure Add, Modify, or Remove rights per sector</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {[
            { key: "questionTank" as const, label: "🧬 Question DNA Tank", desc: "Baseline Case B, Pre trials & C challenges" },
            { key: "syllabus" as const, label: "📖 Syllabus & Structure", desc: "Curriculum parts, chapters & lessons" },
            { key: "packages" as const, label: "📦 Parts & Packages", desc: "Commercial offerings, quotas & student pricing" },
            { key: "carouselContent" as const, label: "🎠 Carousel Slides & Media", desc: "Slide cards, formulas, videos & rich text" }
          ].map(({ key, label, desc }) => {
            const domainPolicy = policy.domains?.[key] || DEFAULT_DOMAIN_POLICIES[key];
            const updateDomain = (action: keyof DomainActionPolicy, val: boolean) => {
              const currentDomains = policy.domains || { ...DEFAULT_DOMAIN_POLICIES };
              const currentSector = currentDomains[key] || { ...DEFAULT_DOMAIN_POLICIES[key] };
              set("domains", {
                ...currentDomains,
                [key]: {
                  ...currentSector,
                  [action]: val
                }
              });
            };

            return (
              <div key={key} className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-3 space-y-2">
                <div>
                  <h5 className="font-bold text-white text-xs">{label}</h5>
                  <p className="text-[10px] text-neutral-400">{desc}</p>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <label className={`flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg border text-[11px] font-bold cursor-pointer transition ${
                    domainPolicy.canAdd ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300" : "bg-neutral-950 border-neutral-800 text-neutral-500"
                  }`}>
                    <input
                      type="checkbox"
                      checked={domainPolicy.canAdd}
                      onChange={(e) => updateDomain("canAdd", e.target.checked)}
                      className="accent-emerald-500 h-3 w-3"
                    />
                    <span>+ Add</span>
                  </label>

                  <label className={`flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg border text-[11px] font-bold cursor-pointer transition ${
                    domainPolicy.canModify ? "bg-sky-500/15 border-sky-500/40 text-sky-300" : "bg-neutral-950 border-neutral-800 text-neutral-500"
                  }`}>
                    <input
                      type="checkbox"
                      checked={domainPolicy.canModify}
                      onChange={(e) => updateDomain("canModify", e.target.checked)}
                      className="accent-sky-500 h-3 w-3"
                    />
                    <span>✎ Modify</span>
                  </label>

                  <label className={`flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg border text-[11px] font-bold cursor-pointer transition ${
                    domainPolicy.canRemove ? "bg-red-500/15 border-red-500/40 text-red-300" : "bg-neutral-950 border-neutral-800 text-neutral-500"
                  }`}>
                    <input
                      type="checkbox"
                      checked={domainPolicy.canRemove}
                      onChange={(e) => updateDomain("canRemove", e.target.checked)}
                      className="accent-red-500 h-3 w-3"
                    />
                    <span>✕ Remove</span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AdminControlCenter({ onCurriculumAdded }: AdminControlCenterProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("reports");

  // Registry state
  const [specs, setSpecs] = useState<CurriculumSpec[]>(() => Object.values(REGISTERED_CURRICULUM_SPECS));
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<string>("egypt-baccalaureate-second-year-physics-part1");
  
  // Multi-Policy State
  const [showAddPolicyModal, setShowAddPolicyModal] = useState(false);
  const [newPolicyName, setNewPolicyName] = useState("");
  const [newPolicyData, setNewPolicyData] = useState<CurriculumPolicy>({ ...DEFAULT_CURRICULUM_POLICY });

  // Question Tank State
  const [selectedLessonId, setSelectedLessonId] = useState<string>("CAROUSEL-PHYS-EB-MECH-1-1");
  const [currentTank, setCurrentTank] = useState<QuestionDNA[]>(() => ClassRegistry.getQuestionDNABank("CAROUSEL-PHYS-EB-MECH-1-1"));
  const [expandedDNAId, setExpandedDNAId] = useState<string | null>(null);
  const [tankActionMsg, setTankActionMsg] = useState<string | null>(null);

  // Master Packages State
  const [masterPackages, setMasterPackages] = useState<ClassRecord[]>(() => ClassRegistry.getAllMasterPackages());
  const [pkgFilter, setPkgFilter] = useState<"ALL" | "PUBLIC" | "PRIVATE" | "ARCHIVED">("ALL");
  const [showCreatePkgModal, setShowCreatePkgModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState<ClassRecord | null>(null);

  // Form state for package creation/editing
  const [pkgTitle, setPkgTitle] = useState("");
  const [pkgCurriculumId, setPkgCurriculumId] = useState("egypt-baccalaureate-second-year-physics-part1");
  const [pkgScopeType, setPkgScopeType] = useState<PackageScopeType>("FULL_PACKAGE");
  const [pkgTeacherIds, setPkgTeacherIds] = useState<string[]>(["teacher_1"]);
  const [pkgBasePrice, setPkgBasePrice] = useState(50);
  const [pkgIsPrivate, setPkgIsPrivate] = useState(false);
  const [pkgSpecialPrice, setPkgSpecialPrice] = useState(35);
  const [pkgLiveSessions, setPkgLiveSessions] = useState(4);
  const [pkgDescription, setPkgDescription] = useState("");
  const [pkgActionMsg, setPkgActionMsg] = useState("");

  const refreshPackages = () => {
    setMasterPackages([...ClassRegistry.getAllMasterPackages()]);
  };

  const handleTogglePackageVisibility = (pkgId: string, currentIsPrivate: boolean) => {
    ClassRegistry.adminTogglePackageVisibility(pkgId, currentIsPrivate);
    refreshPackages();
    refreshExecutiveSuite();
    setPkgActionMsg("✓ Package visibility updated.");
    setTimeout(() => setPkgActionMsg(""), 3000);
  };

  const handleArchivePackage = (pkgId: string) => {
    ClassRegistry.adminArchivePackage(pkgId);
    refreshPackages();
    refreshExecutiveSuite();
    setPkgActionMsg("✓ Package archived.");
    setTimeout(() => setPkgActionMsg(""), 3000);
  };

  const handleRestorePackage = (pkgId: string) => {
    ClassRegistry.adminRestorePackage(pkgId);
    refreshPackages();
    refreshExecutiveSuite();
    setPkgActionMsg("✓ Package restored.");
    setTimeout(() => setPkgActionMsg(""), 3000);
  };

  const handleDeletePackage = (pkgId: string) => {
    if (!window.confirm("Permanently delete this package? This cannot be undone.")) return;
    ClassRegistry.adminDeletePackagePermanently(pkgId);
    refreshPackages();
    refreshExecutiveSuite();
    setPkgActionMsg("✓ Package deleted permanently.");
    setTimeout(() => setPkgActionMsg(""), 3000);
  };

  const handleOpenEditPkg = (pkg: ClassRecord) => {
    setEditingPkg(pkg);
    setPkgTitle(pkg.name);
    setPkgCurriculumId(pkg.curriculumPackageId);
    setPkgScopeType(pkg.scope.scopeType);
    setPkgTeacherIds(pkg.assignedTeacherIds || [pkg.teacherId]);
    setPkgBasePrice(pkg.financials.basePricePerStudent);
    setPkgIsPrivate(!!pkg.isPrivate);
    setPkgSpecialPrice(pkg.specialNegotiatedPrice ?? Math.round(pkg.financials.basePricePerStudent * 0.8));
    setPkgLiveSessions(pkg.scope.includedLiveSessions ?? 4);
    setPkgDescription(pkg.announcement?.description || "");
    setShowCreatePkgModal(true);
  };

  const handleOpenCreatePkg = () => {
    setEditingPkg(null);
    setPkgTitle("");
    setPkgCurriculumId(specs[0]?.id || "egypt-baccalaureate-second-year-physics-part1");
    setPkgScopeType("FULL_PACKAGE");
    setPkgTeacherIds(["teacher_1"]);
    setPkgBasePrice(50);
    setPkgIsPrivate(false);
    setPkgSpecialPrice(35);
    setPkgLiveSessions(4);
    setPkgDescription("");
    setShowCreatePkgModal(true);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    const spec = specs.find(s => s.id === pkgCurriculumId) || specs[0];
    const primaryTeacher = teacherAssignments.find(t => t.teacherId === pkgTeacherIds[0]) || teacherAssignments[0];

    if (editingPkg) {
      ClassRegistry.adminUpdatePackage(editingPkg.id, {
        name: pkgTitle,
        curriculumPackageId: spec.id,
        curriculumPackageName: spec.name,
        gradeLevel: spec.gradeLevel,
        scope: {
          scopeType: pkgScopeType,
          semesterId: "full",
          includedLiveSessions: pkgLiveSessions,
          maxLessonCount: spec.lessons.length
        },
        financials: {
          ...editingPkg.financials,
          basePricePerStudent: pkgBasePrice
        },
        teacherId: primaryTeacher.teacherId,
        assignedTeacherIds: pkgTeacherIds,
        isPrivate: pkgIsPrivate,
        specialNegotiatedPrice: pkgIsPrivate ? pkgSpecialPrice : undefined,
        announcement: {
          teacherName: pkgTeacherIds.map(id => teacherAssignments.find(t => t.teacherId === id)?.teacherName || id).join(" & "),
          teacherTitle: "Authorized Master Faculty",
          description: pkgDescription || `${spec.name} comprehensive package.`,
          prerequisites: editingPkg.announcement?.prerequisites || [`Active ${spec.gradeLevel} standing`],
          isPubliclyAnnounced: !pkgIsPrivate,
          publishedAt: editingPkg.announcement?.publishedAt || new Date().toISOString().split("T")[0]
        }
      });
      setPkgActionMsg("✓ Package updated successfully.");
    } else {
      ClassRegistry.adminCreatePackage({
        name: pkgTitle,
        curriculumPackageId: spec.id,
        curriculumPackageName: spec.name,
        gradeLevel: spec.gradeLevel,
        teacherId: primaryTeacher.teacherId,
        assignedTeacherIds: pkgTeacherIds,
        isPrivate: pkgIsPrivate,
        specialNegotiatedPrice: pkgIsPrivate ? pkgSpecialPrice : undefined,
        scope: {
          scopeType: pkgScopeType,
          semesterId: "full",
          includedLiveSessions: pkgLiveSessions,
          maxLessonCount: spec.lessons.length
        },
        financials: {
          pricingModel: "VOLUME_TIERED",
          currency: "USD",
          basePricePerStudent: pkgBasePrice,
          tiers: [
            { minStudents: 1, maxStudents: 20, pricePerStudent: pkgBasePrice },
            { minStudents: 21, maxStudents: 50, pricePerStudent: Math.round(pkgBasePrice * 0.85) },
            { minStudents: 51, maxStudents: 200, pricePerStudent: Math.round(pkgBasePrice * 0.70) }
          ]
        },
        announcement: {
          teacherName: pkgTeacherIds.map(id => teacherAssignments.find(t => t.teacherId === id)?.teacherName || id).join(" & "),
          teacherTitle: "Authorized Master Faculty",
          description: pkgDescription || `${spec.name} comprehensive package.`,
          prerequisites: [`Active ${spec.gradeLevel} standing`, "Registration approval"],
          isPubliclyAnnounced: !pkgIsPrivate,
          publishedAt: new Date().toISOString().split("T")[0]
        }
      });
      setPkgActionMsg("✓ New Master Package created successfully.");
    }

    refreshPackages();
    refreshExecutiveSuite();
    setShowCreatePkgModal(false);
    setEditingPkg(null);
    setTimeout(() => setPkgActionMsg(""), 3500);
  };

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

  // Curriculum Cloning State
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [cloneTargetSpec, setCloneTargetSpec] = useState<CurriculumSpec | null>(null);
  const [cloneVersionTag, setCloneVersionTag] = useState("2026/2027 v2.0");
  const [cloneNewTitle, setCloneNewTitle] = useState("");
  const [cloneResult, setCloneResult] = useState<{ success: boolean; message: string } | null>(null);

  function handleCloneCurriculum() {
    if (!cloneTargetSpec || !cloneVersionTag.trim()) return;
    const res = ClassRegistry.adminCloneCurriculum(cloneTargetSpec.id, cloneVersionTag.trim(), cloneNewTitle.trim() || undefined);
    setCloneResult(res);
    if (res.success) {
      refreshSpecs();
      setTimeout(() => {
        setShowCloneModal(false);
        setCloneResult(null);
      }, 2200);
    }
  }

  // Sovereign Rules Hub State
  const [selectedRuleCurriculumId, setSelectedRuleCurriculumId] = useState<string>("egypt-baccalaureate-second-year-physics-part1");
  const [rulebookForm, setRulebookForm] = useState<CurriculumRules>(() => ClassRegistry.getCurriculumRules("egypt-baccalaureate-second-year-physics-part1"));
  const [rulebookSaveMsg, setRulebookSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    if (selectedRuleCurriculumId) {
      setRulebookForm(ClassRegistry.getCurriculumRules(selectedRuleCurriculumId));
    }
  }, [selectedRuleCurriculumId]);

  function handleSaveSovereignRules() {
    const res = ClassRegistry.updateCurriculumRules(selectedRuleCurriculumId, rulebookForm);
    setRulebookSaveMsg(res.message);
    setTimeout(() => setRulebookSaveMsg(null), 3500);
  }

  // Teacher Account Provisioning & Password Visibility State
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherEmail, setNewTeacherEmail] = useState("");
  const [newTeacherPassword, setNewTeacherPassword] = useState("teacher123");
  const [newTeacherCurriculums, setNewTeacherCurriculums] = useState<string[]>(["egypt-baccalaureate-second-year-physics-part1"]);
  const [newTeacherPermissions, setNewTeacherPermissions] = useState<TeacherPermissions>({
    canAddCarousels: true,
    canContactParents: true,
    canRecordDemos: true,
    canHostLiveSessions: true,
    canReviewCurriculumTanks: false
  });
  const [teacherCreateMsg, setTeacherCreateMsg] = useState<{ success: boolean; message: string } | null>(null);
  const [showTeacherPasswords, setShowTeacherPasswords] = useState<Record<string, boolean>>({});
  const [resetPassTeacherId, setResetPassTeacherId] = useState<string | null>(null);
  const [resetPassValue, setResetPassValue] = useState("");
  const [resetPassMsg, setResetPassMsg] = useState<string | null>(null);

  // Homepage CMS State
  const [homepageForm, setHomepageForm] = useState<HomepageConfig>(() => ClassRegistry.getHomepageConfig());
  const [homepageSaveMsg, setHomepageSaveMsg] = useState<string | null>(null);
  const [newFilterLabel, setNewFilterLabel] = useState("");
  const [newFilterKey, setNewFilterKey] = useState("");

  function handleCreateTeacher(e: React.FormEvent) {
    e.preventDefault();
    if (!newTeacherName.trim() || !newTeacherEmail.trim()) return;

    const res = ClassRegistry.adminCreateTeacher({
      name: newTeacherName,
      email: newTeacherEmail,
      password: newTeacherPassword,
      curriculumIds: newTeacherCurriculums,
      permissions: newTeacherPermissions
    });

    setTeacherCreateMsg(res);
    if (res.success) {
      refreshTeachers();
      setTimeout(() => {
        setShowAddTeacherModal(false);
        setTeacherCreateMsg(null);
        setNewTeacherName("");
        setNewTeacherEmail("");
        setNewTeacherPassword("teacher123");
      }, 2000);
    }
  }

  function handleResetPassword(teacherId: string) {
    const res = ClassRegistry.adminResetTeacherPassword(teacherId, resetPassValue.trim() || undefined);
    setResetPassMsg(res.message);
    refreshTeachers();
    setTimeout(() => {
      setResetPassTeacherId(null);
      setResetPassMsg(null);
      setResetPassValue("");
    }, 2500);
  }

  function handleDeleteTeacher(teacherId: string) {
    if (confirm("Are you sure you want to remove this teacher account and revoke all their package accesses?")) {
      ClassRegistry.adminDeleteTeacher(teacherId);
      refreshTeachers();
    }
  }

  function handleSaveHomepageCMS() {
    const res = ClassRegistry.updateHomepageConfig(homepageForm);
    setHomepageSaveMsg(res.message);
    setTimeout(() => setHomepageSaveMsg(null), 3000);
  }

  // Executive Suite State
  const [alarms, setAlarms] = useState<AdminAlarm[]>(() => ClassRegistry.getAdminAlarms());
  const [broadcasts, setBroadcasts] = useState<AdminBroadcast[]>(() => ClassRegistry.getAllBroadcasts());
  const [notes, setNotes] = useState<AdminDirectiveNote[]>(() => ClassRegistry.getAllAdminNotes());
  const [executiveReport, setExecutiveReport] = useState<ExecutiveAuditReport>(() => ClassRegistry.getExecutiveAuditReport());

  // Forms
  const [bcastTitle, setBcastTitle] = useState("");
  const [bcastMessage, setBcastMessage] = useState("");
  const [bcastTarget, setBcastTarget] = useState<any>("TEACHERS");
  const [bcastPriority, setBcastPriority] = useState<any>("NORMAL");
  const [bcastSuccessMsg, setBcastSuccessMsg] = useState<string | null>(null);

  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteCategory, setNoteCategory] = useState<any>("Pedagogical Audit");
  const [notePriority, setNotePriority] = useState<any>("MEDIUM");
  const [noteTeacherTarget, setNoteTeacherTarget] = useState("");
  const [notePackageTarget, setNotePackageTarget] = useState("");
  const [noteFilterStatus, setNoteFilterStatus] = useState<string>("ALL");

  const refreshSpecs = () => setSpecs(Object.values(REGISTERED_CURRICULUM_SPECS));
  const refreshTeachers = () => setTeacherAssignments([...ClassRegistry.getAllTeacherAssignments()]);
  const refreshExecutiveSuite = () => {
    setAlarms(ClassRegistry.getAdminAlarms());
    setBroadcasts(ClassRegistry.getAllBroadcasts());
    setNotes(ClassRegistry.getAllAdminNotes());
    setExecutiveReport(ClassRegistry.getExecutiveAuditReport());
  };
  const refreshTank = (lessonId: string) => {
    setCurrentTank([...ClassRegistry.getQuestionDNABank(lessonId)]);
  };

  useEffect(() => {
    getAIProviderPoolAction().then(res => {
      if (res.success && res.data) setAIPoolConfig(res.data);
    });

    getDistillationMemoryAction().then(res => {
      if (res.success && res.data) setDistillationMemory(res.data);
    });
  }, []);

  // ── Question DNA Tank Handlers ────────────────────────────────────────────
  const handleSelectLessonForTank = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    refreshTank(lessonId);
  };

  const handlePurgeEntireTank = (lessonId: string) => {
    if (confirm(`Are you sure you want to PURGE ALL Question DNA for lesson "${lessonId}"? This will delete all Case B baseline questions, Pre trials, and C challenges.`)) {
      ClassRegistry.purgeEntireLessonTank(lessonId);
      refreshTank(lessonId);
      setTankActionMsg(`✓ Entire Question Tank purged for lesson ${lessonId}.`);
      setTimeout(() => setTankActionMsg(null), 4000);
    }
  };

  const handleRestoreDefaultTank = (lessonId: string) => {
    ClassRegistry.restoreDefaultLessonTank(lessonId);
    refreshTank(lessonId);
    setTankActionMsg(`✓ Restored factory default Question Tank for ${lessonId}.`);
    setTimeout(() => setTankActionMsg(null), 4000);
  };

  const handleDeleteDNAItem = (lessonId: string, bQuestionId: string) => {
    ClassRegistry.deleteQuestionDNAItem(lessonId, bQuestionId);
    refreshTank(lessonId);
  };

  const handleDeletePreTrial = (lessonId: string, bQuestionId: string, trialId: string) => {
    ClassRegistry.deletePreTrial(lessonId, bQuestionId, trialId);
    refreshTank(lessonId);
  };

  const handleDeleteCQuestion = (lessonId: string, bQuestionId: string, cQuestionId: string) => {
    ClassRegistry.deleteCQuestion(lessonId, bQuestionId, cQuestionId);
    refreshTank(lessonId);
  };

  // ── Multi-Policy Profile Handlers ─────────────────────────────────────────
  const handleSetActivePolicyProfile = (curriculumId: string, profileId: string) => {
    ClassRegistry.setActivePolicyProfile(curriculumId, profileId);
    refreshSpecs();
  };

  const handleAddPolicyProfile = (curriculumId: string) => {
    if (!newPolicyName) return;
    ClassRegistry.addPolicyProfileToCurriculum(curriculumId, {
      ...newPolicyData,
      name: newPolicyName,
      isDefault: false
    });
    setNewPolicyName("");
    setShowAddPolicyModal(false);
    refreshSpecs();
  };

  const handleDeletePolicyProfile = (curriculumId: string, profileId: string) => {
    ClassRegistry.deletePolicyProfile(curriculumId, profileId);
    refreshSpecs();
  };

  // ── Upload & Lifecycle ────────────────────────────────────────────────────
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
      refreshExecutiveSuite();
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
      refreshExecutiveSuite();
    }
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
      refreshExecutiveSuite();
      setNewSpec({ id: "", name: "", publisher: "", subject: "", gradeLevel: "", version: "", terms: [], chapters: [], lessons: [], policy: { ...DEFAULT_CURRICULUM_POLICY } });
      setNewChapter("");
    }
  };

  const handleSetTeacherCurriculumStatus = (teacherId: string, curriculumId: string, status: "ACTIVE" | "SUSPENDED" | "REVOKED") => {
    ClassRegistry.setTeacherCurriculumStatus(teacherId, curriculumId, status);
    refreshTeachers();
    refreshExecutiveSuite();
  };

  const handleUpdateTeacherPermission = (teacherId: string, permKey: keyof TeacherPermissions, value: boolean) => {
    ClassRegistry.updateTeacherPermissions(teacherId, { [permKey]: value });
    refreshTeachers();
    refreshExecutiveSuite();
  };

  // ── Executive Handlers ─────────────────────────────────────────────────────
  const handleResolveAlarm = (alarmId: string) => {
    ClassRegistry.resolveAdminAlarm(alarmId);
    refreshExecutiveSuite();
  };

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bcastTitle || !bcastMessage) return;
    ClassRegistry.createBroadcast({
      title: bcastTitle,
      message: bcastMessage,
      targetAudience: bcastTarget,
      priority: bcastPriority,
      authorName: "Platform Admin"
    });
    setBcastTitle("");
    setBcastMessage("");
    setBcastSuccessMsg("✓ Broadcast alert dispatched successfully.");
    setTimeout(() => setBcastSuccessMsg(null), 4000);
    refreshExecutiveSuite();
  };

  const handleCreateAdminNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle || !noteContent) return;
    ClassRegistry.createAdminNote({
      title: noteTitle,
      content: noteContent,
      category: noteCategory,
      priority: notePriority,
      status: "OPEN",
      targetTeacherName: noteTeacherTarget || undefined,
      targetPackageName: notePackageTarget || undefined
    });
    setNoteTitle("");
    setNoteContent("");
    setNoteTeacherTarget("");
    setNotePackageTarget("");
    refreshExecutiveSuite();
  };

  const handleUpdateNoteStatus = (noteId: string, status: any) => {
    ClassRegistry.updateAdminNote(noteId, { status });
    refreshExecutiveSuite();
  };

  const handleDeleteNote = (noteId: string) => {
    ClassRegistry.deleteAdminNote(noteId);
    refreshExecutiveSuite();
  };

  // ── AI Provider Pool Handlers ───────────────────────────────────────────────
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
  const activeAlarmsCount = alarms.filter(a => !a.resolved).length;
  const criticalAlarmsCount = alarms.filter(a => !a.resolved && a.severity === "CRITICAL").length;

  const tabs: { key: AdminTab; label: string; icon: React.ElementType; badge?: string; badgeColor?: string }[] = [
    { key: "reports", label: "📊 Executive Reports", icon: BarChart2 },
    { key: "packages", label: "📦 Master Packages", icon: Package, badge: `${masterPackages.length} Pkgs` },
    { key: "tanks", label: "🧬 Question Tank Manager", icon: Dna, badge: `${currentTank.length} Items` },
    { 
      key: "alarms", 
      label: "🚨 Live Alarms", 
      icon: AlertOctagon, 
      badge: activeAlarmsCount > 0 ? `${activeAlarmsCount}` : undefined,
      badgeColor: criticalAlarmsCount > 0 ? "bg-red-500 text-white" : "bg-amber-500 text-black"
    },
    { key: "broadcasts", label: "📢 Broadcasts", icon: Radio },
    { key: "notes", label: "📝 Directives", icon: FileText, badge: `${notes.filter(n => n.status !== "RESOLVED").length}` },
    { key: "registry", label: "📋 Registry & Multi-Policy", icon: BookOpen },
    { key: "sovereign-rules", label: "⚖️ Sovereign Rulebook", icon: Scale, badge: "Per-Curriculum" },
    { key: "add", label: "➕ Add Curriculum", icon: PlusCircle },
    { key: "teachers", label: "👩‍🏫 Teacher Governance", icon: UserCheck },
    { key: "ai", label: "🤖 AI & Ollama Pool", icon: Cpu },
    { key: "curriculum-studio", label: "📄 Curriculum AI Studio", icon: FileEdit },
    { key: "homepage-manager", label: "🏠 Homepage CMS", icon: Globe, badge: "Dynamic" },
    { key: "demo-codes", label: "🔑 Demo Codes", icon: Key, badge: "Trial Codes" },
  ];

  const filteredNotes = notes.filter(n => noteFilterStatus === "ALL" || n.status === noteFilterStatus);
  const selectedSpec = specs.find(s => s.id === selectedCurriculumId) || specs[0];

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-400">Executive Control Suite</p>
        <h2 className="mt-1 text-2xl font-bold text-white">Platform Governance & Intelligence Center</h2>
        <p className="mt-1 text-sm text-neutral-400">Question DNA Tank Bank removal & pruning, multi-policy profiles, live alarms, broadcasts, and AI pool infrastructure.</p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
          <BarChart2 className="h-5 w-5 text-emerald-400" />
          <p className="mt-4 text-xs text-neutral-500">Student Academic Readiness</p>
          <p className="mt-1 text-xl font-bold text-white">{executiveReport.academics.masteryPercentage}% Readiness</p>
          <p className="text-[10px] text-emerald-400 mt-1">{executiveReport.academics.readyCount} Ready · {executiveReport.academics.foundationRequiredCount} Foundation Needed</p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
          <DollarSign className="h-5 w-5 text-sky-400" />
          <p className="mt-4 text-xs text-neutral-500">Gross Package Revenue</p>
          <p className="mt-1 text-xl font-bold text-white">${executiveReport.financials.grossVolumeUSD}</p>
          <p className="text-[10px] text-sky-400 mt-1">{executiveReport.financials.totalEnrolledStudents} Enrolled · Avg ${executiveReport.financials.averageRatePerStudent}/std</p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
          <Dna className="h-5 w-5 text-violet-400" />
          <p className="mt-4 text-xs text-neutral-500">Question DNA Tank Bank</p>
          <p className="mt-1 text-xl font-bold text-white">{currentTank.length} Question DNA Items</p>
          <p className="text-[10px] text-violet-400 mt-1">{currentTank.reduce((a, b) => a + b.preTrials.length, 0)} Pre Trials · {currentTank.reduce((a, b) => a + b.cQuestions.length, 0)} C Challenges</p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
          <Cpu className="h-5 w-5 text-amber-400" />
          <p className="mt-4 text-xs text-neutral-500">AI Pool & Offline Distillation</p>
          <p className="mt-1 text-xl font-bold text-white">{aiPoolConfig.providers.filter(p => p.enabled).length} Active Keys</p>
          <p className="text-[10px] text-amber-400 mt-1">{distillationMemory.length} Gold Exemplars Learned</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-800 pb-0 overflow-x-auto">
        {tabs.map(({ key, label, icon: Icon, badge, badgeColor }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold rounded-t-lg border-b-2 transition whitespace-nowrap ${
              activeTab === key
                ? "border-amber-500 text-amber-400 bg-amber-500/5"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}>
            <Icon className="h-4 w-4" /> 
            <span>{label}</span>
            {badge && (
              <span className={`ml-1 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${badgeColor || "bg-neutral-800 text-neutral-300"}`}>
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── TAB 1: EXECUTIVE REPORTS ───────────────────────────────────── */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Target className="h-4 w-4 text-emerald-400" /> Student Academic Readiness Audit
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  {executiveReport.academics.masteryPercentage}% OVERALL READY
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { label: "READY (Direct Progression)", count: executiveReport.academics.readyCount, color: "bg-emerald-500 text-emerald-300 border-emerald-500/40" },
                  { label: "READY WITH SUPPORT (Scaffolded)", count: executiveReport.academics.readyWithSupportCount, color: "bg-amber-500 text-amber-300 border-amber-500/40" },
                  { label: "BRIDGING RECOMMENDED (Target Gaps)", count: executiveReport.academics.bridgingRecommendedCount, color: "bg-orange-500 text-orange-300 border-orange-500/40" },
                  { label: "FOUNDATION REQUIRED (Urgent Case Pre)", count: executiveReport.academics.foundationRequiredCount, color: "bg-red-500 text-red-300 border-red-500/40" },
                ].map(({ label, count, color }) => (
                  <div key={label} className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between">
                    <span className="text-neutral-300 font-semibold">{label}</span>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${color}`}>
                      {count} Students
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-sky-400" /> Package Revenue & Volume Tier Audit
                </h3>
                <span className="text-[10px] bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full font-bold">
                  FINANCIAL LEDGER
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <p className="text-neutral-500 text-[10px]">Gross Volume USD</p>
                  <p className="text-lg font-bold text-white mt-1">${executiveReport.financials.grossVolumeUSD}</p>
                </div>
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <p className="text-neutral-500 text-[10px]">Volume Discount Savings</p>
                  <p className="text-lg font-bold text-emerald-400 mt-1">${executiveReport.financials.volumeDiscountSavingsUSD}</p>
                </div>
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <p className="text-neutral-500 text-[10px]">Active vs Archived Packages</p>
                  <p className="text-sm font-bold text-white mt-1">{executiveReport.financials.totalActivePackages} Active · {executiveReport.financials.archivedPackagesCount} Archived</p>
                </div>
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <p className="text-neutral-500 text-[10px]">Average Rate Per Student</p>
                  <p className="text-sm font-bold text-white mt-1">${executiveReport.financials.averageRatePerStudent} / student</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 1.5: MASTER PACKAGE MANAGER ───────────────────────────────── */}
      {activeTab === "packages" && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-150">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 flex-wrap gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Package className="h-5 w-5 text-amber-500" />
                  Master Package & Commercial Offerings Manager
                </h3>
                <p className="text-xs text-neutral-400">
                  Control curriculum scope parts, base and volume pricing, assigned faculty, and visibility on the public homepage.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenCreatePkg}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs shadow-lg shadow-amber-500/10 transition"
                >
                  <PlusCircle className="h-4 w-4" /> Create Master Package
                </button>
              </div>
            </div>

            {pkgActionMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold animate-in fade-in">
                {pkgActionMsg}
              </div>
            )}

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "ALL", label: `All Packages (${masterPackages.length})` },
                  { id: "PUBLIC", label: `🌐 Public on Homepage (${masterPackages.filter(p => !p.isPrivate && p.announcement?.isPubliclyAnnounced && !p.archivedAt).length})` },
                  { id: "PRIVATE", label: `🔒 Private / Negotiated (${masterPackages.filter(p => p.isPrivate && !p.archivedAt).length})` },
                  { id: "ARCHIVED", label: `🗄️ Archived (${masterPackages.filter(p => p.archivedAt).length})` }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setPkgFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      pkgFilter === f.id
                        ? "bg-amber-500 text-black"
                        : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-neutral-500 font-mono">
                Showing {masterPackages.filter(p => {
                  if (pkgFilter === "PUBLIC") return !p.isPrivate && p.announcement?.isPubliclyAnnounced && !p.archivedAt;
                  if (pkgFilter === "PRIVATE") return p.isPrivate && !p.archivedAt;
                  if (pkgFilter === "ARCHIVED") return !!p.archivedAt;
                  return true;
                }).length} of {masterPackages.length}
              </span>
            </div>

            {/* Package Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {masterPackages
                .filter(p => {
                  if (pkgFilter === "PUBLIC") return !p.isPrivate && p.announcement?.isPubliclyAnnounced && !p.archivedAt;
                  if (pkgFilter === "PRIVATE") return p.isPrivate && !p.archivedAt;
                  if (pkgFilter === "ARCHIVED") return !!p.archivedAt;
                  return true;
                })
                .map((pkg) => {
                  const isArchived = !!pkg.archivedAt;
                  const isPrivate = !!pkg.isPrivate;
                  const isPublic = !isPrivate && !isArchived && !!pkg.announcement?.isPubliclyAnnounced;

                  return (
                    <div
                      key={pkg.id}
                      className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
                        isArchived
                          ? "bg-neutral-950/60 border-neutral-800/60 opacity-60"
                          : isPrivate
                          ? "bg-neutral-950 border-sky-500/30"
                          : "bg-neutral-950 border-emerald-500/30 shadow-lg shadow-emerald-500/5"
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Status Badges */}
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-bold text-[10px] uppercase border border-neutral-700">
                            {pkg.scope.scopeType}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {isArchived ? (
                              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold">
                                🗄️ ARCHIVED
                              </span>
                            ) : isPrivate ? (
                              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-bold">
                                🔒 PRIVATE (REGISTERED USERS)
                              </span>
                            ) : isPublic ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                                🌐 PUBLIC ON HOMEPAGE
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 text-[10px] font-bold">
                                ⚪ DRAFT / UNPUBLISHED
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title & Curriculum Base */}
                        <div>
                          <h4 className="text-base font-bold text-white leading-snug">{pkg.name}</h4>
                          <p className="text-xs text-amber-400 font-medium mt-0.5">
                            📖 Base: {pkg.curriculumPackageName} ({pkg.gradeLevel})
                          </p>
                        </div>

                        {/* Assigned Faculty */}
                        <div className="p-2.5 bg-neutral-900/80 rounded-xl border border-neutral-800 flex items-center gap-2">
                          <Users className="h-4 w-4 text-neutral-400 shrink-0" />
                          <div className="text-xs">
                            <span className="text-neutral-400">Assigned Faculty: </span>
                            <strong className="text-white">
                              {(pkg.assignedTeacherIds && pkg.assignedTeacherIds.length > 0
                                ? pkg.assignedTeacherIds
                                : [pkg.teacherId]
                              ).map(id => teacherAssignments.find(t => t.teacherId === id)?.teacherName || id).join(", ")}
                            </strong>
                          </div>
                        </div>

                        {/* Financial & Scope Specs */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 bg-neutral-900/50 rounded-xl border border-neutral-800/80">
                            <span className="text-neutral-500 block text-[10px]">Commercial Price</span>
                            <strong className="text-emerald-400 font-bold text-sm">
                              ${pkg.financials.basePricePerStudent} USD
                            </strong>
                            <span className="text-neutral-400 text-[10px] block">
                              {pkg.financials.pricingModel === "VOLUME_TIERED" ? "Volume Tiered" : "Fixed Rate"}
                            </span>
                          </div>

                          <div className="p-2.5 bg-neutral-900/50 rounded-xl border border-neutral-800/80">
                            <span className="text-neutral-500 block text-[10px]">
                              {isPrivate ? "Negotiated Group Price" : "Included Sessions"}
                            </span>
                            {isPrivate && pkg.specialNegotiatedPrice ? (
                              <strong className="text-sky-400 font-bold text-sm">
                                ${pkg.specialNegotiatedPrice} USD
                              </strong>
                            ) : (
                              <strong className="text-purple-400 font-bold text-sm">
                                {pkg.scope.includedLiveSessions === -1 ? "Unlimited" : `${pkg.scope.includedLiveSessions} Sessions`}
                              </strong>
                            )}
                            <span className="text-neutral-400 text-[10px] block">
                              {pkg.studentIds.length} students enrolled
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Admin Action Bar */}
                      <div className="border-t border-neutral-800/80 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {!isArchived && (
                            <button
                              type="button"
                              onClick={() => handleTogglePackageVisibility(pkg.id, isPrivate)}
                              className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition ${
                                isPrivate
                                  ? "bg-sky-600 hover:bg-sky-500 text-white"
                                  : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                              }`}
                              title={isPrivate ? "Make public on homepage catalog" : "Make private for registered users only"}
                            >
                              {isPrivate ? "🌐 Make Public" : "🔒 Make Private"}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleOpenEditPkg(pkg)}
                            className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-[11px] transition"
                          >
                            <Edit3 className="h-3 w-3 inline mr-1" /> Edit
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isArchived ? (
                            <button
                              type="button"
                              onClick={() => handleRestorePackage(pkg.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition"
                            >
                              <RotateCcw className="h-3 w-3 inline mr-1" /> Restore
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleArchivePackage(pkg.id)}
                              className="px-2 py-1.5 rounded-lg bg-neutral-900 hover:bg-amber-500/20 text-neutral-400 hover:text-amber-400 font-semibold text-[11px] border border-neutral-800 transition"
                              title="Archive package (hidden from catalog but preserved)"
                            >
                              🗄️ Archive
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeletePackage(pkg.id)}
                            className="px-2 py-1.5 rounded-lg bg-neutral-900 hover:bg-red-500/20 text-neutral-500 hover:text-red-400 text-[11px] border border-neutral-800 transition"
                            title="Delete permanently"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE / EDIT MASTER PACKAGE MODAL ─────────────────────────────────── */}
      {showCreatePkgModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in-95 shadow-2xl">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Package className="h-5 w-5 text-amber-500" />
                  {editingPkg ? "Edit Master Package & Offerings" : "Create Master Package"}
                </h3>
                <p className="text-xs text-neutral-400">
                  Configure curriculum base, faculty assignments, commercial pricing plans, and public or private visibility.
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setShowCreatePkgModal(false); setEditingPkg(null); }}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
              {/* Package Title */}
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Package Title</label>
                <input
                  type="text"
                  required
                  value={pkgTitle}
                  onChange={(e) => setPkgTitle(e.target.value)}
                  placeholder="e.g. Grade 11 Physics Mastery - Term 1 Honors"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-amber-500"
                />
              </div>

              {/* Curriculum Base & Scope */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Curriculum Specification</label>
                  <select
                    value={pkgCurriculumId}
                    onChange={(e) => setPkgCurriculumId(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                  >
                    {specs.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.gradeLevel})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Curriculum Part / Scope</label>
                  <select
                    value={pkgScopeType}
                    onChange={(e) => setPkgScopeType(e.target.value as PackageScopeType)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                  >
                    <option value="FULL_PACKAGE">Full Curriculum Package</option>
                    <option value="SEMESTER">Semester / Term Bundle</option>
                    <option value="CHAPTER_BUNDLE">Chapter Specific Bundle</option>
                    <option value="LESSON_QUANTITY">Lesson Quota Pass</option>
                    <option value="SINGLE_SESSION">Single Intensive Workshop</option>
                  </select>
                </div>
              </div>

              {/* Assigned Faculty Checkboxes */}
              <div className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-800 space-y-2">
                <label className="block text-neutral-400 font-semibold text-[11px]">
                  Assigned Faculty / Teachers (Multi-Teacher Enabled)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {teacherAssignments.map(t => {
                    const isChecked = pkgTeacherIds.includes(t.teacherId);
                    return (
                      <label
                        key={t.teacherId}
                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-xs transition ${
                          isChecked ? "bg-amber-500/10 border-amber-500/40 text-amber-300" : "bg-neutral-900 border-neutral-800 text-neutral-400"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPkgTeacherIds([...pkgTeacherIds, t.teacherId]);
                            } else {
                              if (pkgTeacherIds.length > 1) {
                                setPkgTeacherIds(pkgTeacherIds.filter(id => id !== t.teacherId));
                              }
                            }
                          }}
                          className="accent-amber-500"
                        />
                        <span className="font-bold">{t.teacherName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Pricing & Visibility Plans */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Base Price ($ USD / student)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={pkgBasePrice}
                    onChange={(e) => setPkgBasePrice(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Included Live Sessions (-1 for Unlimited)</label>
                  <input
                    type="number"
                    min="-1"
                    required
                    value={pkgLiveSessions}
                    onChange={(e) => setPkgLiveSessions(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Private Visibility & Special Pricing Box */}
              <div className="p-4 bg-neutral-900/90 rounded-2xl border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <strong className="text-white text-xs block">Private Group / Special Negotiated Offer</strong>
                    <p className="text-[11px] text-neutral-400">
                      When enabled, this package is invisible on the public homepage and reserved for registered/invited students.
                    </p>
                  </div>
                  <Toggle value={pkgIsPrivate} onChange={(v) => setPkgIsPrivate(v)} />
                </div>

                {pkgIsPrivate && (
                  <div className="pt-2 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sky-400 font-semibold mb-1 text-[11px]">
                        Special Negotiated Price ($ USD)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={pkgSpecialPrice}
                        onChange={(e) => setPkgSpecialPrice(Number(e.target.value))}
                        className="w-full bg-neutral-950 border border-sky-500/40 rounded-xl px-3 py-2 text-white outline-none focus:border-sky-400"
                      />
                    </div>
                    <div className="text-[11px] text-neutral-400 flex items-center">
                      ℹ️ Students registering for this private offering will be charged the locked special negotiated rate.
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Package Description & Bio</label>
                <textarea
                  rows={3}
                  value={pkgDescription}
                  onChange={(e) => setPkgDescription(e.target.value)}
                  placeholder="Describe what is covered, teaching approach, and student preparation..."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => { setShowCreatePkgModal(false); setEditingPkg(null); }}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black transition shadow-lg shadow-amber-500/10"
                >
                  {editingPkg ? "Save Package Updates" : "Publish Master Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── TAB 2: QUESTION DNA TANK BANK REMOVAL & PRUNING MANAGER ─────── */}
      {activeTab === "tanks" && (
        <div className="space-y-6">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 flex-wrap gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Dna className="h-5 w-5 text-violet-400" />
                  Question DNA Tank Bank Removal & Pruning Engine
                </h3>
                <p className="text-xs text-neutral-400">Purge entire question tanks, delete selective Case B items, or prune specific Case Pre/C variants.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRestoreDefaultTank(selectedLessonId)}
                  className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold rounded-xl border border-neutral-700 transition flex items-center gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-amber-400" /> Reset to Factory Seed
                </button>
                <button
                  type="button"
                  onClick={() => handlePurgeEntireTank(selectedLessonId)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition shadow-lg flex items-center gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Purge Entire Tank
                </button>
              </div>
            </div>

            {/* Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <label className="block">
                <span className="text-neutral-400 font-semibold block mb-1">Target Curriculum</span>
                <select
                  value={selectedCurriculumId}
                  onChange={e => {
                    const cId = e.target.value;
                    setSelectedCurriculumId(cId);
                    const firstLesson = specs.find(s => s.id === cId)?.lessons[0]?.id || "CAROUSEL-PHYS-EB-MECH-1-1";
                    handleSelectLessonForTank(firstLesson);
                  }}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500 font-semibold"
                >
                  {specs.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.gradeLevel})</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-neutral-400 font-semibold block mb-1">Target Lesson Tank</span>
                <select
                  value={selectedLessonId}
                  onChange={e => handleSelectLessonForTank(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500 font-semibold"
                >
                  {selectedSpec.lessons.map(l => (
                    <option key={l.id} value={l.id}>{l.title}</option>
                  ))}
                </select>
              </label>
            </div>

            {tankActionMsg && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold">
                {tankActionMsg}
              </div>
            )}

            {/* Tank Summary Stats */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl">
                <span className="text-neutral-500 text-[10px]">Case B Questions</span>
                <p className="text-lg font-bold text-amber-400 mt-1">{currentTank.length} Baseline Items</p>
              </div>
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl">
                <span className="text-neutral-500 text-[10px]">Case Pre Scaffolds</span>
                <p className="text-lg font-bold text-emerald-400 mt-1">{currentTank.reduce((a, b) => a + b.preTrials.length, 0)} Trials</p>
              </div>
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl">
                <span className="text-neutral-500 text-[10px]">Case C Challenges</span>
                <p className="text-lg font-bold text-violet-400 mt-1">{currentTank.reduce((a, b) => a + b.cQuestions.length, 0)} Challenge Questions</p>
              </div>
            </div>
          </div>

          {/* Question DNA List & Selective Pruning */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Active Question DNA Items for {selectedLessonId} ({currentTank.length})
            </h3>

            {currentTank.length === 0 ? (
              <div className="p-8 bg-neutral-900/40 border border-neutral-800 rounded-2xl text-center space-y-3">
                <Dna className="h-8 w-8 text-neutral-600 mx-auto" />
                <p className="text-sm font-bold text-neutral-400">Question Tank is currently EMPTY for this lesson.</p>
                <p className="text-xs text-neutral-500">All 3-Case questions have been purged by Admin.</p>
                <button
                  type="button"
                  onClick={() => handleRestoreDefaultTank(selectedLessonId)}
                  className="px-4 py-2 bg-amber-500 text-black font-bold rounded-xl text-xs hover:bg-amber-400 transition"
                >
                  ↺ Restore Default Seed Tank
                </button>
              </div>
            ) : (
              currentTank.map((dna, index) => {
                const isExpanded = expandedDNAId === dna.bQuestion.id;

                return (
                  <div key={dna.bQuestion.id} className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden text-xs">
                    <div className="p-5 flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-amber-400 text-sm">Item #{index + 1} ({dna.bQuestion.id})</span>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                            {dna.preTrials.length} Pre Trials
                          </span>
                          <span className="text-[10px] bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full font-bold">
                            {dna.cQuestions.length} Case C Challenges
                          </span>
                        </div>
                        <p className="text-white font-semibold text-xs">{dna.bQuestion.questionText}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setExpandedDNAId(isExpanded ? null : dna.bQuestion.id)}
                          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded-lg text-[11px] transition flex items-center gap-1"
                        >
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          {isExpanded ? "Collapse" : "Prune Variants"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteDNAItem(selectedLessonId, dna.bQuestion.id)}
                          className="px-3 py-1.5 bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete Item
                        </button>
                      </div>
                    </div>

                    {/* Inline Selective Pruner */}
                    {isExpanded && (
                      <div className="border-t border-neutral-800 bg-neutral-950/80 p-5 space-y-4">
                        {/* Case Pre Pruning */}
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                            <span>🌱 Case Pre Scaffolded Trials ({dna.preTrials.length})</span>
                            <span className="text-[10px] text-neutral-500 font-normal">Click 🗑️ to delete specific trial</span>
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {dna.preTrials.map(pt => (
                              <div key={pt.id} className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl flex items-start justify-between gap-2">
                                <div className="space-y-1 min-w-0">
                                  <span className="font-bold text-emerald-300 text-[10px]">Level {pt.level} · {pt.tierName}</span>
                                  <p className="text-[11px] text-neutral-300 truncate">{pt.questionText}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePreTrial(selectedLessonId, dna.bQuestion.id, pt.id)}
                                  className="text-neutral-500 hover:text-red-400 p-1 shrink-0 transition"
                                  title="Delete this Pre trial"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Case C Pruning */}
                        <div className="space-y-2 pt-2 border-t border-neutral-800/60">
                          <h4 className="text-[11px] font-bold text-violet-400 uppercase tracking-wider flex items-center justify-between">
                            <span>🚀 Case C Challenge Questions ({dna.cQuestions.length})</span>
                            <span className="text-[10px] text-neutral-500 font-normal">Click 🗑️ to delete specific challenge</span>
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {dna.cQuestions.map(c => (
                              <div key={c.id} className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl flex items-start justify-between gap-2">
                                <div className="space-y-1 min-w-0">
                                  <span className="font-bold text-violet-300 text-[10px]">Level {c.level} · {c.tierName}</span>
                                  <p className="text-[11px] text-neutral-300 truncate">{c.questionText}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCQuestion(selectedLessonId, dna.bQuestion.id, c.id)}
                                  className="text-neutral-500 hover:text-red-400 p-1 shrink-0 transition"
                                  title="Delete this C question"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: LIVE ALARMS & HEALTH MONITORING ─────────────────────── */}
      {activeTab === "alarms" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertOctagon className="h-5 w-5 text-red-400" />
                Live System & Academic Alarms Monitor
              </h3>
              <p className="text-xs text-neutral-400">Real-time threshold triggers for academic risks, registration backlogs, and AI provider status.</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
              {activeAlarmsCount} Unresolved Alarms
            </span>
          </div>

          <div className="space-y-3">
            {alarms.map(alarm => {
              const isCritical = alarm.severity === "CRITICAL";
              const isWarning = alarm.severity === "WARNING";

              return (
                <div
                  key={alarm.id}
                  className={`p-5 rounded-2xl border transition ${
                    alarm.resolved
                      ? "bg-neutral-950/40 border-neutral-800 opacity-60"
                      : isCritical
                      ? "bg-red-950/30 border-red-500/40"
                      : isWarning
                      ? "bg-amber-950/30 border-amber-500/40"
                      : "bg-sky-950/20 border-sky-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl border shrink-0 ${
                        isCritical ? "bg-red-500/20 border-red-500/40 text-red-400" :
                        isWarning ? "bg-amber-500/20 border-amber-500/40 text-amber-400" :
                        "bg-sky-500/20 border-sky-500/40 text-sky-400"
                      }`}>
                        <AlertOctagon className="h-5 w-5" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-white text-sm">{alarm.title}</h4>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                            isCritical ? "bg-red-500/20 text-red-300 border-red-500/40" :
                            isWarning ? "bg-amber-500/20 text-amber-300 border-amber-500/40" :
                            "bg-sky-500/20 text-sky-300 border-sky-500/40"
                          }`}>
                            {alarm.severity}
                          </span>
                          <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full border border-neutral-700">
                            {alarm.category.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed">{alarm.message}</p>
                        <p className="text-[10px] text-neutral-500">{new Date(alarm.timestamp).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!alarm.resolved ? (
                        <button
                          type="button"
                          onClick={() => handleResolveAlarm(alarm.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition flex items-center gap-1"
                        >
                          <Check className="h-3.5 w-3.5" /> Resolve
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-lg">
                          ✓ Resolved
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 4: BROADCAST NOTIFIER & ANNOUNCEMENT HUB ──────────────── */}
      {activeTab === "broadcasts" && (
        <div className="space-y-6">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
              <Radio className="h-4 w-4 text-amber-500" /> Dispatch Platform Broadcast Alert
            </h3>

            <form onSubmit={handleCreateBroadcast} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="block">
                  <span className="text-neutral-400 font-semibold block mb-1">Target Audience</span>
                  <select
                    value={bcastTarget}
                    onChange={e => setBcastTarget(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500 font-semibold"
                  >
                    <option value="TEACHERS">Teachers Only</option>
                    <option value="PARENTS">Parents Only</option>
                    <option value="STUDENTS">Students Only</option>
                    <option value="ALL">All Users (Global Platform)</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-neutral-400 font-semibold block mb-1">Priority Flag</span>
                  <select
                    value={bcastPriority}
                    onChange={e => setBcastPriority(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500 font-semibold"
                  >
                    <option value="NORMAL">Normal Priority</option>
                    <option value="URGENT">Urgent Priority (Top Banner)</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-neutral-400 font-semibold block mb-1">Broadcast Title *</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Official Physics Curriculum Update..."
                    value={bcastTitle}
                    onChange={e => setBcastTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-neutral-400 font-semibold block mb-1">Announcement Body Message *</span>
                <textarea
                  required
                  rows={3}
                  placeholder="Write clear instructions or alert details for the target audience..."
                  value={bcastMessage}
                  onChange={e => setBcastMessage(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                />
              </label>

              {bcastSuccessMsg && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" /> {bcastSuccessMsg}
                </div>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition shadow-lg flex items-center gap-2"
              >
                <Send className="h-4 w-4" /> Dispatch Broadcast Alert
              </button>
            </form>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Sent Broadcast Alerts History ({broadcasts.length})</h3>
            <div className="space-y-3">
              {broadcasts.map(b => (
                <div key={b.id} className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{b.title}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        b.priority === "URGENT" ? "bg-red-500/20 text-red-300 border-red-500/40" : "bg-sky-500/20 text-sky-300 border-sky-500/40"
                      }`}>
                        {b.priority}
                      </span>
                      <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full border border-neutral-700">
                        Target: {b.targetAudience}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-500">{new Date(b.sentAt).toLocaleString()}</span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed">{b.message}</p>
                  <div className="text-[10px] text-neutral-500 border-t border-neutral-800/60 pt-2 flex justify-between">
                    <span>Dispatched by: {b.authorName}</span>
                    <span>Delivered to {b.readCount || 0} user accounts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: DIRECTIVES & ADMIN NOTES LEDGER ─────────────────────── */}
      {activeTab === "notes" && (
        <div className="space-y-6">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
              <FileText className="h-4 w-4 text-violet-400" /> Log Administrative Directive / Action Note
            </h3>

            <form onSubmit={handleCreateAdminNote} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="block">
                  <span className="text-neutral-400 font-semibold block mb-1">Directive Category</span>
                  <select
                    value={noteCategory}
                    onChange={e => setNoteCategory(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500 font-semibold"
                  >
                    <option value="Pedagogical Audit">Pedagogical Audit</option>
                    <option value="Financial Policy">Financial Policy</option>
                    <option value="Curriculum Revision">Curriculum Revision</option>
                    <option value="System Tech">System Tech</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-neutral-400 font-semibold block mb-1">Priority</span>
                  <select
                    value={notePriority}
                    onChange={e => setNotePriority(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500 font-semibold"
                  >
                    <option value="URGENT">Urgent Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="INFO">Informational</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-neutral-400 font-semibold block mb-1">Directive Title *</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Audit Case C Projectile Math..."
                    value={noteTitle}
                    onChange={e => setNoteTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-neutral-400 font-semibold block mb-1">Target Teacher (Optional)</span>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Hassan Youssef"
                    value={noteTeacherTarget}
                    onChange={e => setNoteTeacherTarget(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500"
                  />
                </label>

                <label className="block">
                  <span className="text-neutral-400 font-semibold block mb-1">Target Package (Optional)</span>
                  <input
                    type="text"
                    placeholder="e.g. Year 11 Physics Section A"
                    value={notePackageTarget}
                    onChange={e => setNotePackageTarget(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-neutral-400 font-semibold block mb-1">Directive Action Content *</span>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail the exact administrative task, policy change, or review request..."
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500"
                />
              </label>

              <button
                type="submit"
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition shadow-lg flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" /> Save Directive Note
              </button>
            </form>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Administrative Directives Ledger</h3>
              <div className="flex gap-1.5 text-xs">
                {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED"].map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setNoteFilterStatus(st)}
                    className={`px-3 py-1 rounded-lg font-bold transition ${
                      noteFilterStatus === st ? "bg-amber-500 text-black" : "bg-neutral-900 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredNotes.map(n => (
                <div key={n.id} className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl text-xs space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="font-bold text-white text-sm">{n.title}</h4>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          n.priority === "URGENT" ? "bg-red-500/20 text-red-300 border-red-500/40" : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        }`}>
                          {n.priority}
                        </span>
                        <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full border border-neutral-700">
                          {n.category}
                        </span>
                      </div>
                      <p className="text-neutral-300 leading-relaxed">{n.content}</p>
                      {(n.targetTeacherName || n.targetPackageName) && (
                        <p className="text-[10px] text-amber-400 mt-2">
                          Linked: {n.targetTeacherName ? `Teacher: ${n.targetTeacherName}` : ""} {n.targetPackageName ? `| Package: ${n.targetPackageName}` : ""}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <select
                        value={n.status}
                        onChange={e => handleUpdateNoteStatus(n.id, e.target.value as any)}
                        className="bg-neutral-950 border border-neutral-700 text-white font-bold rounded-lg px-2.5 py-1 text-[11px] outline-none"
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(n.id)}
                        className="text-[10px] text-neutral-500 hover:text-red-400 flex items-center justify-end gap-1"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 6: CURRICULUM REGISTRY & MULTI-POLICY ENGINE ──────────── */}
      {activeTab === "registry" && (
        <div className="space-y-5">
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

          <div className="space-y-4">
            {specs.map(spec => {
              const deps = ClassRegistry.getCurriculumDependencies(spec.id);
              const policyProfiles = ClassRegistry.getCurriculumPolicyProfiles(spec.id);
              const activeProfileId = spec.activePolicyId || policyProfiles[0]?.id;

              return (
                <div key={spec.id} className="bg-neutral-900/70 border border-neutral-800 rounded-2xl overflow-hidden text-xs">
                  <div className="flex items-start gap-4 p-5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white text-sm">{spec.name}</h3>
                        <span className="text-[10px] bg-sky-500/15 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full">{spec.subject}</span>
                        <span className="text-[10px] bg-neutral-800 text-neutral-400 border border-neutral-700 px-2 py-0.5 rounded-full">{spec.gradeLevel}</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-1">{spec.publisher} · v{spec.version}</p>

                      {/* Multi-Policy Profiles Section */}
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                            📜 Multi-Policy Profiles ({policyProfiles.length})
                          </span>
                          <button
                            type="button"
                            onClick={() => { setSelectedCurriculumId(spec.id); setShowAddPolicyModal(true); }}
                            className="text-[10px] text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1"
                          >
                            + Add Policy Profile
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {policyProfiles.map(profile => {
                            const isActive = profile.id === activeProfileId;

                            return (
                              <div
                                key={profile.id}
                                className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 transition ${
                                  isActive
                                    ? "bg-amber-950/30 border-amber-500/50 shadow-md"
                                    : "bg-neutral-950 border-neutral-800 opacity-80"
                                }`}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-white text-xs">{profile.name}</span>
                                    {isActive && (
                                      <span className="text-[9px] font-bold bg-amber-500 text-black px-2 py-0.2 rounded-full">
                                        ACTIVE
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-neutral-400 line-clamp-2">{profile.notes || "Standard policy rules."}</p>
                                </div>

                                <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60 text-[10px]">
                                  <div className="flex gap-1">
                                    <PolicyBadge on={profile.aiTankEnabled} label="AI" />
                                    <PolicyBadge on={profile.allowTeacherCustomSlides} label="Slides" />
                                  </div>

                                  {!isActive ? (
                                    <button
                                      type="button"
                                      onClick={() => handleSetActivePolicyProfile(spec.id, profile.id)}
                                      className="text-amber-400 hover:text-amber-300 font-bold"
                                    >
                                      ✓ Apply
                                    </button>
                                  ) : (
                                    <span className="text-emerald-400 font-bold">Applied</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex gap-4 mt-3 text-[11px] text-neutral-400">
                        <span><span className="text-amber-400 font-bold">{deps.authorizedTeachers.length}</span> authorized teachers</span>
                        <span><span className="text-sky-400 font-bold">{deps.affectedPackages.length}</span> active packages</span>
                        <span><span className="text-neutral-500">{spec.chapters.length}</span> chapters</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setCloneTargetSpec(spec);
                          setCloneVersionTag("2026/2027 v2.0");
                          setCloneNewTitle(`${spec.name} (2026/2027 Edition)`);
                          setShowCloneModal(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-sky-500/20 text-neutral-300 hover:text-sky-300 border border-neutral-700 hover:border-sky-500/40 rounded-lg text-[11px] font-bold transition"
                      >
                        <Copy className="h-3 w-3 text-sky-400" /> Clone for New Year
                      </button>
                      <button
                        onClick={() => openRemoveModal(spec)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-300 border border-neutral-700 hover:border-red-500/40 rounded-lg text-[11px] font-bold transition"
                      >
                        <Trash2 className="h-3 w-3" /> Remove Spec
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 7: ADD NEW CURRICULUM ──────────────────────────────────── */}
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
                <Settings className="h-3.5 w-3.5" /> Initial Policy Profile
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

      {/* ── TAB 8: TEACHER GOVERNANCE & PERMISSIONS ────────────────────── */}
      {activeTab === "teachers" && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-amber-500" />
                Teacher Capability & Permissions Governance
              </h3>
              <p className="text-xs text-neutral-400">Admin decides: provision new teachers, set initial credentials, assign curricula, and inspect passwords anytime.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setNewTeacherName("");
                  setNewTeacherEmail("");
                  setNewTeacherPassword(`teach_${Math.random().toString(36).slice(2, 7)}`);
                  setShowAddTeacherModal(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl text-xs transition shadow-lg flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" /> Provision New Teacher Account
              </button>
              <span className="text-[11px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold">
                {teacherAssignments.length} TEACHERS ACTIVE
              </span>
            </div>
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

                {/* ── Admin Credential & Password Visibility Panel ── */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Key className="h-3.5 w-3.5" /> Login Credentials & Password Management
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      Visible & Fully Managed by Admin
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800">
                      <span className="text-neutral-500 block text-[10px]">Login Username / Email</span>
                      <strong className="text-white font-mono text-xs block truncate mt-0.5">
                        {assignment.teacherEmail}
                      </strong>
                    </div>

                    <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-between">
                      <div>
                        <span className="text-neutral-500 block text-[10px]">Current Active Password</span>
                        <strong className="text-amber-400 font-mono text-xs block mt-0.5">
                          {showTeacherPasswords[assignment.teacherId]
                            ? (assignment.password || assignment.initialPassword || "teacher123")
                            : "••••••••••••"}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowTeacherPasswords(p => ({ ...p, [assignment.teacherId]: !p[assignment.teacherId] }))}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition ml-2"
                        title={showTeacherPasswords[assignment.teacherId] ? "Hide Password" : "Show Password"}
                      >
                        {showTeacherPasswords[assignment.teacherId] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>

                    <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-between">
                      <div>
                        <span className="text-neutral-500 block text-[10px]">Security Status</span>
                        <p className="text-[11px] text-neutral-300 mt-0.5">
                          {assignment.lastPasswordChangedAt ? `Changed: ${new Date(assignment.lastPasswordChangedAt).toLocaleDateString()}` : "Initial Provisioned"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setResetPassTeacherId(assignment.teacherId);
                          setResetPassValue(`teach_${Math.random().toString(36).slice(2, 7)}`);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500 hover:text-black text-amber-300 border border-amber-500/30 text-[10px] font-bold transition"
                      >
                        🔑 Reset
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                    🛡️ Teacher Action & Capability Permissions
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
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

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Curriculum Packaging Authorization
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {specs.map(spec => {
                      const status = ClassRegistry.getTeacherCurriculumStatus(assignment.teacherId, spec.id);
                      const isActive = status === "ACTIVE";
                      const isSuspended = status === "SUSPENDED";
                      const isUnassigned = status === "UNASSIGNED";

                      return (
                        <div key={spec.id} className={`p-3 rounded-xl border flex items-center justify-between text-xs transition ${
                          isActive ? "bg-emerald-950/30 border-emerald-500/40" :
                          isSuspended ? "bg-amber-950/30 border-amber-500/40" :
                          "bg-neutral-950 border-neutral-800 opacity-70"
                        }`}>
                          <div className="truncate pr-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="font-bold text-white truncate">{spec.name}</p>
                              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                                isActive ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                                isSuspended ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                                "bg-neutral-800 text-neutral-400 border-neutral-700"
                              }`}>
                                {isActive ? "🟢 ACTIVE" : isSuspended ? "⏸️ SUSPENDED" : "⚪ UNASSIGNED"}
                              </span>
                            </div>
                            <p className="text-[10px] text-neutral-400">{spec.gradeLevel}</p>
                          </div>
                          
                          <div className="flex items-center gap-1.5 shrink-0">
                            {isActive && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleSetTeacherCurriculumStatus(assignment.teacherId, spec.id, "SUSPENDED")}
                                  className="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-amber-950/80 hover:bg-amber-500 hover:text-black text-amber-300 border border-amber-500/40 transition"
                                  title="Suspend access for this teacher"
                                >
                                  ⏸️ Suspend
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSetTeacherCurriculumStatus(assignment.teacherId, spec.id, "REVOKED")}
                                  className="px-2 py-1 rounded-lg font-bold text-[10px] bg-neutral-800 hover:bg-red-600 text-neutral-400 hover:text-white transition"
                                  title="Revoke authorization completely"
                                >
                                  ✕ Revoke
                                </button>
                              </>
                            )}

                            {isSuspended && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleSetTeacherCurriculumStatus(assignment.teacherId, spec.id, "ACTIVE")}
                                  className="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white transition"
                                  title="Re-activate access for this teacher"
                                >
                                  ▶️ Activate
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSetTeacherCurriculumStatus(assignment.teacherId, spec.id, "REVOKED")}
                                  className="px-2 py-1 rounded-lg font-bold text-[10px] bg-neutral-800 hover:bg-red-600 text-neutral-400 hover:text-white transition"
                                  title="Revoke authorization completely"
                                >
                                  ✕ Revoke
                                </button>
                              </>
                            )}

                            {isUnassigned && (
                              <button
                                type="button"
                                onClick={() => handleSetTeacherCurriculumStatus(assignment.teacherId, spec.id, "ACTIVE")}
                                className="px-3 py-1 rounded-lg font-bold text-[10px] bg-neutral-800 hover:bg-emerald-600 text-neutral-300 hover:text-white transition"
                                title="Authorize and mark active"
                              >
                                + Authorize
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-neutral-800/80">
                  <button
                    type="button"
                    onClick={() => handleDeleteTeacher(assignment.teacherId)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-400 bg-red-950/30 border border-red-500/30 hover:bg-red-900/50 transition flex items-center gap-1.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete Teacher Account
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 10: CURRICULUM AI STUDIO ───────────────────────────────── */}
      {activeTab === "curriculum-studio" && (
        <div className="space-y-5">
          <CurriculumAIStudio />
        </div>
      )}

      {/* ── TAB 9: AI & OLLAMA MULTI-API POOL SETTINGS ───────────────────── */}
      {activeTab === "ai" && (
        <div className="space-y-6">
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

                        {testRes && (
                          <p className={`text-[10px] font-bold mt-1 ${testRes.success ? "text-emerald-400" : "text-red-400"}`}>
                            {testRes.message} {testRes.latencyMs ? `(${testRes.latencyMs}ms)` : ""}
                          </p>
                        )}
                      </div>

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
        </div>
      )}

      {/* ── TAB 11: SOVEREIGN CURRICULUM RULEBOOK HUB ───────────────────── */}
      {activeTab === "sovereign-rules" && (
        <div className="space-y-6">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Sovereign Curriculum Rulebook Engine
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                      ISOLATED PER CURRICULUM
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Each curriculum has its own independent rules for lesson management, commercial packages, teacher permissions, domain policies, and assessments.
                  </p>
                </div>
              </div>

              {/* Target Curriculum Dropdown Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-semibold">Target Curriculum:</span>
                <select
                  value={selectedRuleCurriculumId}
                  onChange={e => setSelectedRuleCurriculumId(e.target.value)}
                  className="bg-neutral-950 border border-amber-500/40 text-amber-300 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-amber-400"
                >
                  {specs.map(spec => (
                    <option key={spec.id} value={spec.id}>
                      {spec.name} ({spec.version})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Curriculum Summary Pill */}
            {specs.find(s => s.id === selectedRuleCurriculumId) && (
              <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs">
                <div>
                  <span className="font-bold text-white text-sm">
                    {specs.find(s => s.id === selectedRuleCurriculumId)?.name}
                  </span>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Publisher: {specs.find(s => s.id === selectedRuleCurriculumId)?.publisher} · Subject: {specs.find(s => s.id === selectedRuleCurriculumId)?.subject} · {specs.find(s => s.id === selectedRuleCurriculumId)?.gradeLevel}
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-300 border border-neutral-700">
                    ID: {selectedRuleCurriculumId}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
                    {specs.find(s => s.id === selectedRuleCurriculumId)?.lessons.length || 0} Lessons
                  </span>
                </div>
              </div>
            )}

            {/* Grid of 5 Sovereign Rules Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* CARD 1: Lesson Management Rules */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-sky-400 border-b border-neutral-800/80 pb-2">
                  <BookOpen className="h-4 w-4" />
                  <h4 className="font-bold text-xs uppercase tracking-wider">1. Lesson Management Rules</h4>
                </div>
                <div className="space-y-3 text-xs">
                  <label className="flex items-center justify-between p-2 rounded-lg bg-neutral-900/60 border border-neutral-800 cursor-pointer">
                    <span className="text-neutral-300">Allow Adding New Lessons</span>
                    <input
                      type="checkbox"
                      checked={rulebookForm.lessonsPolicy.canAddLessons}
                      onChange={e => setRulebookForm(f => ({
                        ...f,
                        lessonsPolicy: { ...f.lessonsPolicy, canAddLessons: e.target.checked }
                      }))}
                      className="rounded border-neutral-700 bg-neutral-900 text-amber-500 focus:ring-0"
                    />
                  </label>
                  <label className="flex items-center justify-between p-2 rounded-lg bg-neutral-900/60 border border-neutral-800 cursor-pointer">
                    <span className="text-neutral-300">Allow Modifying Master Lesson Titles</span>
                    <input
                      type="checkbox"
                      checked={rulebookForm.lessonsPolicy.canModifyLessons}
                      onChange={e => setRulebookForm(f => ({
                        ...f,
                        lessonsPolicy: { ...f.lessonsPolicy, canModifyLessons: e.target.checked }
                      }))}
                      className="rounded border-neutral-700 bg-neutral-900 text-amber-500 focus:ring-0"
                    />
                  </label>
                  <label className="flex items-center justify-between p-2 rounded-lg bg-neutral-900/60 border border-neutral-800 cursor-pointer">
                    <span className="text-neutral-300">Allow Deleting Master Lessons</span>
                    <input
                      type="checkbox"
                      checked={rulebookForm.lessonsPolicy.canDeleteLessons}
                      onChange={e => setRulebookForm(f => ({
                        ...f,
                        lessonsPolicy: { ...f.lessonsPolicy, canDeleteLessons: e.target.checked }
                      }))}
                      className="rounded border-neutral-700 bg-neutral-900 text-amber-500 focus:ring-0"
                    />
                  </label>
                  <label className="flex items-center justify-between p-2 rounded-lg bg-neutral-900/60 border border-neutral-800 cursor-pointer">
                    <span className="text-neutral-300">Allow Teacher Soft-Exclusions (Class Level)</span>
                    <input
                      type="checkbox"
                      checked={rulebookForm.lessonsPolicy.allowTeacherSoftExclusions}
                      onChange={e => setRulebookForm(f => ({
                        ...f,
                        lessonsPolicy: { ...f.lessonsPolicy, allowTeacherSoftExclusions: e.target.checked }
                      }))}
                      className="rounded border-neutral-700 bg-neutral-900 text-amber-500 focus:ring-0"
                    />
                  </label>
                  <label className="flex items-center justify-between p-2 rounded-lg bg-neutral-900/60 border border-neutral-800 cursor-pointer">
                    <span className="text-neutral-300">Enforce Strict Sequential Order for Students</span>
                    <input
                      type="checkbox"
                      checked={rulebookForm.lessonsPolicy.sequentialOrderRequired}
                      onChange={e => setRulebookForm(f => ({
                        ...f,
                        lessonsPolicy: { ...f.lessonsPolicy, sequentialOrderRequired: e.target.checked }
                      }))}
                      className="rounded border-neutral-700 bg-neutral-900 text-amber-500 focus:ring-0"
                    />
                  </label>
                </div>
              </div>

              {/* CARD 2: Commercial Package & Pricing Rules */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 border-b border-neutral-800/80 pb-2">
                  <Package className="h-4 w-4" />
                  <h4 className="font-bold text-xs uppercase tracking-wider">2. Commercial Package & Pricing Rules</h4>
                </div>
                <div className="space-y-3 text-xs">
                  <label className="flex items-center justify-between p-2 rounded-lg bg-neutral-900/60 border border-neutral-800 cursor-pointer">
                    <span className="text-neutral-300">Allow Private Packages (Invite-Only)</span>
                    <input
                      type="checkbox"
                      checked={rulebookForm.packageRules.allowPrivatePackages}
                      onChange={e => setRulebookForm(f => ({
                        ...f,
                        packageRules: { ...f.packageRules, allowPrivatePackages: e.target.checked }
                      }))}
                      className="rounded border-neutral-700 bg-neutral-900 text-emerald-500 focus:ring-0"
                    />
                  </label>
                  <label className="flex items-center justify-between p-2 rounded-lg bg-neutral-900/60 border border-neutral-800 cursor-pointer">
                    <span className="text-neutral-300">Allow Special Negotiated Prices</span>
                    <input
                      type="checkbox"
                      checked={rulebookForm.packageRules.allowSpecialNegotiatedPrices}
                      onChange={e => setRulebookForm(f => ({
                        ...f,
                        packageRules: { ...f.packageRules, allowSpecialNegotiatedPrices: e.target.checked }
                      }))}
                      className="rounded border-neutral-700 bg-neutral-900 text-emerald-500 focus:ring-0"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-neutral-400 block mb-1 font-semibold">Currency</span>
                      <input
                        type="text"
                        value={rulebookForm.packageRules.defaultCurrency}
                        onChange={e => setRulebookForm(f => ({
                          ...f,
                          packageRules: { ...f.packageRules, defaultCurrency: e.target.value }
                        }))}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-neutral-400 block mb-1 font-semibold">Min Price</span>
                      <input
                        type="number"
                        value={rulebookForm.packageRules.minimumPrice}
                        onChange={e => setRulebookForm(f => ({
                          ...f,
                          packageRules: { ...f.packageRules, minimumPrice: Number(e.target.value) }
                        }))}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-neutral-400 block mb-1 font-semibold">Max Discount %</span>
                      <input
                        type="number"
                        value={rulebookForm.packageRules.maximumDiscountPercent}
                        onChange={e => setRulebookForm(f => ({
                          ...f,
                          packageRules: { ...f.packageRules, maximumDiscountPercent: Number(e.target.value) }
                        }))}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-neutral-400 block mb-1 font-semibold">Validity (Days)</span>
                      <input
                        type="number"
                        value={rulebookForm.packageRules.defaultValidityDays}
                        onChange={e => setRulebookForm(f => ({
                          ...f,
                          packageRules: { ...f.packageRules, defaultValidityDays: Number(e.target.value) }
                        }))}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 3: Teacher Governance for this Curriculum */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-violet-400 border-b border-neutral-800/80 pb-2">
                  <UserCheck className="h-4 w-4" />
                  <h4 className="font-bold text-xs uppercase tracking-wider">3. Teacher Governance & Access</h4>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-neutral-400 block mb-2 font-semibold">Authorized Teachers for this Curriculum:</span>
                    <div className="space-y-2">
                      {teacherAssignments.map(ta => {
                        const isAllowed = rulebookForm.teacherRules.allowedTeacherIds.includes(ta.teacherId);
                        const isSuspended = rulebookForm.teacherRules.suspendedTeacherIds.includes(ta.teacherId);

                        return (
                          <div key={ta.teacherId} className="flex items-center justify-between p-2 rounded-lg bg-neutral-900/60 border border-neutral-800">
                            <div>
                              <p className="font-bold text-white">{ta.teacherName}</p>
                              <p className="text-[10px] text-neutral-400">{ta.teacherEmail} · ID: {ta.teacherId}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setRulebookForm(f => {
                                    const current = f.teacherRules.allowedTeacherIds;
                                    const next = current.includes(ta.teacherId)
                                      ? current.filter(id => id !== ta.teacherId)
                                      : [...current, ta.teacherId];
                                    return { ...f, teacherRules: { ...f.teacherRules, allowedTeacherIds: next } };
                                  });
                                }}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                                  isAllowed
                                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                    : "bg-neutral-800 text-neutral-500 border-neutral-700"
                                }`}
                              >
                                {isAllowed ? "✓ Authorized" : "+ Authorize"}
                              </button>
                              {isAllowed && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRulebookForm(f => {
                                      const current = f.teacherRules.suspendedTeacherIds;
                                      const next = current.includes(ta.teacherId)
                                        ? current.filter(id => id !== ta.teacherId)
                                        : [...current, ta.teacherId];
                                      return { ...f, teacherRules: { ...f.teacherRules, suspendedTeacherIds: next } };
                                    });
                                  }}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                                    isSuspended
                                      ? "bg-red-500/20 text-red-300 border-red-500/40"
                                      : "bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white"
                                  }`}
                                >
                                  {isSuspended ? "⚠️ Suspended" : "Active"}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-neutral-800/80 pt-3 space-y-2">
                    <label className="flex items-center justify-between p-2 rounded-lg bg-neutral-900/60 border border-neutral-800 cursor-pointer">
                      <span className="text-neutral-300">Allow Teachers to Author Custom Slides</span>
                      <input
                        type="checkbox"
                        checked={rulebookForm.teacherRules.allowTeacherCustomSlides}
                        onChange={e => setRulebookForm(f => ({
                          ...f,
                          teacherRules: { ...f.teacherRules, allowTeacherCustomSlides: e.target.checked }
                        }))}
                        className="rounded border-neutral-700 bg-neutral-900 text-violet-500 focus:ring-0"
                      />
                    </label>
                    <label className="flex items-center justify-between p-2 rounded-lg bg-neutral-900/60 border border-neutral-800 cursor-pointer">
                      <span className="text-neutral-300">Allow Direct Parent Communication</span>
                      <input
                        type="checkbox"
                        checked={rulebookForm.teacherRules.allowTeacherDirectParentContact}
                        onChange={e => setRulebookForm(f => ({
                          ...f,
                          teacherRules: { ...f.teacherRules, allowTeacherDirectParentContact: e.target.checked }
                        }))}
                        className="rounded border-neutral-700 bg-neutral-900 text-violet-500 focus:ring-0"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* CARD 4: Assessment & 3-Case Diagnostic Rules */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 border-b border-neutral-800/80 pb-2">
                  <Target className="h-4 w-4" />
                  <h4 className="font-bold text-xs uppercase tracking-wider">4. Assessment & 3-Case Diagnostic Rules</h4>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-neutral-400 block mb-1 font-semibold">Minimum Passing Score Threshold (%):</span>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="50"
                        max="100"
                        step="5"
                        value={rulebookForm.assessmentRules.passingScorePercent}
                        onChange={e => setRulebookForm(f => ({
                          ...f,
                          assessmentRules: { ...f.assessmentRules, passingScorePercent: Number(e.target.value) }
                        }))}
                        className="flex-1 accent-amber-500"
                      />
                      <span className="font-bold font-mono text-amber-400 text-sm w-12 text-right">
                        {rulebookForm.assessmentRules.passingScorePercent}%
                      </span>
                    </div>
                  </div>

                  <label className="flex items-center justify-between p-2 rounded-lg bg-neutral-900/60 border border-neutral-800 cursor-pointer">
                    <span className="text-neutral-300">Enable Adaptive Case Pre Scaffolding Trials</span>
                    <input
                      type="checkbox"
                      checked={rulebookForm.assessmentRules.enableScaffoldingPreTrials}
                      onChange={e => setRulebookForm(f => ({
                        ...f,
                        assessmentRules: { ...f.assessmentRules, enableScaffoldingPreTrials: e.target.checked }
                      }))}
                      className="rounded border-neutral-700 bg-neutral-900 text-amber-500 focus:ring-0"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-lg bg-neutral-900/60 border border-neutral-800 cursor-pointer">
                    <span className="text-neutral-300">Enable High-Level Case C Challenge Questions</span>
                    <input
                      type="checkbox"
                      checked={rulebookForm.assessmentRules.enableChallengeCaseC}
                      onChange={e => setRulebookForm(f => ({
                        ...f,
                        assessmentRules: { ...f.assessmentRules, enableChallengeCaseC: e.target.checked }
                      }))}
                      className="rounded border-neutral-700 bg-neutral-900 text-amber-500 focus:ring-0"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-lg bg-neutral-900/60 border border-neutral-800 cursor-pointer">
                    <span className="text-neutral-300">Shuffle Answer Choices for Students</span>
                    <input
                      type="checkbox"
                      checked={rulebookForm.assessmentRules.shuffleChoices}
                      onChange={e => setRulebookForm(f => ({
                        ...f,
                        assessmentRules: { ...f.assessmentRules, shuffleChoices: e.target.checked }
                      }))}
                      className="rounded border-neutral-700 bg-neutral-900 text-amber-500 focus:ring-0"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* CARD 5: Domain Action Policies Matrix */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                <div className="flex items-center gap-2 text-red-400">
                  <ShieldCheck className="h-4 w-4" />
                  <h4 className="font-bold text-xs uppercase tracking-wider">5. Granular Domain Action Permissions Matrix</h4>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">Governs Teacher AI Desk & Manual Authoring</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {(["questionTank", "syllabus", "packages", "carouselContent"] as const).map(domainKey => {
                  const policy = rulebookForm.domainPolicies[domainKey];
                  const labels: Record<string, string> = {
                    questionTank: "🧬 Question DNA Tank",
                    syllabus: "📖 Official Syllabus",
                    packages: "📦 Commercial Packages",
                    carouselContent: "🎠 Carousel Content"
                  };

                  return (
                    <div key={domainKey} className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-3 space-y-2">
                      <span className="font-bold text-white block text-[11px]">{labels[domainKey]}</span>
                      <div className="space-y-1.5">
                        <label className="flex items-center justify-between text-[11px] text-neutral-400 cursor-pointer">
                          <span>+ Add</span>
                          <input
                            type="checkbox"
                            checked={policy.canAdd}
                            onChange={e => setRulebookForm(f => ({
                              ...f,
                              domainPolicies: {
                                ...f.domainPolicies,
                                [domainKey]: { ...f.domainPolicies[domainKey], canAdd: e.target.checked }
                              }
                            }))}
                            className="rounded border-neutral-700 bg-neutral-900 text-emerald-500 focus:ring-0"
                          />
                        </label>
                        <label className="flex items-center justify-between text-[11px] text-neutral-400 cursor-pointer">
                          <span>✎ Modify</span>
                          <input
                            type="checkbox"
                            checked={policy.canModify}
                            onChange={e => setRulebookForm(f => ({
                              ...f,
                              domainPolicies: {
                                ...f.domainPolicies,
                                [domainKey]: { ...f.domainPolicies[domainKey], canModify: e.target.checked }
                              }
                            }))}
                            className="rounded border-neutral-700 bg-neutral-900 text-sky-500 focus:ring-0"
                          />
                        </label>
                        <label className="flex items-center justify-between text-[11px] text-neutral-400 cursor-pointer">
                          <span>✕ Remove</span>
                          <input
                            type="checkbox"
                            checked={policy.canRemove}
                            onChange={e => setRulebookForm(f => ({
                              ...f,
                              domainPolicies: {
                                ...f.domainPolicies,
                                [domainKey]: { ...f.domainPolicies[domainKey], canRemove: e.target.checked }
                              }
                            }))}
                            className="rounded border-neutral-700 bg-neutral-900 text-red-500 focus:ring-0"
                          />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Save Status Banner */}
            {rulebookSaveMsg && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                {rulebookSaveMsg}
              </div>
            )}

            {/* Save Sovereign Rules Button */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
              <span className="text-[11px] text-neutral-400">
                Rulebook changes apply immediately to active cohorts for this curriculum without affecting any other curricula.
              </span>
              <button
                type="button"
                onClick={handleSaveSovereignRules}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold rounded-xl text-xs transition shadow-lg flex items-center gap-2"
              >
                <Scale className="h-4 w-4" />
                💾 Save Sovereign Rulebook for this Curriculum
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 12: DYNAMIC HOMEPAGE CMS MANAGER ───────────────────── */}
      {activeTab === "homepage-manager" && (
        <div className="space-y-6">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Dynamic Homepage CMS & Visibility Governance
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                      LIVE PUBLIC CMS
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Control all public homepage content: hero banners, subject filters, announcements, section show/hide states, and footer.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveHomepageCMS}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl text-xs transition shadow-lg flex items-center gap-2"
              >
                <Check className="h-4 w-4" /> Save Homepage Configuration
              </button>
            </div>

            {/* Save Status Banner */}
            {homepageSaveMsg && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                {homepageSaveMsg}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* CARD 1: Hero Banner Editor */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Sparkles className="h-4 w-4" />
                    <h4 className="font-bold text-xs uppercase tracking-wider">1. Hero Banner Content</h4>
                  </div>
                  <span className="text-[10px] text-neutral-400">Top Public Showcase Header</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-neutral-400 block mb-1 font-semibold">Badge Pill Text</label>
                    <input
                      type="text"
                      value={homepageForm.heroBadgeText}
                      onChange={e => setHomepageForm(f => ({ ...f, heroBadgeText: e.target.value }))}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1 font-semibold">Hero Main Title</label>
                    <input
                      type="text"
                      value={homepageForm.heroTitle}
                      onChange={e => setHomepageForm(f => ({ ...f, heroTitle: e.target.value }))}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-bold outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1 font-semibold">Hero Subtitle / Description</label>
                    <textarea
                      rows={3}
                      value={homepageForm.heroSubtitle}
                      onChange={e => setHomepageForm(f => ({ ...f, heroSubtitle: e.target.value }))}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-neutral-400 block mb-1 font-semibold">CTA Button Label</label>
                      <input
                        type="text"
                        value={homepageForm.heroCtaText}
                        onChange={e => setHomepageForm(f => ({ ...f, heroCtaText: e.target.value }))}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="flex items-center pt-5">
                      <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={homepageForm.heroCtaVisible}
                          onChange={e => setHomepageForm(f => ({ ...f, heroCtaVisible: e.target.checked }))}
                          className="rounded border-neutral-700 bg-neutral-900 text-amber-500"
                        />
                        <span>Show CTA Button</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: Section Show / Hide Governance */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                  <div className="flex items-center gap-2 text-sky-400">
                    <Layers className="h-4 w-4" />
                    <h4 className="font-bold text-xs uppercase tracking-wider">2. Homepage Sections Visibility</h4>
                  </div>
                  <span className="text-[10px] text-neutral-400">Show / Hide Toggles</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  {homepageForm.sections.map((section) => (
                    <div
                      key={section.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/70 border border-neutral-800"
                    >
                      <div>
                        <p className="font-bold text-white">{section.label}</p>
                        <p className="text-[10px] text-neutral-400 font-mono">Section ID: {section.id}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setHomepageForm(f => ({
                            ...f,
                            sections: f.sections.map(s => s.id === section.id ? { ...s, visible: !s.visible } : s)
                          }));
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${
                          section.visible
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : "bg-neutral-800 text-neutral-500 border-neutral-700"
                        }`}
                      >
                        {section.visible ? "👁️ Visible" : "✕ Hidden"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 3: Subject Filter Tabs Manager */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                  <div className="flex items-center gap-2 text-violet-400">
                    <Filter className="h-4 w-4" />
                    <h4 className="font-bold text-xs uppercase tracking-wider">3. Subject Filter Tabs</h4>
                  </div>
                  <span className="text-[10px] text-neutral-400">Filter Bar Pills</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {homepageForm.subjectFilters.map(filter => (
                      <div
                        key={filter.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900 border border-neutral-800"
                      >
                        <div>
                          <p className="font-bold text-white">{filter.label}</p>
                          <p className="text-[10px] text-neutral-400 font-mono">Match: {filter.matchKey}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setHomepageForm(f => ({
                                ...f,
                                subjectFilters: f.subjectFilters.map(sf => sf.id === filter.id ? { ...sf, visible: !sf.visible } : sf)
                              }));
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                              filter.visible
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                : "bg-neutral-800 text-neutral-500 border-neutral-700"
                            }`}
                          >
                            {filter.visible ? "Active" : "Hidden"}
                          </button>
                          {filter.id !== "ALL" && (
                            <button
                              type="button"
                              onClick={() => {
                                setHomepageForm(f => ({
                                  ...f,
                                  subjectFilters: f.subjectFilters.filter(sf => sf.id !== filter.id)
                                }));
                              }}
                              className="p-1 rounded text-neutral-500 hover:text-red-400 transition"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Filter Form */}
                  <div className="border-t border-neutral-800/80 pt-3 space-y-2">
                    <span className="text-[11px] font-semibold text-neutral-300 block">+ Add Custom Subject Filter:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Label e.g. Drama Arts"
                        value={newFilterLabel}
                        onChange={e => setNewFilterLabel(e.target.value)}
                        className="bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-white text-xs outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        placeholder="Match Key e.g. drama"
                        value={newFilterKey}
                        onChange={e => setNewFilterKey(e.target.value)}
                        className="bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-white text-xs outline-none focus:border-amber-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newFilterLabel.trim() || !newFilterKey.trim()) return;
                        const newId = newFilterKey.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                        setHomepageForm(f => ({
                          ...f,
                          subjectFilters: [
                            ...f.subjectFilters,
                            { id: newId, label: newFilterLabel.trim(), matchKey: newFilterKey.trim(), visible: true }
                          ]
                        }));
                        setNewFilterLabel("");
                        setNewFilterKey("");
                      }}
                      className="w-full py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-lg text-xs transition"
                    >
                      + Add Filter Tab
                    </button>
                  </div>
                </div>
              </div>

              {/* CARD 4: Global Announcement Banner */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Radio className="h-4 w-4" />
                    <h4 className="font-bold text-xs uppercase tracking-wider">4. Global Announcement Banner</h4>
                  </div>
                  <label className="flex items-center gap-1.5 text-neutral-300 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={homepageForm.announcementBanner.enabled}
                      onChange={e => setHomepageForm(f => ({
                        ...f,
                        announcementBanner: { ...f.announcementBanner, enabled: e.target.checked }
                      }))}
                      className="rounded border-neutral-700 bg-neutral-900 text-emerald-500"
                    />
                    <span>Enabled</span>
                  </label>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-neutral-400 block mb-1 font-semibold">Banner Message</label>
                    <textarea
                      rows={3}
                      value={homepageForm.announcementBanner.message}
                      onChange={e => setHomepageForm(f => ({
                        ...f,
                        announcementBanner: { ...f.announcementBanner, message: e.target.value }
                      }))}
                      placeholder="Type announcement message shown across homepage..."
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1 font-semibold">Banner Style / Type</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(["info", "warning", "success", "promo"] as const).map(bType => (
                        <button
                          key={bType}
                          type="button"
                          onClick={() => setHomepageForm(f => ({
                            ...f,
                            announcementBanner: { ...f.announcementBanner, type: bType }
                          }))}
                          className={`py-1.5 rounded-lg font-bold text-[11px] uppercase border transition ${
                            homepageForm.announcementBanner.type === bType
                              ? bType === "promo" ? "bg-amber-500 text-black border-amber-400" :
                                bType === "success" ? "bg-emerald-600 text-white border-emerald-500" :
                                bType === "warning" ? "bg-orange-600 text-white border-orange-500" :
                                "bg-sky-600 text-white border-sky-500"
                              : "bg-neutral-900 text-neutral-400 border-neutral-800"
                          }`}
                        >
                          {bType}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Footer Settings */}
                  <div className="border-t border-neutral-800/80 pt-3 space-y-2">
                    <label className="text-neutral-400 block font-semibold">Footer Text</label>
                    <input
                      type="text"
                      value={homepageForm.footerText}
                      onChange={e => setHomepageForm(f => ({ ...f, footerText: e.target.value }))}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-white outline-none focus:border-amber-500 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={handleSaveHomepageCMS}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold rounded-xl text-xs transition shadow-lg flex items-center gap-2"
              >
                <Check className="h-4 w-4" /> Save Homepage Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PROVISION NEW TEACHER ACCOUNT MODAL ───────────────────────── */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in-95 text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-emerald-400" /> Provision New Teacher & Curriculums
              </h3>
              <button type="button" onClick={() => setShowAddTeacherModal(false)} className="text-neutral-500 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            {teacherCreateMsg && (
              <div className={`p-3 rounded-lg border font-semibold flex items-center gap-2 ${
                teacherCreateMsg.success ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300" : "bg-red-950/40 border-red-500/40 text-red-300"
              }`}>
                {teacherCreateMsg.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                {teacherCreateMsg.message}
              </div>
            )}

            <form onSubmit={handleCreateTeacher} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Teacher Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ahmed Mansoor"
                    value={newTeacherName}
                    onChange={e => setNewTeacherName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Login Email / Username *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ahmed.mansoor@school.edu.eg"
                    value={newTeacherEmail}
                    onChange={e => setNewTeacherEmail(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Initial Password</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newTeacherPassword}
                    onChange={e => setNewTeacherPassword(e.target.value)}
                    className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setNewTeacherPassword(`teach_${Math.random().toString(36).slice(2, 7)}`)}
                    className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded-lg transition"
                  >
                    🎲 Random
                  </button>
                </div>
                <p className="text-[10px] text-neutral-500 mt-1">Teacher can change this password anytime from their dashboard, and you will still be able to inspect it.</p>
              </div>

              {/* Curriculum Assignment Checkboxes */}
              <div className="space-y-2">
                <label className="block text-neutral-400 font-semibold">Assign Initial Authorized Curricula *</label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 bg-neutral-900 rounded-xl border border-neutral-800">
                  {specs.map(spec => (
                    <label key={spec.id} className="flex items-center gap-2 text-neutral-300 cursor-pointer p-1 rounded hover:bg-neutral-800/50">
                      <input
                        type="checkbox"
                        checked={newTeacherCurriculums.includes(spec.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setNewTeacherCurriculums(c => [...c, spec.id]);
                          } else {
                            setNewTeacherCurriculums(c => c.filter(id => id !== spec.id));
                          }
                        }}
                        className="rounded border-neutral-700 bg-neutral-900 text-emerald-500"
                      />
                      <span className="font-semibold text-xs">{spec.name}</span>
                      <span className="text-[10px] text-neutral-500">({spec.version})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Permissions Checkboxes */}
              <div className="space-y-2">
                <label className="block text-neutral-400 font-semibold">Teacher Action Permissions</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 text-neutral-300 cursor-pointer p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                    <input
                      type="checkbox"
                      checked={newTeacherPermissions.canAddCarousels}
                      onChange={e => setNewTeacherPermissions(p => ({ ...p, canAddCarousels: e.target.checked }))}
                      className="rounded border-neutral-700 bg-neutral-900 text-amber-500"
                    />
                    <span>Add Custom Carousels</span>
                  </label>
                  <label className="flex items-center gap-2 text-neutral-300 cursor-pointer p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                    <input
                      type="checkbox"
                      checked={newTeacherPermissions.canContactParents}
                      onChange={e => setNewTeacherPermissions(p => ({ ...p, canContactParents: e.target.checked }))}
                      className="rounded border-neutral-700 bg-neutral-900 text-emerald-500"
                    />
                    <span>Contact Parents</span>
                  </label>
                  <label className="flex items-center gap-2 text-neutral-300 cursor-pointer p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                    <input
                      type="checkbox"
                      checked={newTeacherPermissions.canHostLiveSessions}
                      onChange={e => setNewTeacherPermissions(p => ({ ...p, canHostLiveSessions: e.target.checked }))}
                      className="rounded border-neutral-700 bg-neutral-900 text-sky-500"
                    />
                    <span>Host Live Sessions</span>
                  </label>
                  <label className="flex items-center gap-2 text-neutral-300 cursor-pointer p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                    <input
                      type="checkbox"
                      checked={newTeacherPermissions.canReviewCurriculumTanks}
                      onChange={e => setNewTeacherPermissions(p => ({ ...p, canReviewCurriculumTanks: e.target.checked }))}
                      className="rounded border-neutral-700 bg-neutral-900 text-violet-500"
                    />
                    <span>Lead Reviewer</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={newTeacherCurriculums.length === 0}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition disabled:opacity-50"
                >
                  ✓ Create Teacher Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── RESET TEACHER PASSWORD MODAL ──────────────────────────────── */}
      {resetPassTeacherId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 max-w-md w-full space-y-4 animate-in fade-in zoom-in-95 text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="h-4 w-4 text-amber-400" /> Reset Teacher Password
              </h3>
              <button type="button" onClick={() => setResetPassTeacherId(null)} className="text-neutral-500 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            {resetPassMsg && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> {resetPassMsg}
              </div>
            )}

            <div className="space-y-3">
              <p className="text-neutral-300">
                Set a new password for teacher <strong className="text-white">{teacherAssignments.find(t => t.teacherId === resetPassTeacherId)?.teacherName}</strong>:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={resetPassValue}
                  onChange={e => setResetPassValue(e.target.value)}
                  className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setResetPassValue(`teach_${Math.random().toString(36).slice(2, 7)}`)}
                  className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded-lg transition"
                >
                  🎲 Random
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setResetPassTeacherId(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => resetPassTeacherId && handleResetPassword(resetPassTeacherId)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition"
              >
                ✓ Apply New Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD POLICY PROFILE MODAL ──────────────────────────────────────── */}
      {showAddPolicyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 max-w-lg w-full space-y-5 animate-in fade-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PlusCircle className="h-4 w-4 text-amber-400" /> Create Policy Profile for {selectedCurriculumId}
              </h3>
              <button type="button" onClick={() => setShowAddPolicyModal(false)} className="text-neutral-500 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="text-neutral-400 font-semibold block mb-1">Policy Profile Name *</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Strict Examination Policy"
                  value={newPolicyName}
                  onChange={e => setNewPolicyName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                />
              </label>

              <PolicyEditor
                policy={newPolicyData}
                onChange={setNewPolicyData}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddPolicyModal(false)}
                className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAddPolicyProfile(selectedCurriculumId)}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition"
              >
                Create Policy Profile
              </button>
            </div>
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
              {/* Quick Presets */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">One-Click Model Presets (No Conflict):</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: "Claude 3.7 Sonnet", type: "openai", model: "anthropic/claude-3.7-sonnet", apiBaseUrl: "https://openrouter.ai/api/v1" },
                    { name: "Claude 3.5 Sonnet", type: "openai", model: "anthropic/claude-3.5-sonnet", apiBaseUrl: "https://openrouter.ai/api/v1" },
                    { name: "Claude 3 Opus", type: "openai", model: "anthropic/claude-3-opus", apiBaseUrl: "https://openrouter.ai/api/v1" },
                    { name: "ChatGPT (gpt-4o)", type: "openai", model: "gpt-4o", apiBaseUrl: "https://api.openai.com/v1" },
                    { name: "ChatGPT (gpt-4o-mini)", type: "openai", model: "gpt-4o-mini", apiBaseUrl: "https://api.openai.com/v1" },
                    { name: "Gemini 2.5 Flash", type: "gemini", model: "gemini-2.5-flash" },
                    { name: "Gemini 2.5 Pro", type: "gemini", model: "gemini-2.5-pro" },
                    { name: "DeepSeek R1", type: "openai", model: "deepseek-reasoner", apiBaseUrl: "https://api.deepseek.com/v1" },
                    { name: "DeepSeek Chat", type: "openai", model: "deepseek-chat", apiBaseUrl: "https://api.deepseek.com/v1" },
                    { name: "Ollama (100% Free Offline)", type: "ollama", model: "qwen2.5:3b", endpoint: "http://127.0.0.1:11434" }
                  ].map(preset => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setNewProviderForm({
                        name: preset.name,
                        type: preset.type as any,
                        model: preset.model,
                        apiKey: "",
                        endpoint: preset.endpoint || "http://127.0.0.1:11434",
                        apiBaseUrl: preset.apiBaseUrl || "https://api.openai.com/v1"
                      })}
                      className="px-2.5 py-1 rounded-lg border border-neutral-700 bg-neutral-900 hover:border-violet-400 hover:text-white text-[10px] font-bold text-neutral-300 transition"
                    >
                      + {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="text-neutral-400 font-semibold block mb-1">Provider Protocol Type</span>
                <select
                  value={newProviderForm.type}
                  onChange={e => setNewProviderForm(p => ({
                    ...p,
                    type: e.target.value as any,
                    model: e.target.value === "gemini" ? "gemini-2.5-flash" : e.target.value === "ollama" ? "qwen2.5:3b" : "gpt-4o-mini"
                  }))}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500 font-bold"
                >
                  <option value="gemini">Google Gemini REST API (Cloud Fast & Free Tier)</option>
                  <option value="openai">OpenAI / ChatGPT / Claude / DeepSeek REST Protocol</option>
                  <option value="ollama">Ollama (Local 100% Free Offline LLM Server)</option>
                </select>
              </label>

              <label className="block">
                <span className="text-neutral-400 font-semibold block mb-1">Display Name</span>
                <input
                  type="text"
                  placeholder="e.g. OpenAI GPT-4o / Claude 3.5 Sonnet / Ollama Local"
                  value={newProviderForm.name}
                  onChange={e => setNewProviderForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500"
                />
              </label>

              <label className="block">
                <span className="text-neutral-400 font-semibold block mb-1">Target Model Identifier</span>
                <input
                  type="text"
                  placeholder="e.g. gpt-4o, gpt-4o-mini, claude-3-5-sonnet, gemini-2.5-flash, qwen2.5:3b"
                  value={newProviderForm.model}
                  onChange={e => setNewProviderForm(p => ({ ...p, model: e.target.value }))}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500 font-mono"
                />
              </label>

              {newProviderForm.type === "openai" && (
                <label className="block">
                  <span className="text-neutral-400 font-semibold block mb-1">API Base URL (Endpoint)</span>
                  <input
                    type="text"
                    placeholder="https://api.openai.com/v1 or https://openrouter.ai/api/v1 or https://api.deepseek.com/v1"
                    value={newProviderForm.apiBaseUrl || "https://api.openai.com/v1"}
                    onChange={e => setNewProviderForm(p => ({ ...p, apiBaseUrl: e.target.value }))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500 font-mono text-[11px]"
                  />
                </label>
              )}

              {newProviderForm.type !== "ollama" ? (
                <label className="block">
                  <span className="text-neutral-400 font-semibold block mb-1">API Secret Key</span>
                  <input
                    type="password"
                    placeholder="sk-... / AIzaSy..."
                    value={newProviderForm.apiKey}
                    onChange={e => setNewProviderForm(p => ({ ...p, apiKey: e.target.value }))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500 font-mono"
                  />
                </label>
              ) : (
                <label className="block">
                  <span className="text-neutral-400 font-semibold block mb-1">Ollama Local Server Endpoint</span>
                  <input
                    type="text"
                    placeholder="http://127.0.0.1:11434"
                    value={newProviderForm.endpoint}
                    onChange={e => setNewProviderForm(p => ({ ...p, endpoint: e.target.value }))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-violet-500 font-mono"
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

      {/* ── CLONE CURRICULUM FOR NEW YEAR MODAL ───────────────────────── */}
      {showCloneModal && cloneTargetSpec && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 max-w-lg w-full space-y-5 animate-in fade-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Copy className="h-4 w-4 text-sky-400" /> Duplicate & Clone for New Academic Year / Version
              </h3>
              <button type="button" onClick={() => setShowCloneModal(false)} className="text-neutral-500 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-3 bg-sky-950/30 border border-sky-500/30 rounded-xl space-y-1">
              <p className="font-bold text-sky-300">Cloning Source Package:</p>
              <p className="text-neutral-300 font-mono text-[11px]">{cloneTargetSpec.name} (ID: {cloneTargetSpec.id})</p>
              <p className="text-[10px] text-neutral-400">All chapters ({cloneTargetSpec.chapters.length}), lessons ({cloneTargetSpec.lessons.length}), and policy matrices will be duplicated under a new independent version.</p>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="text-neutral-400 font-semibold block mb-1">New Version Tag / Academic Year *</span>
                <input
                  type="text"
                  placeholder="e.g. 2026/2027 v2.0 or Term 1 - 2027 Edition"
                  value={cloneVersionTag}
                  onChange={e => setCloneVersionTag(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-sky-500 font-mono"
                />
              </label>

              <label className="block">
                <span className="text-neutral-400 font-semibold block mb-1">New Curriculum Package Name *</span>
                <input
                  type="text"
                  placeholder="e.g. Egyptian Baccalaureate Physics (2026/2027 Edition)"
                  value={cloneNewTitle}
                  onChange={e => setCloneNewTitle(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-sky-500 font-bold"
                />
              </label>
            </div>

            {cloneResult && (
              <div className={`p-3 rounded-xl border text-xs font-semibold flex items-start gap-2 ${
                cloneResult.success ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300" : "bg-red-950/40 border-red-500/40 text-red-300"
              }`}>
                {cloneResult.success ? <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" /> : <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />}
                <span>{cloneResult.message}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCloneModal(false)}
                className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCloneCurriculum}
                disabled={!cloneVersionTag.trim()}
                className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition disabled:opacity-40"
              >
                🚀 Duplicate Curriculum Package
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: DEMO ACCESS CODES & PACKAGE SERVICE POLICIES ────────────── */}
      {activeTab === "demo-codes" && (
        <DemoCodeManager />
      )}

    </div>
  );
}