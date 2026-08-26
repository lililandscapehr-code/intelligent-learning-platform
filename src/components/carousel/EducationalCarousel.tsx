"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  EduSlide, EduCarouselConfig, SlideAnswerRecord,
  CarouselSessionResult, MCQChoice, CarouselEffortSummary, CarouselAccessPolicy, CarouselTimingStatus,
  MultiParameterDiagnosticReport
} from "./CarouselTypes";
import { generateMultiParameterDiagnosticReport } from "../../core/services/diagnostic-evaluator";
import { gameAudio } from "../../core/services/game-audio";
import { LessonTextSlideView } from "./slides/LessonSlide";
import { LessonImageSlideView } from "./slides/LessonSlide";
import { YouTubeSlideView } from "./slides/YouTubeSlide";
import { QuestionMCQSlideView } from "./slides/QuestionMCQSlide";
import { QuestionTextSlideView } from "./slides/QuestionTextSlide";
import { EvaluationSlideView } from "./slides/EvaluationSlide";
import { UploadZoneSlideView } from "./slides/UploadZoneSlide";
import { 
  Sparkles, 
  Flame, 
  Volume2, 
  VolumeX, 
  Zap, 
  HelpCircle, 
  Users, 
  Trophy, 
  Star, 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Lightbulb,
  Radio,
  BookOpen,
  Globe
} from "lucide-react";

interface Props {
  config: EduCarouselConfig;
  onComplete?: (result: CarouselSessionResult) => void;
  viewerRole?: "STUDENT" | "TEACHER" | "ADMIN";
  studentId?: string;
  subscriptionId?: string;
}

