import type { EduCarouselConfig } from "../../components/carousel/CarouselTypes";
import type { QuestionInstance } from "../../contracts/question-content";
import { lessonCatalog as catalog0580, lessonCarouselsByLessonId as carousels0580 } from "../../curriculum-packages/0580/lessons";
import { sampleLessonCarousels as sampleCarousels0580 } from "../../curriculum-packages/0580/carousel-lessons";
import { readinessQuestionBank as bank0580 } from "../../curriculum-packages/0580/question-bank";
import { aquaticEcosystemCarousel } from "../../curriculum-packages/egypt-secondary1-integrated-science/ecosystem-carousel";
import { integratedScienceDiagnosticQuestions } from "../../curriculum-packages/egypt-secondary1-integrated-science/question-bank";
import { boyleCharlesCarousel } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/boyle-charles-carousel";
import { lesson11VelocityCarousel } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/lesson-1-1-velocity-carousel";
import { lesson12HorizontalProjectileCarousel } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/lesson-1-2-horizontal-projectile-carousel";
import { lesson13AngledProjectileCarousel } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/lesson-1-3-angled-projectile-carousel";
import { lesson14MomentCarousel } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/lesson-1-4-moment-carousel";
import { lesson15EquilibriumCarousel } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/lesson-1-5-equilibrium-carousel";
import { lesson16PowerCarousel } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/lesson-1-6-power-efficiency-carousel";
import { lesson17MomentumImpulseCarousel } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/lesson-1-7-momentum-impulse-carousel";
import { lesson18ConservationMomentumCarousel } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/lesson-1-8-conservation-momentum-carousel";
import { lesson19MomentumEnergyCarousel } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/lesson-1-9-momentum-energy-carousel";
import { lesson110CircularCarousel } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/lesson-1-10-circular-motion-carousel";
import { lesson111CircularHVCarousel } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/lesson-1-11-circular-horizontal-vertical-carousel";
import { lesson112KeplerCarousel } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/lesson-1-12-kepler-gravitation-carousel";
import { dramaVocalCarousel } from "../../curriculum-packages/drama-201/vocal-carousel";


export type DynamicLessonStatus = "AVAILABLE" | "CONTENT_PENDING" | "PENDING";

export interface LessonEntry {
  lessonId: string;
  stageId: string;
  title: string;
  status: DynamicLessonStatus;
  carousel?: EduCarouselConfig;
}

export interface GenericQuestionItem {
  id: string;
  skillId: string;
  blueprintId: string;
  promptText: string;
  choices: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
    misconceptionId?: string;
  }>;
}

/**
 * Registry of lessons and carousels per curriculum package ID
 */
