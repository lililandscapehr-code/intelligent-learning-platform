"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  BookOpen, 
  Activity, 
  FileText, 
  AlertTriangle, 
  User, 
  Users, 
  UserRound,
  ArrowRight,
  ShieldCheck,
  Compass, 
  Clock,
  CheckCircle2, 
  ClipboardCheck,
  XCircle, 
  BarChart2,
  Database,
  Lock,
  ListFilter,
  CheckCircle,
  Tv,
  Sparkles,
  Play,
  Layers,
  HelpCircle,
  Video,
  UploadCloud,
  ShoppingBag,
  FileSearch
} from "lucide-react";
import { curriculum0580 } from "../curriculum-packages/0580";
import { curriculumDrama201 } from "../curriculum-packages/drama-201";
import { curriculumEgyptSecondary1IntegratedScience } from "../curriculum-packages/egypt-secondary1-integrated-science";
import { 
  curriculumEgyptBaccalaureateSecondYearPhysics,
  curriculumEgyptBaccalaureateSecondYearPhysicsPart1,
  curriculumEgyptBaccalaureateSecondYearPhysicsPart2
} from "../curriculum-packages/egypt-baccalaureate-second-year-physics";
import { validateCurriculumPackage } from "../curriculum-packages/validator";
import {
  scoreReadinessAssessment,
  ReadinessResult,
  QuestionResponse,
  ReadinessOutcome
} from "../engine/readiness-engine";
import { 
  checkDbConnection, 
  fetchAuditLogs, 
  uploadCurriculumPackage,
  getSession,
  login,
  logout
} from "./actions";
import EducationalCarousel from "../components/carousel/EducationalCarousel";
import TeacherAuthoringStudio from "../components/teacher/TeacherAuthoringStudio";
import TeacherDashboard from "../components/teacher/TeacherDashboard";
import ServiceCatalog from "../components/services/ServiceCatalog";
import StudentHome from "../components/student/StudentHome";
import ParentHome from "../components/parent/ParentHome";
import StudentDiagnostic from "../components/student/StudentDiagnostic";
import PublicTeacherShowcase from "../components/public/PublicTeacherShowcase";
import { lesson11QuestionDNA } from "../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-1-question-dna";
import { lesson12QuestionDNA } from "../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-2-question-dna";
import { lesson13QuestionDNA } from "../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-3-question-dna";
import { lesson14QuestionDNA } from "../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-4-question-dna";
import { lesson15QuestionDNA } from "../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-5-question-dna";
import { lesson16QuestionDNA } from "../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-6-question-dna";
import { lesson17QuestionDNA } from "../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-7-question-dna";
import { lesson18QuestionDNA } from "../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-8-question-dna";
import { lesson19QuestionDNA } from "../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-9-question-dna";
import { lesson110QuestionDNA } from "../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-10-question-dna";
import { lesson111QuestionDNA } from "../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-11-question-dna";
import { lesson112QuestionDNA } from "../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-12-question-dna";

const dnaMap: Record<string, any[]> = {
  "CAROUSEL-PHYS-EB-MECH-1-1": lesson11QuestionDNA,
  "CAROUSEL-PHYS-EB-MECH-1-2": lesson12QuestionDNA,
  "CAROUSEL-PHYS-EB-MECH-1-3": lesson13QuestionDNA,
  "CAROUSEL-PHYS-EB-MECH-1-4": lesson14QuestionDNA,
  "CAROUSEL-PHYS-EB-MECH-1-5": lesson15QuestionDNA,
  "CAROUSEL-PHYS-EB-MECH-1-6": lesson16QuestionDNA,
  "CAROUSEL-PHYS-EB-MECH-1-7": lesson17QuestionDNA,
  "CAROUSEL-PHYS-EB-MECH-1-8": lesson18QuestionDNA,
  "CAROUSEL-PHYS-EB-MECH-1-9": lesson19QuestionDNA,
  "CAROUSEL-PHYS-EB-MECH-1-10": lesson110QuestionDNA,
  "CAROUSEL-PHYS-EB-MECH-1-11": lesson111QuestionDNA,
  "CAROUSEL-PHYS-EB-MECH-1-12": lesson112QuestionDNA,
};

import AdminControlCenter from "../components/admin/AdminControlCenter";
import SourceAnalysisExplorer from "../components/admin/SourceAnalysisExplorer";
import { CarouselSessionResult } from "../components/carousel/CarouselTypes";
import type { CurriculumPackage } from "../contracts/curriculum";
import {
  getMasteryLabels,
  getDynamicStudentCases,
  getReadinessBlueprint
} from "../core/services/curriculum-resolver";
import {
  getLessonCatalogForCurriculum,
  getLessonCarouselsForCurriculum,
  getQuestionBankForCurriculum,
  getSampleCarouselForSkill,
  GenericQuestionItem
} from "../core/services/lesson-registry";

const initialCurriculumOptions: Record<string, CurriculumPackage> = {
  "egypt-baccalaureate-second-year-physics-part1": curriculumEgyptBaccalaureateSecondYearPhysicsPart1,
  "egypt-baccalaureate-second-year-physics-part2": curriculumEgyptBaccalaureateSecondYearPhysicsPart2,
  "egypt-baccalaureate-second-year-physics": curriculumEgyptBaccalaureateSecondYearPhysics,
  "cambridge-igcse-0580": curriculum0580,
  "egypt-secondary1-integrated-science": curriculumEgyptSecondary1IntegratedScience,
  "arts-drama-201": curriculumDrama201
};

type CurriculumId = string;

const OUTCOME_COLORS: Record<ReadinessOutcome | "PENDING", string> = {
  READY: "text-emerald-400",
  READY_WITH_SUPPORT: "text-amber-400",
  BRIDGING_RECOMMENDED: "text-orange-400",
  FOUNDATION_REQUIRED: "text-red-400",
  PENDING: "text-neutral-400"
};

