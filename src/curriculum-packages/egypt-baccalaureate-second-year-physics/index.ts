import type { CurriculumPackage } from "../../contracts/curriculum";
import { secondSecondaryPhysicsLearningProcess } from "./learning-process";

export const curriculumEgyptBaccalaureateSecondYearPhysics: CurriculumPackage = {
  identity: {
    id: "egypt-baccalaureate-second-year-physics",
    name: "Egyptian Baccalaureate Second Year Physics (English)",
    publisher: "Egyptian Ministry of Education and Technical Education"
  },
  version: {
    packageVersion: "0.1.0",
    curriculumVersion: "2026-2027",
    status: "REVIEW",
    effectiveDate: "2026-09-01T00:00:00.000Z",
    changeSummary: "Two-semester source package prepared from the supplied Physics Part 1 and Part 2 volumes. Chapter and unit structure is source-mapped; detailed lessons and assessments remain pending educator review.",
    checksum: "SOURCE-PARTS-8C63067F-827431C9"
  },
  provenance: {
    sourceId: "EGYPT-BACCALAUREATE-S2-PHYSICS-2026-2027",
    title: "Physics, Egyptian Baccalaureate Second Year, Parts 1 and 2",
    sourceVersion: "2026-2027",
    retrievedDate: "2026-08-25T00:00:00.000Z",
    sectionReference: "Part 1: first-semester volume; Part 2: second-term volume. Supplied files are retained separately in materials/."
  },
  approvalStatus: "UNDER_REVIEW",
  capabilities: {
    stem: "SUPPORTED",
    educationalServices: ["CURRICULUM_REFERENCE", "LESSON_PLANNING"],
    examinationRequirements: {
      hasWrittenExam: false,
      hasPracticalExam: false,
      hasProjectComponent: false,
      hasCoursework: false
    }
  },
  topics: [
    {
      id: "TOPIC-EGYPT-BACCALAUREATE-S2-PHYSICS-SEM1",
      name: "Chapter 1: Mechanics",
      subtopics: [
        { id: "SUB-EGYPT-BACCALAUREATE-S2-PHYSICS-VELOCITY", name: "Velocity vectors and relative velocity", skillIds: ["SK-EGYPT-PHY-MECH-VELOCITY"] },
        { id: "SUB-EGYPT-BACCALAUREATE-S2-PHYSICS-PROJECTILES", name: "Horizontal and angled projectile motion", skillIds: ["SK-EGYPT-PHY-MECH-PROJECTILES"] },
        { id: "SUB-EGYPT-BACCALAUREATE-S2-PHYSICS-FORCES", name: "Moment and equilibrium of forces", skillIds: ["SK-EGYPT-PHY-MECH-FORCES"] },
        { id: "SUB-EGYPT-BACCALAUREATE-S2-PHYSICS-ENERGY", name: "Power and efficiency", skillIds: ["SK-EGYPT-PHY-MECH-POWER"] },
        { id: "SUB-EGYPT-BACCALAUREATE-S2-PHYSICS-MOMENTUM", name: "Momentum, impulse, and conservation", skillIds: ["SK-EGYPT-PHY-MECH-MOMENTUM"] },
        { id: "SUB-EGYPT-BACCALAUREATE-S2-PHYSICS-CIRCULAR", name: "Uniform circular motion and centripetal force", skillIds: ["SK-EGYPT-PHY-MECH-CIRCULAR"] },
        { id: "SUB-EGYPT-BACCALAUREATE-S2-PHYSICS-GRAVITATION", name: "Kepler's Laws and universal gravitation", skillIds: ["SK-EGYPT-PHY-MECH-GRAVITATION"] }
      ]
    },
    {
      id: "TOPIC-EGYPT-BACCALAUREATE-S2-PHYSICS-SEM2",
      name: "Second semester Physics units",
      subtopics: [
        { id: "SUB-EGYPT-BACCALAUREATE-S2-PHYSICS-GASES-HEAT", name: "Unit 1: Gases and Heat", skillIds: [] },
        { id: "SUB-EGYPT-BACCALAUREATE-S2-PHYSICS-STATIC-ELECTRICITY", name: "Unit 2: Static Electricity", skillIds: [] },
        { id: "SUB-EGYPT-BACCALAUREATE-S2-PHYSICS-CIRCUITS", name: "Unit 3: Electric Current and Circuits", skillIds: [] },
        { id: "SUB-EGYPT-BACCALAUREATE-S2-PHYSICS-MAGNETISM", name: "Unit 4: Magnetism and Electromagnetic Induction", skillIds: [] },
        { id: "SUB-EGYPT-BACCALAUREATE-S2-PHYSICS-QUANTUM", name: "Unit 5: Quantum Nature of Light and Matter", skillIds: [] }
      ]
    }
  ],
  skills: [
    { id: "SK-EGYPT-PHY-MECH-VELOCITY", name: "Velocity vectors and relative velocity", learningObjectives: ["Combine velocity vectors and determine velocity relative to a moving observer."], relations: [] },
    { id: "SK-EGYPT-PHY-MECH-PROJECTILES", name: "Projectile motion", learningObjectives: ["Resolve projectile motion into independent components and determine flight time, range, speed, and maximum height."], relations: [] },
    { id: "SK-EGYPT-PHY-MECH-FORCES", name: "Moments and equilibrium of forces", learningObjectives: ["Calculate moments and resolve forces to analyse translational and rotational equilibrium."], relations: [] },
    { id: "SK-EGYPT-PHY-MECH-POWER", name: "Power and efficiency", learningObjectives: ["Relate work, energy transfer, power, and efficiency in physical systems."], relations: [] },
    { id: "SK-EGYPT-PHY-MECH-MOMENTUM", name: "Momentum and impulse", learningObjectives: ["Relate impulse to change in momentum and apply conservation of momentum to collisions and recoil."], relations: [] },
    { id: "SK-EGYPT-PHY-MECH-CIRCULAR", name: "Circular motion and centripetal force", learningObjectives: ["Relate speed, angular velocity, centripetal acceleration, and centripetal force in horizontal and vertical circular motion."], relations: [] },
    { id: "SK-EGYPT-PHY-MECH-GRAVITATION", name: "Kepler's laws and universal gravitation", learningObjectives: ["Use Kepler's laws and universal gravitation to describe orbital motion and planetary systems."], relations: [] },
    { id: "SK-EGYPT-PHY-GAS-BOYLE-CHARLES", name: "Boyle-Charles's Law and Piston Force Balance", learningObjectives: ["Relate pressure, volume, and absolute temperature (pV/T = constant) and calculate enclosed cylinder piston equilibrium (p = p0 + mg/A)."], relations: [] }
  ],
  stages: [
    {
      id: "STAGE-EGYPT-BACCALAUREATE-S2-PHYSICS-SEM1",
      name: "Semester 1: Mechanics, Oscillations & Waves",
      sequence: 1,
      objectives: ["Explain how motion is represented and predicted using vectors and component models.", "Analyse projectile, force, energy, momentum, and circular-motion systems using evidence and equations.", "Use the source-defined Observe, Predict, Measure, Name inquiry sequence in mechanics investigations."],
      includedSkills: ["SK-EGYPT-PHY-MECH-VELOCITY", "SK-EGYPT-PHY-MECH-PROJECTILES", "SK-EGYPT-PHY-MECH-FORCES", "SK-EGYPT-PHY-MECH-POWER", "SK-EGYPT-PHY-MECH-MOMENTUM", "SK-EGYPT-PHY-MECH-CIRCULAR", "SK-EGYPT-PHY-MECH-GRAVITATION"],
      prerequisiteRequirements: [],
      lessons: ["LES-PHYS-EB-MECH-1-1", "LES-PHYS-EB-MECH-1-2"],
      assessments: [],
      masteryRequirements: { minimumSkillMasteryLevel: 2, requiredScorePercentage: 70, mustClearCriticalGaps: true },
      remediationRules: { maxAttempts: 3, interventionType: "PRACTICE", triggerSeverity: "LOW" },
      progressionRules: { requireTeacherSignoff: true, autoUnlockNextStage: false },
      optionalExtensions: [],
      stemOpportunities: ["Physics investigation and modelling, after source review"]
    },
    {
      id: "STAGE-EGYPT-BACCALAUREATE-S2-PHYSICS-SEM2",
      name: "Semester 2: Gases, Electricity, Magnetism & Quantum",
      sequence: 2,
      objectives: ["Study the source-mapped units in Gases and Heat, Electricity, Magnetism, and Quantum Physics.", "Complete page, section, title, and lesson analysis for Physics Part 2."],
      includedSkills: ["SK-EGYPT-PHY-GAS-BOYLE-CHARLES"],
      prerequisiteRequirements: ["STAGE-EGYPT-BACCALAUREATE-S2-PHYSICS-SEM1"],
      lessons: ["LES-PHYS-EB-1-1", "LES-PHYS-EB-1-2"],
      assessments: [],
      masteryRequirements: { minimumSkillMasteryLevel: 2, requiredScorePercentage: 70, mustClearCriticalGaps: true },
      remediationRules: { maxAttempts: 3, interventionType: "PRACTICE", triggerSeverity: "LOW" },
      progressionRules: { requireTeacherSignoff: true, autoUnlockNextStage: false },
      optionalExtensions: [],
      stemOpportunities: ["Gas thermodynamics and particle quantum nature investigations"]
    }
  ],
  assessmentBlueprints: [],
  masteryModel: { levels: [{ value: 0, label: "Not assessed", isPassing: false }] },
  gapModel: { categories: ["NOT_YET_ASSESSED"], severities: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], confidenceLevels: ["LOW", "MEDIUM", "HIGH"] },
  rootCauseModel: { rules: [] },
  reportingRequirements: { student: ["SOURCE_MAPPED_TOPICS"], parent: [], teacher: ["SOURCE_PROVENANCE", "ASSESSMENT_NOT_YET_AVAILABLE"] },
  extensions: [{
    namespace: "source-parts",
    version: "1.0.0",
    data: {
      bookId: "EGYPT-BACCALAUREATE-S2-PHYSICS-2026-2027",
      parts: [
        { partId: "PART-1", semester: "FIRST", fileName: "Physics-En-EB-Part1.pdf", sha256: "8C63067FB1C4BDD869899CB8E3BFA877C3FFB02F074AB0D446CAD8CD6FF3B8E5", pageCount: 154 },
        { partId: "PART-2", semester: "SECOND", fileName: "Physics-En-EB-Part2.pdf", sha256: "827431C9C28A83B6D86299BF75712BA4BEC115F17E43DE9FD6A82E68ED4ED48E", pageCount: 157 }
      ],
      courseAnalysis: {
        part1: {
          title: "Space, time and motion",
          chapters: ["Chapter 1: Mechanics", "Chapter 2: Oscillations and Waves"],
          lessonCountFromContents: 23,
          priorityNeed: "Complete lesson-level skill, misconception, equation, and readiness mapping before publishing assessments."
        },
        part2: {
          title: "Particulate Nature of Matter, Fields, and Quantum Physics",
          units: ["Gases and Heat", "Static Electricity", "Electric Current and Circuits", "Magnetism and Electromagnetic Induction", "The Quantum Nature of Light and Matter"],
          lessonCountFromContents: 22,
          priorityNeed: "Extract every lesson objective, practical activity, worked-example pattern, and prerequisite relation."
        },
        requiredNextWork: [
          "Create a stable lesson ID for every contents entry and map it to its source part and page range.",
          "Author a short readiness diagnostic for algebra, graphs, vectors, trigonometry, units, and prerequisite physics.",
          "Add misconception-specific support lessons and retry checks rather than using score alone.",
          "Create continuous checks, chapter mastery checks, semester reviews, and a final readiness review.",
          "Add teacher dashboards for attendance, assignment review, intervention notes, and parent-safe progress summaries.",
          "Keep all source-derived questions under educator review and retain the original PDF checksums."
        ]
      },
      learningProcess: secondSecondaryPhysicsLearningProcess,
      carouselPlanTemplate: {
        title: "Physics inquiry lesson",
        subtitle: "Build the model from evidence",
        inquiryLoop: [...secondSecondaryPhysicsLearningProcess.inquiryLoop],
        inquiryCycle: [...secondSecondaryPhysicsLearningProcess.inquiryCycle],
        lessonBlocks: [...secondSecondaryPhysicsLearningProcess.lessonBlocks],
        sourceReferences: ["Physics Part 1 PDF, pages 4-7", "Physics Part 2 PDF, pages 4-6"]
      },
      chapterAnalysis: [
        {
          chapterId: "CHAPTER-1-MECHANICS",
          sourcePart: "PART-1",
          pdfPageStart: 7,
          pdfPageEnd: 81,
          title: "Mechanics",
          chapterQuestions: [
            "How can any motion be described and predicted?",
            "What do forces and momentum tell us about how motion changes?",
            "Why is the total energy of an isolated system conserved?"
          ],
          lessonSequence: [
            "1-1 Velocity Vectors and Relative Velocity",
            "1-2 Horizontal Projectile Motion",
            "1-3 Projectile Motion at an Angle",
            "1-4 Moment of a Force",
            "1-5 Equilibrium of Forces",
            "1-6 Power and Efficiency",
            "1-7 Momentum and Impulse",
            "1-8 The Law of Conservation of Momentum",
            "1-9 Momentum and Mechanical Energy",
            "1-10 Uniform Circular Motion and Centripetal Force",
            "1-11 Circular Motion: Horizontal and Vertical"
            , "1-12 Kepler's Laws and Universal Gravitation"
          ],
          recurringLessonPattern: ["Observe", "Predict", "Measure", "Name"],
          evidenceActivities: [
            "Draw and measure combined perpendicular motions.",
            "Compare horizontal projectile motion with vertical free fall.",
            "Use slow-motion observation to examine projectile components.",
            "Measure moments with a pivot and balanced loads.",
            "Measure force-extension changes as force directions vary.",
            "Measure power while climbing stairs.",
            "Test impulse and momentum during collisions.",
            "Observe recoil and momentum conservation.",
            "Compare momentum and kinetic energy in inelastic collisions.",
            "Test centripetal-force relationships and vertical circular motion."
          ],
          reviewNotes: [
            "This is a source map, not an approved lesson or assessment bank.",
            "Equation notation and numerical examples require teacher verification before publication.",
            "The source uses real-world Egyptian contexts including the Nile, transport, farming, and local infrastructure."
          ]
        }
      ],
      teachingStrategy: {
        purpose: [
          "Build a predictive model of motion rather than memorising equations.",
          "Connect vectors, forces, energy, and momentum as explanations of changing motion.",
          "Develop evidence habits: observe, predict, measure, model, calculate, and evaluate."
        ],
        simpleCommunicationRules: [
          "Start with one visible situation and one short question.",
          "Ask the student to predict before giving the formula.",
          "Use a drawing, arrows, units, and one worked example before symbolic rearrangement.",
          "Ask the student to explain what each number means and whether the answer is reasonable.",
          "Correct one misconception at a time and ask the student to try again."
        ],
        discussionPrompts: [
          "What do you observe, and what did you expect to observe?",
          "Which quantities have direction, and which are scalars?",
          "Which part of the motion is independent of the other part?",
          "What evidence would change your prediction?",
          "Where should the model stop being trusted, for example when air resistance matters?",
          "Can you explain the result without using the equation first?"
        ],
        readinessBeforeChapter: {
          durationMinutes: 15,
          mode: "LOW_STAKES_DIAGNOSTIC",
          skills: [
            "Read and convert SI units.",
            "Rearrange a one-step equation and substitute values with units.",
            "Use right-triangle geometry and basic sine, cosine, and tangent.",
            "Read position-time and velocity-time graphs.",
            "Distinguish distance from displacement and speed from velocity.",
            "Describe constant velocity and constant acceleration, including free fall."
          ],
          decisionRules: [
            "Do not block access on a single mistake; use the error to choose a short bridge.",
            "If vector or trigonometry items are weak, provide a visual bridge before projectile lessons.",
            "If units, algebra, or graph reading are weak, provide a foundation bridge before equation-heavy work.",
            "Repeat the same concept in a new context before increasing difficulty."
          ]
        },
        readinessDuringChapter: {
          beforeEachLesson: "One prediction question and one prerequisite retrieval question.",
          duringEachLesson: "One hinge question after the observation and one check after the worked example.",
          afterEachLesson: "One explanation, one calculation, and one reasonableness check.",
          masteryGate: "Require two independent pieces of evidence: a correct solution and a clear explanation or measured interpretation.",
          supportSignal: "Accuracy below 70 percent, a repeated misconception, or accurate work that is consistently slow."
        },
        simplifiedChapterRoute: [
          "1. Draw motion with arrows and identify the reference frame.",
          "2. Split two-dimensional motion into perpendicular components.",
          "3. Connect force and turning effect to balance and change.",
          "4. Connect work and energy transfer to power and efficiency.",
          "5. Use momentum before and after interactions to explain collisions and recoil.",
          "6. Explain circular motion as continuous inward acceleration, then test the model."
        ],
        onlineResources: [
          { title: "PhET Vector Addition", url: "https://phet.colorado.edu/en/simulations/vector-addition", use: "Visualise components, resultant vectors, and reference directions." },
          { title: "PhET Projectile Motion", url: "https://phet.colorado.edu/en/simulations/projectile-motion", use: "Explore launch angle, components, range, and air resistance." },
          { title: "PhET Collision Lab", url: "https://phet.colorado.edu/en/simulations/collision-lab", use: "Compare momentum and kinetic energy before and after collisions." },
          { title: "Khan Academy Two-Dimensional Motion", url: "https://www.khanacademy.org/science/physics/two-dimensional-motion", use: "Short guided explanations and practice for vectors and projectiles." },
          { title: "Khan Academy Linear Momentum", url: "https://www.khanacademy.org/science/physics/linear-momentum", use: "Reinforce impulse, momentum, and collisions." },
          { title: "OpenStax Physics", url: "https://openstax.org/details/books/physics", use: "Open textbook reference for teacher background and alternative explanations." }
        ],
        safetyAndGovernance: [
          "Use simulations or low-risk classroom demonstrations; never use unsafe projectiles or collision setups.",
          "Treat online material as supporting explanation, not as curriculum authority.",
          "Record student evidence and teacher judgement separately from AI suggestions.",
          "Keep chapter assessments disabled until questions are authored and educator-approved."
        ]
      }
    }
  }]
};