const dynamicLessonRegistry: Record<string, LessonEntry[]> = {
  "cambridge-igcse-0580": catalog0580,
  "egypt-secondary1-integrated-science": [
    {
      lessonId: "LES-EGYPT-S1-AQUATIC-01",
      stageId: "STAGE-EGYPT-S1-AQUATIC",
      title: "Aquatic Ecosystem: Observation to Evidence",
      status: "AVAILABLE",
      carousel: aquaticEcosystemCarousel
    }
  ],
  "egypt-baccalaureate-second-year-physics": [
    // ── PART 1 · Semester 1: Mechanics (Chapter 1) ──────────────────────
    {
      lessonId: "LES-PHYS-EB-MECH-1-1",
      stageId: "STAGE-EGYPT-BACCALAUREATE-S2-PHYSICS-SEM1",
      title: "Part 1 · 1-1  Velocity Vectors & Relative Velocity",
      status: "AVAILABLE",
      carousel: lesson11VelocityCarousel
    },
    {
      lessonId: "LES-PHYS-EB-MECH-1-2",
      stageId: "STAGE-EGYPT-BACCALAUREATE-S2-PHYSICS-SEM1",
      title: "Part 1 · 1-2  Horizontal Projectile Motion",
      status: "AVAILABLE",
      carousel: lesson12HorizontalProjectileCarousel
    },
    {
      lessonId: "LES-PHYS-EB-MECH-1-3",
      stageId: "STAGE-EGYPT-BACCALAUREATE-S2-PHYSICS-SEM1",
      title: "Part 1 · 1-3  Projectile Motion at an Angle",
      status: "AVAILABLE",
      carousel: lesson13AngledProjectileCarousel
    },
    {
      lessonId: "LES-PHYS-EB-MECH-1-4",
      stageId: "STAGE-EGYPT-BACCALAUREATE-S2-PHYSICS-SEM1",
      title: "Part 1 · 1-4  Moment of a Force",
      status: "AVAILABLE",
      carousel: lesson14MomentCarousel
    },
    {
      lessonId: "LES-PHYS-EB-MECH-1-5",
      stageId: "STAGE-EGYPT-BACCALAUREATE-S2-PHYSICS-SEM1",
      title: "Part 1 · 1-5  Equilibrium of Forces",
      status: "AVAILABLE",
      carousel: lesson15EquilibriumCarousel
    },
    {
      lessonId: "LES-PHYS-EB-MECH-1-6",
      stageId: "STAGE-EGYPT-BACCALAUREATE-S2-PHYSICS-SEM1",
      title: "Part 1 · 1-6  Power and Efficiency",
      status: "AVAILABLE",
      carousel: lesson16PowerCarousel
    },
    {
      lessonId: "LES-PHYS-EB-MECH-1-7",
      stageId: "STAGE-EGYPT-BACCALAUREATE-S2-PHYSICS-SEM1",
      title: "Part 1 · 1-7  Momentum and Impulse",
      status: "AVAILABLE",
      carousel: lesson17MomentumImpulseCarousel
    },
    {
      lessonId: "LES-PHYS-EB-MECH-1-8",
      stageId: "STAGE-EGYPT-BACCALAUREATE-S2-PHYSICS-SEM1",
      title: "Part 1 · 1-8  The Law of Conservation of Momentum",
      status: "AVAILABLE",
      carousel: lesson18ConservationMomentumCarousel
    },
    {
      lessonId: "LES-PHYS-EB-MECH-1-9",
      stageId: "STAGE-EGYPT-BACCALAUREATE-S2-PHYSICS-SEM1",
      title: "Part 1 · 1-9  Momentum and Mechanical Energy",
      status: "AVAILABLE",
      carousel: lesson19MomentumEnergyCarousel
    },
    {
      lessonId: "LES-PHYS-EB-MECH-1-10",
      stageId: "STAGE-EGYPT-BACCALAUREATE-S2-PHYSICS-SEM1",
      title: "Part 1 · 1-10  Uniform Circular Motion and Centripetal Force",
      status: "AVAILABLE",
      carousel: lesson110CircularCarousel
    },
    {
      lessonId: "LES-PHYS-EB-MECH-1-11",
      stageId: "STAGE-EGYPT-BACCALAUREATE-S2-PHYSICS-SEM1",
      title: "Part 1 · 1-11  Circular Motion: Horizontal and Vertical",
      status: "AVAILABLE",
      carousel: lesson111CircularHVCarousel
    },
    {
      lessonId: "LES-PHYS-EB-MECH-1-12",
      stageId: "STAGE-EGYPT-BACCALAUREATE-S2-PHYSICS-SEM1",
      title: "Part 1 · 1-12  Kepler's Laws and Universal Gravitation",
      status: "AVAILABLE",
      carousel: lesson112KeplerCarousel
    },
    // ── PART 2 · Semester 2: Gases, Electricity, Magnetism & Quantum ──────
    {
      lessonId: "LES-PHYS-EB-GAS-1-1",
      stageId: "STAGE-EGYPT-BACCALAUREATE-S2-PHYSICS-SEM2",
      title: "Part 2 · 1-1  Boyle-Charles's Law",
      status: "AVAILABLE",
      carousel: boyleCharlesCarousel
    },
    {
      lessonId: "LES-PHYS-EB-GAS-1-2",
      stageId: "STAGE-EGYPT-BACCALAUREATE-S2-PHYSICS-SEM2",
      title: "Part 2 · 1-2  Equation of State for an Ideal Gas",
      status: "CONTENT_PENDING"
    },
    {
      lessonId: "LES-PHYS-EB-ELEC-2-1",
      stageId: "STAGE-EGYPT-BACCALAUREATE-S2-PHYSICS-SEM2",
      title: "Part 2 · 2-1  Coulomb's Law and Electric Field",
      status: "CONTENT_PENDING"
    },
    {
      lessonId: "LES-PHYS-EB-ELEC-3-1",
      stageId: "STAGE-EGYPT-BACCALAUREATE-S2-PHYSICS-SEM2",
      title: "Part 2 · 3-1  Electric Current and Ohm's Law",
      status: "CONTENT_PENDING"
    },
    {
      lessonId: "LES-PHYS-EB-MAG-4-1",
      stageId: "STAGE-EGYPT-BACCALAUREATE-S2-PHYSICS-SEM2",
      title: "Part 2 · 4-1  Magnetic Force and Electromagnetic Induction",
      status: "CONTENT_PENDING"
    },
    {
      lessonId: "LES-PHYS-EB-QUANTUM-5-1",
      stageId: "STAGE-EGYPT-BACCALAUREATE-S2-PHYSICS-SEM2",
      title: "Part 2 · 5-1  Photoelectric Effect & Quantum Nature of Light",
      status: "CONTENT_PENDING"
    }
  ],
  "arts-drama-201": [
    {
      lessonId: "LES-DRAMA-VOCAL-01",
      stageId: "STAGE-DRAMA-VOCAL",
      title: "Vocal Projection and Resonance",
      status: "AVAILABLE",
      carousel: dramaVocalCarousel
    }
  ]
};

