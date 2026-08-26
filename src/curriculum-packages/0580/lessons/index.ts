import { EduCarouselConfig } from "../../../components/carousel/CarouselTypes";
import { stages } from "../stages";
import { sampleLessonCarousels } from "../carousel-lessons";

export type LessonContentStatus = "AVAILABLE" | "CONTENT_PENDING";

export interface LessonCatalogEntry {
  lessonId: string;
  title: string;
  stageId: string;
  stageName: string;
  sequence: number;
  status: LessonContentStatus;
  carousel?: EduCarouselConfig;
}

const carouselByLessonId: Record<string, EduCarouselConfig> = {
  "LES-0580-S1-LCM-02": sampleLessonCarousels["SK-PREREQ-LCM"],
  "LES-0580-S1-FRAC-03": sampleLessonCarousels["SK-NUM-FRAC-ADD"]
};

const lessonTitles: Record<string, string> = {
  "LES-0580-S1-NUM-01": "Arithmetic and BIDMAS",
  "LES-0580-S1-LCM-02": "HCF and LCM",
  "LES-0580-S1-FRAC-03": "Fraction Arithmetic",
  "LES-0580-S1-ALG-04": "Linear Algebra Foundations",
  "LES-0580-S2-RATES-01": "Rates and Proportion",
  "LES-0580-S2-QUAD-02": "Quadratic Expansions",
  "LES-0580-S2-COORD-03": "Coordinate Geometry",
  "LES-0580-S3-SURDS-01": "Surds and Exact Form",
  "LES-0580-S3-QUAD-FORM-02": "The Quadratic Formula",
  "LES-0580-S3-FUNCTIONS-03": "Functions and Sequences",
  "LES-0580-S3-MENSURATION-04": "Mensuration",
  "LES-0580-S4-CIRCLES-01": "Circle Theorems",
  "LES-0580-S4-TRIG-02": "Trigonometry in 2D and 3D",
  "LES-0580-S4-VECTORS-03": "Vectors and Geometric Proofs",
  "LES-0580-S4-TRANSFORM-04": "Transformations",
  "LES-0580-S5-CALCULUS-01": "Differentiation and Rates of Change",
  "LES-0580-S5-PROBABILITY-02": "Probability and Distributions",
  "LES-0580-S5-STATISTICS-03": "Statistics and Data Analysis",
  "LES-0580-S5-EXAM-SYNTHESIS-04": "Exam Synthesis"
};

export const lessonCatalog: LessonCatalogEntry[] = stages
  .slice()
  .sort((first, second) => first.sequence - second.sequence)
  .flatMap((stage) => stage.lessons.map((lessonId, index) => ({
    lessonId,
    title: lessonTitles[lessonId] ?? lessonId,
    stageId: stage.id,
    stageName: stage.name,
    sequence: index + 1,
    status: carouselByLessonId[lessonId] ? "AVAILABLE" : "CONTENT_PENDING",
    carousel: carouselByLessonId[lessonId]
  })));

export const lessonCarouselsByLessonId = Object.fromEntries(
  lessonCatalog
    .filter((lesson) => lesson.carousel)
    .map((lesson) => [lesson.lessonId, lesson.carousel as EduCarouselConfig])
) as Record<string, EduCarouselConfig>;

export function getLessonsForStage(stageId: string): LessonCatalogEntry[] {
  return lessonCatalog.filter((lesson) => lesson.stageId === stageId);
}

export function getLessonById(lessonId: string): LessonCatalogEntry | undefined {
  return lessonCatalog.find((lesson) => lesson.lessonId === lessonId);
}
