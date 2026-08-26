"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ClipboardCheck, Loader2 } from "lucide-react";
import { getActiveStudentDiagnostic, getDiagnosticAttemptForStudent, startDiagnostic, submitDiagnosticResponse } from "../../app/actions";
import { resolveQuestionVersion } from "../../features/diagnostic/question-resolution";
import type { AssessmentRevision } from "../../contracts/foundation";
import type { QuestionInstance } from "../../contracts/question-content";

const ATTEMPT_STORAGE_KEY = "student-diagnostic-attempt";

export default function StudentDiagnostic({ curriculumId, curriculumName }: { curriculumId: string; curriculumName: string }) {
  const [revision, setRevision] = useState<AssessmentRevision | null>(null);
  const [question, setQuestion] = useState<QuestionInstance | null>(null);
  const [attempt, setAttempt] = useState<any>(null);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [status, setStatus] = useState("Loading diagnostic...");
  const [busy, setBusy] = useState(false);
  const questionStartedAt = useRef<number | null>(null);

  async function loadAttempt(attemptId: string, activeRevision: AssessmentRevision) {
    const result = await getDiagnosticAttemptForStudent(attemptId);
    if (!result.success || !result.data) {
      localStorage.removeItem(ATTEMPT_STORAGE_KEY);
      setStatus(result.errors[0] || "Unable to resume diagnostic.");
      return;
    }
    setAttempt(result.data);
    if (result.data.status === "COMPLETED") {
      setQuestion(null);
      setStatus("Diagnostic completed. Your responses are securely recorded.");
      return;
    }
    const currentQuestionId = activeRevision.questionVersionIds[result.data.currentQuestionIndex];
    try {
      setQuestion(resolveQuestionVersion(activeRevision, currentQuestionId));
      questionStartedAt.current ??= Date.now();
      setStatus("");
    } catch {
      setStatus("The current question version is unavailable.");
    }
  }

  useEffect(() => {
    (async () => {
      const config = await getActiveStudentDiagnostic(curriculumId);
      if (!config.success || !config.data) {
        setStatus(config.errors[0] || "No diagnostic is available.");
        return;
      }
      setRevision(config.data.revision);
      const storedAttemptId = localStorage.getItem(ATTEMPT_STORAGE_KEY);
      if (storedAttemptId) await loadAttempt(storedAttemptId, config.data.revision);
      else setStatus("Ready to begin your diagnostic.");
    })();
  }, [curriculumId]);

  async function begin() {
    if (!revision) return;
    setBusy(true);
    const result = await startDiagnostic(revision.revisionId, crypto.randomUUID());
    if (result.success && result.data) {
      localStorage.setItem(ATTEMPT_STORAGE_KEY, result.data.attemptId);
      await loadAttempt(result.data.attemptId, revision);
    } else setStatus(result.errors[0] || "Unable to start diagnostic.");
    setBusy(false);
  }

  async function submit() {
    if (!attempt || !question || !selectedChoice) return;
    setBusy(true);
    const responseTimeMs = questionStartedAt.current ? Math.max(0, Date.now() - questionStartedAt.current) : 0;
    const result = await submitDiagnosticResponse(attempt.attemptId, question.id, { type: "CHOICE_ID", choiceId: selectedChoice }, responseTimeMs, crypto.randomUUID());
    if (result.success) {
      setSelectedChoice("");
      questionStartedAt.current = null;
      await loadAttempt(attempt.attemptId, revision!);
    } else setStatus(result.errors[0] || "Unable to save response.");
    setBusy(false);
  }

  return (
    <section className="mx-auto max-w-3xl rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
      <div className="flex items-center gap-3"><ClipboardCheck className="h-5 w-5 text-sky-400" /><div><p className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Persistent student assessment</p><h2 className="mt-1 text-xl font-bold text-white">{curriculumName} diagnostic</h2></div></div>
      {status && <p className="mt-4 text-sm text-neutral-300">{status}</p>}
      {!attempt && revision && <button onClick={begin} disabled={busy} className="mt-5 flex items-center gap-2 rounded-lg bg-sky-400 px-4 py-2.5 text-sm font-bold text-neutral-950 disabled:opacity-50">{busy && <Loader2 className="h-4 w-4 animate-spin" />} Begin diagnostic</button>}
      {question && <div className="mt-5"><p className="text-xs text-neutral-500">Question {(attempt?.currentQuestionIndex ?? 0) + 1}</p><h3 className="mt-2 text-lg font-semibold text-white">{question.promptText}</h3><div className="mt-4 grid gap-2">{(question.answerConfig.choices || []).map((choice) => <button key={choice.id} onClick={() => setSelectedChoice(choice.id)} className={`rounded-lg border px-4 py-3 text-left text-sm ${selectedChoice === choice.id ? "border-sky-400 bg-sky-400/10 text-sky-200" : "border-neutral-700 bg-neutral-900 text-neutral-300"}`}>{choice.id}. {choice.text}</button>)}</div><button onClick={submit} disabled={busy || !selectedChoice} className="mt-5 flex items-center gap-2 rounded-lg bg-sky-400 px-4 py-2.5 text-sm font-bold text-neutral-950 disabled:opacity-50">{busy && <Loader2 className="h-4 w-4 animate-spin" />} Save answer</button></div>}
      {attempt?.status === "COMPLETED" && <div className="mt-5 flex items-center gap-2 text-sm text-emerald-300"><CheckCircle2 className="h-5 w-5" /> Evidence recorded successfully.</div>}
    </section>
  );
}