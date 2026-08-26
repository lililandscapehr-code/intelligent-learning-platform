"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, Download, Eye, Plus, RotateCcw, Sparkles, Trash2, Upload } from "lucide-react";
import EducationalCarousel from "../carousel/EducationalCarousel";
import { applyStandardStepDefaults, validateLearningProcess } from "../carousel/CarouselValidation";
import {
  EduCarouselConfig,
  EduSlide,
  EvaluationSlide,
  LessonTextSlide,
  MCQChoice,
  QuestionMCQSlide
} from "../carousel/CarouselTypes";
import {
  approveContentDraftAction,
  createContentDraft,
  publishContentDraftAction,
} from "../../app/actions";

const starterDraft: EduCarouselConfig = {
  id: "DRAFT-LESSON-01",
  title: "New teacher lesson",
  skillId: "SK-PREREQ-ARITHMETIC",
  showProgressBar: true,
  showScoreTally: true,
  accessPolicy: {
    scope: "ALL_ENROLLED",
    minimumScorePercentage: 70,
    showCorrectAnswers: true,
    showMarks: true,
    trackTiming: true
  },
  slides: [
    {
      id: "draft-introduction",
      type: "lesson_text",
      title: "Lesson introduction",
      learningObjective: "Describe what students should be able to do.",
      body: "Write the explanation for your students here.",
      keyTerms: []
    }
  ]
};

function createSlide(type: "lesson_text" | "question_mcq" | "evaluation" | "youtube" | "image" | "video", index: number): EduSlide {
  if (type === "youtube") {
    return {
      id: `draft-video-${index}`,
      type,
      title: "Teacher-selected video",
      subtitle: "Watch, pause, and connect the demonstration to the lesson question.",
      caption: "Teacher-selected resource",
      youtubeUrl: "https://www.youtube.com/watch?v=",
      maxDuration: 600
    };
  }

  if (type === "image") {
    return { id: `draft-image-${index}`, type, title: "Teacher image", imageUrl: "", caption: "Add an image caption" };
  }

  if (type === "video") {
    return { id: `draft-video-${index}`, type, title: "Teacher video", videoUrl: "", caption: "Add a video caption" };
  }

  if (type === "question_mcq") {
    return {
      id: `draft-question-${index}`,
      type,
      title: "Practice question",
      questionText: "Write the question here.",
      points: 1,
      choices: [
        { id: "A", text: "Correct answer", isCorrect: true },
        { id: "B", text: "Distractor", isCorrect: false }
      ]
    };
  }

  if (type === "evaluation") {
    return {
      id: `draft-evaluation-${index}`,
      type,
      title: "Answer evaluation",
      questionRef: "draft-question-1",
      correctAnswerText: "Write the correct answer.",
      explanation: "Explain the solution step by step."
    };
  }

  return {
    id: `draft-explanation-${index}`,
    type,
    title: "New explanation",
    learningObjective: "Add a learning objective.",
    body: "Add lesson content here.",
    keyTerms: []
  };
}