interface ActiveGapDisplay {
  gapId: string;
  classification: string;
  severity: string;
  confidence: string;
  rootCause: string;
  skillId: string;
}

export default function EngineSimulator() {
  const [session, setSession] = useState<{ email: string; role: string } | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [curriculumOptions, setCurriculumOptions] = useState<Record<string, CurriculumPackage>>(initialCurriculumOptions);
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<CurriculumId>("cambridge-igcse-0580");
  const [hasCurriculumAssignment, setHasCurriculumAssignment] = useState(false);

  const selectedCurriculum: CurriculumPackage = curriculumOptions[selectedCurriculumId] || Object.values(curriculumOptions)[0];
  const validationReport = validateCurriculumPackage(selectedCurriculum);

  const [activeTab, setActiveTab] = useState<"curriculum" | "readiness" | "carousel" | "authoring" | "teacher" | "student" | "student-diagnostic" | "parent" | "admin" | "services" | "diagnostic" | "state" | "platform" | "source-analysis" | "public-showcase">("public-showcase");
  const [activeCaseKey, setActiveCaseKey] = useState<string>("A");

  // --- Platform Connection States ---
  const [dbStatus, setDbStatus] = useState<string>("CHECKING...");
  const [dbConfig, setDbConfig] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [dbError, setDbError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // --- Readiness State ---
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [readinessResult, setReadinessResult] = useState<ReadinessResult | null>(null);
  const [activeGaps, setActiveGaps] = useState<ActiveGapDisplay[]>([]);
  const [nextAction, setNextAction] = useState<string>("TAKE READINESS ASSESSMENT");
  const questionStartTimes = useRef<Record<string, number>>({});

  // --- Carousel State ---
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [expandedQuestionCarousel, setExpandedQuestionCarousel] = useState<string | null>(null);
  const [carouselSessionScore, setCarouselSessionScore] = useState<number | null>(null);

  // Dynamic derivations based on selectedCurriculum
  const masteryLabels = useMemo(() => getMasteryLabels(selectedCurriculum), [selectedCurriculum]);
  const studentCases = useMemo(() => getDynamicStudentCases(selectedCurriculum), [selectedCurriculum]);
  const currentCase = studentCases[activeCaseKey] || studentCases["A"];
  const masteryLevels = currentCase.mastery;

  const currentLessonCatalog = useMemo(() => getLessonCatalogForCurriculum(selectedCurriculumId), [selectedCurriculumId]);
  const currentLessonCarousels = useMemo(() => getLessonCarouselsForCurriculum(selectedCurriculumId), [selectedCurriculumId]);
  const currentQuestionBank = useMemo(() => getQuestionBankForCurriculum(selectedCurriculumId), [selectedCurriculumId]);
  const currentReadinessBlueprint = useMemo(() => getReadinessBlueprint(selectedCurriculum), [selectedCurriculum]);

  const sessionQuestions = useMemo(() => {
    if (currentQuestionBank.length > 0) {
      return currentQuestionBank.slice(0, Math.min(3, currentQuestionBank.length));
    }
    return [];
  }, [currentQuestionBank]);

  const availableLessonCount = currentLessonCatalog.filter((lesson) => lesson.status === "AVAILABLE").length;

  // Load database status and logs
  const loadPlatformState = async () => {
    const conn = await checkDbConnection();
    if (conn.success && conn.data) {
      setDbStatus(conn.data.status);
      setDbConfig(conn.data.config);
      setDbError(null);
    } else {
      setDbStatus("DISCONNECTED");
      setDbError(conn.errors[0] || "Could not reach database server.");
    }

    const logRes = await fetchAuditLogs();
    if (logRes.success && logRes.data) {
      setAuditLogs(logRes.data);
    }
  };

  useEffect(() => {
    loadPlatformState();
  }, []);

  const handleUploadPackage = async () => {
    setUploadStatus(`Uploading & validating ${selectedCurriculum.identity.name} against schema...`);
    const res = await uploadCurriculumPackage(selectedCurriculum);
    if (res.success) {
      setUploadStatus(`SUCCESS: ${selectedCurriculum.identity.name} validated, registered, and locked into database tables!`);
      loadPlatformState();
    } else {
      setUploadStatus(`FAILED: ${res.errors.join("; ")}`);
    }
  };

  const ensureTimer = (qId: string) => {
    if (!questionStartTimes.current[qId]) {
      questionStartTimes.current[qId] = Date.now();
    }
  };

  const handleAnswer = (question: GenericQuestionItem, choiceId: string) => {
    if (responses.find((r) => r.questionInstanceId === question.id)) return;

    const elapsed = Date.now() - (questionStartTimes.current[question.id] ?? Date.now());
    const choice = question.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    const response: QuestionResponse = {
      questionInstanceId: question.id,
      skillId: question.skillId,
      blueprintId: question.blueprintId,
      selectedChoiceId: choiceId,
      isCorrect: choice.isCorrect,
      misconceptionId: choice.misconceptionId,
      responseTimeMs: elapsed
    };

    const newResponses = [...responses, response];
    setResponses(newResponses);

    if (newResponses.length === sessionQuestions.length) {
      const blueprintId = currentReadinessBlueprint?.id || `ASSESS-${selectedCurriculum.identity.id}-R1`;
      const result = scoreReadinessAssessment(blueprintId, session?.email || "STU-DEMO", newResponses, 60000, selectedCurriculum.identity.name);
      setReadinessResult(result);
      setNextAction(result.recommendedAction);

      const gaps = result.skillSummaries
        .filter((s) => s.scorePercentage < 70)
        .map((s) => ({
          gapId: `GAP-SKILL-${s.skillId}`,
          classification: s.misconceptionsDetected.length > 0 ? "PROCEDURAL" : "PREREQUISITE",
          severity: s.scorePercentage < 40 ? "HIGH" : "MEDIUM",
          confidence: result.confidence,
          rootCause: s.misconceptionsDetected.length > 0
            ? `Specific misconception: ${s.misconceptionsDetected[0]}`
            : `Score too low (${s.scorePercentage}%) — insufficient mastery evidence`,
          skillId: s.skillId
        }));
      setActiveGaps(gaps);
    }
  };

  const resetAssessment = () => {
    setResponses([]);
    setReadinessResult(null);
    setActiveGaps([]);
    setNextAction("TAKE READINESS ASSESSMENT");
    questionStartTimes.current = {};
  };

  const switchCase = (key: string) => {
    setActiveCaseKey(key);
    resetAssessment();
  };

  const answered = (qId: string) => responses.find((r) => r.questionInstanceId === qId);

  useEffect(() => {
    getSession().then((result) => {
      if (result.success && result.data) {
        setSession({ email: result.data.email, role: result.data.role });
        const assignedCurriculum = window.localStorage.getItem(`curriculum:${result.data.email}`);
        if (assignedCurriculum && curriculumOptions[assignedCurriculum]) {
          setSelectedCurriculumId(assignedCurriculum);
          setHasCurriculumAssignment(true);
        }
        if (result.data.role === "TEACHER") setActiveTab("teacher");
        if (result.data.role === "ADMIN") setActiveTab("admin");
        if (result.data.role === "PARENT") setActiveTab("parent");
        if (result.data.role === "STUDENT") setActiveTab("student");
      }
      setAuthChecking(false);
    });
  }, [curriculumOptions]);

  function selectCurriculum(curriculumId: CurriculumId) {
    setSelectedCurriculumId(curriculumId);
    resetAssessment();
    setExpandedQuestionCarousel(null);
    const firstLesson = getLessonCatalogForCurriculum(curriculumId)[0]?.lessonId || "";
    setSelectedLessonId(firstLesson);
    if (session) {
      window.localStorage.setItem(`curriculum:${session.email}`, curriculumId);
      setHasCurriculumAssignment(true);
    }
  }

  async function submitLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginBusy(true);
    setLoginError("");
    const result = await login(loginEmail, loginPassword);
    if (result.success && result.data) {
      setSession({ email: loginEmail.trim().toLowerCase(), role: result.data.role });
      if (result.data.role === "TEACHER") setActiveTab("teacher");
      if (result.data.role === "ADMIN") setActiveTab("admin");
      if (result.data.role === "PARENT") setActiveTab("parent");
      if (result.data.role === "STUDENT") setActiveTab("student");
    } else {
      setLoginError(result.errors[0] || "Unable to sign in.");
    }
    setLoginBusy(false);
  }

  async function signOut() {
    await logout();
    setSession(null);
  }

  const [showAuthModal, setShowAuthModal] = useState(false);

  async function submitLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginBusy(true);
    setLoginError("");
    const result = await login(loginEmail, loginPassword);
    if (result.success && result.data) {
      setSession({ email: loginEmail.trim().toLowerCase(), role: result.data.role });
      setShowAuthModal(false);
      if (result.data.role === "TEACHER") setActiveTab("teacher");
      if (result.data.role === "ADMIN") setActiveTab("admin");
      if (result.data.role === "PARENT") setActiveTab("parent");
      if (result.data.role === "STUDENT") setActiveTab("student");
    } else {
      setLoginError(result.errors[0] || "Unable to sign in.");
    }
    setLoginBusy(false);
  }

  async function signOut() {
    await logout();
    setSession(null);
  }

  if (authChecking) {
    return <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-sm text-neutral-400">Checking secure session...</div>;
  }

  // ── PUBLIC HOMEPAGE (UNAUTHENTICATED) ───────────────────────────
  if (!session) {
    return (
      <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col font-sans">
        {/* Public Header */}
        <header className="border-b border-neutral-800 bg-neutral-950 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center font-black text-xl text-neutral-950">Ω</div>
            <div>
              <h1 className="text-base font-black text-white flex items-center gap-2">
                EDUCATIONAL LEARNING PLATFORM
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  PUBLIC HOMEPAGE
                </span>
              </h1>
              <p className="text-xs text-neutral-400">Public Package Catalog & Teacher Announcements</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition"
            >
              Sign In to Dashboard
            </button>
          </div>
        </header>

        {/* Public Portal Showcase */}
        <main className="flex-1 p-6 overflow-y-auto">
          <PublicTeacherShowcase 
            onDirectLaunchPackage={() => setShowAuthModal(true)}
            onOpenLoginModal={() => setShowAuthModal(true)}
          />
        </main>

        {/* Auth Modal Overlay */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center font-black text-xl text-neutral-950">Ω</div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-400">Authorized Access Guard</p>
                  <h2 className="text-lg font-bold text-white">Sign In to Platform</h2>
                </div>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed">
                Sign in to access your authorized teacher dashboard, student workspace, or parent portal.
              </p>

              <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-[11px] text-amber-300 space-y-1">
                <p className="font-bold">Quick Demo Credentials:</p>
                <p>Teacher: <code className="text-white">teacher@platform.com</code> / <code className="text-white">teacher123</code></p>
                <p>Student: <code className="text-white">student@platform.com</code> / <code className="text-white">student123</code></p>
                <p>Parent: <code className="text-white">parent@platform.com</code> / <code className="text-white">parent123</code></p>
              </div>

              <form onSubmit={submitLogin} className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Email Address</label>
                  <input 
                    type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. teacher@platform.com"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Password</label>
                  <input 
                    type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                </div>

                {loginError && (
                  <p className="p-2.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 text-xs">
                    {loginError}
                  </p>
                )}

                <button 
                  disabled={loginBusy}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs transition disabled:opacity-50"
                >
                  {loginBusy ? "Authenticating..." : "Sign In & Unlock Workspace"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  const navigationItems: Array<{ key: typeof activeTab; icon: typeof User; label: string; roles?: string[] }> = [
    { key: "public-showcase", icon: Layers, label: "Teacher Packages Portal", roles: ["STUDENT", "TEACHER", "ADMIN", "PARENT"] },
    { key: "student", icon: User, label: "My Study Tracks", roles: ["STUDENT"] },
    { key: "carousel", icon: Tv, label: "Lesson & Quiz Carousel", roles: ["STUDENT", "TEACHER", "ADMIN"] },
    { key: "student-diagnostic", icon: ClipboardCheck, label: "Readiness & 3-Case Diagnostics", roles: ["STUDENT"] },
    { key: "curriculum", icon: BookOpen, label: "Curriculum Syllabus", roles: ["STUDENT", "TEACHER", "ADMIN"] },
    { key: "teacher", icon: Users, label: "Teacher Dashboard", roles: ["TEACHER", "ADMIN"] },
    { key: "authoring", icon: Sparkles, label: "Teacher Authoring Studio", roles: ["TEACHER", "ADMIN"] },
    { key: "source-analysis", icon: FileSearch, label: "Source Analysis", roles: ["TEACHER", "ADMIN"] },
    { key: "services", icon: ShoppingBag, label: "Services & Enrollment", roles: ["TEACHER", "ADMIN", "PARENT"] },
    { key: "parent", icon: UserRound, label: "Parent Portal", roles: ["PARENT"] },
    { key: "admin", icon: ShieldCheck, label: "Admin Control Center", roles: ["ADMIN"] },
    { key: "platform", icon: Database, label: "Platform Core & DB", roles: ["ADMIN"] }
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-950 px-4 py-4 md:px-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div style={{ background: "#f59e0b" }} className="h-10 w-10 rounded-xl flex items-center justify-center font-black text-xl text-neutral-950">Ω</div>
          <div>
            <h1 className="text-base md:text-lg font-black tracking-tight text-white flex items-center gap-2">
              EDUCATIONAL ENGINE SIMULATOR
              <span className="hidden sm:inline text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                {session.role === "STUDENT" ? "STUDENT LEARNING HUB" : "DYNAMIC CURRICULUM ENGINE"}
              </span>
            </h1>
            <p className="text-xs text-neutral-400">{selectedCurriculum.identity.name} · Active Track</p>
          </div>
        </div>
        <div className="flex w-full md:w-auto items-center gap-2 text-xs overflow-x-auto">
          <label className="flex items-center gap-2 text-neutral-400">
            Active Track
            <select value={selectedCurriculumId} onChange={(event) => selectCurriculum(event.target.value as CurriculumId)} className="rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-xs text-neutral-200 outline-none focus:border-amber-500">
              {Object.entries(curriculumOptions).map(([id, curriculum]) => (
                <option key={id} value={id}>{curriculum.identity.name}</option>
              ))}
            </select>
          </label>
          
          {["TEACHER", "ADMIN"].includes(session.role) && (
            <div onClick={loadPlatformState} className="cursor-pointer px-3 py-1.5 rounded-full bg-neutral-800 border border-neutral-700 flex items-center gap-2 hover:bg-neutral-700 transition">
              <span className={`h-2 w-2 rounded-full ${dbStatus === "CONNECTED" ? "bg-emerald-500" : "bg-red-500"} animate-pulse`}></span>
              DB: {dbStatus}
            </div>
          )}

          <div className="flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-neutral-400">
            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
              session.role === "STUDENT" ? "bg-sky-500/20 text-sky-300" : "bg-amber-500/20 text-amber-300"
            }`}>
              {session.role}
            </span>
            <button onClick={signOut} className="font-semibold text-amber-400 hover:text-amber-300">Sign out</button>
          </div>
        </div>
      </header>

      {/* Student Enrolled Track Header */}
      {session.role === "STUDENT" && (
        <section className="bg-neutral-950/80 border-b border-neutral-800 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Enrolled Track:</span>
            <span className="font-bold text-amber-400">{selectedCurriculum.identity.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab("student")}
              className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 underline"
            >
              Switch Enrolled Track / Register Part
            </button>
          </div>
        </section>
      )}

      {/* Dynamic Simulated Case Selector for Teachers & Admins */}
      {["TEACHER", "ADMIN"].includes(session.role) && Object.keys(studentCases).length > 0 && (
        <section className="bg-neutral-800 border-b border-neutral-700 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <User className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-semibold text-neutral-300">Simulate Student Profile:</span>
            <span className="text-amber-400">{currentCase.label}</span>
          </div>
          <div className="flex gap-2">
            {Object.entries(studentCases).map(([key, c]) => (
              <button key={key} onClick={() => switchCase(key)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${activeCaseKey === key ? "bg-amber-500 text-neutral-950 font-semibold" : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"}`}>
                {c.label.split(":")[0]}
              </button>
            ))}
          </div>
        </section>
      )}

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Collapsible Sidebar */}
        <nav className={`border-b md:border-b-0 md:border-r border-neutral-800 bg-neutral-950 shrink-0 transition-all duration-300 flex flex-col ${sidebarCollapsed ? "md:w-14" : "md:w-56"} w-full`}>
          {/* Collapse toggle — desktop only */}
          <div className="hidden md:flex items-center justify-end px-2 py-3 border-b border-neutral-800">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-800 hover:text-white transition"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <ArrowRight className="h-4 w-4" />
              ) : (
                <ListFilter className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Nav items */}
          <div className="flex flex-row md:flex-col gap-1 p-2 overflow-x-auto md:overflow-x-visible">
            {navigationItems.filter(({ roles }) => !roles || roles.includes(session.role)).map(({ key, icon: Icon, label }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                title={label}
                className={`shrink-0 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  activeTab === key
                    ? "bg-neutral-800 text-amber-400 border border-neutral-700 font-semibold"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                } ${sidebarCollapsed ? "md:justify-center" : ""}`}>
                <Icon className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span className="hidden md:inline truncate text-xs">{label}</span>}
                <span className="md:hidden text-xs truncate">{label}</span>
              </button>
            ))}
          </div>
        </nav>


        {/* Canvas */}
        <section className="flex-1 min-w-0 p-4 md:p-6 overflow-y-auto bg-neutral-900">

          {/* PUBLIC TEACHER PACKAGE PORTAL */}
          {activeTab === "public-showcase" && (
            <PublicTeacherShowcase 
              onDirectLaunchPackage={(curriculumId, classId) => {
                setSelectedCurriculumId(curriculumId);
                setActiveTab("student-diagnostic");
              }}
            />
          )}

          {/* READINESS TAB WITH DYNAMIC TOP CAROUSEL */}
          {activeTab === "readiness" && sessionQuestions.length > 0 && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Compass className="h-5 w-5 text-amber-500" />
                    Readiness Assessment Engine: {selectedCurriculum.identity.name}
                  </h2>
                  <p className="text-sm text-neutral-400 mt-1">
                    Every question is backed by interactive learning carousels, worked examples, and step-by-step evaluations.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 uppercase block font-bold mb-1">Engine Outcome</span>
                  <span className={`text-sm font-extrabold ${OUTCOME_COLORS[readinessResult?.outcome ?? "PENDING"]}`}>
                    {readinessResult?.outcome.replace(/_/g, " ") ?? "PENDING"}
                  </span>
                </div>
              </div>

              {sessionQuestions.map((q, idx) => {
                ensureTimer(q.id);
                const ans = answered(q.id);
                const isCarouselOpen = expandedQuestionCarousel === q.id;
                const carouselData = getSampleCarouselForSkill(selectedCurriculumId, q.skillId);

                return (
                  <div key={q.id} className="bg-neutral-950 rounded-2xl border border-neutral-800 p-6 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-neutral-800 border border-neutral-700 px-2.5 py-1 rounded text-neutral-300 font-medium">
                          Question {idx + 1} · {q.skillId}
                        </span>
                        {carouselData && (
                          <button
                            onClick={() => setExpandedQuestionCarousel(isCarouselOpen ? null : q.id)}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                              isCarouselOpen
                                ? "bg-amber-500 text-neutral-950"
                                : "bg-neutral-900 border border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
                            }`}
                          >
                            <Tv className="h-3 w-3" />
                            {isCarouselOpen ? "Close Lesson Carousel" : "Open Top Lesson Carousel"}
                          </button>
                        )}
                      </div>
                      {ans && (
                        <span className={`flex items-center gap-1 text-xs font-bold ${ans.isCorrect ? "text-emerald-400" : "text-red-400"}`}>
                          {ans.isCorrect ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                          {ans.isCorrect ? "Correct" : "Incorrect"}
                          <span className="text-neutral-500 font-normal ml-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />{(ans.responseTimeMs / 1000).toFixed(1)}s
                          </span>
                        </span>
                      )}
                    </div>

                    {/* TOP EMBEDDED CAROUSEL FOR THIS QUESTION */}
                    {isCarouselOpen && carouselData && (
                      <div className="mt-4 mb-6 border border-amber-500/30 rounded-2xl overflow-hidden shadow-2xl bg-neutral-900/50 p-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="px-3 py-2 text-xs font-bold text-amber-400 flex items-center justify-between border-b border-neutral-800/80 mb-2">
                          <span className="flex items-center gap-2">
                            <Sparkles className="h-3.5 w-3.5" />
                            Interactive Media & Video Carousel on Top of Question
                          </span>
                          <span className="text-neutral-500">{carouselData.slides.length} Sequential Slides</span>
                        </div>
                        <EducationalCarousel config={carouselData} viewerRole={session.role as "STUDENT" | "TEACHER" | "ADMIN"} studentId={session.email} />
                      </div>
                    )}

                    <h3 className="text-base font-bold text-white pt-2">{q.promptText}</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.choices.map((c) => {
                        let cls = "bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-neutral-200";
                        if (ans) {
                          if (c.id === ans.selectedChoiceId) {
                            cls = c.isCorrect
                              ? "bg-emerald-950/40 border-emerald-500 text-emerald-300 font-semibold"
                              : "bg-red-955/40 border-red-500 text-red-300 font-semibold";
                          } else if (c.isCorrect) {
                            cls = "bg-emerald-950/20 border-emerald-800/50 text-emerald-400/70";
                          }
                        }
                        return (
                          <button key={c.id} onClick={() => handleAnswer(q, c.id)} disabled={!!ans}
                            className={`p-4 rounded-lg border text-left text-sm transition ${cls}`}>
                            <span className="font-bold mr-2">{c.id}.</span>{c.text}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {readinessResult && (
                <div className="bg-neutral-950 border border-amber-500/20 rounded-2xl p-6 space-y-4 shadow-xl">
                  <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                    <BarChart2 className="h-4 w-4" /> Assessment Results
                  </h3>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-neutral-900 rounded-lg p-3">
                      <p className="text-2xl font-black text-white">{readinessResult.overallScore}%</p>
                      <p className="text-[10px] text-neutral-500 uppercase mt-1">Overall Score</p>
                    </div>
                    <div className="bg-neutral-900 rounded-lg p-3">
                      <p className={`text-sm font-black ${OUTCOME_COLORS[readinessResult.outcome]}`}>{readinessResult.outcome.replace(/_/g, " ")}</p>
                      <p className="text-[10px] text-neutral-500 uppercase mt-1">Outcome</p>
                    </div>
                    <div className="bg-neutral-900 rounded-lg p-3">
                      <p className="text-sm font-black text-white">{readinessResult.confidence}</p>
                      <p className="text-[10px] text-neutral-500 uppercase mt-1">Confidence</p>
                    </div>
                  </div>
                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg">
                    <p className="text-[10px] font-bold text-neutral-500 uppercase mb-1">Recommended Action</p>
                    <p className="text-sm text-amber-300 font-medium flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 shrink-0 mt-0.5" />
                      {readinessResult.recommendedAction}
                    </p>
                  </div>
                  <button onClick={resetAssessment}
                    className="w-full py-2 text-xs font-semibold text-neutral-400 border border-neutral-700 rounded-lg hover:border-neutral-600 hover:text-neutral-200 transition">
                    Reset Assessment
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "readiness" && sessionQuestions.length === 0 && (
            <div className="mx-auto max-w-3xl rounded-xl border border-amber-500/20 bg-amber-500/5 p-8 text-center">
              <h2 className="text-xl font-bold text-white">Assessment workspace ready for {selectedCurriculum.identity.name}</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-400">
                This subject has {selectedCurriculum.skills.length} skills and {selectedCurriculum.stages.length} stages mapped. 
                Use Curriculum Graph to inspect its structure or Teacher Authoring to create and approve live question items.
              </p>
              <div className="mt-5 flex justify-center gap-3">
                <button onClick={() => setActiveTab("curriculum")} className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-neutral-950">Open curriculum graph</button>
                <button onClick={() => setActiveTab("authoring")} className="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-700">Author questions</button>
              </div>
            </div>
          )}

          {/* LESSON & QUIZ CAROUSEL STUDIO TAB */}
          {activeTab === "carousel" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Tv className="h-5 w-5 text-amber-500" />
                    Educational Carousel Studio: {selectedCurriculum.identity.name}
                  </h2>
                  <p className="text-sm text-neutral-400 mt-1">
                    Multi-slide interactive format: Concepts → Video / Inquiry Lesson → Question → Step-by-Step Evaluation → Media Upload.
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
                    <span className="rounded-full bg-neutral-800 px-2.5 py-1 text-neutral-300">{currentLessonCatalog.length} lessons</span>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-400">{availableLessonCount} available</span>
                    <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-amber-400">{currentLessonCatalog.length - availableLessonCount} pending</span>
                  </div>
                </div>
              </div>

              {currentLessonCatalog.length > 0 && currentLessonCatalog.find((l) => l.status === "AVAILABLE") && (
                <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4 mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Featured {selectedCurriculum.identity.name} Lesson</p>
                  <p className="mt-1 text-sm text-white font-bold">{currentLessonCatalog.find((l) => l.status === "AVAILABLE")!.title}</p>
                </div>
              )}

              <div className="grid lg:grid-cols-[240px_1fr] gap-5">
                <aside className="space-y-3">
                  {selectedCurriculum.stages.map((stage) => {
                    const stageLessons = currentLessonCatalog.filter((lesson) => lesson.stageId === stage.id || lesson.stageId.includes(stage.id));
                    const stageAvailable = stageLessons.filter((lesson) => lesson.status === "AVAILABLE").length;
                    return (
                      <div key={stage.id} className="rounded-xl border border-neutral-800 bg-neutral-950 p-3">
                        <h3 className="text-xs font-bold text-neutral-300">{stage.name}</h3>
                        <p className="mt-1 text-[10px] text-neutral-500">{stageAvailable}/{Math.max(stageLessons.length, stage.lessons.length)} lessons ready</p>
                        
                        <div className="mt-2 space-y-1">
                          {stageLessons.length > 0 ? (
                            stageLessons.map((lesson) => (
                              <button
                                key={lesson.lessonId}
                                onClick={() => lesson.carousel && setSelectedLessonId(lesson.lessonId)}
                                disabled={!lesson.carousel}
                                className={`w-full rounded-lg px-2.5 py-2 text-left text-[11px] transition ${
                                  selectedLessonId === lesson.lessonId
                                    ? "bg-amber-500 text-neutral-950"
                                    : lesson.carousel
                                      ? "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                                      : "bg-neutral-900/50 text-neutral-600 cursor-not-allowed"
                                }`}
                              >
                                <span className="block font-semibold">{lesson.title}</span>
                                <span className="block mt-0.5 opacity-75">
                                  {lesson.status === "AVAILABLE" ? "Available" : "Content pending"} · {lesson.lessonId}
                                </span>
                              </button>
                            ))
                          ) : (
                            <p className="text-[10px] text-neutral-600 p-2 italic">Ready for lesson authoring</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </aside>

                {/* ACTIVE CAROUSEL PLAYER */}
                <div className="space-y-4">
                  {currentLessonCarousels[selectedLessonId] ? (
                    <EducationalCarousel 
                      key={selectedLessonId} 
                      config={currentLessonCarousels[selectedLessonId]} 
                      viewerRole={session.role as "STUDENT" | "TEACHER" | "ADMIN"}
                      studentId={session.email}
                      onComplete={(result: CarouselSessionResult) => {
                        setCarouselSessionScore(result.scorePercentage);
                      }}
                    />
                  ) : (() => {
                    const firstAvailable = currentLessonCatalog.find((l) => l.carousel);
                    if (firstAvailable?.carousel) {
                      return (
                        <EducationalCarousel
                          key={firstAvailable.lessonId}
                          config={firstAvailable.carousel}
                          viewerRole={session.role as "STUDENT" | "TEACHER" | "ADMIN"}
                          studentId={session.email}
                          onComplete={(result: CarouselSessionResult) => {
                            setCarouselSessionScore(result.scorePercentage);
                          }}
                        />
                      );
                    }
                    return (
                      <div className="rounded-xl border border-dashed border-neutral-700 bg-neutral-950 p-8 text-center">
                        <p className="text-sm font-semibold text-neutral-300">Select a lesson or author new content</p>
                        <p className="mt-2 text-xs text-neutral-500">This stage is mapped to the {selectedCurriculum.identity.name} syllabus and ready for interactive carousels.</p>
                        <button onClick={() => setActiveTab("authoring")} className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-neutral-950">
                          Launch Teacher Authoring
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* CAROUSEL FEATURE SPECIFICATIONS */}
              <div className="grid md:grid-cols-3 gap-4 pt-4">
                <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <Video className="h-4 w-4" /> YouTube & Video Facade
                  </div>
                  <p className="text-xs text-neutral-400">
                    Smart lazy loading, custom player overlays, automatic audio mute management, and full responsiveness.
                  </p>
                </div>
                <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <HelpCircle className="h-4 w-4" /> Locked Assessment Flow
                  </div>
                  <p className="text-xs text-neutral-400">
                    Students cannot bypass questions without attempting them. Once submitted, answers lock and reveal explanations.
                  </p>
                </div>
                <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                    <UploadCloud className="h-4 w-4" /> Dynamic Educator Uploads
                  </div>
                  <p className="text-xs text-neutral-400">
                    Upload images, documents, or paste YouTube links to inject new slides on the fly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "authoring" && <TeacherAuthoringStudio curriculumId={selectedCurriculumId} />}

          {activeTab === "teacher" && <TeacherDashboard onOpenAuthoring={() => setActiveTab("authoring")} />}

          {activeTab === "services" && <ServiceCatalog curriculumName={selectedCurriculum.identity.name} />}

          {activeTab === "source-analysis" && ["TEACHER", "ADMIN"].includes(session.role) && <SourceAnalysisExplorer />}

          {activeTab === "student" && (
            <StudentHome
              curriculumName={selectedCurriculum.identity.name}
              selectedCurriculumId={selectedCurriculumId}
              onBrowseServices={() => setActiveTab("services")}
              onStartLesson={() => setActiveTab("carousel")}
              onSelectTrack={(currId) => {
                selectCurriculum(currId as CurriculumId);
                setActiveTab("carousel");
              }}
            />
          )}

          {activeTab === "student-diagnostic" && (
            <StudentDiagnostic
              lessonId={selectedLessonId || "CAROUSEL-PHYS-EB-MECH-1-1"}
              lessonTitle={
                currentLessonCatalog.find((l) => l.lessonId === selectedLessonId)?.title ||
                "Lesson 1-1 · Velocity Vectors & Relative Velocity"
              }
              questionDNA={dnaMap[selectedLessonId] || lesson11QuestionDNA}
              onComplete={() => setActiveTab("curriculum")}
              onBack={() => setActiveTab("curriculum")}
            />
          )}

          {activeTab === "parent" && <ParentHome onChooseProgram={() => setActiveTab("services")} />}

          {activeTab === "admin" && (
            <AdminControlCenter onCurriculumAdded={(curriculum) => {
              setCurriculumOptions((current) => ({ ...current, [curriculum.identity.id]: curriculum }));
              selectCurriculum(curriculum.identity.id);
            }} />
          )}

          {/* CURRICULUM TAB */}
          {activeTab === "curriculum" && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedCurriculum.identity.name}</h2>
                  <p className="text-sm text-neutral-400 mt-1">Dynamic package v{selectedCurriculum.version.packageVersion} — {selectedCurriculum.version.status}</p>
                </div>
                <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 text-xs font-bold ${validationReport.isValid ? "bg-emerald-950/45 border-emerald-500/35 text-emerald-400" : "bg-red-955/45 border-red-500/35 text-red-400"}`}>
                  <ShieldCheck className="h-4 w-4" />
                  {validationReport.isValid ? "CONTRACT MODEL VALIDATED" : "VALIDATION ERRORS"}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-neutral-950 rounded-xl p-5 border border-neutral-800">
                  <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4 pb-2 border-b border-neutral-800">Stages</h3>
                  <div className="space-y-3">
                    {selectedCurriculum.stages.map((stage) => (
                      <div key={stage.id} className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-bold text-white">{stage.name}</p>
                          <p className="text-xs text-neutral-500 mt-1">{stage.includedSkills.length} skills · Pass: {stage.masteryRequirements.requiredScorePercentage}%</p>
                        </div>
                        <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-1 rounded-full">S{stage.sequence}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-neutral-950 rounded-xl p-5 border border-neutral-800">
                  <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4 pb-2 border-b border-neutral-800">Skills Graph</h3>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {selectedCurriculum.skills.map((skill) => (
                      <div key={skill.id} className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
                        <p className="text-sm font-bold text-white">{skill.name}</p>
                        <code className="text-[10px] text-amber-400">{skill.id}</code>
                        {skill.relations.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {skill.relations.map((rel, i) => (
                              <span key={i} className="text-[10px] bg-neutral-800 border border-neutral-700 text-neutral-300 px-2 py-0.5 rounded">
                                {rel.relationType}: <span className="text-amber-400">{rel.targetSkillId}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DIAGNOSTIC TAB */}
          {activeTab === "diagnostic" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Diagnostic Gap Investigator: {selectedCurriculum.identity.name}</h2>
                <p className="text-sm text-neutral-400 mt-1">Observe dynamic diagnostic state projections and evidence flags.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="col-span-2 bg-neutral-950 rounded-xl border border-neutral-800 p-5 space-y-4">
                  <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider pb-2 border-b border-neutral-800 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" /> Observed Gaps
                  </h3>
                  {activeGaps.length === 0 ? (
                    <p className="text-sm text-neutral-500 p-6 text-center">No active gaps. Complete the Readiness Assessment to trigger diagnostic events.</p>
                  ) : activeGaps.map((gap, i) => (
                    <div key={i} className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs bg-red-955/40 border border-red-500/30 text-red-400 px-2 py-0.5 rounded font-bold uppercase">{gap.classification} GAP</span>
                          <h4 className="text-sm font-bold text-white mt-1.5">{gap.gapId}</h4>
                        </div>
                        <span className="text-xs bg-neutral-800 px-2 py-1 rounded text-neutral-400">Confidence: {gap.confidence}</span>
                      </div>
                      <div className="p-3 bg-neutral-950 rounded border border-neutral-800 text-xs">
                        <p className="text-neutral-500 font-bold mb-1">Root Cause Candidate:</p>
                        <p className="text-neutral-300">{gap.rootCause}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-5 space-y-4">
                  <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider pb-2 border-b border-neutral-800">Mastery Snapshot</h3>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {Object.entries(masteryLevels).map(([skill, level]) => (
                      <div key={skill} className="flex justify-between items-center text-xs">
                        <code className="text-neutral-400 text-[10px] truncate max-w-[140px]" title={skill}>{skill}</code>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${level >= 3 ? "bg-emerald-950 text-emerald-400" : level > 0 ? "bg-amber-950 text-amber-400" : "bg-red-955/60 text-red-400"}`}>
                          {masteryLabels[level] || `Level ${level}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STATE TAB */}
          {activeTab === "state" && (
            <div className="space-y-6">
              <pre className="p-6 bg-neutral-950 border border-neutral-800 text-xs text-amber-400 font-mono rounded-xl overflow-x-auto">
                {JSON.stringify({
                  studentId: session.email,
                  curriculumId: selectedCurriculum.identity.id,
                  curriculumVersion: selectedCurriculum.version.packageVersion,
                  studentCase: currentCase.label,
                  readinessResult,
                  skillMasteries: masteryLevels,
                  activeGaps,
                  nextRecommendedAction: nextAction
                }, null, 2)}
              </pre>
            </div>
          )}

          {/* PLATFORM CORE TAB */}
          {activeTab === "platform" && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-white">Platform Core & MySQL Registries</h2>
                  <p className="text-sm text-neutral-400 mt-1">Manage database schemas, seed tables, and run schema validations.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* DB Config card */}
                <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-5 space-y-4">
                  <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider pb-2 border-b border-neutral-800">Connection Health</h3>
                  
                  {dbError ? (
                    <div className="p-3 bg-red-955/20 border border-red-500/30 rounded text-xs text-red-400 font-medium">
                      {dbError}
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded text-xs text-emerald-400 font-medium">
                      Connected to local database.
                    </div>
                  )}

                  {dbConfig && (
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                        <span className="text-neutral-500">Host:</span>
                        <span className="font-mono text-neutral-300">{dbConfig.host}</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                        <span className="text-neutral-500">Database:</span>
                        <span className="font-mono text-neutral-300">{dbConfig.database}</span>
                      </div>
                      <div className="flex justify-between pb-1.5">
                        <span className="text-neutral-500">Username:</span>
                        <span className="font-mono text-neutral-300">{dbConfig.user}</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    <button 
                      onClick={handleUploadPackage}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-600 transition rounded-lg text-xs font-bold text-neutral-950 flex items-center justify-center gap-2"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      Seed {selectedCurriculum.identity.name} to MySQL
                    </button>
                  </div>

                  {uploadStatus && (
                    <div className={`p-3 rounded text-xs font-medium border ${
                      uploadStatus.startsWith("FAILED")
                        ? "bg-red-955/20 border-red-500/30 text-red-400"
                        : uploadStatus.startsWith("SUCCESS")
                        ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
                        : "bg-neutral-900 border-neutral-800 text-neutral-400 animate-pulse"
                    }`}>
                      {uploadStatus}
                    </div>
                  )}

                </div>

                {/* Audit Logs card */}
                <div className="col-span-2 bg-neutral-950 rounded-xl border border-neutral-800 p-5 space-y-4">
                  <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider pb-2 border-b border-neutral-800 flex items-center justify-between">
                    <span className="flex items-center gap-2"><ListFilter className="h-4 w-4 text-amber-500" /> Platform Audit Logs</span>
                    <button onClick={loadPlatformState} className="text-neutral-500 hover:text-white transition text-[10px] font-bold uppercase">Refresh</button>
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-850 text-neutral-500">
                          <th className="py-2 pr-4">Timestamp</th>
                          <th className="py-2 pr-4">Action</th>
                          <th className="py-2 pr-4">Target Entity</th>
                          <th className="py-2">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auditLogs.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-6 text-center text-neutral-600">No logs found in audit_logs. Run the database setup command locally or from CI.</td>
                          </tr>
                        ) : (
                          auditLogs.map((log) => (
                            <tr key={log.id} className="border-b border-neutral-900 hover:bg-neutral-900/50">
                              <td className="py-2 pr-4 text-neutral-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                              <td className="py-2 pr-4 font-bold text-amber-400">{log.action}</td>
                              <td className="py-2 pr-4 text-neutral-300 font-mono text-[10px]">{log.target_entity}</td>
                              <td className="py-2 text-neutral-400 max-w-xs truncate" title={JSON.stringify(log.details)}>{JSON.stringify(log.details)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

        </section>
      </main>
    </div>
  );
}
