import { CurriculumPackage } from "../../contracts/curriculum";

export const curriculumDrama201: CurriculumPackage = {
  identity: {
    id: "arts-drama-201",
    name: "Drama & Performance Studies",
    publisher: "Arts & Humanities International"
  },
  version: {
    packageVersion: "1.0.0",
    curriculumVersion: "2026",
    status: "ACTIVE",
    effectiveDate: "2026-09-01T00:00:00.000Z",
    checksum: "drama-201-sha256-verified"
  },
  provenance: {
    sourceId: "AHI-DRAMA-SPEC-2026",
    title: "International Drama and Theatre Performance Framework",
    sourceVersion: "v1.2"
  },
  approvalStatus: "EDUCATOR_APPROVED",
  capabilities: {
    stem: "NOT_SUPPORTED",
    educationalServices: ["DIAGNOSTIC", "PORTFOLIO_REVIEW", "PRACTICAL_ASSESSMENT", "PEER_REVIEW"],
    aiCapabilities: ["AUDIO_TRANSCRIPTION", "PERFORMANCE_FEEDBACK"],
    examinationRequirements: {
      hasWrittenExam: false,
      hasPracticalExam: true,
      hasProjectComponent: true,
      hasCoursework: true
    }
  },
  topics: [
    {
      id: "TOPIC-DRAMA-FOUNDATIONS",
      name: "Physical & Vocal Foundations",
      subtopics: [
        {
          id: "SUB-VOCAL-TECH",
          name: "Vocal Technique & Breath Control",
          skillIds: ["SK-DRAMA-VOCAL-PROJ"]
        },
        {
          id: "SUB-PHYSICAL-THEATRE",
          name: "Movement & Stage Awareness",
          skillIds: ["SK-DRAMA-PHYS-EXPR"]
        }
      ]
    },
    {
      id: "TOPIC-DRAMA-PERFORMANCE",
      name: "Solo & Classical Repertoire",
      subtopics: [
        {
          id: "SUB-TEXT-ANALYSIS",
          name: "Classical Script Analysis",
          skillIds: ["SK-DRAMA-TEXT-ANALYSIS"]
        },
        {
          id: "SUB-MONOLOGUE-DELIVERY",
          name: "Monologue Characterization",
          skillIds: ["SK-DRAMA-MONOLOGUE"]
        }
      ]
    }
  ],
  skills: [
    {
      id: "SK-DRAMA-VOCAL-PROJ",
      name: "Vocal Projection and Articulation",
      learningObjectives: ["Project vocal resonance in large theatre spaces without straining."],
      relations: [],
      timingExpectation: {
        trackingType: "DEADLINE_DAYS",
        expectedDuration: 7
      }
    },
    {
      id: "SK-DRAMA-PHYS-EXPR",
      name: "Physical Expression and Spatial Blocking",
      learningObjectives: ["Demonstrate spatial awareness and intentional body language on stage."],
      relations: [],
      timingExpectation: {
        trackingType: "DEADLINE_DAYS",
        expectedDuration: 7
      }
    },
    {
      id: "SK-DRAMA-TEXT-ANALYSIS",
      name: "Dramatic Text & Subtext Interpretation",
      learningObjectives: ["Extract subtext, beats, and motivations from classical drama scripts."],
      relations: [],
      timingExpectation: {
        trackingType: "DEADLINE_DAYS",
        expectedDuration: 5
      }
    },
    {
      id: "SK-DRAMA-MONOLOGUE",
      name: "Solo Classical Monologue Performance",
      learningObjectives: ["Deliver a 3-minute solo performance integrating vocal clarity, physical blocking, and subtext."],
      relations: [
        {
          targetSkillId: "SK-DRAMA-VOCAL-PROJ",
          relationType: "PREREQUISITE"
        },
        {
          targetSkillId: "SK-DRAMA-TEXT-ANALYSIS",
          relationType: "PREREQUISITE"
        }
      ],
      timingExpectation: {
        trackingType: "DEADLINE_DAYS",
        expectedDuration: 14
      }
    }
  ],
  stages: [
    {
      id: "STAGE-DRAMA-1",
      name: "Stage 1: Foundation Voice and Movement",
      sequence: 1,
      objectives: ["Establish fundamental vocal projection and physical stage presence."],
      includedSkills: ["SK-DRAMA-VOCAL-PROJ", "SK-DRAMA-PHYS-EXPR"],
      prerequisiteRequirements: [],
      lessons: ["LES-DRAMA-VOICE-01", "LES-DRAMA-BODY-01"],
      assessments: ["ASSESS-DRAMA-PRAC-1"],
      masteryRequirements: {
        minimumSkillMasteryLevel: 3, // Competent
        requiredScorePercentage: 75,
        mustClearCriticalGaps: true
      },
      remediationRules: {
        maxAttempts: 3,
        interventionType: "PRACTICE",
        triggerSeverity: "HIGH"
      },
      progressionRules: {
        requireTeacherSignoff: true, // Requires drama educator evaluation
        autoUnlockNextStage: false
      },
      optionalExtensions: ["EXT-DRAMA-MIME"],
      stemOpportunities: []
    },
    {
      id: "STAGE-DRAMA-2",
      name: "Stage 2: Classical Performance & Monologue",
      sequence: 2,
      objectives: ["Synthesize text analysis, characterization, and vocal control into live solo performance."],
      includedSkills: ["SK-DRAMA-TEXT-ANALYSIS", "SK-DRAMA-MONOLOGUE"],
      prerequisiteRequirements: ["STAGE-DRAMA-1"],
      lessons: ["LES-DRAMA-SHAKESPEARE-01", "LES-DRAMA-MONOLOGUE-01"],
      assessments: ["ASSESS-DRAMA-SOLO-MONO"],
      masteryRequirements: {
        minimumSkillMasteryLevel: 4, // Accomplished
        requiredScorePercentage: 80,
        mustClearCriticalGaps: true
      },
      remediationRules: {
        maxAttempts: 2,
        interventionType: "RETEACH",
        triggerSeverity: "CRITICAL"
      },
      progressionRules: {
        requireTeacherSignoff: true,
        autoUnlockNextStage: true
      },
      optionalExtensions: ["EXT-DRAMA-ENSEMBLE"],
      stemOpportunities: []
    }
  ],
  assessmentBlueprints: [
    {
      id: "ASSESS-DRAMA-SOLO-MONO",
      type: "STAGE_MASTERY",
      purpose: "Formal 5-dimension rubric assessment of classical monologue performance.",
      questionBlueprints: [
        {
          id: "QB-MONOLOGUE-PERF",
          skillId: "SK-DRAMA-MONOLOGUE",
          type: "VIDEO_PORTFOLIO",
          difficulty: 4,
          expectedResponseType: "FILE",
          scoringModel: "RUBRIC_5_DIMENSION",
          timingExpectation: {
            trackingType: "DEADLINE_DAYS",
            expectedDuration: 14
          }
        }
      ]
    }
  ],
  masteryModel: {
    levels: [
      { value: 1, label: "Novice", isPassing: false, evidenceThreshold: 1, reassessmentDays: 7 },
      { value: 2, label: "Developing", isPassing: false, evidenceThreshold: 2, reassessmentDays: 14 },
      { value: 3, label: "Competent", isPassing: true, evidenceThreshold: 3, reassessmentDays: 30 },
      { value: 4, label: "Accomplished", isPassing: true, evidenceThreshold: 4, reassessmentDays: 60 },
      { value: 5, label: "Distinguished", isPassing: true, evidenceThreshold: 5, reassessmentDays: 90 }
    ]
  },
  gapModel: {
    categories: ["VOCAL_TECHNIQUE", "PHYSICAL_EXPRESSION", "TEXTUAL_ANALYSIS", "ENSEMBLE_AWARENESS"],
    severities: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
    confidenceLevels: ["LOW", "MEDIUM", "HIGH"]
  },
  rootCauseModel: {
    rules: [
      {
        rootCauseId: "GAP-ROOT-DRAMA-BREATH",
        description: "Insufficient diaphragmatic breath support leads to shallow vocal projection.",
        triggerGapIds: ["VOCAL_TECHNIQUE"],
        requiredEvidenceCount: 2,
        verificationMethod: "RECORDED_VOCAL_RANGE_DRILL"
      },
      {
        rootCauseId: "GAP-ROOT-DRAMA-SUBTEXT-MISREAD",
        description: "Superficial literal reading of text misses character underlying motivation.",
        triggerGapIds: ["TEXTUAL_ANALYSIS"],
        requiredEvidenceCount: 1,
        verificationMethod: "ANNOTATED_SCRIPT_SUBMISSION"
      }
    ]
  },
  reportingRequirements: {
    student: ["RUBRIC_RADAR_CHART", "PORTFOLIO_PROGRESSION"],
    parent: ["TERM_SUMMARY", "PERFORMANCE_RECORDING_LINKS"],
    teacher: ["RUBRIC_DIMENSION_BREAKDOWN", "AUDIO_ANALYSIS_HEATMAP"]
  }
};

export default curriculumDrama201;
