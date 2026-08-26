export const curriculumPackageSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "CurriculumPackage",
  "type": "object",
  "required": [
    "identity", "version", "provenance", "approvalStatus",
    "capabilities", "topics", "skills", "stages",
    "assessmentBlueprints", "masteryModel", "gapModel",
    "rootCauseModel", "reportingRequirements"
  ],
  "properties": {
    "identity": {
      "type": "object",
      "required": ["id", "name", "publisher"],
      "properties": {
        "id": { "type": "string" },
        "name": { "type": "string" },
        "publisher": { "type": "string" }
      }
    },
    "version": {
      "type": "object",
      "required": ["packageVersion", "curriculumVersion", "status", "effectiveDate", "checksum"],
      "properties": {
        "packageVersion": { "type": "string" },
        "curriculumVersion": { "type": "string" },
        "status": { "enum": ["DRAFT", "REVIEW", "ACTIVE", "DEPRECATED", "ARCHIVED"] },
        "effectiveDate": { "type": "string", "format": "date-time" },
        "expiryDate": { "type": "string", "format": "date-time" },
        "predecessorVersion": { "type": "string" },
        "successorVersion": { "type": "string" },
        "changeSummary": { "type": "string" },
        "checksum": { "type": "string" }
      }
    },
    "provenance": {
      "type": "object",
      "required": ["sourceId", "title", "sourceVersion"],
      "properties": {
        "sourceId": { "type": "string" },
        "title": { "type": "string" },
        "sourceVersion": { "type": "string" },
        "locationUrl": { "type": "string" },
        "retrievedDate": { "type": "string", "format": "date-time" },
        "sectionReference": { "type": "string" }
      }
    },
    "approvalStatus": {
      "enum": ["AI_GENERATED_DRAFT", "TEACHER_CREATED", "UNDER_REVIEW", "EDUCATOR_APPROVED"]
    },
    "capabilities": {
      "type": "object",
      "required": ["stem", "educationalServices"],
      "properties": {
        "stem": { "enum": ["SUPPORTED", "OPTIONAL", "NOT_SUPPORTED"] },
        "educationalServices": {
          "type": "array",
          "items": { "type": "string" }
        },
        "aiCapabilities": {
          "type": "array",
          "items": { "type": "string" }
        },
        "examinationRequirements": {
          "type": "object",
          "properties": {
            "hasWrittenExam": { "type": "boolean" },
            "hasPracticalExam": { "type": "boolean" },
            "hasProjectComponent": { "type": "boolean" },
            "hasCoursework": { "type": "boolean" }
          }
        }
      }
    },
    "topics": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name"],
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "subtopics": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["id", "name", "skillIds"],
              "properties": {
                "id": { "type": "string" },
                "name": { "type": "string" },
                "skillIds": { "type": "array", "items": { "type": "string" } }
              }
            }
          }
        }
      }
    },
    "skills": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "learningObjectives", "relations"],
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "learningObjectives": { "type": "array", "items": { "type": "string" } },
          "relations": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["targetSkillId", "relationType"],
              "properties": {
                "targetSkillId": { "type": "string" },
                "relationType": { "enum": ["PREREQUISITE", "REINFORCES", "CO_REQUISITE"] }
              }
            }
          },
          "timingExpectation": { "$ref": "#/definitions/TimingExpectation" }
        }
      }
    },
    "stages": {
      "type": "array",
      "items": { "$ref": "#/definitions/Stage" }
    },
    "assessmentBlueprints": {
      "type": "array",
      "items": { "$ref": "#/definitions/AssessmentBlueprint" }
    },
    "masteryModel": { "$ref": "#/definitions/MasteryModel" },
    "gapModel": { "$ref": "#/definitions/GapModel" },
    "rootCauseModel": { "$ref": "#/definitions/RootCauseModel" },
    "reportingRequirements": { "$ref": "#/definitions/ReportingRequirements" },
    "extensions": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["namespace", "version", "data"],
        "properties": {
          "namespace": { "type": "string" },
          "version": { "type": "string" },
          "data": { "type": "object" }
        }
      }
    }
  },
  "definitions": {
    "TimingExpectation": {
      "type": "object",
      "required": ["trackingType"],
      "properties": {
        "trackingType": { "enum": ["SESSION_MS", "DEADLINE_DAYS", "NONE"] },
        "expectedDuration": { "type": "number" },
        "slowThreshold": { "type": "number" },
        "fastThreshold": { "type": "number" },
        "context": { "type": "string" },
        "unit": { "type": "string" }
      }
    },
    "Stage": {
      "type": "object",
      "required": ["id", "name", "sequence", "includedSkills", "masteryRequirements", "remediationRules", "progressionRules"],
      "properties": {
        "id": { "type": "string" },
        "name": { "type": "string" },
        "sequence": { "type": "integer" },
        "objectives": { "type": "array", "items": { "type": "string" } },
        "includedSkills": { "type": "array", "items": { "type": "string" } },
        "prerequisiteRequirements": { "type": "array", "items": { "type": "string" } },
        "lessons": { "type": "array", "items": { "type": "string" } },
        "assessments": { "type": "array", "items": { "type": "string" } },
        "masteryRequirements": {
          "type": "object",
          "required": ["minimumSkillMasteryLevel", "requiredScorePercentage", "mustClearCriticalGaps"],
          "properties": {
            "minimumSkillMasteryLevel": { "type": "integer" },
            "requiredScorePercentage": { "type": "number" },
            "mustClearCriticalGaps": { "type": "boolean" }
          }
        },
        "remediationRules": {
          "type": "object",
          "required": ["maxAttempts", "interventionType", "triggerSeverity"],
          "properties": {
            "maxAttempts": { "type": "integer" },
            "interventionType": { "enum": ["RETEACH", "PRACTICE", "PREREQUISITE_REVIEW", "TEACHER_REFERRAL"] },
            "triggerSeverity": { "enum": ["LOW", "MEDIUM", "HIGH", "CRITICAL"] }
          }
        },
        "progressionRules": {
          "type": "object",
          "required": ["requireTeacherSignoff", "autoUnlockNextStage"],
          "properties": {
            "requireTeacherSignoff": { "type": "boolean" },
            "autoUnlockNextStage": { "type": "boolean" }
          }
        },
        "optionalExtensions": { "type": "array", "items": { "type": "string" } },
        "stemOpportunities": { "type": "array", "items": { "type": "string" } }
      }
    },
    "QuestionBlueprint": {
      "type": "object",
      "required": ["id", "skillId", "type", "difficulty", "expectedResponseType", "scoringModel", "timingExpectation"],
      "properties": {
        "id": { "type": "string" },
        "skillId": { "type": "string" },
        "objectiveId": { "type": "string" },
        "type": { "type": "string" },
        "difficulty": { "type": "integer", "minimum": 1, "maximum": 5 },
        "cognitiveDemand": { "type": "string" },
        "expectedResponseType": { "type": "string" },
        "scoringModel": { "type": "string" },
        "timingExpectation": { "$ref": "#/definitions/TimingExpectation" },
        "prerequisiteEvidence": { "type": "array", "items": { "type": "string" } },
        "evidenceProduced": { "type": "array", "items": { "type": "string" } },
        "misconceptionMapping": { "type": "array", "items": { "type": "string" } },
        "validationRequirements": { "type": "array", "items": { "type": "string" } }
      }
    },
    "AssessmentBlueprint": {
      "type": "object",
      "required": ["id", "type", "purpose", "questionBlueprints"],
      "properties": {
        "id": { "type": "string" },
        "type": { "enum": ["READINESS", "DIAGNOSTIC", "CONTINUOUS", "RETENTION", "STAGE_MASTERY", "PROGRESS_REVIEW"] },
        "purpose": { "type": "string" },
        "eligibility": { "type": "string" },
        "skillsAssessed": { "type": "array", "items": { "type": "string" } },
        "questionBlueprints": { "type": "array", "items": { "$ref": "#/definitions/QuestionBlueprint" } },
        "timingRules": { "$ref": "#/definitions/TimingExpectation" },
        "progressionImplications": { "type": "object" }
      }
    },
    "MasteryModel": {
      "type": "object",
      "required": ["levels"],
      "properties": {
        "levels": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["value", "label", "isPassing"],
            "properties": {
              "value": { "type": "integer" },
              "label": { "type": "string" },
              "isPassing": { "type": "boolean" },
              "evidenceThreshold": { "type": "integer" },
              "reassessmentDays": { "type": "integer" }
            }
          }
        }
      }
    },
    "GapModel": {
      "type": "object",
      "required": ["categories", "severities", "confidenceLevels"],
      "properties": {
        "categories": { "type": "array", "items": { "type": "string" } },
        "severities": { "type": "array", "items": { "type": "string" } },
        "confidenceLevels": { "type": "array", "items": { "type": "string" } }
      }
    },
    "RootCauseModel": {
      "type": "object",
      "required": ["rules"],
      "properties": {
        "rules": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["rootCauseId", "triggerGapIds", "requiredEvidenceCount"],
            "properties": {
              "rootCauseId": { "type": "string" },
              "description": { "type": "string" },
              "triggerGapIds": { "type": "array", "items": { "type": "string" } },
              "requiredEvidenceCount": { "type": "integer" },
              "verificationMethod": { "type": "string" }
            }
          }
        }
      }
    },
    "ReportingRequirements": {
      "type": "object",
      "required": ["student", "parent", "teacher"],
      "properties": {
        "student": { "type": "array", "items": { "type": "string" } },
        "parent": { "type": "array", "items": { "type": "string" } },
        "teacher": { "type": "array", "items": { "type": "string" } }
      }
    }
  }
};