const dynamicCarouselRegistry: Record<string, Record<string, EduCarouselConfig>> = {
  "cambridge-igcse-0580": carousels0580,
  "egypt-secondary1-integrated-science": {
    "LES-EGYPT-S1-AQUATIC-01": aquaticEcosystemCarousel,
    "CAROUSEL-EGYPT-S1-AQUATIC-ECOSYSTEM-INTRO": aquaticEcosystemCarousel
  },
  "egypt-baccalaureate-second-year-physics": {
    "LES-PHYS-EB-MECH-1-1": lesson11VelocityCarousel,
    "CAROUSEL-PHYS-EB-MECH-1-1": lesson11VelocityCarousel,
    "LES-PHYS-EB-MECH-1-2": lesson12HorizontalProjectileCarousel,
    "CAROUSEL-PHYS-EB-MECH-1-2": lesson12HorizontalProjectileCarousel,
    "LES-PHYS-EB-MECH-1-3": lesson13AngledProjectileCarousel,
    "CAROUSEL-PHYS-EB-MECH-1-3": lesson13AngledProjectileCarousel,
    "LES-PHYS-EB-MECH-1-4": lesson14MomentCarousel,
    "CAROUSEL-PHYS-EB-MECH-1-4": lesson14MomentCarousel,
    "LES-PHYS-EB-MECH-1-5": lesson15EquilibriumCarousel,
    "CAROUSEL-PHYS-EB-MECH-1-5": lesson15EquilibriumCarousel,
    "LES-PHYS-EB-MECH-1-6": lesson16PowerCarousel,
    "CAROUSEL-PHYS-EB-MECH-1-6": lesson16PowerCarousel,
    "LES-PHYS-EB-MECH-1-7": lesson17MomentumImpulseCarousel,
    "CAROUSEL-PHYS-EB-MECH-1-7": lesson17MomentumImpulseCarousel,
    "LES-PHYS-EB-MECH-1-8": lesson18ConservationMomentumCarousel,
    "CAROUSEL-PHYS-EB-MECH-1-8": lesson18ConservationMomentumCarousel,
    "LES-PHYS-EB-MECH-1-9": lesson19MomentumEnergyCarousel,
    "CAROUSEL-PHYS-EB-MECH-1-9": lesson19MomentumEnergyCarousel,
    "LES-PHYS-EB-MECH-1-10": lesson110CircularCarousel,
    "CAROUSEL-PHYS-EB-MECH-1-10": lesson110CircularCarousel,
    "LES-PHYS-EB-MECH-1-11": lesson111CircularHVCarousel,
    "CAROUSEL-PHYS-EB-MECH-1-11": lesson111CircularHVCarousel,
    "LES-PHYS-EB-MECH-1-12": lesson112KeplerCarousel,
    "CAROUSEL-PHYS-EB-MECH-1-12": lesson112KeplerCarousel,
    "LES-PHYS-EB-GAS-1-1": boyleCharlesCarousel,
    "CAROUSEL-PHYS-EB-BOYLE-CHARLES": boyleCharlesCarousel
  },
  "arts-drama-201": {
    "LES-DRAMA-VOCAL-01": dramaVocalCarousel,
    "CAROUSEL-DRAMA-VOCAL": dramaVocalCarousel
  }
};