function parseAiCarousel(answer: string): EduSlide[] | null {
  try {
    const jsonText = answer.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1] || answer.slice(answer.indexOf("{"), answer.lastIndexOf("}") + 1);
    const proposal = JSON.parse(jsonText);
    if (!Array.isArray(proposal.slides) || proposal.slides.length === 0) return null;
    const slides = proposal.slides.map((item: any, index: number) => {
      const type = item.type as EduSlide["type"];
      if (!["lesson_text", "youtube", "image", "video", "question_mcq", "evaluation"].includes(type)) return null;
      if (type === "lesson_text") return { id: `ai-slide-${Date.now()}-${index}`, type, title: String(item.title || "AI explanation"), learningObjective: String(item.learningObjective || ""), body: String(item.body || ""), keyTerms: Array.isArray(item.keyTerms) ? item.keyTerms.map(String) : [] } as LessonTextSlide;
      if (type === "youtube") return { id: `ai-slide-${Date.now()}-${index}`, type, title: String(item.title || "Teacher-reviewed video"), subtitle: String(item.subtitle || ""), caption: String(item.caption || ""), youtubeUrl: String(item.youtubeUrl || "") } as EduSlide;
      if (type === "image") return { id: `ai-slide-${Date.now()}-${index}`, type, title: String(item.title || "Teacher image"), caption: String(item.caption || ""), imageUrl: String(item.imageUrl || "") } as EduSlide;
      if (type === "video") return { id: `ai-slide-${Date.now()}-${index}`, type, title: String(item.title || "Teacher video"), caption: String(item.caption || ""), videoUrl: String(item.videoUrl || "") } as EduSlide;
      if (type === "question_mcq") return { id: `ai-slide-${Date.now()}-${index}`, type, title: String(item.title || "Practice question"), questionText: String(item.questionText || ""), points: Number(item.points || 1), choices: Array.isArray(item.choices) ? item.choices.map((choice: any, choiceIndex: number) => ({ id: String(choice.id || String.fromCharCode(65 + choiceIndex)), text: String(choice.text || ""), isCorrect: Boolean(choice.isCorrect), misconceptionId: choice.misconceptionId ? String(choice.misconceptionId) : undefined, explanation: choice.explanation ? String(choice.explanation) : undefined })) : [] } as QuestionMCQSlide;
      return { id: `ai-slide-${Date.now()}-${index}`, type: "evaluation", title: String(item.title || "Answer evaluation"), questionRef: String(item.questionRef || ""), correctAnswerText: String(item.correctAnswerText || ""), explanation: String(item.explanation || ""), misconceptionNote: item.misconceptionNote ? String(item.misconceptionNote) : undefined } as EvaluationSlide;
    });
    return slides.every(Boolean) ? slides : null;
  } catch {
    return null;
  }
}

