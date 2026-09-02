"use client";

import React, { useEffect, useState } from "react";
import { fetchTeacherDashboard, getSession, login } from "../../app/actions";
import TeacherAIDesk from "./TeacherAIDesk";
import DiagnosticReport from "./DiagnosticReport";
import TeacherDNAReview from "./TeacherDNAReview";
import StudentFollowUp from "./StudentFollowUp";
import LiveSessionsManager from "./LiveSessionsManager";
import ClassManager from "./ClassManager";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  MessageSquare,
  CalendarClock,
  FileCheck2,
  BarChart3,
  Plus,
  Users,
  UserRound,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Search,
  Check,
  ChevronDown,
  ChevronUp,
  X
} from "lucide-react";

interface StudentRecord {
  id: string;
  name: string;
  className: string;
  progress: number;
  stage: string;
  lastActive: string;
  gap: string;
  status: "ON_TRACK" | "NEEDS_SUPPORT" | "INACTIVE";
}

const classes = [
  { id: "CLASS-10A", name: "Year 10 Mathematics", students: 24, progress: 68, next: "Fractions and algebra" },
  { id: "CLASS-10B", name: "Year 10 Mathematics Support", students: 16, progress: 52, next: "Foundation arithmetic" },
  { id: "CLASS-DRAMA", name: "Drama Performance Group", students: 12, progress: 74, next: "Monologue preparation" }
];

const students: StudentRecord[] = [
  { id: "STU-1001", name: "Amira Hassan", className: "Year 10 Mathematics", progress: 82, stage: "Stage 2", lastActive: "Today", gap: "None detected", status: "ON_TRACK" },
  { id: "STU-1002", name: "Daniel Okafor", className: "Year 10 Mathematics", progress: 61, stage: "Stage 1", lastActive: "Yesterday", gap: "Fraction denominators", status: "NEEDS_SUPPORT" },
  { id: "STU-1003", name: "Sofia Williams", className: "Year 10 Mathematics Support", progress: 44, stage: "Foundation", lastActive: "3 days ago", gap: "LCM and HCF", status: "NEEDS_SUPPORT" },
  { id: "STU-1004", name: "Leo Martin", className: "Drama Performance Group", progress: 76, stage: "Stage 2", lastActive: "Today", gap: "None detected", status: "ON_TRACK" },
  { id: "STU-1005", name: "Maya Patel", className: "Year 10 Mathematics Support", progress: 28, stage: "Foundation", lastActive: "12 days ago", gap: "Engagement review", status: "INACTIVE" }
];

const assignments = [
  { title: "Fraction arithmetic carousel", className: "Year 10 Mathematics", due: "Tomorrow", submitted: "18/24", state: "ACTIVE" },
  { title: "Foundation readiness check", className: "Mathematics Support", due: "Friday", submitted: "9/16", state: "ACTIVE" },
  { title: "Monologue reflection", className: "Drama Performance Group", due: "Next Monday", submitted: "10/12", state: "REVIEW" }
];

const sessions = [
  { title: "Fraction remediation", className: "Year 10 Mathematics", date: "Today · 16:00", type: "REMEDIATION", status: "CONFIRMED" },
  { title: "Foundation progress review", className: "Mathematics Support", date: "Tomorrow · 10:00", type: "PROGRESS REVIEW", status: "SCHEDULED" },
  { title: "Monologue performance review", className: "Drama Performance Group", date: "Monday · 14:00", type: "PRACTICAL REVIEW", status: "SCHEDULED" }
];

const contentReviews = [
  { title: "Adding Fractions with Unlike Denominators", type: "Lesson", status: "READY FOR REVIEW", source: "Teacher draft" },
  { title: "Stage 1 Number Skills", type: "Assessment", status: "2 WARNINGS", source: "AI-assisted draft" },
  { title: "Monologue Reflection", type: "Question set", status: "APPROVED", source: "Teacher created" }
];

const todayTasks = [
  { id: "task-1", title: "Review readiness evidence", detail: "2 students need a decision before the next lesson", action: "Open students", view: "students" as const, tone: "text-amber-400" },
  { id: "task-2", title: "Prepare next lesson", detail: "Mechanics · Velocity vectors and relative velocity", action: "Open preparation", view: "preparation" as const, tone: "text-sky-400" },
  { id: "task-3", title: "Check submitted work", detail: "9 responses are ready for feedback", action: "Open assignments", view: "assignments" as const, tone: "text-violet-400" },
  { id: "task-4", title: "Prepare family update", detail: "1 approved progress summary is ready", action: "Open parents", view: "parents" as const, tone: "text-emerald-400" }
];