const dynamicQuestionBankRegistry: Record<string, GenericQuestionItem[]> = {
  "cambridge-igcse-0580": bank0580.map(q => ({
    id: q.id,
    skillId: q.skillId,
    blueprintId: q.blueprintId,
    promptText: q.promptText,
    choices: q.choices
  })),
  "egypt-secondary1-integrated-science": integratedScienceDiagnosticQuestions.map(q => ({
    id: q.id,
    skillId: q.skillId,
    blueprintId: q.blueprintId,
    promptText: q.promptText,
    choices: q.answerConfig.choices?.map(c => ({
      id: c.id,
      text: c.text,
      isCorrect: c.isCorrect,
      misconceptionId: c.misconceptionId
    })) || []
  })),
  "egypt-baccalaureate-second-year-physics": [
    {
      id: "QI-PHYS-EB-GAS-1-1-PREDICT",
      skillId: "SK-EGYPT-PHY-GAS-BOYLE-CHARLES",
      blueprintId: "QB-PHYS-EB-GAS-1-1",
      promptText: "A sealed bag of chips swells in an airplane at cruising altitude because cabin pressure is lower. When volume increases at constant temperature, what happens to internal gas pressure?",
      choices: [
        { id: "A", text: "Gas pressure falls proportionally as volume expands.", isCorrect: true },
        { id: "B", text: "Gas pressure rises because molecules move faster.", isCorrect: false, misconceptionId: "PHYS-PRESSURE-VOLUME-DIRECT" },
        { id: "C", text: "Gas pressure stays identical to ground level.", isCorrect: false }
      ]
    },
    {
      id: "QI-PHYS-EB-GAS-1-1-PISTON",
      skillId: "SK-EGYPT-PHY-GAS-BOYLE-CHARLES",
      blueprintId: "QB-PHYS-EB-GAS-1-1",
      promptText: "A vertical piston (mass m = 20 kg, area A = 0.01 m², g = 10 m/s²) floats in equilibrium over gas at 27 °C under p0 = 1.0 × 10⁵ Pa. What is total gas pressure and absolute temperature?",
      choices: [
        { id: "A", text: "p = 1.2 × 10⁵ Pa; T = 300 K", isCorrect: true },
        { id: "B", text: "p = 20,000 Pa; T = 27 K (missed atmospheric p0 & Kelvin conversion)", isCorrect: false, misconceptionId: "PHYS-GAUGE-VS-ABSOLUTE" },
        { id: "C", text: "p = 1.2 × 10⁵ Pa; T = 27 K (missed Kelvin conversion)", isCorrect: false, misconceptionId: "PHYS-TEMP-CELSIUS-KELVIN" }
      ]
    }
  ],
  "arts-drama-201": [
    {
      id: "QI-DRAMA-VOCAL-PROJ",
      skillId: "SK-DRAMA-VOCAL-PROJ",
      blueprintId: "QB-DRAMA-VOCAL",
      promptText: "When performing in a large theater with a high ceiling, what is the safest technique to project your voice without vocal strain?",
      choices: [
        { id: "A", text: "Use diaphragmatic breath support and resonators.", isCorrect: true },
        { id: "B", text: "Increase tension in the throat muscles to push volume.", isCorrect: false, misconceptionId: "DRAMA-VOCAL-STRAIN" },
        { id: "C", text: "Limit movement and projection to save vocal power.", isCorrect: false }
      ]
    },
    {
      id: "QI-DRAMA-TEXT-ANALYSIS",
      skillId: "SK-DRAMA-TEXT-ANALYSIS",
      blueprintId: "QB-DRAMA-TEXT",
      promptText: "In a classical monologue, what does identifying the 'subtext' refer to?",
      choices: [
        { id: "A", text: "The unspoken thoughts, motives, and emotions beneath the text.", isCorrect: true },
        { id: "B", text: "The parenthetical stage directions detailing actor movements.", isCorrect: false },
        { id: "C", text: "The historical footnotes explaining archaic vocabulary.", isCorrect: false }
      ]
    }
  ]
};

