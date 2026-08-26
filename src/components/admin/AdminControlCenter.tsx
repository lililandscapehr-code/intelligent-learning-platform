"use client";

import { ChangeEvent, useState } from "react";
import { Activity, BookOpen, CreditCard, Database, ShieldCheck, Upload, Users } from "lucide-react";
import { uploadCurriculumPackage } from "../../app/actions";
import type { CurriculumPackage } from "../../contracts/curriculum";

interface AdminControlCenterProps {
  onCurriculumAdded: (curriculum: CurriculumPackage) => void;
}

export default function AdminControlCenter({ onCurriculumAdded }: AdminControlCenterProps) {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-400">Administration</p>
        <h2 className="mt-1 text-2xl font-bold text-white">Platform control center</h2>
        <p className="mt-1 text-sm text-neutral-400">Manage users, curricula, services, enrollment, and governance.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[{ label: "Users", value: "1,248", icon: Users }, { label: "Published services", value: "18", icon: CreditCard }, { label: "Active enrollments", value: "486", icon: Activity }, { label: "Audit events today", value: "92", icon: ShieldCheck }].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-neutral-800 bg-neutral-950 p-5"><Icon className="h-5 w-5 text-red-400" /><p className="mt-4 text-xs text-neutral-500">{label}</p><p className="mt-1 text-xl font-bold text-white">{value}</p></div>
        ))}
      </div>
      <section className="rounded-xl border border-red-500/30 bg-neutral-950 p-5">
        <div className="flex items-start gap-3"><BookOpen className="mt-0.5 h-5 w-5 text-red-400" /><div><h3 className="text-sm font-bold text-white">Add a subject</h3><p className="mt-1 text-xs text-neutral-400">Upload a validated curriculum package to register a new subject.</p></div></div>
        <label className={`mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-400 ${isUploading ? "pointer-events-none opacity-60" : ""}`}><Upload className="h-4 w-4" />{isUploading ? "Uploading..." : "Upload curriculum JSON"}<input type="file" accept="application/json,.json" className="sr-only" onChange={handlePackageUpload} disabled={isUploading} /></label>
        {uploadStatus && <p className="mt-3 text-xs text-neutral-300">{uploadStatus}</p>}
      </section>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[{ title: "User management", detail: "Teachers, students, parents, roles", icon: Users }, { title: "Curriculum registry", detail: "Packages, versions, approvals", icon: BookOpen }, { title: "Services and offers", detail: "Programs, pricing, enrollment", icon: CreditCard }, { title: "Database and audit", detail: "Health, logs, governance", icon: Database }].map(({ title, detail, icon: Icon }) => (
          <div key={title} className="rounded-xl border border-neutral-800 bg-neutral-950 p-5"><Icon className="h-5 w-5 text-red-400" /><h3 className="mt-5 text-sm font-bold text-white">{title}</h3><p className="mt-2 text-xs text-neutral-500">{detail}</p></div>
        ))}
      </div>
      <section className="rounded-xl border border-neutral-800 bg-neutral-950 p-5"><h3 className="text-sm font-bold text-white">Governance reminders</h3><div className="mt-4 space-y-2 text-xs text-neutral-400"><p>Review curriculum package approvals before publishing.</p><p>Keep audit records for all administrative changes.</p><p>Verify service eligibility before enrollment.</p></div></section>
    </div>
  );
}