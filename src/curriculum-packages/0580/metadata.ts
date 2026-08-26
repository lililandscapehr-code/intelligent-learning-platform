export const metadata = {
  identity: {
    id: "cambridge-igcse-0580",
    name: "Cambridge IGCSE Mathematics 0580",
    publisher: "Cambridge Assessment International Education"
  },
  version: {
    packageVersion: "1.0.0",
    curriculumVersion: "2025-2027",
    status: "ACTIVE" as const,
    effectiveDate: "2025-01-01T00:00:00.000Z",
    checksum: "sha256-cambridge-0580-authoritative-v1"
  },
  provenance: {
    sourceId: "cambridge-igcse-0580-syllabus-2025-2027",
    title: "Cambridge IGCSE Mathematics 0580 Syllabus for examination in 2025, 2026 and 2027",
    sourceVersion: "v1.0",
    locationUrl: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-mathematics-0580/",
    retrievedDate: "2025-01-15T00:00:00.000Z",
    sectionReference: "Subject content sections 1 to 9 (Core and Extended)"
  },
  approvalStatus: "EDUCATOR_APPROVED" as const,
  capabilities: {
    stem: "SUPPORTED" as const,
    educationalServices: [
      "READINESS",
      "DIAGNOSTIC",
      "CONTINUOUS",
      "STAGE_MASTERY",
      "RETENTION",
      "STEM_INTEGRATION",
      "EXAM_PREPARATION"
    ],
    aiCapabilities: [
      "QUESTION_DRAFTING",
      "MISCONCEPTION_DETECTION",
      "STEP_BY_STEP_DERIVATION",
      "ADAPTIVE_PRACTICE"
    ],
    examinationRequirements: {
      hasWrittenExam: true,
      hasPracticalExam: false,
      hasProjectComponent: false,
      hasCoursework: false
    }
  }
};