export function getLessonCatalogForCurriculum(curriculumId: string): LessonEntry[] {
  return dynamicLessonRegistry[curriculumId] || [];
}

export function getLessonCarouselsForCurriculum(curriculumId: string): Record<string, EduCarouselConfig> {
  return dynamicCarouselRegistry[curriculumId] || {};
}

export function getQuestionBankForCurriculum(curriculumId: string): GenericQuestionItem[] {
  return dynamicQuestionBankRegistry[curriculumId] || [];
}

export function getSampleCarouselForSkill(curriculumId: string, skillId: string): EduCarouselConfig | undefined {
  if (curriculumId === "cambridge-igcse-0580") {
    return sampleCarousels0580[skillId];
  }
  if (curriculumId === "egypt-secondary1-integrated-science" && skillId === "SK-EGYPT-S1-AQUATIC-LIFE") {
    return aquaticEcosystemCarousel;
  }
  if (curriculumId === "egypt-baccalaureate-second-year-physics") {
    if (skillId === "SK-EGYPT-PHY-GAS-BOYLE-CHARLES" || skillId.includes("BOYLE")) {
      return boyleCharlesCarousel;
    }
    if (skillId === "SK-EGYPT-PHY-MECH-VELOCITY" || skillId.includes("VELOCITY")) {
      return lesson11VelocityCarousel;
    }
    if (skillId === "SK-EGYPT-PHY-MECH-PROJECTILES" || skillId.includes("PROJECTILE")) {
      // Default to horizontal, or angled based on match
      return skillId.includes("ANGLE") ? lesson13AngledProjectileCarousel : lesson12HorizontalProjectileCarousel;
    }
    if (skillId === "SK-EGYPT-PHY-MECH-FORCES" || skillId.includes("FORCE")) {
      // Default to moment, or equilibrium based on match
      return skillId.includes("EQUIL") ? lesson15EquilibriumCarousel : lesson14MomentCarousel;
    }
    if (skillId === "SK-EGYPT-PHY-MECH-POWER" || skillId.includes("POWER")) {
      return lesson16PowerCarousel;
    }
    if (skillId === "SK-EGYPT-PHY-MECH-MOMENTUM" || skillId.includes("MOMENTUM")) {
      return lesson17MomentumImpulseCarousel;
    }
    if (skillId === "SK-EGYPT-PHY-MECH-CIRCULAR" || skillId.includes("CIRCULAR")) {
      return lesson110CircularCarousel;
    }
    if (skillId === "SK-EGYPT-PHY-MECH-GRAVITATION" || skillId.includes("GRAV")) {
      return lesson112KeplerCarousel;
    }
  }
  if (curriculumId === "arts-drama-201" && skillId === "SK-DRAMA-VOCAL-PROJ") {
    return dramaVocalCarousel;
  }
  return undefined;
}