export default function TeacherAuthoringStudio({ curriculumId = "cambridge-igcse-0580" }: { curriculumId?: string }) {
  const [draft, setDraft] = useState<EduCarouselConfig>(starterDraft);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [preview, setPreview] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiDecision, setAiDecision] = useState<"PENDING" | "ACCEPTED" | "MODIFY" | "MORE">("PENDING");
  const [aiBusy, setAiBusy] = useState(false);
  const [sourceBusy, setSourceBusy] = useState(false);
  const [sourceResult, setSourceResult] = useState("");
  const [capturePreview, setCapturePreview] = useState<string | null>(null);
  const [registryDraftId, setRegistryDraftId] = useState<string | null>(null);
  const [registryStatus, setRegistryStatus] = useState("Draft is local only until it is saved to the content registry.");
  const [registryBusy, setRegistryBusy] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const mediaUrls = useRef<string[]>([]);

  useEffect(() => () => {
    if (capturePreview) URL.revokeObjectURL(capturePreview);
    mediaUrls.current.forEach((url) => URL.revokeObjectURL(url));
  }, [capturePreview]);

  function captureSource(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (capturePreview) URL.revokeObjectURL(capturePreview);
    setCapturePreview(URL.createObjectURL(file));
    setSourceResult(`${file.name} captured. Analyzing image...`);
    const body = new FormData();
    body.append("image", file);
    fetch("/api/teacher/image-analysis", { method: "POST", body })
      .then(async (response) => response.json())
      .then((result) => setSourceResult(result.answer || result.error || "No image analysis was returned."))
      .catch(() => setSourceResult("Image analysis is unavailable. Continue authoring manually."));
  }

  async function analyzeSource(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setSourceBusy(true);
    setSourceResult(`Analyzing ${file.name}...`);
    try {
      const body = new FormData();
      body.append("document", file);
      const response = await fetch("/api/teacher/source-analysis", { method: "POST", body });
      const result = await response.json();
      setSourceResult(result.answer || result.error || "No analysis was returned.");
    } catch {
      setSourceResult("Source analysis is unavailable. Continue authoring manually.");
    } finally {
      setSourceBusy(false);
    }
  }

  const selectedSlide = draft.slides[selectedIndex];

  function updateSlide(update: Partial<EduSlide>) {
    setDraft((current) => ({
      ...current,
      slides: current.slides.map((slide, index) =>
        index === selectedIndex ? ({ ...slide, ...update } as EduSlide) : slide
      )
    }));
  }

  function updateChoice(index: number, update: Partial<MCQChoice>) {
    if (selectedSlide.type !== "question_mcq") return;
    const choices = selectedSlide.choices.map((choice, choiceIndex) =>
      choiceIndex === index ? { ...choice, ...update } : choice
    );
    updateSlide({ choices });
  }

  function addSlide(type: "lesson_text" | "question_mcq" | "evaluation" | "youtube" | "image" | "video") {
    setDraft((current) => ({
      ...current,
      slides: [...current.slides, createSlide(type, current.slides.length + 1)]
    }));
    setSelectedIndex(draft.slides.length);
  }

  function addMediaFromFile(type: "image" | "video", file?: File) {
    if (!file || (type === "image" && !file.type.startsWith("image/")) || (type === "video" && !file.type.startsWith("video/"))) return;
    const url = URL.createObjectURL(file);
    mediaUrls.current.push(url);
    const index = draft.slides.length;
    setDraft((current) => ({ ...current, slides: [...current.slides, { ...createSlide(type, index + 1), ...(type === "image" ? { imageUrl: url } : { videoUrl: url }) }] }));
    setSelectedIndex(index);
  }

  function removeSelectedSlide() {
    if (draft.slides.length === 1) return;
    setDraft((current) => ({ ...current, slides: current.slides.filter((_, index) => index !== selectedIndex) }));
    setSelectedIndex(Math.max(0, selectedIndex - 1));
  }

  function downloadDraft() {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${draft.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function askAi() {
    if (!aiPrompt.trim()) return;
    setAiBusy(true);
    setAiResult("");
    setAiDecision("PENDING");
    try {
      const response = await fetch("/api/ai/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `${aiPrompt}\n\nWhen I ask for a carousel, propose a complete sequence of typed slides. Return valid JSON only in this shape: {"slides":[{"type":"lesson_text|youtube|image|video|question_mcq|evaluation","title":"...","body":"...","learningObjective":"...","youtubeUrl":"...","imageUrl":"...","videoUrl":"...","questionText":"...","choices":[{"id":"A","text":"...","isCorrect":false,"explanation":"..."}],"questionRef":"...","correctAnswerText":"...","explanation":"..."}]}. Use only fields relevant to each type. Include explanation, practice, and evaluation when appropriate. Every URL must be reviewed by the teacher.`, draft })
      });
      const result = await response.json();
      setAiResult(result.answer || result.error || "The local AI helper did not return a suggestion.");
    } catch {
      setAiResult("AI helper is unavailable. The teacher can continue authoring offline without it.");
    } finally {
      setAiBusy(false);
    }
  }

  function acceptAiProposal() {
    if (!aiResult) return;
    const proposedSlides = parseAiCarousel(aiResult);
    setDraft((current) => applyStandardStepDefaults({
      ...current,
      slides: [...current.slides, ...(proposedSlides || [{
        id: `ai-proposal-${Date.now()}`,
        type: "lesson_text",
        title: "AI proposal - teacher edit required",
        learningObjective: "Convert the accepted recommendation into a verified lesson objective.",
        body: aiResult,
        keyTerms: []
      } as LessonTextSlide])]
    }));
    setSelectedIndex(draft.slides.length + (proposedSlides ? proposedSlides.length - 1 : 0));
    setAiDecision("ACCEPTED");
  }

  function requestAiChanges() {
    setAiPrompt(`Modify your previous carousel recommendation. Keep the useful parts, but change: ${aiPrompt || "add the teacher's requested improvements"}`);
    setAiDecision("MODIFY");
  }

  function askAiForMore() {
    setAiPrompt(`Ask one clarifying question and then improve your previous carousel recommendation. Teacher context: ${aiPrompt || "prepare this lesson for the current students"}`);
    setAiDecision("MORE");
  }

  async function saveDraftToRegistry(): Promise<string | null> {
    const preparedDraft = applyStandardStepDefaults(draft);
    setDraft(preparedDraft);
    const validation = validateLearningProcess(preparedDraft);
    if (!validation.valid) {
      setRegistryStatus(`Complete the learning process requirements: ${validation.errors.join(" ")}`);
      return null;
    }
    setRegistryBusy(true);
    setRegistryStatus("Saving draft into the curriculum registry...");
    try {
      const result = await createContentDraft(
        curriculumId,
        "LESSON",
        draft.title || "New teacher lesson",
        {
          ...preparedDraft,
          sourceAnalysis: sourceResult || null,
          capturedImage: capturePreview || null,
        },
        {
          kind: sourceResult ? "AI_ASSISTED" : "MANUAL",
          reference: sourceResult ? "source-analysis" : undefined,
          provenance: sourceResult ? "AI-assisted draft generated from captured material." : "Teacher-edited lesson draft.",
        }
      );

      if (!result.success || !result.data?.id) {
        setRegistryStatus(result.errors[0] || "Unable to save draft to the registry.");
        return null;
      }

      setRegistryDraftId(result.data.id);
      setRegistryStatus(`Saved to registry as ${result.data.id}. Waiting for approval.`);
      return result.data.id;
    } catch {
      setRegistryStatus("Registry save failed. The draft remains local only.");
      return null;
    } finally {
      setRegistryBusy(false);
    }
  }

  async function handleRegistryDecision(decision: "APPROVE" | "REJECT" | "REQUEST_CHANGES") {
    const id = registryDraftId ?? (await saveDraftToRegistry());
    if (!id) return;

    setRegistryBusy(true);
    setRegistryStatus(`Submitting ${decision.toLowerCase().replace("_", " ")} review...`);
    try {
      const result = await approveContentDraftAction(id, decision, reviewNote || undefined);
      if (!result.success) {
        setRegistryStatus(result.errors[0] || "Review decision was rejected by the registry.");
        return;
      }

      const decisionLabel = decision === "APPROVE" ? "approved" : decision === "REJECT" ? "rejected" : "returned for changes";
      setRegistryStatus(`Draft was ${decisionLabel}.`);
      setReviewNote("");
    } finally {
      setRegistryBusy(false);
    }
  }

  async function publishRegistryDraft() {
    const id = registryDraftId ?? (await saveDraftToRegistry());
    if (!id) return;

    setRegistryBusy(true);
    setRegistryStatus("Publishing approved content...");
    try {
      const result = await publishContentDraftAction(id);
      if (!result.success) {
        setRegistryStatus(result.errors[0] || "Draft could not be published.");
        return;
      }

      setRegistryStatus(`Published successfully as ${result.data?.id ?? id}.`);
    } finally {
      setRegistryBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Teacher Authoring Studio</h2>
          <p className="mt-1 text-sm text-neutral-400">Create, preview, and export a lesson draft. Publishing remains a separate approval step.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className={`flex cursor-pointer items-center gap-2 rounded-lg border border-amber-500/40 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/10 ${sourceBusy ? "pointer-events-none opacity-60" : ""}`}>
            <Upload className="h-4 w-4" /> {sourceBusy ? "Analyzing source..." : "Analyze PDF source"}
            <input type="file" accept="application/pdf,.pdf" className="sr-only" onChange={analyzeSource} disabled={sourceBusy} />
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-sky-500/40 px-3 py-2 text-xs font-bold text-sky-300 hover:bg-sky-500/10">
            <Camera className="h-4 w-4" /> Capture source
            <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={captureSource} />
          </label>
          <button onClick={() => setPreview((value) => !value)} className="flex items-center gap-2 rounded-lg bg-neutral-800 px-3 py-2 text-xs font-bold text-neutral-200 hover:bg-neutral-700">
            <Eye className="h-4 w-4" /> {preview ? "Edit draft" : "Student preview"}
          </button>
          <button onClick={downloadDraft} className="flex items-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-neutral-950 hover:bg-amber-400">
            <Download className="h-4 w-4" /> Export draft
          </button>
        </div>
      </div>

      {preview ? (
        <EducationalCarousel config={draft} viewerRole="TEACHER" />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)_300px]">
          <aside className="rounded-xl border border-neutral-800 bg-neutral-950 p-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">Lesson blocks</p>
            <div className="space-y-1">
              {draft.slides.map((slide, index) => (
                <button key={slide.id} onClick={() => setSelectedIndex(index)} className={`w-full rounded-lg px-3 py-2 text-left text-xs ${selectedIndex === index ? "bg-amber-500 text-neutral-950" : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800"}`}>
                  {index + 1}. {slide.title || slide.type}
                </button>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2">
              <button onClick={() => addSlide("lesson_text")} className="flex items-center gap-2 rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-300 hover:border-amber-500"><Plus className="h-3.5 w-3.5" /> Explanation</button>
              <button onClick={() => addSlide("youtube")} className="flex items-center gap-2 rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-300 hover:border-red-500"><Plus className="h-3.5 w-3.5" /> YouTube</button>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-300 hover:border-sky-500"><Upload className="h-3.5 w-3.5" /> Image<input type="file" accept="image/*" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; addMediaFromFile("image", file); }} /></label>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-300 hover:border-sky-500"><Upload className="h-3.5 w-3.5" /> Video<input type="file" accept="video/*" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; addMediaFromFile("video", file); }} /></label>
              <button onClick={() => addSlide("question_mcq")} className="flex items-center gap-2 rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-300 hover:border-amber-500"><Plus className="h-3.5 w-3.5" /> Question</button>
              <button onClick={() => addSlide("evaluation")} className="flex items-center gap-2 rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-300 hover:border-amber-500"><Plus className="h-3.5 w-3.5" /> Evaluation</button>
            </div>
          </aside>

          <section className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Draft content</p>
                <h3 className="mt-1 text-lg font-bold text-white">{selectedSlide.title || selectedSlide.type}</h3>
              </div>
              <button onClick={removeSelectedSlide} disabled={draft.slides.length === 1} className="rounded-lg p-2 text-neutral-500 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30" title="Remove block"><Trash2 className="h-4 w-4" /></button>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-semibold text-neutral-400">Block title<input value={selectedSlide.title || ""} onChange={(event) => updateSlide({ title: event.target.value })} className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-500" /></label>

              {selectedSlide.type === "lesson_text" && (
                <>
                  <label className="block text-xs font-semibold text-neutral-400">Learning objective<input value={selectedSlide.learningObjective || ""} onChange={(event) => updateSlide({ learningObjective: event.target.value })} className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-500" /></label>
                  <label className="block text-xs font-semibold text-neutral-400">Lesson explanation<textarea value={selectedSlide.body} onChange={(event) => updateSlide({ body: event.target.value })} rows={9} className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-500" /></label>
                </>
              )}

              {selectedSlide.type === "youtube" && (
                <>
                  <label className="block text-xs font-semibold text-neutral-400">YouTube URL<input value={selectedSlide.youtubeUrl} onChange={(event) => updateSlide({ youtubeUrl: event.target.value })} placeholder="https://www.youtube.com/watch?v=..." className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-red-500" /></label>
                  <label className="block text-xs font-semibold text-neutral-400">Video context<textarea value={selectedSlide.subtitle || ""} onChange={(event) => updateSlide({ subtitle: event.target.value })} rows={3} placeholder="What should students observe while watching?" className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-red-500" /></label>
                  <label className="block text-xs font-semibold text-neutral-400">Start at (seconds)<input type="number" min="0" value={selectedSlide.startAt || 0} onChange={(event) => updateSlide({ startAt: Number(event.target.value) || 0 })} className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white" /></label>
                  <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-5 text-neutral-400">Use a teacher-reviewed educational video. The teacher should verify the source, age suitability, accuracy, and availability before publishing.</p>
                </>
              )}

              {selectedSlide.type === "image" && <><label className="block text-xs font-semibold text-neutral-400">Image URL<input value={selectedSlide.imageUrl} onChange={(event) => updateSlide({ imageUrl: event.target.value })} placeholder="https://example.org/image.jpg" className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500" /></label><p className="text-xs text-neutral-500">Upload from the PC with Image, or paste a permitted web image URL.</p></>}

              {selectedSlide.type === "video" && <><label className="block text-xs font-semibold text-neutral-400">Video URL<input value={selectedSlide.videoUrl} onChange={(event) => updateSlide({ videoUrl: event.target.value })} placeholder="https://example.org/video.mp4" className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500" /></label><p className="text-xs text-neutral-500">Upload from the PC with Video, or paste a permitted web video URL.</p></>}

              {selectedSlide.type === "question_mcq" && (
                <>
                  <label className="block text-xs font-semibold text-neutral-400">Question<textarea value={selectedSlide.questionText} onChange={(event) => updateSlide({ questionText: event.target.value })} rows={4} className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-500" /></label>
                  <div className="space-y-2"><p className="text-xs font-semibold text-neutral-400">Answers</p>{selectedSlide.choices.map((choice, index) => <div key={choice.id} className="flex items-center gap-2"><span className="w-5 text-xs text-neutral-500">{choice.id}</span><input value={choice.text} onChange={(event) => updateChoice(index, { text: event.target.value })} className="min-w-0 flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white" /><label className="flex items-center gap-1 text-[10px] text-emerald-400"><input type="radio" name="correct-choice" checked={choice.isCorrect} onChange={() => updateSlide({ choices: selectedSlide.choices.map((item, itemIndex) => ({ ...item, isCorrect: itemIndex === index })) })} /> correct</label></div>)}</div>
                </>
              )}

              {selectedSlide.type === "evaluation" && (
                <>
                  <label className="block text-xs font-semibold text-neutral-400">Correct answer<input value={selectedSlide.correctAnswerText} onChange={(event) => updateSlide({ correctAnswerText: event.target.value })} className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white" /></label>
                  <label className="block text-xs font-semibold text-neutral-400">Explanation<textarea value={selectedSlide.explanation} onChange={(event) => updateSlide({ explanation: event.target.value })} rows={7} className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white" /></label>
                </>
              )}
            </div>
          </section>

          <aside className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
            {(() => { const validation = validateLearningProcess(draft); return <div className={`mb-5 rounded-xl border p-3 ${validation.valid ? "border-emerald-500/20 bg-emerald-500/5" : "border-amber-500/25 bg-amber-500/5"}`}><p className={`text-[10px] font-bold uppercase tracking-wider ${validation.valid ? "text-emerald-300" : "text-amber-300"}`}>{validation.valid ? "Learning process ready" : "Learning process review"}</p><p className="mt-2 text-xs leading-5 text-neutral-400">{validation.valid ? "This draft includes ordered steps, evidence, questions, and evaluation." : "Before saving: " + validation.errors.slice(0, 2).join(" ")}</p></div>; })()}
            {sourceResult && <div className="mb-5 max-h-72 overflow-y-auto whitespace-pre-wrap rounded-lg border border-sky-500/20 bg-sky-500/5 p-3 text-xs leading-5 text-neutral-300"><p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-sky-400">Source analysis draft</p>{capturePreview && <img src={capturePreview} alt="Captured source" className="mb-3 max-h-36 w-full rounded object-contain" />}{sourceResult}</div>}

            <div className="mb-5 rounded-xl border border-sky-500/20 bg-sky-500/5 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-sky-300">Student access and assessment</p>
              <label className="mt-3 block text-xs text-neutral-400">Who may open this carousel
                <select value={draft.accessPolicy?.scope || "ALL_ENROLLED"} onChange={(event) => setDraft((current) => ({ ...current, accessPolicy: { ...current.accessPolicy!, scope: event.target.value as "ALL_ENROLLED" | "SELECTED_STUDENTS" | "SELECTED_SUBSCRIPTION" } }))} className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white">
                  <option value="ALL_ENROLLED">All enrolled students</option>
                  <option value="SELECTED_STUDENTS">Selected students</option>
                  <option value="SELECTED_SUBSCRIPTION">Selected subscription</option>
                </select>
              </label>
              <label className="mt-3 block text-xs text-neutral-400">Minimum score for next step (%)
                <input type="number" min="0" max="100" value={draft.accessPolicy?.minimumScorePercentage ?? 70} onChange={(event) => setDraft((current) => ({ ...current, accessPolicy: { ...current.accessPolicy!, minimumScorePercentage: Number(event.target.value) } }))} className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white" />
              </label>
              {draft.accessPolicy?.scope === "SELECTED_STUDENTS" && <label className="mt-3 block text-xs text-neutral-400">Student IDs (comma separated)
                <input value={draft.accessPolicy.studentIds?.join(", ") || ""} onChange={(event) => setDraft((current) => ({ ...current, accessPolicy: { ...current.accessPolicy!, studentIds: event.target.value.split(",").map((value) => value.trim()).filter(Boolean) } }))} className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white" />
              </label>}
              {draft.accessPolicy?.scope === "SELECTED_SUBSCRIPTION" && <label className="mt-3 block text-xs text-neutral-400">Subscription IDs (comma separated)
                <input value={draft.accessPolicy.subscriptionIds?.join(", ") || ""} onChange={(event) => setDraft((current) => ({ ...current, accessPolicy: { ...current.accessPolicy!, subscriptionIds: event.target.value.split(",").map((value) => value.trim()).filter(Boolean) } }))} className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white" />
              </label>}
              <div className="mt-3 space-y-2 text-xs text-neutral-300">
                <label className="flex items-center gap-2"><input type="checkbox" checked={draft.accessPolicy?.showCorrectAnswers ?? true} onChange={(event) => setDraft((current) => ({ ...current, accessPolicy: { ...current.accessPolicy!, showCorrectAnswers: event.target.checked } }))} /> Reveal correct answer</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={draft.accessPolicy?.showMarks ?? true} onChange={(event) => setDraft((current) => ({ ...current, accessPolicy: { ...current.accessPolicy!, showMarks: event.target.checked } }))} /> Show marks</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={draft.accessPolicy?.trackTiming ?? true} onChange={(event) => setDraft((current) => ({ ...current, accessPolicy: { ...current.accessPolicy!, trackTiming: event.target.checked } }))} /> Track answer timing</label>
              </div>
              <p className="mt-3 text-[10px] leading-4 text-neutral-500">Only teachers and administrators prepare, upload, approve, and publish slides. Student access is granted by the selected policy.</p>
            </div>

            <div className="mb-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
              <div className="flex items-center gap-2 text-amber-300"><CheckCircle2 className="h-4 w-4" /><span className="text-[10px] font-bold uppercase tracking-wider">Content registry</span></div>
              <p className="mt-2 text-xs leading-5 text-neutral-300">{registryStatus}</p>
              {registryDraftId && <p className="mt-2 text-[10px] text-amber-200">Draft ID: {registryDraftId}</p>}

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button onClick={saveDraftToRegistry} disabled={registryBusy} className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-2 py-2 text-[10px] font-bold text-amber-200 hover:bg-amber-500/20 disabled:opacity-40">Save draft</button>
                <button onClick={() => handleRegistryDecision("APPROVE")} disabled={registryBusy} className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2 py-2 text-[10px] font-bold text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-40">Approve</button>
                <button onClick={() => handleRegistryDecision("REJECT")} disabled={registryBusy} className="rounded-lg border border-red-500/40 bg-red-500/10 px-2 py-2 text-[10px] font-bold text-red-200 hover:bg-red-500/20 disabled:opacity-40">Reject</button>
                <button onClick={publishRegistryDraft} disabled={registryBusy} className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-2 py-2 text-[10px] font-bold text-sky-200 hover:bg-sky-500/20 disabled:opacity-40">Publish</button>
              </div>

              <textarea value={reviewNote} onChange={(event) => setReviewNote(event.target.value)} rows={3} placeholder="Optional review note or change request..." className="mt-3 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white placeholder:text-neutral-600" />
              <button onClick={() => handleRegistryDecision("REQUEST_CHANGES")} disabled={registryBusy} className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-[10px] font-bold text-neutral-200 hover:border-amber-500 disabled:opacity-40"><RotateCcw className="h-3.5 w-3.5" /> Request changes</button>
            </div>

            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-400" /><h3 className="text-sm font-bold text-white">Optional AI helper</h3></div>
            <p className="mt-2 text-xs leading-5 text-neutral-500">Ask for a carousel proposal, student explanation, readiness check, or communication draft. The teacher decides what enters the editable draft.</p>
            <textarea value={aiPrompt} onChange={(event) => setAiPrompt(event.target.value)} placeholder="Prepare a carousel for Mechanics lesson 1-1 with a phenomenon, prediction, explanation, practice, and evaluation..." rows={5} className="mt-4 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white placeholder:text-neutral-600" />
            <button onClick={askAi} disabled={aiBusy || !aiPrompt.trim()} className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-800 px-3 py-2 text-xs font-bold text-neutral-200 hover:bg-neutral-700 disabled:opacity-40"><Sparkles className="h-3.5 w-3.5" /> {aiBusy ? "Consulting local AI..." : "Ask AI for suggestions"}</button>
            {aiResult && <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3"><div className="max-h-60 overflow-y-auto whitespace-pre-wrap text-xs leading-5 text-neutral-300">{aiResult}</div><div className="mt-4 grid grid-cols-3 gap-2 border-t border-amber-500/15 pt-3"><button type="button" onClick={acceptAiProposal} className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2 py-2 text-[10px] font-bold text-emerald-200">Accept into draft</button><button type="button" onClick={requestAiChanges} className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-2 py-2 text-[10px] font-bold text-amber-200">Modify</button><button type="button" onClick={askAiForMore} className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-2 py-2 text-[10px] font-bold text-sky-200">Ask for more</button></div>{aiDecision !== "PENDING" && <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400">Teacher decision: {aiDecision === "ACCEPTED" ? "accepted as editable draft" : aiDecision === "MODIFY" ? "changes requested" : "more detail requested"}</p>}</div>}
          </aside>
        </div>
      )}
    </div>
  );
}
