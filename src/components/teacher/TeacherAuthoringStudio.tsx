"use client";

import { useMemo } from "react";
import CarouselStudio from "../carousel/editor/CarouselStudio";
import { getLessonCarouselsForCurriculum, getLessonCatalogForCurriculum } from "../../core/services/lesson-registry";
import type { CarouselLibraryEntry } from "../carousel/editor/CarouselEditorTypes";

interface TeacherAuthoringStudioProps {
  curriculumId?: string;
  viewerRole?: "TEACHER" | "ADMIN";
}

export default function TeacherAuthoringStudio({
  curriculumId = "cambridge-igcse-0580",
  viewerRole = "TEACHER",
}: TeacherAuthoringStudioProps) {
  // Build the library from the lesson registry so teachers can load and edit existing carousels
  const library = useMemo<CarouselLibraryEntry[]>(() => {
    const carousels = getLessonCarouselsForCurriculum(curriculumId);
    const catalog = getLessonCatalogForCurriculum(curriculumId);

    return Object.entries(carousels)
      .filter(([, carousel]) => carousel !== undefined)
      .map(([carouselId, carousel]) => {
        const lesson = catalog.find((l) => l.carousel?.id === carousel.id || l.lessonId === carouselId);
        return {
          carouselId,
          lessonId: lesson?.lessonId,
          lessonTitle: lesson?.title,
          curriculumId,
          label: carousel.title || carouselId,
          slideCount: carousel.slides.length,
          carousel,
        };
      });
  }, [curriculumId]);

  return (
    <CarouselStudio
      curriculumId={curriculumId}
      viewerRole={viewerRole}
      library={library}
    />
  );
}