const NAV_ITEMS = [
  { id: "today", label: "Today", icon: CheckCircle2 },
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "classes", label: "Classes", icon: Users },
  { id: "students", label: "Students", icon: UserRound },
  { id: "preparation", label: "Lesson Prep", icon: BookOpen },
  { id: "assignments", label: "Assignments", icon: ClipboardList },
  { id: "sessions", label: "Sessions", icon: CalendarClock },
  { id: "reviews", label: "Question Banks", icon: FileCheck2 },
  { id: "diagnostics", label: "Diagnostics", icon: Sparkles },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "parents", label: "Parents Link", icon: MessageSquare }
] as const;

export default function TeacherDashboard({ onOpenAuthoring }: { onOpenAuthoring: () => void }) {
  const [session, setSession] = useState<{ email: string; role: string } | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [dashboardSource, setDashboardSource] = useState<"DEMO" | "DATABASE">("DEMO");
  const [selectedClass, setSelectedClass] = useState("ALL");
  const [view, setView] = useState<typeof NAV_ITEMS[number]["id"]>("today");
  const [classData, setClassData] = useState(classes);
  const [studentData, setStudentData] = useState(students);
  const [assignmentData, setAssignmentData] = useState(assignments);
  const [parentCount, setParentCount] = useState(3);
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [classNameDraft, setClassNameDraft] = useState("");
  
  // Collapsible view states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiDeskExpanded, setAiDeskExpanded] = useState(false);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const visibleStudents = selectedClass === "ALL" 
    ? studentData.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : studentData.filter((student) => student.className === selectedClass && student.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
  const supportCount = studentData.filter((student) => student.status === "NEEDS_SUPPORT").length;

  useEffect(() => {
    let active = true;
    getSession().then((result) => {
      if (active && result.success && result.data && ["TEACHER", "ADMIN"].includes(result.data.role)) {
        setSession({ email: result.data.email, role: result.data.role });
      }
    });
    fetchTeacherDashboard().then((result) => {
      if (!active || !result.success || !result.data) return;
      setDashboardSource("DATABASE");
      setClassData(result.data.classes.map((item: any) => ({ ...item, students: result.data.students.filter((student: any) => student.className === item.name).length, progress: 0, next: "No lesson assigned" })));
      setStudentData(result.data.students);
      setAssignmentData(result.data.assignments);
      setParentCount(result.data.parentCount);
    });
    return () => { active = false; };
  }, []);

  async function submitLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginBusy(true);
    setLoginError("");
    const result = await login(loginEmail, loginPassword);
    if (result.success && result.data && ["TEACHER", "ADMIN"].includes(result.data.role)) {
      // Persist email so LiveSessionsManager can use it from any machine
      if (typeof window !== "undefined") {
        localStorage.setItem("teacher_email", loginEmail);
      }
      setSession({ email: loginEmail, role: result.data.role });
      window.location.reload();
    } else {
      setLoginError(result.errors[0] || "Teacher or administrator access is required.");
    }
    setLoginBusy(false);
  }

  function createClass(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!classNameDraft.trim()) return;
    setClassData((current) => [...current, { id: `CLASS-${current.length + 1}`, name: classNameDraft.trim(), students: 0, progress: 0, next: "No lesson assigned" }]);
    setClassNameDraft("");
    setShowCreateClass(false);
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl">
        <div className="flex items-center gap-3"><UserRound className="h-5 w-5 text-amber-400" /><div><h2 className="text-lg font-bold text-white">Teacher sign in</h2><p className="mt-1 text-xs text-neutral-500">Use a TEACHER or ADMIN account to access assigned classes and student data.</p></div></div>
        <form onSubmit={submitLogin} className="mt-6 space-y-4">
          <label className="block text-xs font-semibold text-neutral-400">Email<input type="email" value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} required className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500" /></label>
          <label className="block text-xs font-semibold text-neutral-400">Password<input type="password" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} required className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500" /></label>
          {loginError && <p className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-400">{loginError}</p>}
          <button disabled={loginBusy} className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 disabled:opacity-50">{loginBusy ? "Signing in..." : "Sign in to teacher dashboard"}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-[600px] border border-neutral-800 rounded-xl bg-neutral-950 overflow-hidden text-neutral-200">
      
      {/* ── Collapsible Left Sidebar ────────────────────────────── */}
      <aside className={`flex flex-col border-r border-neutral-800 bg-neutral-950 transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-56"}`}>
        <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-4">
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Ms. Carter</span>
              <span className="text-xs text-neutral-400 font-semibold truncate max-w-[140px]">{session.email}</span>
            </div>
          )}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-900 hover:text-white transition ml-auto"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1 p-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs font-bold transition-all ${
                  active 
                    ? "bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/10" 
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                }`}
                title={item.label}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar footer config */}
        <div className="border-t border-neutral-800 p-2 space-y-1">
          <button 
            onClick={() => setShowCreateClass(true)} 
            className="flex w-full items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-950/50 hover:bg-neutral-900 hover:border-neutral-700 px-3 py-2 text-left text-xs font-bold text-neutral-300 transition"
          >
            <Plus className="h-4 w-4 shrink-0 text-amber-400" />
            {!sidebarCollapsed && <span>New Class</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Panel Workspace ───────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 bg-neutral-950/40">
        
        {/* Header toolbar */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 bg-neutral-950/70 px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white capitalize">{view} Workspace</h2>
              <span className="rounded bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 text-[9px] font-bold text-neutral-500 uppercase">
                {dashboardSource === "DATABASE" ? "TiDB Live" : "Demo Cache"}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Review current metrics, gaps, readiness indicators, and parent reports.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Collapsible AI Desk toggle button */}
            <button
              onClick={() => setAiDeskExpanded(!aiDeskExpanded)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition ${
                aiDeskExpanded
                  ? "bg-sky-500 text-white hover:bg-sky-400"
                  : "border border-sky-500/30 text-sky-400 hover:bg-sky-500/10"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {aiDeskExpanded ? "Close AI Desk" : "Open AI Desk"}
            </button>

            <button 
              onClick={onOpenAuthoring} 
              className="flex items-center gap-2 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition"
            >
              <BookOpen className="h-3.5 w-3.5" /> Create Carousel
            </button>
          </div>
        </header>

        {/* Collapsible AI Desk widget container */}
        {aiDeskExpanded && (
          <div className="border-b border-neutral-800 bg-neutral-950/80 p-5 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> Teacher AI Copilot
              </span>
              <button 
                onClick={() => setAiDeskExpanded(false)}
                className="text-neutral-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <TeacherAIDesk />
          </div>
        )}

        {/* Active View Area */}
        <div className="flex-1 p-6 overflow-y-auto">

          {/* Today View */}
          {view === "today" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-sky-500/25 bg-sky-500/5 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Your Teaching Commands</h3>
                    <p className="mt-1 text-sm text-neutral-400">Review readiness markers, lesson checks, and assignments.</p>
                  </div>
                  <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-300">
                    Active Session
                  </span>
                </div>
              </div>

              {/* Tasks Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                {todayTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => setView(task.view)}
                    className="group flex items-start gap-4 rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 text-left hover:border-neutral-600 hover:bg-neutral-900/70 transition"
                  >
                    <div className={`mt-0.5 rounded-lg bg-neutral-950/60 p-2 ${task.tone}`}>
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition">
                        {task.title}
                      </h4>
                      <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
                        {task.detail}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-amber-500">
                        {task.action} <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Collapsible Signal Card */}
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/20 p-5">
                  <h3 className="text-sm font-bold text-white">Priority Student Alerts</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Students exhibiting conceptual or execution gaps.</p>
                  <div className="mt-4 space-y-2.5">
                    {studentData
                      .filter((student) => student.status !== "ON_TRACK")
                      .map((student) => (
                        <div key={student.id} className="flex items-center justify-between rounded-lg border border-neutral-800/80 bg-neutral-900/60 p-3.5">
                          <div>
                            <p className="text-xs font-semibold text-white">{student.name}</p>
                            <p className="text-[10px] text-neutral-400 mt-0.5">
                              {student.gap} • {student.lastActive}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedClass("ALL");
                              setExpandedStudentId(student.id);
                              setView("students");
                            }}
                            className="rounded bg-neutral-800 hover:bg-neutral-700 px-2 py-1 text-[10px] font-bold text-sky-400 transition"
                          >
                            Review Gap
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-900/20 p-5">
                  <h3 className="text-sm font-bold text-white">Preparation Checklist</h3>
                  <div className="mt-4 space-y-3">
                    {[
                      "Check readiness assessment indicators",
                      "Assign remedial velocity Vector carousels",
                      "Preview physics angled projectile slides",
                      "Analyze parent-safe feedback reports",
                    ].map((item, idx) => (
                      <div key={item} className="flex items-center gap-3 text-xs text-neutral-300">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-bold text-emerald-400">
                          ✓
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Overview View */}
          {view === "overview" && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Active Students", value: selectedClass === "ALL" ? String(studentData.length) : String(classData.find((item) => item.name === selectedClass)?.students || 0), icon: Users, tone: "text-sky-400", bg: "bg-sky-500/5" },
                  { label: "Need Support", value: String(supportCount), icon: AlertTriangle, tone: "text-amber-400", bg: "bg-amber-500/5" },
                  { label: "Pending Reviews", value: "7", icon: ClipboardList, tone: "text-violet-400", bg: "bg-violet-500/5" },
                  { label: "Linked Parents", value: String(parentCount), icon: MessageSquare, tone: "text-emerald-400", bg: "bg-emerald-500/5" }
                ].map(({ label, value, icon: Icon, tone, bg }) => (
                  <div key={label} className={`rounded-xl border border-neutral-800 bg-neutral-900/35 p-5 ${bg}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-neutral-400">{label}</span>
                      <Icon className={`h-4.5 w-4.5 ${tone}`} />
                    </div>
                    <p className="mt-3 text-3xl font-black text-white tracking-tight">{value}</p>
                  </div>
                ))}
              </div>

              {/* Class list and priority lists */}
              <div className="grid gap-5 lg:grid-cols-2">
                <section className="rounded-xl border border-neutral-800 bg-neutral-900/20 p-5">
                  <h3 className="text-sm font-bold text-white mb-4">My Classrooms</h3>
                  <div className="space-y-3">
                    {classData.map((classItem) => (
                      <button
                        key={classItem.id}
                        onClick={() => { setSelectedClass(classItem.name); setView("students"); }}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-900/60 p-4 text-left hover:border-neutral-700 hover:bg-neutral-900 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-white">{classItem.name}</p>
                            <p className="text-[10px] text-neutral-400 mt-1">
                              {classItem.students} students • Next: {classItem.next}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-neutral-600" />
                        </div>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-950">
                          <div className="h-full rounded-full bg-amber-500" style={{ width: `${classItem.progress}%` }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="rounded-xl border border-neutral-800 bg-neutral-900/20 p-5">
                  <h3 className="text-sm font-bold text-white mb-4">Urgent Actions Needed</h3>
                  <div className="space-y-2">
                    {studentData
                      .filter((student) => student.status !== "ON_TRACK")
                      .map((student) => (
                        <div key={student.id} className="flex items-center gap-3 rounded-lg border border-neutral-800/60 bg-neutral-900/40 p-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold text-amber-400">
                            {student.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-white">{student.name}</p>
                            <p className="truncate text-[10px] text-neutral-400">{student.gap}</p>
                          </div>
                          <span className={`text-[10px] font-bold ${student.status === "INACTIVE" ? "text-red-400" : "text-amber-400"}`}>
                            {student.status === "INACTIVE" ? "Inactive" : "Needs Support"}
                          </span>
                        </div>
                      ))}
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* Classes View */}
          {view === "classes" && (
            <ClassManager />
          )}

          {/* Students Follow Up View */}
          {view === "students" && (
            <StudentFollowUp />
          )}

          {/* Assignments View */}
          {view === "assignments" && (
            <div className="grid gap-4 md:grid-cols-3">
              {assignmentData.map((assignment) => (
                <div key={assignment.title} className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-5 flex flex-col justify-between hover:border-neutral-700 transition">
                  <div>
                    <div className="flex items-center justify-between">
                      <ClipboardList className="h-5 w-5 text-violet-400" />
                      <span className="rounded bg-violet-500/10 px-2 py-0.5 text-[9px] font-bold text-violet-400 uppercase">
                        {assignment.state}
                      </span>
                    </div>
                    <h3 className="mt-4 text-sm font-bold text-white">{assignment.title}</h3>
                    <p className="mt-1 text-xs text-neutral-400">{assignment.className}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-neutral-800/80 pt-4 text-xs">
                    <span className="text-neutral-500">Due {assignment.due}</span>
                    <span className="text-emerald-400 font-semibold">{assignment.submitted} submitted</span>
                  </div>
                </div>
              ))}
            </div>
          )}


          {/* Sessions View */}
          {view === "sessions" && (
            <LiveSessionsManager />
          )}

          {/* Reviews View */}
          {view === "reviews" && (
            <TeacherDNAReview />
          )}

          {/* Diagnostics View */}
          {view === "diagnostics" && (
            <DiagnosticReport />
          )}

          {/* Reports View */}
          {view === "reports" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-5 flex flex-col justify-between">
                <div>
                  <BarChart3 className="h-5 w-5 text-emerald-400" />
                  <h3 className="mt-4 text-sm font-bold text-white">Class Progression Analytics</h3>
                  <p className="mt-1 text-xs text-neutral-400">Assess classwide strengths, gaps, and average outcomes.</p>
                </div>
                <button className="mt-6 rounded-lg bg-neutral-800 hover:bg-neutral-700 px-3.5 py-2 text-xs font-bold text-neutral-200 transition">
                  Generate Report
                </button>
              </div>
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-5 flex flex-col justify-between">
                <div>
                  <MessageSquare className="h-5 w-5 text-sky-400" />
                  <h3 className="mt-4 text-sm font-bold text-white">Parent Progress Summaries</h3>
                  <p className="mt-1 text-xs text-neutral-400">Publish approved student progress updates to parent dashboard accounts.</p>
                </div>
                <button className="mt-6 rounded-lg bg-neutral-800 hover:bg-neutral-700 px-3.5 py-2 text-xs font-bold text-neutral-200 transition">
                  Prepare Summaries
                </button>
              </div>
            </div>
          )}

          {/* Parents View */}
          {view === "parents" && (
            <section className="rounded-xl border border-neutral-800 bg-neutral-900/20 p-6 space-y-6">
              <div className="flex items-center gap-3">
                <UserRound className="h-5 w-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Parent Link Communications</h3>
                  <p className="text-xs text-neutral-400">Bridge classrooms and families with secure child-specific indicators.</p>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  { label: "3 Unread Messages", desc: "Inquiries regarding relative velocity tasks" },
                  { label: "5 Summaries Pending", desc: "Share approved student diagnostic results" },
                  { label: "Privacy Guarded", desc: "Parents view child progress exclusively" }
                ].map((card) => (
                  <div key={card.label} className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                    <p className="text-xs font-bold text-white">{card.label}</p>
                    <p className="mt-1 text-[11px] text-neutral-400">{card.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Lesson Prep View */}
          {view === "preparation" && (
            <section className="space-y-5">
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-5">
                <h3 className="text-lg font-bold text-white">Curriculum & Lesson Builder</h3>
                <p className="mt-1 text-sm text-neutral-400">Coordinate and verify target objectives before creating learning decks.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { label: "1. Diagnostic Data", text: "Look over student performance alerts and gaps." },
                  { label: "2. Structuring Drafts", text: "Design your carousel outline using AI ideas." },
                  { label: "3. Complete Review", text: "Review, edit slides, and register lesson carousel." }
                ].map((step) => (
                  <div key={step.label} className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-5">
                    <p className="text-xs font-bold text-amber-500">{step.label}</p>
                    <p className="mt-2 text-xs text-neutral-400 leading-relaxed">{step.text}</p>
                  </div>
                ))}
              </div>
              <button 
                onClick={onOpenAuthoring} 
                className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition"
              >
                <BookOpen className="h-4 w-4" /> Open Authoring Studio
              </button>
            </section>
          )}
        </div>
      </main>

      {/* ── Create Class Modal ──────────────────────────────────── */}
      {showCreateClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6 backdrop-blur-sm">
          <form onSubmit={createClass} className="w-full max-w-md rounded-xl border border-neutral-850 bg-neutral-950 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create Classroom</h3>
            <p className="mt-1 text-xs text-neutral-500">Assigns a classroom group. Save when TiDB replication is active.</p>
            <label className="mt-5 block text-xs font-semibold text-neutral-400">
              Class Name
              <input
                autoFocus
                required
                value={classNameDraft}
                onChange={(event) => setClassNameDraft(event.target.value)}
                placeholder="Year 11 Physics Advanced"
                className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-xs text-white outline-none focus:border-amber-500"
              />
            </label>
            <div className="mt-5 flex justify-end gap-2 text-xs">
              <button type="button" onClick={() => setShowCreateClass(false)} className="rounded-lg border border-neutral-800 px-3.5 py-2 text-neutral-400 hover:bg-neutral-900 transition">
                Cancel
              </button>
              <button className="rounded-lg bg-amber-500 px-3.5 py-2 font-bold text-neutral-950 hover:bg-amber-400 transition">
                Create Class
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
