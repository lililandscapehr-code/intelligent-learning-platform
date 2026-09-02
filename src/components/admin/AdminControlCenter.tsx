"use client";

import React, { ChangeEvent, useState } from "react";
import { 
  Activity, 
  BookOpen, 
  CreditCard, 
  Database, 
  ShieldCheck, 
  Upload, 
  Users,
  CheckCircle,
  XCircle,
  Lock,
  Sparkles,
  Plus,
  UserCheck
} from "lucide-react";
import { uploadCurriculumPackage } from "../../app/actions";
import type { CurriculumPackage } from "../../contracts/curriculum";
import { ClassRegistry, REGISTERED_CURRICULUM_SPECS, TeacherAssignment } from "../../core/services/class-registry";

interface AdminControlCenterProps {
  onCurriculumAdded: (curriculum: CurriculumPackage) => void;
}

export default function AdminControlCenter({ onCurriculumAdded }: AdminControlCenterProps) {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Curriculum Governance state
  const [teacherAssignments, setTeacherAssignments] = useState<TeacherAssignment[]>(() => ClassRegistry.getAllTeacherAssignments());
  const registeredSpecs = Object.values(REGISTERED_CURRICULUM_SPECS);

  const handlePackageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(`Uploading ${file.name}...`);
    try {
      const packageData = JSON.parse(await file.text()) as CurriculumPackage;
      const result = await uploadCurriculumPackage(packageData);
      if (!result.success) {
        setUploadStatus(`Upload failed: ${result.errors.join("; ")}`);
        return;
      }

      onCurriculumAdded(packageData);
      setUploadStatus(`${packageData.identity.name} was added and is now available in the subject selector.`);
    } catch {
      setUploadStatus("Upload failed: choose a valid curriculum package JSON file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleTeacherCurriculum = (teacherId: string, curriculumId: string, isAuthorized: boolean) => {
    if (isAuthorized) {
      ClassRegistry.revokeCurriculumFromTeacher(teacherId, curriculumId);
    } else {
      ClassRegistry.assignCurriculumToTeacher(teacherId, curriculumId);
    }
    setTeacherAssignments([...ClassRegistry.getAllTeacherAssignments()]);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-400">Administration & Governance</p>
        <h2 className="mt-1 text-2xl font-bold text-white">Platform Control Center</h2>
        <p className="mt-1 text-sm text-neutral-400">Admin-only official curriculum registration & teacher authorization rules.</p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Users", value: "1,248", icon: Users },
          { label: "Admin-Registered Curricula", value: `${registeredSpecs.length}`, icon: BookOpen },
          { label: "Authorized Teachers", value: `${teacherAssignments.length}`, icon: UserCheck },
          { label: "Audit Governance", value: "100% Active", icon: ShieldCheck }
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
            <Icon className="h-5 w-5 text-red-400" />
            <p className="mt-4 text-xs text-neutral-500">{label}</p>
            <p className="mt-1 text-xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* ── ADMIN CURRICULUM IMPORT SECTION ── */}
      <section className="rounded-2xl border border-red-500/40 bg-neutral-950 p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 font-bold">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Official Curriculum Import (Admin Gatekeeper)
                <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">
                  ADMIN ONLY
                </span>
              </h3>
              <p className="text-xs text-neutral-400">Only platform administrators can import, verify, and register official curriculum specifications.</p>
            </div>
          </div>
          <label className={`inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-500 transition shadow-lg ${isUploading ? "pointer-events-none opacity-60" : ""}`}>
            <Upload className="h-4 w-4" />
            {isUploading ? "Verifying..." : "Import Official Curriculum JSON"}
            <input type="file" accept="application/json,.json" className="sr-only" onChange={handlePackageUpload} disabled={isUploading} />
          </label>
        </div>
        {uploadStatus && <p className="text-xs p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">{uploadStatus}</p>}
      {/* ── ADMIN QUESTION TANK & AI BUILDER GOVERNANCE ── */}
      <section className="rounded-2xl border border-violet-500/40 bg-neutral-950 p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 font-bold">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Official AI Builder & 3-Case Question DNA Tank Manager
                <span className="text-[10px] bg-violet-500/20 text-violet-400 border border-violet-500/30 px-2 py-0.5 rounded-full font-bold">
                  ADMIN EXCLUSIVE
                </span>
              </h3>
              <p className="text-xs text-neutral-400">Only Admin generates and publishes official 3-Case Question DNA banks (Case B, Case Pre, Case C). Teachers inherit pushed tanks.</p>
            </div>
          </div>
          <span className="text-xs font-bold bg-violet-500/10 text-violet-300 border border-violet-500/30 px-3 py-1.5 rounded-xl">
            🤖 AI Generator Locked to Admin
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl space-y-1">
            <strong className="text-violet-400 block font-bold">1. Admin AI Generation</strong>
            <p className="text-neutral-400">Admin parses PDF textbooks and generates official 3-Case Question DNA banks.</p>
          </div>
          <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl space-y-1">
            <strong className="text-amber-400 block font-bold">2. Push to Authorized Teachers</strong>
            <p className="text-neutral-400">Official tanks are pushed only to teachers who hold Admin approval for that curriculum.</p>
          </div>
          <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl space-y-1">
            <strong className="text-emerald-400 block font-bold">3. Teacher Package Extras</strong>
            <p className="text-neutral-400">Teachers can add custom slides, explanation videos, and extra questions to their packages.</p>
          </div>
        </div>
      </section>

      {/* ── TEACHER CURRICULUM AUTHORIZATION MATRIX ── */}
      <section className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-amber-500" />
              Teacher Curriculum Authorization Matrix
            </h3>
            <p className="text-xs text-neutral-400">Teachers can ONLY create packages from curriculums authorized by Admin here.</p>
          </div>
          <span className="text-[11px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold">
            STRICT GOVERNANCE
          </span>
        </div>

        <div className="space-y-4">
          {teacherAssignments.map((assignment) => (
            <div key={assignment.teacherId} className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{assignment.teacherName}</h4>
                  <p className="text-xs text-neutral-400">{assignment.teacherEmail}</p>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                  {assignment.approvedCurriculumIds.length} Curricula Approved
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-800/80">
                <span className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider block">Admin Approval Status per Official Curriculum:</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {registeredSpecs.map((spec) => {
                    const isAuthorized = assignment.approvedCurriculumIds.includes(spec.id);
                    return (
                      <div 
                        key={spec.id}
                        className={`p-3 rounded-lg border flex items-center justify-between text-xs transition ${
                          isAuthorized 
                            ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300" 
                            : "bg-neutral-950 border-neutral-800 text-neutral-400"
                        }`}
                      >
                        <div className="truncate pr-2">
                          <p className="font-bold text-white truncate">{spec.name}</p>
                          <p className="text-[10px] text-neutral-400">{spec.gradeLevel}</p>
                        </div>

                        <button
                          onClick={() => handleToggleTeacherCurriculum(assignment.teacherId, spec.id, isAuthorized)}
                          className={`shrink-0 px-3 py-1 rounded-lg font-bold text-[11px] transition ${
                            isAuthorized
                              ? "bg-emerald-600 hover:bg-red-600 text-white"
                              : "bg-neutral-800 hover:bg-emerald-600 text-neutral-300 hover:text-white"
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
      </section>

      {/* Audit & Governance Details */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "User Management", detail: "Teachers, students, parents, roles", icon: Users },
          { title: "Curriculum Registry", detail: "Admin-imported packages, versions, specs", icon: BookOpen },
          { title: "Services & Offers", detail: "Teacher packages, volume rates, enrollment", icon: CreditCard },
          { title: "Database & Audit", detail: "Platform health, logs, strict control flow", icon: Database }
        ].map(({ title, detail, icon: Icon }) => (
          <div key={title} className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
            <Icon className="h-5 w-5 text-red-400" />
            <h3 className="mt-5 text-sm font-bold text-white">{title}</h3>
            <p className="mt-2 text-xs text-neutral-500">{detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}