export default function EducationalCarousel({ config, onComplete, viewerRole = "STUDENT", studentId, subscriptionId }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [answers, setAnswers] = useState<SlideAnswerRecord[]>([]);
  const [answerFeedback, setAnswerFeedback] = useState<"correct" | "wrong" | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [highestOpenIndex, setHighestOpenIndex] = useState(0);
  const [needsSupport, setNeedsSupport] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // ── Game Show & Excitement State ─────────────────────────────
  const [gameScore, setGameScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [showCommentary, setShowCommentary] = useState<{ text: string; type: "combo" | "speed" | "first_try" | "misconception"; points: number } | null>(null);
  const [lifeline5050Used, setLifeline5050Used] = useState(false);
  const [lifelineClueUsed, setLifelineClueUsed] = useState(false);
  const [lifelineAudienceUsed, setLifelineAudienceUsed] = useState(false);
  const [activeClueModal, setActiveClueModal] = useState<string | null>(null);
  const [activeAudienceModal, setActiveAudienceModal] = useState<boolean>(false);
  const [eliminatedChoiceIds, setEliminatedChoiceIds] = useState<Set<string>>(new Set());

  const carouselStartedAt = useRef(Date.now());
  const slideStartTime = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const slide = config.slides[currentIndex];
  const total = config.slides.length;
  const processStep = config.processSteps?.find((process) => process.id === slide?.processStepId);
  const policy: CarouselAccessPolicy = config.accessPolicy || {
    scope: "ALL_ENROLLED",
    minimumScorePercentage: 70,
    showCorrectAnswers: true,
    showMarks: true,
    trackTiming: true
  };

  const canManageMedia = viewerRole === "TEACHER" || viewerRole === "ADMIN";
  const accessAllowed = canManageMedia
    || policy.scope === "ALL_ENROLLED"
    || (policy.scope === "SELECTED_STUDENTS" && !!studentId && policy.studentIds?.includes(studentId))
    || (policy.scope === "SELECTED_SUBSCRIPTION" && !!subscriptionId && policy.subscriptionIds?.includes(subscriptionId));

  const isInteractive = slide?.type === "question_mcq"
    || slide?.type === "question_text"
    || slide?.type === "question_numeric"
    || slide?.type === "upload_zone";

  const isAnswered = answers.some((a) => a.slideId === slide?.id);
  const isLocked = (isInteractive && !isAnswered && !config.allowSkipQuestions) || needsSupport;
  const isSequentiallyClosed = config.sequenceMode === "SEQUENTIAL" && currentIndex > highestOpenIndex;

  const questionSlides = config.slides.filter((s) =>
    s.type === "question_mcq" || s.type === "question_text" || s.type === "question_numeric"
  );
  const answeredCount = answers.length;
  const totalPoints = questionSlides.reduce((sum, s) => {
    if (s.type === "question_mcq") return sum + (s.points ?? 1);
    if (s.type === "question_text") return sum + (s.points ?? 1);
    if (s.type === "question_numeric") return sum + (s.points ?? 1);
    return sum;
  }, 0);
  const earnedPoints = answers.reduce((sum, a) => sum + (a.isCorrect ? a.points : 0), 0);

  // ── Auto-advance for non-interactive slides ──────────────────
  useEffect(() => {
    if (isComplete) return;
    if (!config.autoAdvanceMs) return;
    if (isInteractive || isPaused) return;

    slideStartTime.current = Date.now();
    setProgress(0);

    const interval = config.autoAdvanceMs;
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - slideStartTime.current;
      setProgress(Math.min((elapsed / interval) * 100, 100));
    }, 50);
    timerRef.current = setTimeout(() => {
      goToNext();
    }, interval);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [currentIndex, isPaused, isInteractive, isComplete]);

  // ── Per-slide question countdown timer ───────────────────────
  const [slideTimerSecondsLeft, setSlideTimerSecondsLeft] = useState<number | null>(null);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any previous timer
    if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    setSlideTimerSecondsLeft(null);

    const timerSecs = slide?.timerSeconds ?? 0;
    if (!timerSecs || timerSecs <= 0) return;
    if (!isInteractive) return;
    if (isAnswered) return;

    let remaining = timerSecs;
    setSlideTimerSecondsLeft(remaining);

    slideTimerRef.current = setInterval(() => {
      remaining -= 1;
      setSlideTimerSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(slideTimerRef.current!);
        setSlideTimerSecondsLeft(0);
        // Auto-advance past question when timer runs out
        goToNext();
      }
    }, 1000);

    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const toggleSound = () => {
    const muted = gameAudio.toggleMute();
    setIsMuted(muted);
    if (!muted) gameAudio.playClick();
  };

  const goToNext = useCallback(() => {
    if (isTransitioning || currentIndex >= total - 1) {
      if (currentIndex >= total - 1) finishCarousel();
      return;
    }
    gameAudio.playClick();
    setIsTransitioning(true);
    setAnswerFeedback(null);
    setShowCommentary(null);
    setEliminatedChoiceIds(new Set());
    setProgress(0);
    slideStartTime.current = Date.now();
    setHighestOpenIndex((index) => Math.max(index, currentIndex + 1));
    setTimeout(() => {
      setCurrentIndex((i) => i + 1);
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, currentIndex, total]);

  const goToPrev = useCallback(() => {
    if (isTransitioning || currentIndex <= 0) return;
    gameAudio.playClick();
    setIsTransitioning(true);
    setAnswerFeedback(null);
    setShowCommentary(null);
    setProgress(0);
    setTimeout(() => {
      setCurrentIndex((i) => i - 1);
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, currentIndex]);

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    gameAudio.playClick();
    setIsTransitioning(true);
    setAnswerFeedback(null);
    setShowCommentary(null);
    setProgress(0);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 300);
  };

  // ── Game Show Lifelines Handler ─────────────────────────────
  const use5050Lifeline = () => {
    if (lifeline5050Used || slide?.type !== "question_mcq") return;
    gameAudio.playPowerup();
    setLifeline5050Used(true);

    const mcq = slide as import("./CarouselTypes").QuestionMCQSlide;
    const incorrectChoices = mcq.choices.filter((c) => !c.isCorrect);
    if (incorrectChoices.length > 0) {
      const eliminateId = incorrectChoices[Math.floor(Math.random() * incorrectChoices.length)].id;
      setEliminatedChoiceIds(new Set([eliminateId]));
    }
  };

  const useClueLifeline = () => {
    if (lifelineClueUsed) return;
    gameAudio.playPowerup();
    setLifelineClueUsed(true);

    const clue = slide?.step?.supportAction 
      || "Formula Clue: Remember to convert Celsius to Kelvin (T [K] = θ [°C] + 273) and check p = p0 + mg/A.";
    setActiveClueModal(clue);
  };

  const useAudienceLifeline = () => {
    if (lifelineAudienceUsed) return;
    gameAudio.playPowerup();
    setLifelineAudienceUsed(true);
    setActiveAudienceModal(true);
  };

  // ── Real-Time Answer & Game Commentary Evaluator ────────────
  const handleAnswer = (record: SlideAnswerRecord) => {
    const timing = slide?.step?.timing;
    const isFast = record.responseTimeMs < (timing?.fastThresholdMs ?? (timing?.expectedMs || 45000) * 0.35);
    const isSlow = timing ? record.responseTimeMs > timing.slowThresholdMs : false;
    const timingStatus: CarouselTimingStatus = !timing ? "NOT_TRACKED" : isSlow ? "SLOW" : isFast ? "FAST" : "EXPECTED";

    const timedRecord = { ...record, timingStatus };
    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.slideId === timedRecord.slideId);
      if (existing >= 0) return prev;
      return [...prev, timedRecord];
    });

    setAnswerFeedback(timedRecord.isCorrect ? "correct" : "wrong");

    if (timedRecord.isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak((prev) => Math.max(prev, newStreak));

      // Calculate XP score with streak multiplier and speed bonus
      const multiplier = newStreak >= 3 ? 2.5 : newStreak >= 2 ? 1.8 : 1.0;
      const speedBonus = isFast ? 50 : 0;
      const earnedXP = Math.round(timedRecord.points * 100 * multiplier + speedBonus);
      setGameScore((prev) => prev + earnedXP);

      if (newStreak >= 2) {
        gameAudio.playStreak(newStreak);
        setShowCommentary({
          text: newStreak >= 3 ? `🔥 COMBO STREAK x${newStreak}! ON FIRE!` : `⚡ STREAK x${newStreak}!`,
          type: "combo",
          points: earnedXP
        });
      } else if (isFast) {
        gameAudio.playCorrect();
        setShowCommentary({
          text: `⚡ LIGHTNING SPEED SOLVE! (+${speedBonus} Speed Bonus)`,
          type: "speed",
          points: earnedXP
        });
      } else {
        gameAudio.playCorrect();
        setShowCommentary({
          text: `🎯 BULLSEYE! Concept Verified`,
          type: "first_try",
          points: earnedXP
        });
      }
    } else {
      gameAudio.playWrong();
      setStreak(0);
      setShowCommentary({
        text: `⚠ Misconception Flagged: Scaffolding Activated`,
        type: "misconception",
        points: 0
      });

      if (slide?.step?.advanceRule === "SUPPORT_AND_RETRY") {
        setNeedsSupport(true);
        return;
      }
    }

    // Auto-advance after 1.5s to let TV banner display
    setTimeout(() => {
      goToNext();
    }, 1500);
  };

  function retryCurrentStep() {
    gameAudio.playClick();
    setAnswers((current) => current.filter((answer) => answer.slideId !== slide?.id));
    setAnswerFeedback(null);
    setNeedsSupport(false);
    setShowCommentary(null);
    setRetryCount((current) => current + 1);
  }

  const finishCarousel = () => {
    setIsComplete(true);
    gameAudio.playVictory();

    const effortSummary: CarouselEffortSummary = {
      slidesCompleted: Math.min(total, Math.max(currentIndex + 1, highestOpenIndex + 1)),
      questionsAnswered: answers.length,
      retriesUsed: retryCount,
      evidenceActivities: config.slides.filter((item) => item.type === "upload_zone").length,
      activeTimeMs: Date.now() - carouselStartedAt.current,
      timingSignals: {
        fast: answers.filter((answer) => answer.timingStatus === "FAST").length,
        expected: answers.filter((answer) => answer.timingStatus === "EXPECTED").length,
        slow: answers.filter((answer) => answer.timingStatus === "SLOW").length
      }
    };

    const diagnosticReport = generateMultiParameterDiagnosticReport({
      studentId: studentId || "student@platform.com",
      curriculumName: config.title || "Curriculum Lesson",
      lessonTitle: config.title || "Inquiry Carousel",
      carouselId: config.id,
      slides: config.slides,
      answers,
      effort: effortSummary
    });

    if (onComplete) {
      const result: CarouselSessionResult = {
        carouselId: config.id,
        completedAt: new Date().toISOString(),
        answers,
        totalPoints,
        earnedPoints,
        scorePercentage: totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0,
        skillId: config.skillId,
        scoreLedger: questionSlides.map((question, index) => {
          const answer = answers.find((item) => item.slideId === question.id);
          const points = question.points ?? 1;
          return {
            slideId: question.id,
            sequenceNumber: question.sequenceNumber ?? index + 1,
            points,
            earnedPoints: answer?.isCorrect ? points : 0,
            isCorrect: answer?.isCorrect ?? false,
            timingStatus: answer?.timingStatus ?? "NOT_TRACKED"
          };
        }),
        effort: effortSummary,
        diagnosticReport
      };
      onComplete(result);
    }
  };

  if (!accessAllowed) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-neutral-950 p-8 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-300">Carousel Access Restricted</p>
        <h2 className="mt-2 text-xl font-bold text-white">This lesson is not assigned to you</h2>
        <p className="mt-2 text-sm text-neutral-400">Your teacher or administrator has limited this carousel to selected students or a subscription.</p>
      </div>
    );
  }

  if (isComplete) {
    const effortSummary: CarouselEffortSummary = {
      slidesCompleted: total,
      questionsAnswered: answers.length,
      retriesUsed: retryCount,
      evidenceActivities: config.slides.filter((item) => item.type === "upload_zone").length,
      activeTimeMs: Date.now() - carouselStartedAt.current,
      timingSignals: {
        fast: answers.filter((answer) => answer.timingStatus === "FAST").length,
        expected: answers.filter((answer) => answer.timingStatus === "EXPECTED").length,
        slow: answers.filter((answer) => answer.timingStatus === "SLOW").length
      }
    };

    const diagnosticReport = generateMultiParameterDiagnosticReport({
      studentId: studentId || "student@platform.com",
      curriculumName: config.title || "Curriculum Lesson",
      lessonTitle: config.title || "Inquiry Carousel",
      carouselId: config.id,
      slides: config.slides,
      answers,
      effort: effortSummary
    });

    return (
      <GameShowVictoryPanel
        gameScore={gameScore}
        bestStreak={bestStreak}
        earnedPoints={earnedPoints}
        totalPoints={totalPoints}
        answeredCount={answeredCount}
        totalQuestions={questionSlides.length}
        effort={effortSummary}
        policy={policy}
        diagnosticReport={diagnosticReport}
        onRestart={() => {
          setCurrentIndex(0);
          setAnswers([]);
          setIsComplete(false);
          setHighestOpenIndex(0);
          setRetryCount(0);
          setGameScore(0);
          setStreak(0);
          setLifeline5050Used(false);
          setLifelineClueUsed(false);
          setLifelineAudienceUsed(false);
          carouselStartedAt.current = Date.now();
          setAnswerFeedback(null);
          setProgress(0);
        }}
      />
    );
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-neutral-950 border-2 border-neutral-800 shadow-2xl relative">

      {/* ── TOP TV ARENA HUD (Points, Streak, Lifelines, Audio) ───────── */}
      <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border-b border-neutral-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Skill & Round */}
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-black text-xs text-amber-400">
            Ω
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                ROUND {currentIndex + 1}/{total}
              </span>
              {config.skillId && (
                <span className="text-[10px] font-mono text-neutral-400 hidden sm:inline">
                  {config.skillId}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Live XP & Streak Flame */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900 border border-amber-500/40 rounded-full shadow-inner">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-spin" />
            <span className="text-sm font-black text-amber-300 font-mono tracking-tight">{gameScore} XP</span>
          </div>

          {streak >= 2 && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-orange-600 to-amber-600 text-neutral-950 font-black text-xs rounded-full shadow-lg shadow-orange-500/30 animate-pulse">
              <Flame className="h-3.5 w-3.5 fill-current" />
              <span>{streak}x COMBO</span>
            </div>
          )}
        </div>

        {/* Right: Lifelines & Audio */}
        <div className="flex items-center gap-2">
          {/* Lifelines for MCQ */}
          {slide?.type === "question_mcq" && !isAnswered && (
            <div className="flex items-center gap-1.5 mr-2">
              <button
                onClick={use5050Lifeline}
                disabled={lifeline5050Used}
                title="50:50 Eliminator (Removes 1 Wrong Choice)"
                className={`px-2 py-1 rounded text-[10px] font-black tracking-wider transition ${
                  lifeline5050Used
                    ? "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                    : "bg-sky-500/20 border border-sky-500/40 text-sky-300 hover:bg-sky-500/30"
                }`}
              >
                50:50
              </button>
              <button
                onClick={useClueLifeline}
                disabled={lifelineClueUsed}
                title="Formula Clue"
                className={`p-1 rounded text-xs transition ${
                  lifelineClueUsed
                    ? "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                    : "bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30"
                }`}
              >
                <Lightbulb className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={useAudienceLifeline}
                disabled={lifelineAudienceUsed}
                title="Audience Prediction Poll"
                className={`p-1 rounded text-xs transition ${
                  lifelineAudienceUsed
                    ? "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                    : "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30"
                }`}
              >
                <Users className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-700 px-2 py-1 rounded-lg text-xs">
            <Globe className="h-3.5 w-3.5 text-emerald-400" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-transparent text-white text-xs outline-none cursor-pointer"
            >
              <option value="en" className="bg-neutral-950 text-white">English (Original)</option>
              <option value="ar" className="bg-neutral-950 text-white">العربية (Arabic)</option>
              <option value="fr" className="bg-neutral-950 text-white">Français (French)</option>
              <option value="de" className="bg-neutral-950 text-white">Deutsch (German)</option>
              <option value="es" className="bg-neutral-950 text-white">Español (Spanish)</option>
              <option value="tr" className="bg-neutral-950 text-white">Türkçe (Turkish)</option>
            </select>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white transition text-xs"
            title={isMuted ? "Unmute Sound Effects" : "Mute Sound Effects"}
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5 text-red-400" /> : <Volume2 className="h-3.5 w-3.5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* ── Dynamic Neon Progress Bar ────────────────────────── */}
      <div className="h-1 bg-neutral-900 relative overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-300 transition-all duration-300 shadow-lg shadow-amber-500/50"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>

      {/* ── Real-Time Game Show Commentary Toast Banner ───────── */}
      {showCommentary && (
        <div className={`px-5 py-2.5 flex items-center justify-between text-xs font-black animate-in slide-in-from-top-2 duration-300 ${
          showCommentary.type === "combo"
            ? "bg-gradient-to-r from-orange-600 to-amber-600 text-neutral-950"
            : showCommentary.type === "speed"
            ? "bg-gradient-to-r from-sky-600 to-teal-600 text-white"
            : showCommentary.type === "first_try"
            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
            : "bg-red-950/80 border-b border-red-500/30 text-red-300"
        }`}>
          <span className="flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            {showCommentary.text}
          </span>
          {showCommentary.points > 0 && (
            <span className="bg-neutral-950/30 px-2 py-0.5 rounded font-mono">
              +{showCommentary.points} XP
            </span>
          )}
        </div>
      )}

      {/* Step Context */}
      {slide?.step && (
        <div className="border-b border-neutral-800 bg-neutral-900/40 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">
              {slide.step.purpose} ARENA
            </span>
            <span className="text-neutral-400">·</span>
            <span className="text-neutral-300 font-medium">
              {slide.title || "Inquiry Step"}
            </span>
          </div>
          {slide.step.timing && (
            <span className="text-[10px] text-neutral-500 flex items-center gap-1">
              <Clock className="h-3 w-3" /> Target: {(slide.step.timing.expectedMs / 1000).toFixed(0)}s
            </span>
          )}
        </div>
      )}

      {/* Lifeline Clue Modal */}
      {activeClueModal && (
        <div className="p-4 bg-purple-950/40 border-b border-purple-500/30 text-xs text-purple-200 flex items-start justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
            <p>{activeClueModal}</p>
          </div>
          <button onClick={() => setActiveClueModal(null)} className="font-bold text-purple-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Lifeline Audience Prediction Poll */}
      {activeAudienceModal && (
        <div className="p-4 bg-emerald-950/40 border-b border-emerald-500/30 text-xs text-emerald-200 flex items-start justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-start gap-2">
            <Users className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Studio Audience Prediction Poll:</p>
              <p className="text-[11px] text-emerald-300/80 mt-0.5">84% of students chose Choice A (Inversely proportional: volume doubles → pressure halves).</p>
            </div>
          </div>
          <button onClick={() => setActiveAudienceModal(false)} className="font-bold text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Remediation Scaffolding Mode */}
      {needsSupport && slide?.step && (
        <div className="border-b border-amber-500/30 bg-amber-500/10 px-5 py-4 space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
            <HelpCircle className="h-4 w-4 text-amber-400" />
            Game Scaffolding Activated · Let's Repair the Concept
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {(slide.step.supportExamples || ["Check what variable is changing.", "Remember: p = p0 + mg/A.", "Always convert Celsius to Kelvin."]).map((example) => (
              <div key={example} className="rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-xs leading-5 text-neutral-300">
                {example}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={retryCurrentStep}
            className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition"
          >
            Retry Challenge Trial
          </button>
        </div>
      )}

      {/* ── Active Slide Stage ───────────────────────────────── */}
      <div
        className={`relative min-h-[320px] ${slide?.type === "question_mcq" ? "p-0" : "p-6"}`}
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? "translateY(8px)" : "translateY(0)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
        }}
      >
        {/* Per-slide countdown timer ring */}
        {slideTimerSecondsLeft !== null && slideTimerSecondsLeft > 0 && (
          <div className={`absolute right-4 top-4 z-20 flex h-12 w-12 items-center justify-center rounded-full border-4 ${
            slideTimerSecondsLeft <= 10 ? "border-red-500 bg-red-500/10" : "border-amber-500 bg-amber-500/10"
          }`}>
            <span className={`text-sm font-bold tabular-nums ${slideTimerSecondsLeft <= 10 ? "text-red-400" : "text-amber-400"}`}>
              {slideTimerSecondsLeft}
            </span>
          </div>
        )}
        {slideTimerSecondsLeft === 0 && (
          <div className="absolute right-4 top-4 z-20 flex h-12 w-12 items-center justify-center rounded-full border-4 border-red-500 bg-red-500/20">
            <Clock className="h-5 w-5 text-red-400" />
          </div>
        )}

        {slide?.type === "lesson_text" && <LessonTextSlideView slide={slide} />}
        {slide?.type === "lesson_image" && <LessonImageSlideView slide={slide} />}
        {slide?.type === "youtube" && <YouTubeSlideView slide={slide} />}
        {slide?.type === "question_mcq" && (
          <QuestionMCQSlideView 
            slide={{
              ...slide,
              choices: slide.choices.filter((c) => !eliminatedChoiceIds.has(c.id))
            }} 
            existingAnswer={answers.find((a) => a.slideId === slide.id)}
            onAnswer={handleAnswer} 
            startTime={slideStartTime.current}
            viewerRole={viewerRole}
          />
        )}
        {(slide?.type === "question_text" || slide?.type === "question_numeric") && (
          <QuestionTextSlideView
            slide={slide}
            existingAnswer={answers.find((a) => a.slideId === slide.id)}
            onAnswer={handleAnswer}
            startTime={slideStartTime.current}
            viewerRole={viewerRole}
            activeLanguage={selectedLanguage}
          />
        )}
        {slide?.type === "evaluation" && <EvaluationSlideView slide={slide} answers={answers} policy={policy} />}
        {slide?.type === "upload_zone" && <UploadZoneSlideView slide={slide} onUpload={() => goToNext()} />}
      </div>

      {/* ── Bottom Game Show Navigation Bar ─────────────────── */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-neutral-800 bg-neutral-950">
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0 || isTransitioning}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none transition"
        >
          ← Prev Round
        </button>

        {/* Round dots */}
        <div className="flex gap-1.5 items-center flex-wrap justify-center max-w-xs">
          {config.slides.map((s, i) => {
            const isQ = s.type === "question_mcq" || s.type === "question_text" || s.type === "question_numeric";
            const isAns = answers.some((a) => a.slideId === s.id);
            return (
              <button
                key={s.id}
                onClick={() => { if (config.sequenceMode !== "SEQUENTIAL" || i <= highestOpenIndex) goToSlide(i); }}
                disabled={config.sequenceMode === "SEQUENTIAL" && i > highestOpenIndex}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "bg-amber-500 w-4 h-2"
                    : isQ && isAns
                    ? "bg-emerald-500 w-2 h-2"
                    : isQ
                    ? "bg-amber-500/40 w-2 h-2"
                    : "bg-neutral-700 w-2 h-2 hover:bg-neutral-500"
                }`}
              />
            );
          })}
        </div>

        <button
          onClick={isLocked || isSequentiallyClosed ? undefined : (currentIndex >= total - 1 ? finishCarousel : goToNext)}
          disabled={isTransitioning}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition ${
            isLocked || isSequentiallyClosed
              ? "bg-neutral-800 text-neutral-600 cursor-not-allowed border border-neutral-700"
              : currentIndex >= total - 1
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:brightness-110"
              : "bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 shadow-lg shadow-amber-500/20 hover:brightness-110"
          }`}
        >
          {isLocked
            ? "Answer to Unlock"
            : currentIndex >= total - 1
            ? "Claim Victory 🏆"
            : "Next Round →"}
        </button>
      </div>
    </div>
  );
}

// ── Game Show Victory Podium Panel with Specialized Cognitive Report ──
function GameShowVictoryPanel({
  gameScore, bestStreak, earnedPoints, totalPoints, answeredCount, totalQuestions, effort, policy, diagnosticReport, onRestart
}: {
  gameScore: number; bestStreak: number; earnedPoints: number; totalPoints: number; answeredCount: number;
  totalQuestions: number; effort: CarouselEffortSummary; policy: CarouselAccessPolicy;
  diagnosticReport?: MultiParameterDiagnosticReport; onRestart: () => void;
}) {
  const pct = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const stars = pct >= 85 ? 3 : pct >= 65 ? 2 : 1;

  const rankTitle = pct >= 85 
    ? "🏆 Grandmaster Physicist" 
    : pct >= 65 
    ? "⭐ Master Investigator" 
    : "🌱 Rising Physics Scholar";

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-neutral-950 border-2 border-amber-500/30 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-500">
      {/* Victory Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((star) => (
            <Star 
              key={star} 
              className={`h-8 w-8 ${
                star <= stars 
                  ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]" 
                  : "text-neutral-700 fill-neutral-800"
              }`} 
            />
          ))}
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{rankTitle}</h2>
        <p className="text-xs text-neutral-400 font-medium">Inquiry Round Completed · {pct}% Mastery Score</p>
      </div>

      {/* Game Show Scoreboard Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-neutral-900 rounded-xl border border-amber-500/30 text-center">
          <p className="text-xs text-neutral-500 uppercase font-bold">Total Game XP</p>
          <p className="text-2xl font-black text-amber-400 font-mono mt-1">+{gameScore} XP</p>
        </div>

        <div className="p-4 bg-neutral-900 rounded-xl border border-orange-500/30 text-center">
          <p className="text-xs text-neutral-500 uppercase font-bold">Best Streak</p>
          <p className="text-2xl font-black text-orange-400 font-mono mt-1">{bestStreak}x COMBO</p>
        </div>

        <div className="p-4 bg-neutral-900 rounded-xl border border-emerald-500/30 text-center">
          <p className="text-xs text-neutral-500 uppercase font-bold">Items Solved</p>
          <p className="text-2xl font-black text-emerald-400 font-mono mt-1">{earnedPoints}/{totalPoints} Pts</p>
        </div>

        <div className="p-4 bg-neutral-900 rounded-xl border border-sky-500/30 text-center">
          <p className="text-xs text-neutral-500 uppercase font-bold">Active Time</p>
          <p className="text-2xl font-black text-sky-400 font-mono mt-1">{(effort.activeTimeMs / 1000).toFixed(0)}s</p>
        </div>
      </div>

      {/* Multi-Parameter Cognitive Performance Radar */}
      {diagnosticReport && (
        <div className="rounded-xl border border-amber-500/30 bg-neutral-900/90 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Certified Multi-Parameter Telemetry</p>
              <h3 className="text-sm font-bold text-white">Diagnostic & Cognitive Matrix</h3>
            </div>
            <span className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full font-semibold">
              {diagnosticReport.fluencyClassification.replace(/_/g, " ")}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">
              <span className="text-[10px] text-neutral-500 uppercase font-bold">Prerequisite Readiness</span>
              <p className="text-base font-black text-white mt-0.5">{diagnosticReport.parameters.prerequisiteReadiness}%</p>
              <div className="h-1 bg-neutral-800 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${diagnosticReport.parameters.prerequisiteReadiness}%` }} />
              </div>
            </div>

            <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">
              <span className="text-[10px] text-neutral-500 uppercase font-bold">Conceptual Depth</span>
              <p className="text-base font-black text-white mt-0.5">{diagnosticReport.parameters.conceptualDepth}%</p>
              <div className="h-1 bg-neutral-800 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-sky-500" style={{ width: `${diagnosticReport.parameters.conceptualDepth}%` }} />
              </div>
            </div>

            <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">
              <span className="text-[10px] text-neutral-500 uppercase font-bold">Mathematical Execution</span>
              <p className="text-base font-black text-white mt-0.5">{diagnosticReport.parameters.mathematicalExecution}%</p>
              <div className="h-1 bg-neutral-800 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${diagnosticReport.parameters.mathematicalExecution}%` }} />
              </div>
            </div>

            <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">
              <span className="text-[10px] text-neutral-500 uppercase font-bold">Inquiry & Prediction</span>
              <p className="text-base font-black text-white mt-0.5">{diagnosticReport.parameters.inquiryPrediction}%</p>
              <div className="h-1 bg-neutral-800 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: `${diagnosticReport.parameters.inquiryPrediction}%` }} />
              </div>
            </div>

            <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">
              <span className="text-[10px] text-neutral-500 uppercase font-bold">Real-World Transfer</span>
              <p className="text-base font-black text-white mt-0.5">{diagnosticReport.parameters.realWorldTransfer}%</p>
              <div className="h-1 bg-neutral-800 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-rose-500" style={{ width: `${diagnosticReport.parameters.realWorldTransfer}%` }} />
              </div>
            </div>

            <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">
              <span className="text-[10px] text-neutral-500 uppercase font-bold">Cognitive Fluency</span>
              <p className="text-base font-black text-white mt-0.5">{diagnosticReport.parameters.cognitiveFluency}%</p>
              <div className="h-1 bg-neutral-800 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-teal-500" style={{ width: `${diagnosticReport.parameters.cognitiveFluency}%` }} />
              </div>
            </div>
          </div>

          {/* Action Guidance */}
          <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-xs space-y-1">
            <p className="font-bold text-emerald-400">Action Guidance:</p>
            <p className="text-neutral-300">{diagnosticReport.parentSafeGuidance}</p>
          </div>
        </div>
      )}

      <button
        onClick={onRestart}
        className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 font-black rounded-xl hover:brightness-110 shadow-lg shadow-amber-500/20 transition uppercase tracking-wider text-xs"
      >
        Play Next Challenge Round 🎮
      </button>
    </div>
  );
}
