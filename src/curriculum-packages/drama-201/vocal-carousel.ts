import type { EduCarouselConfig } from "../../components/carousel/CarouselTypes";

export const dramaVocalCarousel: EduCarouselConfig = {
  id: "CAROUSEL-DRAMA-VOCAL",
  title: "Vocal Projection and Resonance",
  skillId: "SK-DRAMA-VOCAL-PROJ",
  showProgressBar: true,
  showScoreTally: true,
  allowSkipQuestions: false,
  sequenceMode: "SEQUENTIAL",
  processSteps: [
    {
      id: "drama-observe",
      title: "1. Observe & Predict",
      subtitle: "Vocal Projection",
      mission: "Predict the impact of theater size on projection",
      brief: "Observe how vocal waves bounce in large halls",
      studentOutcome: "Understand resonance areas",
      parentHint: "Student explores the physics of acting vocal projection",
      preparationStages: [],
      evaluationStages: [],
      successSignal: "Committed prediction",
      supportDecision: "Highlight the larynx analogy"
    }
  ],
  slides: [
    {
      id: "drama-vocal-intro",
      type: "lesson_text",
      title: "Lesson 1: Vocal Technique & Projection",
      subtitle: "Drama & Performance Studies",
      body: `### 🎭 Safe Vocal Projection
To project your voice without causing strain on your vocal cords:
1. **Engage the Diaphragm**: Power comes from deep abdominal support.
2. **Utilize Resonators**: Focus the sound in your chest, mouth, and nasal cavities.
3. **Open the Throat**: Relax the jaw and soft palate.`,
      keyTerms: ["Resonance", "Diaphragm", "Projection"],
      processStepId: "drama-observe",
      step: {
        purpose: "CONNECT",
        targetPoints: ["Understand diaphragmatic projection"],
        completionEvidence: ["Ready for practice"],
        advanceRule: "OPEN_NEXT"
      }
    },
    {
      id: "drama-vocal-q1",
      type: "question_mcq",
      title: "Vocal Projection Check",
      subtitle: "Resonance practice",
      questionText: "What is the primary source of power for projecting a voice safely to a large auditorium?",
      points: 1,
      choices: [
        { id: "A", text: "Steady diaphragmatic breath support and vocal resonance chambers.", isCorrect: true, explanation: "Correct!" },
        { id: "B", text: "Tensing the throat muscles to push air out faster.", isCorrect: false, misconceptionId: "DRAMA-VOCAL-STRAIN" }
      ],
      processStepId: "drama-observe",
      step: {
        purpose: "PRACTICE",
        targetPoints: ["Identify diaphragmatic breath support"],
        completionEvidence: ["Answered choice"],
        advanceRule: "SUPPORT_AND_RETRY",
        supportAction: "Remember: tensing the throat causes damage and limits volume.",
        timing: { expectedMs: 30000, fastThresholdMs: 10000, slowThresholdMs: 60000 }
      }
    }
  ]
};
