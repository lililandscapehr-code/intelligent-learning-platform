"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, FileSearch, Filter } from "lucide-react";
import sourceAnalysis, { SourceAnalysisScope } from "../../curriculum-packages/egypt-secondary1-integrated-science/source-analysis";

const scopeLabels: Record<SourceAnalysisScope, string> = {
  PAGE: "Page",
  PAGE_RANGE: "Page range",
  CHAPTER: "Chapter",
  LESSON: "Lesson",
  TITLE: "Title",
  SECTION: "Section",
  COMBINED: "Combined sections"
};

export default function SourceAnalysisExplorer() {
  const [scope, setScope] = useState<"ALL" | SourceAnalysisScope>("ALL");
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState("");
  const [uploadScope, setUploadScope] = useState<SourceAnalysisScope>("PAGE_RANGE");
  const [sourceType, setSourceType] = useState<"PDF" | "DOCX" | "WEBPAGE" | "TEXT" | "IMAGE">("PDF");
  const [sourceUrl, setSourceUrl] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [pageStart, setPageStart] = useState("1");
  const [pageEnd, setPageEnd] = useState("10");
  const [title, setTitle] = useState("");
  const [section, setSection] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [uploadBusy, setUploadBusy] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [textPreview, setTextPreview] = useState("");
  const [targetKind, setTargetKind] = useState<"PART" | "CHAPTER" | "LESSON">("CHAPTER");
  const [targetId, setTargetId] = useState("");
  const [sourceVersion, setSourceVersion] = useState("2026-2027");

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const entries = useMemo(() => sourceAnalysis.filter((entry) => {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedPage = Number(pageNumber);
    const matchesScope = scope === "ALL" || entry.scope === scope;
    const matchesQuery = !normalizedQuery || [entry.label, entry.title, entry.section, entry.summary, ...entry.learningFocus].join(" ").toLowerCase().includes(normalizedQuery);
    const matchesPage = !pageNumber || (Number.isInteger(normalizedPage) && normalizedPage >= entry.pageStart && normalizedPage <= entry.pageEnd);
    return matchesScope && matchesQuery && matchesPage;
  }), [pageNumber, query, scope]);

  async function selectSourceFile(file?: File) {
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setTextPreview(file.type.startsWith("text/") || /\.(txt|md|csv|json)$/i.test(file.name) ? (await file.text()).slice(0, 4000) : "");
    setAnalysisResult(`${file.name} is ready for preview. Confirm the target and analyze when ready.`);
  }

  async function analyzeUploadedSource(file?: File) {
    const sourceFile = file || selectedFile || undefined;
    if (sourceType !== "TEXT" && sourceType !== "WEBPAGE" && !sourceFile) return;
    if (sourceType === "WEBPAGE" && !sourceUrl.trim()) {
      setAnalysisResult("Enter a public webpage URL before uploading.");
      return;
    }
    if (sourceType === "TEXT" && !file && !pastedText.trim()) {
      setAnalysisResult("Enter source text before submitting.");
      return;
    }
    setUploadBusy(true);
    if (!targetId.trim()) { setAnalysisResult("Enter a part, chapter, or lesson target ID before analyzing."); return; }
    setAnalysisResult(`Analyzing ${sourceFile?.name || sourceUrl || "pasted source"} for ${targetKind.toLowerCase()} ${targetId}...`);
    try {
      const body = new FormData();
      body.append("sourceType", sourceType);
      if (sourceFile) body.append("document", sourceFile);
      body.append("sourceUrl", sourceUrl);
      body.append("pastedText", pastedText);
      body.append("analysisScope", uploadScope);
      body.append("pageStart", pageStart);
      body.append("pageEnd", pageEnd);
      body.append("title", title);
      body.append("section", section);
      body.append("targetKind", targetKind);
      body.append("targetId", targetId);
      body.append("sourceVersion", sourceVersion);
      const response = await fetch("/api/teacher/source-analysis", { method: "POST", body });
      const result = await response.json();
      setAnalysisResult(result.answer || result.error || "No source analysis was returned.");
    } catch {
      setAnalysisResult("Source analysis is unavailable. Verify the teacher/admin session and AI provider configuration.");
    } finally {
      setUploadBusy(false);
    }
  }

  return (
    <section className="space-y-5 rounded-xl border border-sky-500/25 bg-sky-500/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <FileSearch className="mt-0.5 h-5 w-5 text-sky-300" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-300">Teacher/admin source analysis</p>
            <h2 className="mt-1 text-xl font-bold text-white">English Integrated Science source map</h2>
            <p className="mt-1 text-sm text-neutral-400">Select a page, page range, chapter, title, section, lesson, or combined view.</p>
          </div>
        </div>
        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase text-amber-300">Source mapped / review required</span>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_180px_150px]">
        <label className="text-xs font-semibold text-neutral-400">Search title or section<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="sustainability, aquatic..." className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-400" /></label>
        <label className="text-xs font-semibold text-neutral-400">Page number<input type="number" min="1" max="96" value={pageNumber} onChange={(event) => setPageNumber(event.target.value)} placeholder="1-96" className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-400" /></label>
        <label className="text-xs font-semibold text-neutral-400">Analysis type<select value={scope} onChange={(event) => setScope(event.target.value as "ALL" | SourceAnalysisScope)} className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-400"><option value="ALL">All types</option>{Object.entries(scopeLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
      </div>

      <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Upload source update</p><p className="mt-1 text-xs text-neutral-400">Preview locally, target a part/chapter/lesson, then explicitly analyze. Previous revisions are preserved.</p></div>{sourceType === "PDF" || sourceType === "DOCX" || sourceType === "IMAGE" || sourceType === "TEXT" ? <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-neutral-800 px-3 py-2 text-xs font-bold text-neutral-200"><FileSearch className="h-4 w-4" />Choose source<input type="file" accept={sourceType === "DOCX" ? ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" : sourceType === "IMAGE" ? "image/*" : sourceType === "TEXT" ? ".txt,.md,.csv,.json,text/*" : "application/pdf,.pdf"} className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; void selectSourceFile(file); }} disabled={uploadBusy} /></label> : <button type="button" onClick={() => analyzeUploadedSource()} disabled={uploadBusy} className="flex items-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-neutral-950 disabled:opacity-50"><FileSearch className="h-4 w-4" />Analyze source</button>}</div>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <label className="text-xs font-semibold text-neutral-400">Update target<select value={targetKind} onChange={(event) => setTargetKind(event.target.value as typeof targetKind)} className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white"><option value="PART">Part</option><option value="CHAPTER">Chapter</option><option value="LESSON">Lesson</option></select></label>
          <label className="text-xs font-semibold text-neutral-400">Target ID or name<input value={targetId} onChange={(event) => setTargetId(event.target.value)} placeholder="CHAPTER-1-MECHANICS" className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white" /></label>
          <label className="text-xs font-semibold text-neutral-400">Source version<input value={sourceVersion} onChange={(event) => setSourceVersion(event.target.value)} placeholder="2027-2028" className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white" /></label>
          <label className="text-xs font-semibold text-neutral-400">Source type<select value={sourceType} onChange={(event) => setSourceType(event.target.value as typeof sourceType)} className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white"><option value="PDF">PDF</option><option value="DOCX">Word DOCX</option><option value="IMAGE">Image</option><option value="WEBPAGE">Public webpage</option><option value="TEXT">Pasted or local text</option></select></label>
          <label className="text-xs font-semibold text-neutral-400">Scope<select value={uploadScope} onChange={(event) => setUploadScope(event.target.value as SourceAnalysisScope)} className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white">{Object.entries(scopeLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
          <label className="text-xs font-semibold text-neutral-400">Page start<input type="number" min="1" value={pageStart} onChange={(event) => setPageStart(event.target.value)} className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white" /></label>
          <label className="text-xs font-semibold text-neutral-400">Page end<input type="number" min="1" value={pageEnd} onChange={(event) => setPageEnd(event.target.value)} className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white" /></label>
          <label className="text-xs font-semibold text-neutral-400">Title or section<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Chapter One" className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white" /></label>
        </div>
        {sourceType === "WEBPAGE" && <label className="mt-3 block text-xs font-semibold text-neutral-400">Public webpage URL<input type="url" value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} placeholder="https://example.org/science" className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white" /></label>}
        {sourceType === "TEXT" && <label className="mt-3 block text-xs font-semibold text-neutral-400">Source text<textarea value={pastedText} onChange={(event) => setPastedText(event.target.value)} rows={5} placeholder="Paste source notes or an openly licensed excerpt..." className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white" /></label>}
        {previewUrl && (sourceType === "PDF" || sourceType === "IMAGE") && <div className="mt-3 rounded-lg border border-neutral-800 bg-neutral-950 p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Local preview · {selectedFile?.name}</p>{sourceType === "IMAGE" ? <img src={previewUrl} alt="Selected source preview" className="mt-2 max-h-72 max-w-full rounded object-contain" /> : <iframe src={previewUrl} title="Selected PDF preview" className="mt-2 h-72 w-full rounded border border-neutral-800" />}</div>}
        {textPreview && sourceType === "TEXT" && <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-xs text-neutral-400">{textPreview}</pre>}
        <label className="mt-3 block text-xs font-semibold text-neutral-400">Section detail<input value={section} onChange={(event) => setSection(event.target.value)} placeholder="Water chemistry" className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white" /></label>
        {(selectedFile || sourceType === "WEBPAGE" || pastedText.trim()) && <button type="button" onClick={() => analyzeUploadedSource()} disabled={uploadBusy || !targetId.trim()} className="mt-4 flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-neutral-950 disabled:opacity-50"><FileSearch className="h-4 w-4" />{uploadBusy ? "Analyzing..." : "Analyze source update"}</button>}
        {analysisResult && <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg border border-neutral-800 bg-neutral-950 p-4 text-xs leading-5 text-neutral-300">{analysisResult}</pre>}
      </div>

      <div className="flex items-center gap-2 text-xs text-neutral-500"><Filter className="h-3.5 w-3.5" />{entries.length} matching source analyses</div>
      <div className="grid gap-4 lg:grid-cols-2">
        {entries.map((entry) => (
          <article key={entry.id} className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
            <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-wider text-sky-300">{scopeLabels[entry.scope]} · pages {entry.pageStart}-{entry.pageEnd}</p><h3 className="mt-1 text-sm font-bold text-white">{entry.title}</h3><p className="mt-1 text-xs text-neutral-500">{entry.section || entry.label}</p></div><BookOpen className="h-4 w-4 shrink-0 text-neutral-600" /></div>
            <p className="mt-4 text-sm leading-6 text-neutral-300">{entry.summary}</p>
            <div className="mt-4"><p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Learning focus</p><ul className="mt-2 space-y-1 text-xs text-neutral-400">{entry.learningFocus.map((focus) => <li key={focus}>• {focus}</li>)}</ul></div>
            <div className="mt-4 flex flex-wrap gap-1.5">{entry.scienceDomains.map((domain) => <span key={domain} className="rounded border border-neutral-700 px-2 py-1 text-[10px] text-neutral-500">{domain}</span>)}</div>
            <p className={`mt-4 text-[10px] font-bold uppercase ${entry.status === "SOURCE_MAPPED" ? "text-emerald-400" : "text-amber-300"}`}>{entry.status.replace("_", " ")}</p>
          </article>
        ))}
      </div>
      {entries.length === 0 && <p className="rounded-lg border border-neutral-800 bg-neutral-950 p-6 text-center text-sm text-neutral-500">No source analysis matches these filters.</p>}
    </section>
  );
}
