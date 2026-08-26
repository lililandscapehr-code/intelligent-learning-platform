"use client";

import { useEffect, useState } from "react";
import { fetchTeacherDashboard, getSession, login } from "../../app/actions";
import TeacherAIDesk from "./TeacherAIDesk";
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
  UserRound
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

export default function TeacherDashboard({ onOpenAuthoring }: { onOpenAuthoring: () => void }) {
  const [session, setSession] = useState<{ email: string; role: string } | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [dashboardSource, setDashboardSource] = useState<"DEMO" | "DATABASE">("DEMO");
  const [selectedClass, setSelectedClass] = useState("ALL");
  const [view, setView] = useState<"today" | "overview" | "preparation" | "students" | "assignments" | "sessions" | "reviews" | "reports" | "parents">("today");
  const [classData, setClassData] = useState(classes);
  const [studentData, setStudentData] = useState(students);
  const [assignmentData, setAssignmentData] = useState(assignments);
  const [parentCount, setParentCount] = useState(3);
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [classNameDraft, setClassNameDraft] = useState("");
  const visibleStudents = selectedClass === "ALL" ? studentData : studentData.filter((student) => student.className === selectedClass);
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
      <div className="mx-auto max-w-md rounded-xl border border-neutral-800 bg-neutral-950 p-6">
        <div className="flex items-center gap-3"><UserRound className="h-5 w-5 text-amber-400" /><div><h2 className="text-lg font-bold text-white">Teacher sign in</h2><p className="mt-1 text-xs text-neutral-500">Use a TEACHER or ADMIN account to access assigned classes and student data.</p></div></div>
        <form onSubmit={submitLogin} className="mt-6 space-y-4">
          <label className="block text-xs font-semibold text-neutral-400">Email<input type="email" value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} required className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500" /></label>
          <label className="block text-xs font-semibold text-neutral-400">Password<input type="password" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} required className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500" /></label>
          {loginError && <p className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-400">{loginError}</p>}
          <button disabled={loginBusy} className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-bold text-neutral-950 disabled:opacity-50">{loginBusy ? "Signing in..." : "Sign in to teacher dashboard"}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-500">Teacher workspace</p>
          <h2 className="mt-1 text-2xl font-bold text-white">Good morning, Ms. Carter</h2>
          <p className="mt-1 text-sm text-neutral-400">Monitor learning, support students, and manage approved classroom content.</p>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-600">Data source: {dashboardSource === "DATABASE" ? "TiDB" : "Demo preview"}</p>
        </div>
        <button onClick={onOpenAuthoring} className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-bold text-neutral-950 hover:bg-amber-400">
          <BookOpen className="h-4 w-4" /> Create lesson content
        </button>
      </div>

      <TeacherAIDesk />

      <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-3">
        {(["today", "overview", "preparation", "students", "assignments", "sessions", "reviews", "reports", "parents"] as const).map((item) => (
          <button key={item} onClick={() => setView(item)} className={`rounded-lg px-3 py-2 text-xs font-bold capitalize ${view === item ? "bg-amber-500 text-neutral-950" : "text-neutral-400 hover:bg-neutral-800 hover:text-white"}`}>
            {item}
          </button>
        ))}
        <button onClick={() => setShowCreateClass(true)} className="flex items-center gap-1 rounded-lg border border-neutral-700 px-3 py-2 text-xs font-bold text-neutral-300 hover:border-amber-500"><Plus className="h-3.5 w-3.5" /> New class</button>
        <select value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)} className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-300 outline-none focus:border-amber-500">
          <option value="ALL">All classes</option>
          {classData.map((classItem) => <option key={classItem.id} value={classItem.name}>{classItem.name}</option>)}
        </select>
      </div>

      {view === "today" && (
        <section className="space-y-5">
          <div className="rounded-xl border border-sky-500/25 bg-sky-500/5 p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-300">Teacher command center</p><h3 className="mt-1 text-xl font-bold text-white">Your teaching day, in priority order</h3><p className="mt-1 text-sm text-neutral-400">Evidence first, preparation next, communication when it is useful.</p></div><span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold text-emerald-300">Teacher-controlled workflow</span></div></div>
          <div className="grid gap-4 lg:grid-cols-2">{todayTasks.map((task) => <button key={task.id} type="button" onClick={() => setView(task.view)} className="flex items-start gap-4 rounded-xl border border-neutral-800 bg-neutral-950 p-5 text-left hover:border-neutral-600"><div className={`mt-0.5 ${task.tone}`}><CheckCircle2 className="h-5 w-5" /></div><div className="min-w-0 flex-1"><h4 className="text-sm font-bold text-white">{task.title}</h4><p className="mt-1 text-xs leading-5 text-neutral-500">{task.detail}</p><p className="mt-3 text-xs font-bold text-amber-400">{task.action} <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></p></div></button>)}</div>
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]"><section className="rounded-xl border border-neutral-800 bg-neutral-950 p-5"><h3 className="text-sm font-bold text-white">Fast student signal</h3><p className="mt-1 text-xs text-neutral-500">Use this view to decide who needs explanation, practice, or a teacher conversation.</p><div className="mt-4 space-y-3">{studentData.filter((student) => student.status !== "ON_TRACK").map((student) => <div key={student.id} className="flex flex-wrap items-center gap-3 rounded-lg bg-neutral-900 p-3"><div className="min-w-36 flex-1"><p className="text-xs font-semibold text-white">{student.name}</p><p className="mt-1 text-[11px] text-neutral-500">{student.gap} · Last active {student.lastActive}</p></div><span className="text-[10px] font-bold text-amber-400">{student.status.replace("_", " ")}</span><button type="button" onClick={() => setView("students")} className="text-[10px] font-bold text-sky-400">Review</button></div>)}</div></section><section className="rounded-xl border border-neutral-800 bg-neutral-950 p-5"><h3 className="text-sm font-bold text-white">Preparation checklist</h3><div className="mt-4 space-y-3">{["Confirm readiness evidence", "Choose one learning objective", "Ask AI for a draft carousel", "Preview as a student", "Save teacher draft for review"].map((item, index) => <div key={item} className="flex items-center gap-3 text-xs text-neutral-300"><span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${index < 2 ? "bg-emerald-500/15 text-emerald-400" : "bg-neutral-800 text-neutral-500"}`}>{index < 2 ? "✓" : index + 1}</span>{item}</div>)}</div><button type="button" onClick={() => setView("preparation")} className="mt-5 flex items-center gap-2 text-xs font-bold text-amber-400">Open preparation desk <ArrowRight className="h-3.5 w-3.5" /></button></section></div>
        </section>
      )}

      {view === "preparation" && <section className="space-y-5"><div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-5"><p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Lesson preparation</p><h3 className="mt-1 text-xl font-bold text-white">Prepare one clear learning experience</h3><p className="mt-1 text-sm text-neutral-400">Start from student evidence, ask AI for options, then edit and preview before saving.</p></div><div className="grid gap-4 md:grid-cols-3">{[{ label: "1. Evidence", text: "Review readiness and priority gaps" }, { label: "2. Build", text: "Ask AI for a carousel recommendation" }, { label: "3. Check", text: "Preview, edit, and save for review" }].map((step) => <div key={step.label} className="rounded-xl border border-neutral-800 bg-neutral-950 p-5"><p className="text-xs font-bold text-amber-400">{step.label}</p><p className="mt-2 text-sm text-white">{step.text}</p></div>)}</div><button type="button" onClick={onOpenAuthoring} className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-bold text-neutral-950"><BookOpen className="h-4 w-4" /> Open authoring studio</button></section>}

      {view === "overview" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Active students", value: selectedClass === "ALL" ? String(studentData.length) : String(classData.find((item) => item.name === selectedClass)?.students || 0), icon: Users, tone: "text-sky-400" },
              { label: "Need support", value: String(supportCount), icon: AlertTriangle, tone: "text-amber-400" },
              { label: "Pending reviews", value: "7", icon: ClipboardList, tone: "text-violet-400" },
              { label: "Linked parents", value: String(parentCount), icon: MessageSquare, tone: "text-emerald-400" }
            ].map(({ label, value, icon: Icon, tone }) => (
              <div key={label} className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
                <Icon className={`h-5 w-5 ${tone}`} />
                <p className="mt-4 text-xs text-neutral-500">{label}</p>
                <p className="mt-1 text-2xl font-bold text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
              <div className="flex items-center justify-between"><h3 className="text-sm font-bold text-white">My classes</h3><button onClick={() => setView("students")} className="text-xs text-amber-400">View students</button></div>
              <div className="mt-4 space-y-3">
                {classData.map((classItem) => (
                  <button key={classItem.id} onClick={() => { setSelectedClass(classItem.name); setView("students"); }} className="w-full rounded-lg border border-neutral-800 bg-neutral-900/60 p-4 text-left hover:border-neutral-700">
                    <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-white">{classItem.name}</p><p className="mt-1 text-xs text-neutral-500">{classItem.students} students · Next: {classItem.next}</p></div><ArrowRight className="h-4 w-4 text-neutral-600" /></div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-800"><div className="h-full rounded-full bg-amber-500" style={{ width: `${classItem.progress}%` }} /></div>
                    <p className="mt-1 text-right text-[10px] text-neutral-500">{classItem.progress}% average progress</p>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
              <div className="flex items-center justify-between"><h3 className="text-sm font-bold text-white">Priority support</h3><button onClick={() => setView("students")} className="text-xs text-amber-400">Open list</button></div>
              <div className="mt-4 space-y-3">{studentData.filter((student) => student.status !== "ON_TRACK").map((student) => <div key={student.id} className="flex items-center gap-3 rounded-lg bg-neutral-900/60 p-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold text-amber-400">{student.name.split(" ").map((part) => part[0]).join("")}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-white">{student.name}</p><p className="truncate text-[11px] text-neutral-500">{student.gap} · {student.lastActive}</p></div><span className={`text-[10px] font-bold ${student.status === "INACTIVE" ? "text-red-400" : "text-amber-400"}`}>{student.status === "INACTIVE" ? "Inactive" : "Support"}</span></div>)}</div>
            </section>
          </div>
        </>
      )}

      {view === "students" && (
        <section className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
          <div className="border-b border-neutral-800 p-5"><h3 className="text-sm font-bold text-white">Student progress</h3><p className="mt-1 text-xs text-neutral-500">Teacher access is limited to assigned classes. Parent data is not shown in this view.</p></div>
          <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-neutral-900/70 text-[10px] uppercase tracking-wider text-neutral-500"><tr><th className="px-5 py-3">Student</th><th className="px-5 py-3">Class</th><th className="px-5 py-3">Stage</th><th className="px-5 py-3">Progress</th><th className="px-5 py-3">Priority gap</th><th className="px-5 py-3">Status</th></tr></thead><tbody>{visibleStudents.map((student) => <tr key={student.id} className="border-t border-neutral-800"><td className="px-5 py-4 font-semibold text-white">{student.name}</td><td className="px-5 py-4 text-neutral-400">{student.className}</td><td className="px-5 py-4 text-neutral-400">{student.stage}</td><td className="px-5 py-4"><div className="flex items-center gap-2"><div className="h-1.5 w-20 rounded-full bg-neutral-800"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${student.progress}%` }} /></div><span className="text-neutral-300">{student.progress}%</span></div></td><td className="px-5 py-4 text-neutral-400">{student.gap}</td><td className="px-5 py-4"><span className={student.status === "ON_TRACK" ? "text-emerald-400" : student.status === "INACTIVE" ? "text-red-400" : "text-amber-400"}>{student.status.replace("_", " ")}</span></td></tr>)}</tbody></table></div>
        </section>
      )}

      {view === "assignments" && <section className="grid gap-4 lg:grid-cols-3">{assignmentData.map((assignment) => <div key={assignment.title} className="rounded-xl border border-neutral-800 bg-neutral-950 p-5"><div className="flex items-start justify-between"><ClipboardList className="h-5 w-5 text-violet-400" /><span className="text-[10px] font-bold text-neutral-500">{assignment.state}</span></div><h3 className="mt-5 text-sm font-bold text-white">{assignment.title}</h3><p className="mt-2 text-xs text-neutral-500">{assignment.className}</p><div className="mt-5 flex justify-between text-xs"><span className="text-neutral-500">Due {assignment.due}</span><span className="text-emerald-400">{assignment.submitted} submitted</span></div></div>)}</section>}

      {view === "sessions" && <section className="space-y-4"><div className="flex items-center justify-between"><div><h3 className="text-sm font-bold text-white">Session management</h3><p className="mt-1 text-xs text-neutral-500">Schedule lessons, remediation, reviews, and practical assessments.</p></div><button className="flex items-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-neutral-950"><Plus className="h-3.5 w-3.5" /> Schedule session</button></div>{sessions.map((session) => <div key={session.title} className="flex flex-wrap items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-950 p-5"><CalendarClock className="h-5 w-5 text-sky-400" /><div className="min-w-48 flex-1"><p className="text-sm font-bold text-white">{session.title}</p><p className="mt-1 text-xs text-neutral-500">{session.className} · {session.type}</p></div><span className="text-xs text-neutral-400">{session.date}</span><span className="text-[10px] font-bold text-emerald-400">{session.status}</span><button className="text-xs text-amber-400">Manage</button></div>)}</section>}

      {view === "reviews" && <section className="space-y-4"><div><h3 className="text-sm font-bold text-white">Content review queue</h3><p className="mt-1 text-xs text-neutral-500">Review teacher drafts and optional AI suggestions before publishing.</p></div>{contentReviews.map((review) => <div key={review.title} className="flex flex-wrap items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-950 p-5"><FileCheck2 className="h-5 w-5 text-violet-400" /><div className="min-w-48 flex-1"><p className="text-sm font-bold text-white">{review.title}</p><p className="mt-1 text-xs text-neutral-500">{review.type} · {review.source}</p></div><span className={review.status === "APPROVED" ? "text-[10px] font-bold text-emerald-400" : "text-[10px] font-bold text-amber-400"}>{review.status}</span><button onClick={onOpenAuthoring} className="text-xs font-bold text-amber-400">Open review</button></div>)}</section>}

      {view === "reports" && <section className="grid gap-4 md:grid-cols-2"><div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5"><BarChart3 className="h-5 w-5 text-emerald-400" /><h3 className="mt-5 text-sm font-bold text-white">Class progress report</h3><p className="mt-2 text-xs text-neutral-500">Average mastery, engagement, and priority gaps by class.</p><button className="mt-5 rounded-lg bg-neutral-800 px-3 py-2 text-xs font-bold text-neutral-200">Generate report</button></div><div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5"><MessageSquare className="h-5 w-5 text-sky-400" /><h3 className="mt-5 text-sm font-bold text-white">Parent summary report</h3><p className="mt-2 text-xs text-neutral-500">Prepare approved progress summaries for linked parents.</p><button className="mt-5 rounded-lg bg-neutral-800 px-3 py-2 text-xs font-bold text-neutral-200">Prepare summaries</button></div></section>}

      {view === "parents" && <section className="rounded-xl border border-neutral-800 bg-neutral-950 p-6"><div className="flex items-center gap-3"><UserRound className="h-5 w-5 text-emerald-400" /><div><h3 className="text-sm font-bold text-white">Parent communication</h3><p className="mt-1 text-xs text-neutral-500">A secure messaging and progress-report workflow will connect here.</p></div></div><div className="mt-5 grid gap-3 md:grid-cols-3"><div className="rounded-lg bg-neutral-900 p-4"><p className="text-xs font-semibold text-white">3 unread messages</p><p className="mt-1 text-[11px] text-neutral-500">Questions about current assignments</p></div><div className="rounded-lg bg-neutral-900 p-4"><p className="text-xs font-semibold text-white">5 reports ready</p><p className="mt-1 text-[11px] text-neutral-500">Share approved progress summaries</p></div><div className="rounded-lg bg-neutral-900 p-4"><p className="text-xs font-semibold text-white">Privacy controlled</p><p className="mt-1 text-[11px] text-neutral-500">Parents see only their linked child</p></div></div></section>}

      {showCreateClass && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"><form onSubmit={createClass} className="w-full max-w-md rounded-xl border border-neutral-700 bg-neutral-950 p-6"><h3 className="text-lg font-bold text-white">Create a class</h3><p className="mt-1 text-xs text-neutral-500">This creates a local draft class. Save it to TiDB when the class management API is connected.</p><label className="mt-5 block text-xs font-semibold text-neutral-400">Class name<input autoFocus required value={classNameDraft} onChange={(event) => setClassNameDraft(event.target.value)} placeholder="Year 11 Mathematics" className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500" /></label><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setShowCreateClass(false)} className="rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-400">Cancel</button><button className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-neutral-950">Create class</button></div></form></div>}
    </div>
  );
}