export const curriculumEgyptBaccalaureateSecondYearPhysicsPart1: CurriculumPackage = {
  ...curriculumEgyptBaccalaureateSecondYearPhysics,
  identity: {
    id: "egypt-baccalaureate-second-year-physics-part1",
    name: "Egyptian Baccalaureate 2nd Year Physics · Part 1 (Mechanics & Vectors)",
    publisher: "Egyptian Ministry of Education and Technical Education"
  },
  stages: [curriculumEgyptBaccalaureateSecondYearPhysics.stages[0]],
  topics: [curriculumEgyptBaccalaureateSecondYearPhysics.topics[0]],
};

export const curriculumEgyptBaccalaureateSecondYearPhysicsPart2: CurriculumPackage = {
  ...curriculumEgyptBaccalaureateSecondYearPhysics,
  identity: {
    id: "egypt-baccalaureate-second-year-physics-part2",
    name: "Egyptian Baccalaureate 2nd Year Physics · Part 2 (Gases, Electricity & Quantum)",
    publisher: "Egyptian Ministry of Education and Technical Education"
  },
  stages: [curriculumEgyptBaccalaureateSecondYearPhysics.stages[1]],
  topics: [curriculumEgyptBaccalaureateSecondYearPhysics.topics[1]],
};

export default curriculumEgyptBaccalaureateSecondYearPhysics;

