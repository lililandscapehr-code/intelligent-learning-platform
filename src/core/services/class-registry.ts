import type { QuestionDNA } from "../../components/carousel/CarouselTypes";
import { lesson11QuestionDNA } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-1-question-dna";
import { lesson12QuestionDNA } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-2-question-dna";
import { lesson13QuestionDNA } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-3-question-dna";
import { lesson14QuestionDNA } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-4-question-dna";
import { lesson15QuestionDNA } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-5-question-dna";
import { lesson16QuestionDNA } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-6-question-dna";
import { lesson17QuestionDNA } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-7-question-dna";
import { lesson18QuestionDNA } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-8-question-dna";
import { lesson19QuestionDNA } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-9-question-dna";
import { lesson110QuestionDNA } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-10-question-dna";
import { lesson111QuestionDNA } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-11-question-dna";
import { lesson112QuestionDNA } from "../../curriculum-packages/egypt-baccalaureate-second-year-physics/part1/question-dna/lesson-1-12-question-dna";

export type PackageScopeType = 
  | "FULL_PACKAGE"       // Complete curriculum package
  | "SEMESTER"           // Term 1 / Term 2
  | "CHAPTER_BUNDLE"     // Specific selected chapters
  | "LESSON_BUNDLE"      // Specific selected lessons
  | "LESSON_QUANTITY"    // Custom quota (e.g. 5 Lessons Pass)
  | "SINGLE_SESSION"     // Single Live Session / 1-on-1 Workshop
  | "CUSTOM_HYBRID";     // Custom mix

export interface ClassPackageScope {
  scopeType: PackageScopeType;
  semesterId?: "term1" | "term2" | "full";
  chapterNames?: string[];
  lessonIds?: string[];
  maxLessonCount?: number;
  includedLiveSessions?: number; // -1 for unlimited, 0 for none, N for specific allowance
}

export interface PricingTier {
  minStudents: number;
  maxStudents: number;
  pricePerStudent: number;
}

export interface PackageFinancials {
  pricingModel: "VOLUME_TIERED" | "FIXED_PER_STUDENT" | "FLAT_FEE";
  basePricePerStudent: number;
  tiers: PricingTier[];
  currency: string;
}

export interface ParentInfo {
  name: string;
  relationship: string;
  email: string;
  phone: string;
  preferredChannel: "EMAIL" | "SMS" | "WHATSAPP";
  verified: boolean;
}

export interface FollowUpRecord {
  id: string;
  studentId: string;
  createdAt: string;
  authorRole: "TEACHER" | "SYSTEM_DIAGNOSTIC" | "PARENT";
  authorName: string;
  category: "PARENT_NOTIFICATION" | "TEACHER_NOTE" | "ACADEMIC_WARNING" | "REMEDIAL_ASSIGNMENT" | "COMMENDATION";
  title: string;
  message: string;
  weaknessTargets?: string[];
  status: "SENT" | "READ_BY_PARENT" | "ACKNOWLEDGED";
}

export interface BillingTransaction {
  id: string;
  studentId: string;
  timestamp: string;
  type: "ENROLLMENT" | "PACKAGE_SWAP_DEBIT" | "PACKAGE_SWAP_CREDIT" | "UNENROLLMENT";
  className: string;
  packageName: string;
  amount: number; // Positive = cost added, Negative = credit/refund
  effectiveRateApplied: number;
  studentVolumeAtTime: number;
  description: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  status: "ACTIVE" | "SUSPENDED" | "GRADUATED";
  gradeLevel: string;
  avatarUrl?: string;
  attendanceRate: number;
  overallGrade: number;
  weaknesses: string[];
  parent: ParentInfo;
  enrolledClassIds: string[]; // Can be enrolled/tied to MULTIPLE classes/packages
  billingTransactions: BillingTransaction[];
  followUpLogs: FollowUpRecord[];
}

export interface LiveSession {
  id: string;
  classId: string;
  title: string;
  scheduledTime: string;
  meetingLink: string;
  platform: "google-meet" | "zoom" | "teams" | "custom";
  attachedCarouselId?: string;
  description?: string;
  durationMinutes?: number;
  status: "scheduled" | "live" | "completed";
  attendeeStudentIds?: string[];
}

export interface PendingRegistration {
  id: string;
  classId: string;
  className: string;
  curriculumPackageName: string;
  teacherId: string;
  studentName: string;
  studentEmail: string;
  submittedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
}

// ── Official Registered Curriculum Packages & Specifications ─────────────────
export interface DomainActionPolicy {
  canAdd: boolean;
  canModify: boolean;
  canRemove: boolean;
  requireAdminApprovalForRemove?: boolean;
}

export interface CurriculumDomainPolicies {
  questionTank: DomainActionPolicy;
  syllabus: DomainActionPolicy;
  packages: DomainActionPolicy;
  carouselContent: DomainActionPolicy;
}

export const DEFAULT_DOMAIN_POLICIES: CurriculumDomainPolicies = {
  questionTank: { canAdd: true, canModify: true, canRemove: false, requireAdminApprovalForRemove: true },
  syllabus: { canAdd: false, canModify: true, canRemove: false, requireAdminApprovalForRemove: true },
  packages: { canAdd: true, canModify: true, canRemove: false, requireAdminApprovalForRemove: true },
  carouselContent: { canAdd: true, canModify: true, canRemove: true, requireAdminApprovalForRemove: false }
};

export interface CurriculumPolicy {
  maxAuthorizedTeachers: number;        // 0 = unlimited
  teacherMustBeVerified: boolean;       // teacher profile verified before assignment
  allowTeacherCustomSlides: boolean;    // can teacher add their own slides?
  allowTeacherCustomQuestions: boolean; // can teacher add their own questions?
  aiTankEnabled: boolean;               // admin can push AI Question DNA tanks
  expiryDate: string | null;            // ISO date "2027-06-30" or null = no expiry
  notes: string;                        // admin internal notes
  domains?: CurriculumDomainPolicies;   // Granular domain-level permissions for questions tank, syllabus, packages, etc.
}

export interface CurriculumPolicyProfile extends CurriculumPolicy {
  id: string;
  name: string;
  isDefault?: boolean;
}

export const DEFAULT_CURRICULUM_POLICY: CurriculumPolicy = {
  maxAuthorizedTeachers: 0,
  teacherMustBeVerified: false,
  allowTeacherCustomSlides: true,
  allowTeacherCustomQuestions: true,
  aiTankEnabled: true,
  expiryDate: null,
  notes: "",
  domains: { ...DEFAULT_DOMAIN_POLICIES }
};

export const DEFAULT_POLICY_PROFILES: CurriculumPolicyProfile[] = [
  {
    id: "pol_standard",
    name: "Standard Open Policy",
    isDefault: true,
    maxAuthorizedTeachers: 0,
    teacherMustBeVerified: false,
    allowTeacherCustomSlides: true,
    allowTeacherCustomQuestions: true,
    aiTankEnabled: true,
    expiryDate: null,
    notes: "Default open policy for authorized teachers.",
    domains: { ...DEFAULT_DOMAIN_POLICIES }
  },
  {
    id: "pol_strict_exam",
    name: "Strict Ministry Exam Policy",
    isDefault: false,
    maxAuthorizedTeachers: 3,
    teacherMustBeVerified: true,
    allowTeacherCustomSlides: false,
    allowTeacherCustomQuestions: false,
    aiTankEnabled: true,
    expiryDate: null,
    notes: "Locked down for official examination packages. Custom edits disabled.",
    domains: {
      questionTank: { canAdd: false, canModify: false, canRemove: false, requireAdminApprovalForRemove: true },
      syllabus: { canAdd: false, canModify: false, canRemove: false, requireAdminApprovalForRemove: true },
      packages: { canAdd: false, canModify: false, canRemove: false, requireAdminApprovalForRemove: true },
      carouselContent: { canAdd: false, canModify: false, canRemove: false, requireAdminApprovalForRemove: true }
    }
  },
  {
    id: "pol_trial_30d",
    name: "30-Day Evaluation Policy",
    isDefault: false,
    maxAuthorizedTeachers: 10,
    teacherMustBeVerified: false,
    allowTeacherCustomSlides: true,
    allowTeacherCustomQuestions: true,
    aiTankEnabled: true,
    expiryDate: "2027-06-30",
    notes: "Temporary promotional policy for trial packages.",
    domains: {
      questionTank: { canAdd: true, canModify: true, canRemove: false, requireAdminApprovalForRemove: true },
      syllabus: { canAdd: true, canModify: true, canRemove: false, requireAdminApprovalForRemove: true },
      packages: { canAdd: true, canModify: true, canRemove: false, requireAdminApprovalForRemove: true },
      carouselContent: { canAdd: true, canModify: true, canRemove: true, requireAdminApprovalForRemove: false }
    }
  }
];

export interface CurriculumLessonsPolicy {
  canAddLessons: boolean;
  canModifyLessons: boolean;
  canDeleteLessons: boolean;
  allowTeacherSoftExclusions: boolean;
  requireAdminApprovalForLessonChanges: boolean;
  sequentialOrderRequired: boolean;
}

export interface CurriculumPackageRules {
  allowPrivatePackages: boolean;
  allowSpecialNegotiatedPrices: boolean;
  defaultCurrency: string;
  minimumPrice: number;
  maximumDiscountPercent: number;
  defaultValidityDays: number;
}

export interface CurriculumTeacherRules {
  allowedTeacherIds: string[];
  leadReviewerIds: string[];
  suspendedTeacherIds: string[];
  allowTeacherCustomSlides: boolean;
  allowTeacherDirectParentContact: boolean;
  allowTeacherAITankAccess: boolean;
}

export interface CurriculumAssessmentRules {
  passingScorePercent: number;
  allowQuestionRetries: boolean;
  shuffleChoices: boolean;
  enableScaffoldingPreTrials: boolean;
  enableChallengeCaseC: boolean;
}

export interface CurriculumRules {
  lessonsPolicy: CurriculumLessonsPolicy;
  packageRules: CurriculumPackageRules;
  teacherRules: CurriculumTeacherRules;
  domainPolicies: CurriculumDomainPolicies;
  assessmentRules: CurriculumAssessmentRules;
}

export const DEFAULT_CURRICULUM_RULES: CurriculumRules = {
  lessonsPolicy: {
    canAddLessons: true,
    canModifyLessons: true,
    canDeleteLessons: false,
    allowTeacherSoftExclusions: true,
    requireAdminApprovalForLessonChanges: true,
    sequentialOrderRequired: false
  },
  packageRules: {
    allowPrivatePackages: true,
    allowSpecialNegotiatedPrices: true,
    defaultCurrency: "EGP",
    minimumPrice: 200,
    maximumDiscountPercent: 50,
    defaultValidityDays: 120
  },
  teacherRules: {
    allowedTeacherIds: ["teacher_1", "teacher_2"],
    leadReviewerIds: ["teacher_1"],
    suspendedTeacherIds: [],
    allowTeacherCustomSlides: true,
    allowTeacherDirectParentContact: true,
    allowTeacherAITankAccess: true
  },
  domainPolicies: DEFAULT_DOMAIN_POLICIES,
  assessmentRules: {
    passingScorePercent: 70,
    allowQuestionRetries: true,
    shuffleChoices: true,
    enableScaffoldingPreTrials: true,
    enableChallengeCaseC: true
  }
};

export interface CurriculumSpec {
  id: string;
  name: string;
  publisher: string;
  subject: string;
  gradeLevel: string;
  version: string;
  terms: Array<{ id: "term1" | "term2" | "full"; label: string; dateRange: string }>;
  chapters: string[];
  lessons: Array<{ id: string; title: string }>;
  policy?: CurriculumPolicy;
  policies?: CurriculumPolicyProfile[];
  activePolicyId?: string;
  rules?: CurriculumRules;
  registeredAt?: string;
  archivedAt?: string | null;
}

export interface CurriculumRemovalReport {
  curriculumId: string;
  curriculumName: string;
  revokedFromTeachers: string[];
  archivedPackages: string[];
}


export const REGISTERED_CURRICULUM_SPECS: Record<string, CurriculumSpec> = {
  "egypt-baccalaureate-second-year-physics-part1": {
    id: "egypt-baccalaureate-second-year-physics-part1",
    name: "Egyptian Baccalaureate 2nd Year Physics - Part 1",
    publisher: "Egyptian Ministry of Education and Technical Education",
    subject: "Physics",
    gradeLevel: "Secondary 2 (Grade 11)",
    version: "2026-2027 (Official Part 1)",
    terms: [
      { id: "term1", label: "Part 1 · Term 1 (Mechanics, Projectiles & Gravitation)", dateRange: "Sept 2026 – Jan 2027" }
    ],
    chapters: [
      "Chapter 1: Velocity Vectors & Relative Velocity",
      "Chapter 2: Horizontal & Angled Projectiles",
      "Chapter 3: Moment of Force & Equilibrium",
      "Chapter 4: Power, Work & Energy Efficiency",
      "Chapter 5: Momentum, Impulse & Conservation Laws",
      "Chapter 6: Uniform Circular Motion & Centripetal Acceleration",
      "Chapter 7: Kepler's Laws & Universal Gravitation"
    ],
    lessons: [
      { id: "CAROUSEL-PHYS-EB-MECH-1-1", title: "1-1 Velocity Vectors & Relative Velocity" },
      { id: "CAROUSEL-PHYS-EB-MECH-1-2", title: "1-2 Horizontal Projectile Motion" },
      { id: "CAROUSEL-PHYS-EB-MECH-1-3", title: "1-3 Projectile Motion at an Angle" },
      { id: "CAROUSEL-PHYS-EB-MECH-1-4", title: "1-4 Moment of a Force" },
      { id: "CAROUSEL-PHYS-EB-MECH-1-5", title: "1-5 Equilibrium of Forces" },
      { id: "CAROUSEL-PHYS-EB-MECH-1-6", title: "1-6 Power & Efficiency" },
      { id: "CAROUSEL-PHYS-EB-MECH-1-7", title: "1-7 Momentum & Impulse" },
      { id: "CAROUSEL-PHYS-EB-MECH-1-8", title: "1-8 Conservation of Momentum" },
      { id: "CAROUSEL-PHYS-EB-MECH-1-9", title: "1-9 Momentum & Energy Interactions" },
      { id: "CAROUSEL-PHYS-EB-MECH-1-10", title: "1-10 Uniform Circular Motion" },
      { id: "CAROUSEL-PHYS-EB-MECH-1-11", title: "1-11 Horizontal & Vertical Circular Dynamics" },
      { id: "CAROUSEL-PHYS-EB-MECH-1-12", title: "1-12 Kepler's Laws & Universal Gravitation" }
    ],
    registeredAt: "2026-08-01",
    archivedAt: null,
    policy: { ...DEFAULT_CURRICULUM_POLICY, notes: "Official MoE Physics Term 1 — AI Tank Enabled" }
  },
  "egypt-baccalaureate-second-year-physics-part2": {
    id: "egypt-baccalaureate-second-year-physics-part2",
    name: "Egyptian Baccalaureate 2nd Year Physics - Part 2",
    publisher: "Egyptian Ministry of Education and Technical Education",
    subject: "Physics",
    gradeLevel: "Secondary 2 (Grade 11)",
    version: "2026-2027 (Official Part 2)",
    terms: [
      { id: "term2", label: "Part 2 · Term 2 (Gases, Electricity & Quantum)", dateRange: "Feb 2027 – June 2027" }
    ],
    chapters: [
      "Unit 1: Gases & Heat (Boyle & Charles Laws)",
      "Unit 2: Static Electricity & Electrostatics",
      "Unit 3: Electric Current, Resistance & Circuits",
      "Unit 4: Magnetism & Electromagnetic Induction",
      "Unit 5: Quantum Nature of Light & Photoelectric Effect"
    ],
    lessons: [
      { id: "CAROUSEL-PHYS-EB-GASES-2-1", title: "2-1 Gas Pressure & Kinetic Theory" },
      { id: "CAROUSEL-PHYS-EB-GASES-2-2", title: "2-2 Boyle's Law (p-V Isothermal)" },
      { id: "CAROUSEL-PHYS-EB-GASES-2-3", title: "2-3 Charles's Law & Absolute Temperature" },
      { id: "CAROUSEL-PHYS-EB-GASES-2-4", title: "2-4 Ideal Gas Equation (pV = nRT)" }
    ],
    registeredAt: "2026-08-01",
    archivedAt: null,
    policy: { ...DEFAULT_CURRICULUM_POLICY, notes: "Official MoE Physics Term 2 — AI Tank Enabled" }
  },
  "egypt-baccalaureate-second-year-physics": {
    id: "egypt-baccalaureate-second-year-physics",
    name: "Egyptian Baccalaureate 2nd Year Physics (Full Year)",
    publisher: "Egyptian Ministry of Education and Technical Education",
    subject: "Physics",
    gradeLevel: "Secondary 2 (Grade 11)",
    version: "2026-2027 (Full Curriculum)",
    terms: [
      { id: "term1", label: "Part 1 · Term 1 (Mechanics)", dateRange: "Sept 2026 – Jan 2027" },
      { id: "term2", label: "Part 2 · Term 2 (Gases & Electricity)", dateRange: "Feb 2027 – June 2027" },
      { id: "full", label: "Full Academic Year (Both Terms)", dateRange: "Sept 2026 – June 2027" }
    ],
    chapters: [
      "Chapter 1: Mechanics & Projectiles",
      "Chapter 2: Forces, Moments & Equilibrium",
      "Chapter 3: Energy, Power & Momentum",
      "Chapter 4: Circular Motion & Gravitation",
      "Chapter 5: Gases & Thermodynamic Laws",
      "Chapter 6: Electricity, Circuits & Magnetism",
      "Chapter 7: Quantum Physics"
    ],
    lessons: [
      { id: "CAROUSEL-PHYS-EB-MECH-1-1", title: "1-1 Velocity Vectors & Relative Velocity" },
      { id: "CAROUSEL-PHYS-EB-MECH-1-2", title: "1-2 Horizontal Projectile Motion" },
      { id: "CAROUSEL-PHYS-EB-MECH-1-3", title: "1-3 Projectile Motion at an Angle" },
      { id: "CAROUSEL-PHYS-EB-GASES-2-2", title: "2-2 Boyle's Law" },
      { id: "CAROUSEL-PHYS-EB-GASES-2-3", title: "2-3 Charles's Law" }
    ],
    registeredAt: "2026-08-01",
    archivedAt: null,
    policy: { ...DEFAULT_CURRICULUM_POLICY, notes: "Full-year bundle — both terms" }
  },
  "cambridge-igcse-0580": {
    id: "cambridge-igcse-0580",
    name: "Cambridge IGCSE Mathematics 0580",
    publisher: "Cambridge Assessment International Education",
    subject: "Mathematics",
    gradeLevel: "IGCSE / Secondary 1-2",
    version: "2026-2028 Syllabus",
    terms: [
      { id: "term1", label: "Core Syllabus (Term 1)", dateRange: "Sept 2026 – Jan 2027" },
      { id: "term2", label: "Extended Syllabus (Term 2)", dateRange: "Feb 2027 – June 2027" }
    ],
    chapters: [
      "Topic 1: Number Skills & Fractions",
      "Topic 2: Algebra & Equations",
      "Topic 3: Coordinate Geometry",
      "Topic 4: Mensuration & Trigonometry"
    ],
    lessons: [
      { id: "LES-0580-NUM-01", title: "Fraction Arithmetic & Simplification" },
      { id: "LES-0580-ALG-01", title: "Algebraic Expansion & Factorization" }
    ],
    registeredAt: "2026-08-01",
    archivedAt: null,
    policy: { ...DEFAULT_CURRICULUM_POLICY, maxAuthorizedTeachers: 10, notes: "Cambridge IGCSE — max 10 authorized teachers" }
  },
  "egypt-secondary1-integrated-science": {
    id: "egypt-secondary1-integrated-science",
    name: "Egyptian Secondary 1 Integrated Science",
    publisher: "Egyptian Ministry of Education and Technical Education",
    subject: "Integrated Science",
    gradeLevel: "Secondary 1 (Grade 10)",
    version: "2026-2027",
    terms: [
      { id: "term1", label: "Part 1 · Ecosystems & Environmental Chemistry", dateRange: "Sept 2026 – Jan 2027" }
    ],
    chapters: [
      "Chapter 1: Aquatic Ecosystems & Energy Flow",
      "Chapter 2: Atmospheric Chemistry & Climate"
    ],
    lessons: [
      { id: "LES-EGYPT-S1-AQUATIC-01", title: "Aquatic Ecosystem: Observation to Evidence" }
    ],
    registeredAt: "2026-08-01",
    archivedAt: null,
    policy: { ...DEFAULT_CURRICULUM_POLICY, notes: "MoE Integrated Science Grade 10" }
  },
  "arts-drama-201": {
    id: "arts-drama-201",
    name: "Advanced Dramatic Arts & Monologue 201",
    publisher: "National Theatre Arts Board",
    subject: "Dramatic Arts",
    gradeLevel: "Grade 11-12",
    version: "2026-2027",
    terms: [
      { id: "full", label: "Full Module (Voice & Performance)", dateRange: "Sept 2026 – June 2027" }
    ],
    chapters: [
      "Module 1: Voice Projection & Articulation",
      "Module 2: Monologue Interpretation"
    ],
    lessons: [
      { id: "LES-DRAMA-VOCAL-01", title: "Voice Projection & Resonator Technique" }
    ],
    registeredAt: "2026-08-01",
    archivedAt: null,
    policy: { ...DEFAULT_CURRICULUM_POLICY, aiTankEnabled: false, notes: "Arts module — AI Tank disabled" }
  }
};

export interface TeacherAnnouncement {
  teacherName: string;
  teacherTitle: string;
  description: string;
  prerequisites: string[];
  isPubliclyAnnounced: boolean;
  publishedAt: string;
}

export interface TeacherPermissions {
  canAddCarousels: boolean;            // Whom of teachers can add carousels, whom can not
  canContactParents: boolean;          // Whom of teachers can contact parents, whom can not
  canRecordDemos: boolean;             // Permission to use Screen/Mic recording studio
  canHostLiveSessions: boolean;        // Permission to schedule Meet/Zoom live classes
  canReviewCurriculumTanks: boolean;   // Lead Teacher role: Inspect, refine & verify AI Question Tanks
}

export const DEFAULT_TEACHER_PERMISSIONS: TeacherPermissions = {
  canAddCarousels: true,
  canContactParents: true,
  canRecordDemos: true,
  canHostLiveSessions: true,
  canReviewCurriculumTanks: false
};

// ── Admin Executive Suite Interfaces ──────────────────────────────────────────
export type AlarmSeverity = "CRITICAL" | "WARNING" | "INFO";
export type AlarmCategory = "ACADEMIC_GAP" | "PENDING_REGISTRATION" | "SYSTEM_AI" | "SESSION_DISRUPTION" | "FINANCIAL";

export interface AdminAlarm {
  id: string;
  title: string;
  message: string;
  severity: AlarmSeverity;
  category: AlarmCategory;
  timestamp: string;
  resolved: boolean;
  actionLabel?: string;
  actionUrl?: string;
}

export type BroadcastAudience = "ALL" | "TEACHERS" | "PARENTS" | "STUDENTS";
export type BroadcastPriority = "URGENT" | "NORMAL";

export interface AdminBroadcast {
  id: string;
  title: string;
  message: string;
  targetAudience: BroadcastAudience;
  priority: BroadcastPriority;
  sentAt: string;
  authorName: string;
  readCount?: number;
}

export type NotePriority = "URGENT" | "MEDIUM" | "INFO";
export type NoteStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";

export interface AdminDirectiveNote {
  id: string;
  title: string;
  content: string;
  category: "Pedagogical Audit" | "Financial Policy" | "Curriculum Revision" | "System Tech";
  priority: NotePriority;
  status: NoteStatus;
  createdAt: string;
  targetTeacherName?: string;
  targetPackageName?: string;
}

export interface ExecutiveAuditReport {
  timestamp: string;
  academics: {
    totalStudents: number;
    readyCount: number;
    readyWithSupportCount: number;
    bridgingRecommendedCount: number;
    foundationRequiredCount: number;
    masteryPercentage: number;
  };
  financials: {
    totalActivePackages: number;
    archivedPackagesCount: number;
    totalEnrolledStudents: number;
    grossVolumeUSD: number;
    volumeDiscountSavingsUSD: number;
    averageRatePerStudent: number;
  };
  teachers: {
    totalTeachers: number;
    authorizedTeacherCount: number;
    leadReviewerCount: number;
    totalParentNotesSent: number;
  };
  aiEngine: {
    activeProvider: string;
    failoverEnabled: boolean;
    distillationMemoryCount: number;
  };
}

export type TeacherCurriculumStatus = "ACTIVE" | "SUSPENDED";

export interface TeacherAssignment {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  approvedCurriculumIds: string[];
  curriculumStatuses?: Record<string, TeacherCurriculumStatus>; // curriculumId -> "ACTIVE" | "SUSPENDED"
  excludedLessonIds?: Record<string, string[]>; // curriculumId -> list of lessonIds soft-hidden by teacher
  permissions: TeacherPermissions;
}

export interface ClassRecord {
  id: string;
  teacherId: string;
  assignedTeacherIds?: string[];
  name: string;
  curriculumPackageId: string;
  curriculumPackageName: string;
  gradeLevel: string;
  scope: ClassPackageScope;
  financials: PackageFinancials;
  studentIds: string[];
  announcement?: TeacherAnnouncement;
  isPrivate?: boolean;
  specialNegotiatedPrice?: number;
  archivedAt?: string | null;
}

// Initial Mock Data
let mockClasses: ClassRecord[] = [
  {
    id: "cls_101",
    teacherId: "teacher_1",
    name: "Year 11 Physics - Section A (Full Term 1)",
    curriculumPackageId: "egypt-baccalaureate-second-year-physics-part1",
    curriculumPackageName: "Egyptian Baccalaureate 2nd Year Physics - Part 1",
    gradeLevel: "Secondary 2 (Grade 11)",
    announcement: {
      teacherName: "Dr. Hassan Youssef",
      teacherTitle: "Senior Physics Master Educator",
      description: "Complete Term 1 Mechanics & Vectors coverage. Includes 12 carousels, 3-case adaptive diagnostics, and weekly live video review sessions.",
      prerequisites: [
        "Secondary 2 (Grade 11) active standing",
        "Basic SI unit conversions & algebraic rearrangement",
        "Right-triangle geometry & trigonometry basics (sin, cos, tan)"
      ],
      isPubliclyAnnounced: true,
      publishedAt: "2026-08-28T09:00:00Z"
    },
    scope: {
      scopeType: "SEMESTER",
      semesterId: "term1",
      chapterNames: ["Mechanics & Vectors", "Projectiles", "Momentum"],
      includedLiveSessions: -1
    },
    financials: {
      pricingModel: "VOLUME_TIERED",
      basePricePerStudent: 50,
      tiers: [
        { minStudents: 1, maxStudents: 5, pricePerStudent: 60 },
        { minStudents: 6, maxStudents: 20, pricePerStudent: 45 },
        { minStudents: 21, maxStudents: 100, pricePerStudent: 35 }
      ],
      currency: "USD"
    },
    studentIds: ["std_001", "std_002", "std_003"]
  },
  {
    id: "cls_102",
    teacherId: "teacher_1",
    name: "Vector & Projectile Intensive Workshop",
    curriculumPackageId: "egypt-baccalaureate-second-year-physics-part1",
    curriculumPackageName: "Egyptian Baccalaureate 2nd Year Physics - Part 1",
    gradeLevel: "Secondary 2 (Grade 11)",
    announcement: {
      teacherName: "Dr. Hassan Youssef",
      teacherTitle: "Senior Physics Master Educator",
      description: "Focused 2-chapter workshop on relative velocity vectors & projectile motion trajectory equations. 2 live sessions included.",
      prerequisites: [
        "Secondary 2 Physics Standing",
        "Understanding of Cartesian coordinates (X, Y)"
      ],
      isPubliclyAnnounced: true,
      publishedAt: "2026-08-30T10:00:00Z"
    },
    scope: {
      scopeType: "CHAPTER_BUNDLE",
      chapterNames: ["Vectors & Relative Velocity"],
      lessonIds: ["CAROUSEL-PHYS-EB-MECH-1-1", "CAROUSEL-PHYS-EB-MECH-1-2"],
      includedLiveSessions: 2
    },
    financials: {
      pricingModel: "VOLUME_TIERED",
      basePricePerStudent: 25,
      tiers: [
        { minStudents: 1, maxStudents: 10, pricePerStudent: 25 },
        { minStudents: 11, maxStudents: 50, pricePerStudent: 20 }
      ],
      currency: "USD"
    },
    studentIds: ["std_001", "std_004", "std_005"]
  },
  {
    id: "cls_103",
    teacherId: "teacher_1",
    name: "Cambridge IGCSE Math 0580 - Algebra & Number Pass",
    curriculumPackageId: "cambridge-igcse-0580",
    curriculumPackageName: "Cambridge IGCSE Mathematics 0580",
    gradeLevel: "IGCSE / Secondary 1-2",
    announcement: {
      teacherName: "Dr. Hassan Youssef",
      teacherTitle: "Certified Cambridge Math Instructor",
      description: "Core & Extended Cambridge 0580 arithmetic, fractions, and linear algebra booster. Includes 4 live problem-solving sessions.",
      prerequisites: [
        "Year 9 / Year 10 Math Foundation",
        "Scientific calculator"
      ],
      isPubliclyAnnounced: true,
      publishedAt: "2026-08-29T14:00:00Z"
    },
    scope: {
      scopeType: "CHAPTER_BUNDLE",
      chapterNames: ["Topic 1: Number Skills & Fractions", "Topic 2: Algebra & Equations"],
      lessonIds: ["LES-0580-NUM-01", "LES-0580-ALG-01"],
      includedLiveSessions: 4
    },
    financials: {
      pricingModel: "VOLUME_TIERED",
      basePricePerStudent: 40,
      tiers: [
        { minStudents: 1, maxStudents: 10, pricePerStudent: 40 },
        { minStudents: 11, maxStudents: 50, pricePerStudent: 30 }
      ],
      currency: "USD"
    },
    studentIds: ["std_001", "std_003"]
  },
  {
    id: "cls_104",
    teacherId: "teacher_1",
    name: "Secondary 1 Integrated Science - Ecosystems Workshop",
    curriculumPackageId: "egypt-secondary1-integrated-science",
    curriculumPackageName: "Egyptian Secondary 1 Integrated Science",
    gradeLevel: "Secondary 1 (Grade 10)",
    announcement: {
      teacherName: "Dr. Hassan Youssef",
      teacherTitle: "Integrated Science Specialist",
      description: "Aquatic ecosystem energy flow and environmental chemistry observation module.",
      prerequisites: [
        "Secondary 1 Active Standing"
      ],
      isPubliclyAnnounced: true,
      publishedAt: "2026-08-25T11:00:00Z"
    },
    scope: {
      scopeType: "CHAPTER_BUNDLE",
      chapterNames: ["Chapter 1: Aquatic Ecosystems & Energy Flow"],
      lessonIds: ["LES-EGYPT-S1-AQUATIC-01"],
      includedLiveSessions: 2
    },
    financials: {
      pricingModel: "VOLUME_TIERED",
      basePricePerStudent: 30,
      tiers: [
        { minStudents: 1, maxStudents: 20, pricePerStudent: 30 }
      ],
      currency: "USD"
    },
    studentIds: ["std_002", "std_005"]
  }
];

let mockStudents: StudentProfile[] = [
  {
    id: "std_001",
    name: "Ahmed Youssef",
    email: "ahmed.youssef@student.com",
    registrationDate: "2026-01-10",
    status: "ACTIVE",
    gradeLevel: "11",
    attendanceRate: 95,
    overallGrade: 88,
    weaknesses: ["Vector Components", "Friction Analysis"],
    parent: {
      name: "Tarek Youssef",
      relationship: "Father",
      email: "tarek.youssef@parent.com",
      phone: "+20 100 123 4567",
      preferredChannel: "WHATSAPP",
      verified: true
    },
    enrolledClassIds: ["cls_101", "cls_102"], // Tied to 2 packages simultaneously
    billingTransactions: [
      {
        id: "tx_001",
        studentId: "std_001",
        timestamp: "2026-01-10T10:00:00Z",
        type: "ENROLLMENT",
        className: "Year 11 Physics - Section A (Full Term 1)",
        packageName: "Egyptian Baccalaureate 2nd Year Physics",
        amount: 60,
        effectiveRateApplied: 60,
        studentVolumeAtTime: 3,
        description: "Enrolled in Full Term 1 Package (Volume Tier 1-5 students)"
      },
      {
        id: "tx_002",
        studentId: "std_001",
        timestamp: "2026-01-15T14:30:00Z",
        type: "ENROLLMENT",
        className: "Vector & Projectile Intensive Workshop",
        packageName: "Egyptian Baccalaureate 2nd Year Physics",
        amount: 25,
        effectiveRateApplied: 25,
        studentVolumeAtTime: 3,
        description: "Enrolled in Chapter Bundle Workshop (Volume Tier 1-10 students)"
      }
    ],
    followUpLogs: [
      {
        id: "log_001",
        studentId: "std_001",
        createdAt: "2026-02-01T09:00:00Z",
        authorRole: "TEACHER",
        authorName: "Dr. Hassan",
        category: "TEACHER_NOTE",
        title: "Strong Vector Component Progress",
        message: "Ahmed showed great improvement in relative velocity vectors during Tuesday's workshop.",
        status: "READ_BY_PARENT"
      }
    ]
  },
  {
    id: "std_002",
    name: "Sara Mahmoud",
    email: "sara.mahmoud@student.com",
    registrationDate: "2026-01-12",
    status: "ACTIVE",
    gradeLevel: "11",
    attendanceRate: 98,
    overallGrade: 94,
    weaknesses: ["Circular Motion"],
    parent: {
      name: "Mona Mahmoud",
      relationship: "Mother",
      email: "mona.mahmoud@parent.com",
      phone: "+20 101 987 6543",
      preferredChannel: "EMAIL",
      verified: true
    },
    enrolledClassIds: ["cls_101"],
    billingTransactions: [
      {
        id: "tx_003",
        studentId: "std_002",
        timestamp: "2026-01-12T11:00:00Z",
        type: "ENROLLMENT",
        className: "Year 11 Physics - Section A (Full Term 1)",
        packageName: "Egyptian Baccalaureate 2nd Year Physics",
        amount: 60,
        effectiveRateApplied: 60,
        studentVolumeAtTime: 3,
        description: "Enrolled in Full Term 1 Package"
      }
    ],
    followUpLogs: []
  },
  {
    id: "std_003",
    name: "Omar Hassan",
    email: "omar.hassan@student.com",
    registrationDate: "2026-01-14",
    status: "ACTIVE",
    gradeLevel: "11",
    attendanceRate: 82,
    overallGrade: 76,
    weaknesses: ["Tension Forces", "Free Body Diagrams"],
    parent: {
      name: "Hassan Ali",
      relationship: "Father",
      email: "hassan.ali@parent.com",
      phone: "+20 102 333 4444",
      preferredChannel: "SMS",
      verified: true
    },
    enrolledClassIds: ["cls_101"],
    billingTransactions: [
      {
        id: "tx_004",
        studentId: "std_003",
        timestamp: "2026-01-14T09:15:00Z",
        type: "ENROLLMENT",
        className: "Year 11 Physics - Section A (Full Term 1)",
        packageName: "Egyptian Baccalaureate 2nd Year Physics",
        amount: 60,
        effectiveRateApplied: 60,
        studentVolumeAtTime: 3,
        description: "Enrolled in Full Term 1 Package"
      }
    ],
    followUpLogs: [
      {
        id: "log_002",
        studentId: "std_003",
        createdAt: "2026-02-10T16:00:00Z",
        authorRole: "SYSTEM_DIAGNOSTIC",
        authorName: "Adaptive Diagnostic Engine",
        category: "PARENT_NOTIFICATION",
        title: "Diagnostic Trial Exhaustion Alert",
        message: "Omar exhausted all 10 Pre-trials for Free Body Diagrams. Parent report generated.",
        weaknessTargets: ["Tension Forces", "Free Body Diagrams"],
        status: "ACKNOWLEDGED"
      }
    ]
  },
  {
    id: "std_004",
    name: "Laila Karim",
    email: "laila.karim@student.com",
    registrationDate: "2026-01-18",
    status: "ACTIVE",
    gradeLevel: "12",
    attendanceRate: 100,
    overallGrade: 98,
    weaknesses: [],
    parent: {
      name: "Khaled Karim",
      relationship: "Father",
      email: "khaled.karim@parent.com",
      phone: "+20 105 555 6666",
      preferredChannel: "EMAIL",
      verified: true
    },
    enrolledClassIds: ["cls_102"],
    billingTransactions: [
      {
        id: "tx_005",
        studentId: "std_004",
        timestamp: "2026-01-18T10:00:00Z",
        type: "ENROLLMENT",
        className: "Vector & Projectile Intensive Workshop",
        packageName: "Egyptian Baccalaureate 2nd Year Physics",
        amount: 25,
        effectiveRateApplied: 25,
        studentVolumeAtTime: 3,
        description: "Enrolled in Workshop"
      }
    ],
    followUpLogs: []
  },
  {
    id: "std_005",
    name: "Ziad Fares",
    email: "ziad.fares@student.com",
    registrationDate: "2026-01-20",
    status: "ACTIVE",
    gradeLevel: "12",
    attendanceRate: 90,
    overallGrade: 85,
    weaknesses: ["Energy Conservation"],
    parent: {
      name: "Fatima Fares",
      relationship: "Mother",
      email: "fatima.fares@parent.com",
      phone: "+20 109 777 8888",
      preferredChannel: "WHATSAPP",
      verified: true
    },
    enrolledClassIds: ["cls_102"],
    billingTransactions: [
      {
        id: "tx_006",
        studentId: "std_005",
        timestamp: "2026-01-20T12:00:00Z",
        type: "ENROLLMENT",
        className: "Vector & Projectile Intensive Workshop",
        packageName: "Egyptian Baccalaureate 2nd Year Physics",
        amount: 25,
        effectiveRateApplied: 25,
        studentVolumeAtTime: 3,
        description: "Enrolled in Workshop"
      }
    ],
    followUpLogs: []
  }
];

let mockSessions: LiveSession[] = [
  {
    id: "session_001",
    classId: "cls_101",
    title: "Live Problem Solving: Vectors & Forces",
    scheduledTime: new Date(Date.now() + 3600000).toISOString(), // Starts in 1 hour
    meetingLink: "https://meet.google.com/abc-defg-hij",
    platform: "google-meet",
    attachedCarouselId: "CAROUSEL-cls_101",
    description: "Live interactive problem solving on Nile boat crossing & relative velocity vectors.",
    durationMinutes: 60,
    status: "live",
    attendeeStudentIds: ["std_001"]
  },
  {
    id: "session_002",
    classId: "cls_102",
    title: "Masterclass: Angled Projectiles & Trajectory Math",
    scheduledTime: new Date(Date.now() + 172800000).toISOString(), // In 2 days
    meetingLink: "https://zoom.us/j/9876543210",
    platform: "zoom",
    attachedCarouselId: "CAROUSEL-cls_102",
    description: "Step-by-step breakdown of projectile motion at an angle.",
    durationMinutes: 90,
    status: "scheduled",
    attendeeStudentIds: []
  }
];

let mockPendingRegistrations: PendingRegistration[] = [];

let mockAdminAlarms: AdminAlarm[] = [
  {
    id: "alarm_101",
    title: "Pending Student Registration Backlog",
    message: "2 pending student registration requests awaiting teacher review in 'Year 11 Physics Section A'.",
    severity: "WARNING",
    category: "PENDING_REGISTRATION",
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    resolved: false,
    actionLabel: "Review Requests"
  },
  {
    id: "alarm_102",
    title: "High Academic Gap Flagged: Foundation Required",
    message: "Student 'Tariq Ziyad' triggered FOUNDATION_REQUIRED diagnosis in Velocity Vectors Case B.",
    severity: "CRITICAL",
    category: "ACADEMIC_GAP",
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    resolved: false,
    actionLabel: "Inspect Student Audit"
  },
  {
    id: "alarm_103",
    title: "Offline Local Ollama Failover Active",
    message: "Primary Cloud API reached quota limit; auto-switched to Local Ollama (qwen2.5:3b). Zero downtime experienced.",
    severity: "INFO",
    category: "SYSTEM_AI",
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    resolved: true
  }
];

let mockAdminBroadcasts: AdminBroadcast[] = [
  {
    id: "bcast_1",
    title: "Official Egyptian Baccalaureate Term 2 Specs Published",
    message: "The new official Term 2 curriculum package and AI Question Tanks are registered and available to authorized teachers.",
    targetAudience: "TEACHERS",
    priority: "NORMAL",
    sentAt: "2026-08-28T10:00:00Z",
    authorName: "Platform Admin",
    readCount: 18
  },
  {
    id: "bcast_2",
    title: "System Data Backup & Distillation Memory Sync",
    message: "All student progress logs, AI distillation exemplars, and package financial ledgers backed up successfully.",
    targetAudience: "ALL",
    priority: "NORMAL",
    sentAt: "2026-08-30T14:30:00Z",
    authorName: "Platform Admin",
    readCount: 92
  }
];

let mockAdminDirectiveNotes: AdminDirectiveNote[] = [
  {
    id: "note_1",
    title: "Verify Case C Projectile Trajectory Calculations",
    content: "Request Dr. Hassan Youssef (Lead Reviewer) to double check angles in Lesson 1-3 Case C questions before final exam publishing.",
    category: "Pedagogical Audit",
    priority: "URGENT",
    status: "OPEN",
    createdAt: "2026-09-01T09:00:00Z",
    targetTeacherName: "Dr. Hassan Youssef",
    targetPackageName: "Year 11 Physics Section A"
  },
  {
    id: "note_2",
    title: "Enforce Volume Pricing Tier for Section B",
    content: "Ensure Section B applies 15+ student tier discount ($40/std) upon 3 new student enrollments.",
    category: "Financial Policy",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    createdAt: "2026-09-02T11:15:00Z",
    targetPackageName: "Year 11 Physics Section B"
  }
];

let mockTeacherAssignments: TeacherAssignment[] = [
  {
    teacherId: "teacher_1",
    teacherName: "Dr. Hassan Youssef",
    teacherEmail: "teacher@platform.com",
    approvedCurriculumIds: [
      "egypt-baccalaureate-second-year-physics-part1",
      "egypt-baccalaureate-second-year-physics-part2",
      "cambridge-igcse-0580"
    ],
    curriculumStatuses: {
      "egypt-baccalaureate-second-year-physics-part1": "ACTIVE",
      "egypt-baccalaureate-second-year-physics-part2": "ACTIVE",
      "cambridge-igcse-0580": "ACTIVE"
    },
    permissions: {
      canAddCarousels: true,
      canContactParents: true,
      canRecordDemos: true,
      canHostLiveSessions: true,
      canReviewCurriculumTanks: true // Lead Reviewer authorized by Admin
    }
  },
  {
    teacherId: "teacher_2",
    teacherName: "Eng. Mariam Adel",
    teacherEmail: "mariam.adel@platform.com",
    approvedCurriculumIds: [
      "cambridge-igcse-0580",
      "egypt-secondary1-integrated-science"
    ],
    curriculumStatuses: {
      "cambridge-igcse-0580": "ACTIVE",
      "egypt-secondary1-integrated-science": "SUSPENDED" // Suspended by Admin for syllabus review
    },
    permissions: {
      canAddCarousels: false,  // Restricted: Cannot create carousels
      canContactParents: false, // Restricted: Cannot contact parents directly
      canRecordDemos: true,
      canHostLiveSessions: true,
      canReviewCurriculumTanks: false
    }
  }
];

export const ClassRegistry = {
  // --- Dynamic Pricing Engine ---
  calculateEffectiveRate(classRecord: ClassRecord): number {
    const studentCount = classRecord.studentIds.length;
    if (classRecord.financials.pricingModel === "VOLUME_TIERED" && classRecord.financials.tiers.length > 0) {
      const matchedTier = classRecord.financials.tiers.find(
        (t) => studentCount >= t.minStudents && studentCount <= t.maxStudents
      );
      if (matchedTier) return matchedTier.pricePerStudent;
      // Fallback to highest tier if volume exceeds max
      const sorted = [...classRecord.financials.tiers].sort((a, b) => b.maxStudents - a.maxStudents);
      return sorted[0].pricePerStudent;
    }
    return classRecord.financials.basePricePerStudent;
  },

  getPackageMetrics(classId: string) {
    const cls = this.getClassById(classId);
    if (!cls) return null;
    const studentCount = cls.studentIds.length;
    const effectiveRate = this.calculateEffectiveRate(cls);
    const totalRevenue = studentCount * effectiveRate;
    return {
      classId: cls.id,
      name: cls.name,
      studentCount,
      effectiveRate,
      totalRevenue,
      currency: cls.financials.currency,
      pricingModel: cls.financials.pricingModel
    };
  },

  // --- Classes CRUD ---
  getClassesByTeacher(teacherId: string): ClassRecord[] {
    return mockClasses.filter((c) => c.teacherId === teacherId);
  },
  getClassById(classId: string): ClassRecord | undefined {
    return mockClasses.find((c) => c.id === classId);
  },
  createClass(cls: Omit<ClassRecord, "id">): ClassRecord {
    const newClass = { ...cls, id: `cls_${Date.now()}` };
    mockClasses.push(newClass);
    return newClass;
  },

  // --- Students 360° Profiles & Multi-Package Tying ---
  getStudentsForClass(classId: string): StudentProfile[] {
    const cls = this.getClassById(classId);
    if (!cls) return [];
    return cls.studentIds.map((id) => mockStudents.find((s) => s.id === id)!).filter(Boolean);
  },
  getStudentById(studentId: string): StudentProfile | undefined {
    return mockStudents.find((s) => s.id === studentId);
  },
  getAllStudents(): StudentProfile[] {
    return mockStudents;
  },

  // Calculate complete student financial ledger across ALL tied packages
  getStudentFinancialLedger(studentId: string) {
    const student = this.getStudentById(studentId);
    if (!student) return null;

    const tiedClasses = mockClasses.filter((c) => student.enrolledClassIds.includes(c.id));
    
    const packageBreakdown = tiedClasses.map((cls) => {
      const effectiveRate = this.calculateEffectiveRate(cls);
      return {
        classId: cls.id,
        className: cls.name,
        packageName: cls.curriculumPackageName,
        scopeType: cls.scope.scopeType,
        studentVolumeInClass: cls.studentIds.length,
        effectiveRatePerStudent: effectiveRate,
        individualPackageCost: effectiveRate,
        currency: cls.financials.currency
      };
    });

    const totalBalance = packageBreakdown.reduce((sum, item) => sum + item.individualPackageCost, 0);

    return {
      studentId: student.id,
      studentName: student.name,
      parent: student.parent,
      registrationDate: student.registrationDate,
      packageBreakdown,
      totalBalance,
      billingTransactions: student.billingTransactions
    };
  },

  // --- Student Swapping with Automatic Financial Adjustment ---
  swapStudentClass(studentId: string, fromClassId: string, toClassId: string): { success: boolean; message: string } {
    const student = this.getStudentById(studentId);
    const fromClass = this.getClassById(fromClassId);
    const toClass = this.getClassById(toClassId);

    if (!student || !fromClass || !toClass) {
      return { success: false, message: "Student or class not found." };
    }

    // 1. Remove from old class
    fromClass.studentIds = fromClass.studentIds.filter((id) => id !== studentId);
    student.enrolledClassIds = student.enrolledClassIds.filter((id) => id !== fromClassId);

    // 2. Add to new class
    if (!toClass.studentIds.includes(studentId)) {
      toClass.studentIds.push(studentId);
    }
    if (!student.enrolledClassIds.includes(toClassId)) {
      student.enrolledClassIds.push(toClassId);
    }

    // 3. Recalculate effective rates
    const fromRate = this.calculateEffectiveRate(fromClass);
    const toRate = this.calculateEffectiveRate(toClass);

    // 4. Log transactions
    const now = new Date().toISOString();
    student.billingTransactions.push({
      id: `tx_${Date.now()}_credit`,
      studentId,
      timestamp: now,
      type: "PACKAGE_SWAP_CREDIT",
      className: fromClass.name,
      packageName: fromClass.curriculumPackageName,
      amount: -fromRate,
      effectiveRateApplied: fromRate,
      studentVolumeAtTime: fromClass.studentIds.length,
      description: `Swapped out of ${fromClass.name}. Credit applied.`
    });

    student.billingTransactions.push({
      id: `tx_${Date.now()}_debit`,
      studentId,
      timestamp: now,
      type: "PACKAGE_SWAP_DEBIT",
      className: toClass.name,
      packageName: toClass.curriculumPackageName,
      amount: toRate,
      effectiveRateApplied: toRate,
      studentVolumeAtTime: toClass.studentIds.length,
      description: `Swapped into ${toClass.name}. Charge applied.`
    });

    return {
      success: true,
      message: `Successfully swapped ${student.name} from ${fromClass.name} ($${fromRate}) to ${toClass.name} ($${toRate}).`
    };
  },

  // --- Follow-ups & Parent Communications ---
  addFollowUpNote(note: Omit<FollowUpRecord, "id">): FollowUpRecord {
    const newRecord = { ...note, id: `log_${Date.now()}` };
    const student = this.getStudentById(note.studentId);
    if (student) {
      student.followUpLogs.unshift(newRecord);
    }
    return newRecord;
  },

  // --- Sessions ---
  getSessionsForClass(classId: string): LiveSession[] {
    return mockSessions.filter((s) => s.classId === classId);
  },
  getSessionsForStudent(studentId: string): LiveSession[] {
    const student = this.getStudentById(studentId);
    if (!student) return [];
    return mockSessions.filter((s) => student.enrolledClassIds.includes(s.classId));
  },
  createSession(session: Omit<LiveSession, "id">): LiveSession {
    const newSession = { ...session, id: `session_${Date.now()}` };
    mockSessions.push(newSession);
    return newSession;
  },
  joinLiveSession(sessionId: string, studentId: string): LiveSession | null {
    const session = mockSessions.find((s) => s.id === sessionId);
    if (!session) return null;
    if (!session.attendeeStudentIds) session.attendeeStudentIds = [];
    if (!session.attendeeStudentIds.includes(studentId)) {
      session.attendeeStudentIds.push(studentId);
    }
    return session;
  },
  updateSessionStatus(sessionId: string, status: LiveSession["status"]): void {
    const session = mockSessions.find((s) => s.id === sessionId);
    if (session) {
      session.status = status;
    }
  },

  // --- Public Package Announcement Portal ---
  getPublicPackageAnnouncements() {
    return mockClasses
      .filter((c) => c.announcement && c.announcement.isPubliclyAnnounced && !c.archivedAt && !c.isPrivate)
      .map((c) => {
        const effectiveRate = this.calculateEffectiveRate(c);
        return {
          classId: c.id,
          title: c.name,
          curriculumPackageId: c.curriculumPackageId,
          curriculumPackageName: c.curriculumPackageName,
          gradeLevel: c.gradeLevel,
          scope: c.scope,
          effectiveRate,
          currency: c.financials.currency,
          studentCount: c.studentIds.length,
          announcement: c.announcement!,
          assignedTeacherIds: c.assignedTeacherIds || [c.teacherId],
          isPrivate: !!c.isPrivate
        };
      });
  },

  // --- Admin Master Package System ---
  getAllMasterPackages(): ClassRecord[] {
    return mockClasses;
  },

  adminCreatePackage(pkg: Omit<ClassRecord, "id" | "studentIds"> & { id?: string }): ClassRecord {
    const newPkg: ClassRecord = {
      ...pkg,
      id: pkg.id || `cls_${Date.now()}`,
      studentIds: [],
      assignedTeacherIds: pkg.assignedTeacherIds && pkg.assignedTeacherIds.length > 0 ? pkg.assignedTeacherIds : [pkg.teacherId],
      archivedAt: null,
      isPrivate: !!pkg.isPrivate
    };
    mockClasses.unshift(newPkg);
    return newPkg;
  },

  adminUpdatePackage(packageId: string, updates: Partial<ClassRecord>): ClassRecord | null {
    const pkg = mockClasses.find(c => c.id === packageId);
    if (!pkg) return null;
    Object.assign(pkg, updates);
    return pkg;
  },

  adminArchivePackage(packageId: string): boolean {
    const pkg = mockClasses.find(c => c.id === packageId);
    if (!pkg) return false;
    pkg.archivedAt = new Date().toISOString();
    if (pkg.announcement) pkg.announcement.isPubliclyAnnounced = false;
    return true;
  },

  adminRestorePackage(packageId: string): boolean {
    const pkg = mockClasses.find(c => c.id === packageId);
    if (!pkg) return false;
    pkg.archivedAt = null;
    return true;
  },

  adminDeletePackagePermanently(packageId: string): boolean {
    const idx = mockClasses.findIndex(c => c.id === packageId);
    if (idx === -1) return false;
    mockClasses.splice(idx, 1);
    return true;
  },

  adminTogglePackageVisibility(packageId: string, isPublic: boolean): boolean {
    const pkg = mockClasses.find(c => c.id === packageId);
    if (!pkg) return false;
    pkg.isPrivate = !isPublic;
    if (pkg.announcement) {
      pkg.announcement.isPubliclyAnnounced = isPublic;
    }
    return true;
  },

  enrollStudentInPublicPackage(studentId: string, classId: string) {
    const student = this.getStudentById(studentId);
    const cls = this.getClassById(classId);
    if (!student || !cls) return { success: false, message: "Student or package not found." };

    if (!cls.studentIds.includes(studentId)) {
      cls.studentIds.push(studentId);
    }
    if (!student.enrolledClassIds.includes(classId)) {
      student.enrolledClassIds.push(classId);
    }

    const rate = this.calculateEffectiveRate(cls);
    student.billingTransactions.push({
      id: `tx_${Date.now()}`,
      studentId,
      timestamp: new Date().toISOString(),
      type: "ENROLLMENT",
      className: cls.name,
      packageName: cls.curriculumPackageName,
      amount: rate,
      effectiveRateApplied: rate,
      studentVolumeAtTime: cls.studentIds.length,
      description: `Registered for public teacher package: ${cls.name}`
    });

    return {
      success: true,
      message: `Enrolled in ${cls.name}! Effective package rate: $${rate}.`
    };
  },

  // --- Teacher Announcement Management ---
  toggleAnnouncement(classId: string, isPublic: boolean): boolean {
    const cls = this.getClassById(classId);
    if (!cls || !cls.announcement) return false;
    cls.announcement.isPubliclyAnnounced = isPublic;
    return true;
  },

  updateAnnouncement(classId: string, patch: Partial<TeacherAnnouncement>): boolean {
    const cls = this.getClassById(classId);
    if (!cls) return false;
    if (!cls.announcement) {
      cls.announcement = {
        teacherName: "Teacher",
        teacherTitle: "",
        description: "",
        prerequisites: [],
        isPubliclyAnnounced: false,
        publishedAt: new Date().toISOString(),
        ...patch
      };
    } else {
      Object.assign(cls.announcement, patch);
    }
    return true;
  },

  // --- Student Pending Registration Queue ---
  submitRegistrationRequest(classId: string, studentName: string, studentEmail: string, prereqConfirmed: boolean) {
    const cls = this.getClassById(classId);
    if (!cls) return { success: false, message: "Package not found." };
    if (!prereqConfirmed) return { success: false, message: "You must confirm all prerequisites." };

    const existing = mockPendingRegistrations.find(r => r.classId === classId && r.studentEmail === studentEmail);
    if (existing) return { success: false, message: "A registration request for this package is already pending." };

    mockPendingRegistrations.push({
      id: `reg_${Date.now()}`,
      classId,
      className: cls.name,
      curriculumPackageName: cls.curriculumPackageName,
      teacherId: cls.teacherId,
      studentName,
      studentEmail,
      submittedAt: new Date().toISOString(),
      status: "PENDING"
    });
    return { success: true, message: `Registration request submitted for ${cls.name}. The teacher will review and accept soon.` };
  },

  getPendingRegistrationsForTeacher(teacherId: string) {
    return mockPendingRegistrations.filter(r => r.teacherId === teacherId && r.status === "PENDING");
  },

  approveRegistration(registrationId: string, studentId: string) {
    const reg = mockPendingRegistrations.find(r => r.id === registrationId);
    if (!reg) return { success: false, message: "Registration not found." };
    reg.status = "APPROVED";
    return this.enrollStudentInPublicPackage(studentId, reg.classId);
  },

  rejectRegistration(registrationId: string, reason: string) {
    const reg = mockPendingRegistrations.find(r => r.id === registrationId);
    if (!reg) return false;
    reg.status = "REJECTED";
    reg.rejectionReason = reason;
    return true;
  },

  getAllPendingRegistrations() {
    return mockPendingRegistrations;
  },

  // --- Admin Curriculum Governance & Teacher Permissions ---
  getApprovedCurriculumsForTeacher(teacherId: string, includeSuspended: boolean = false): CurriculumSpec[] {
    const assignment = mockTeacherAssignments.find(t => t.teacherId === teacherId);
    if (!assignment) return []; // STRICT: If unassigned, return empty array!
    
    return assignment.approvedCurriculumIds
      .filter(id => {
        // If includeSuspended is false, check curriculum status
        if (!includeSuspended) {
          const status = assignment.curriculumStatuses?.[id] || "ACTIVE";
          if (status === "SUSPENDED") return false;
        }
        // Also ensure curriculum itself is not archived
        const spec = REGISTERED_CURRICULUM_SPECS[id];
        return spec && !spec.archivedAt;
      })
      .map(id => REGISTERED_CURRICULUM_SPECS[id])
      .filter((c): c is CurriculumSpec => c !== undefined);
  },

  getTeacherCurriculumStatus(teacherId: string, curriculumId: string): TeacherCurriculumStatus | "UNASSIGNED" {
    const assignment = mockTeacherAssignments.find(t => t.teacherId === teacherId);
    if (!assignment || !assignment.approvedCurriculumIds.includes(curriculumId)) return "UNASSIGNED";
    return assignment.curriculumStatuses?.[curriculumId] || "ACTIVE";
  },

  setTeacherCurriculumStatus(teacherId: string, curriculumId: string, status: "ACTIVE" | "SUSPENDED" | "REVOKED"): boolean {
    let assignment = mockTeacherAssignments.find(t => t.teacherId === teacherId);
    if (!assignment) {
      if (status === "REVOKED") return true;
      assignment = {
        teacherId,
        teacherName: "Teacher",
        teacherEmail: `${teacherId}@platform.com`,
        approvedCurriculumIds: [curriculumId],
        curriculumStatuses: { [curriculumId]: status },
        permissions: { ...DEFAULT_TEACHER_PERMISSIONS }
      };
      mockTeacherAssignments.push(assignment);
      return true;
    }

    if (!assignment.curriculumStatuses) assignment.curriculumStatuses = {};

    if (status === "REVOKED") {
      assignment.approvedCurriculumIds = assignment.approvedCurriculumIds.filter(id => id !== curriculumId);
      delete assignment.curriculumStatuses[curriculumId];
    } else {
      if (!assignment.approvedCurriculumIds.includes(curriculumId)) {
        assignment.approvedCurriculumIds.push(curriculumId);
      }
      assignment.curriculumStatuses[curriculumId] = status;
    }
    return true;
  },

  isCurriculumActiveForTeacher(teacherId: string, curriculumId: string): boolean {
    const assignment = mockTeacherAssignments.find(t => t.teacherId === teacherId);
    if (!assignment || !assignment.approvedCurriculumIds.includes(curriculumId)) return false;
    const status = assignment.curriculumStatuses?.[curriculumId] || "ACTIVE";
    const spec = REGISTERED_CURRICULUM_SPECS[curriculumId];
    return status === "ACTIVE" && !!spec && !spec.archivedAt;
  },

  getAllTeacherAssignments(): TeacherAssignment[] {
    return mockTeacherAssignments;
  },

  getTeacherPermissions(teacherId: string): TeacherPermissions {
    const assignment = mockTeacherAssignments.find(t => t.teacherId === teacherId);
    return assignment?.permissions ?? { ...DEFAULT_TEACHER_PERMISSIONS };
  },

  updateTeacherPermissions(teacherId: string, permissions: Partial<TeacherPermissions>): boolean {
    const assignment = mockTeacherAssignments.find(t => t.teacherId === teacherId);
    if (!assignment) return false;
    assignment.permissions = { ...assignment.permissions, ...permissions };
    return true;
  },

  assignCurriculumToTeacher(teacherId: string, curriculumId: string, status: TeacherCurriculumStatus = "ACTIVE"): boolean {
    return this.setTeacherCurriculumStatus(teacherId, curriculumId, status);
  },

  revokeCurriculumFromTeacher(teacherId: string, curriculumId: string): boolean {
    return this.setTeacherCurriculumStatus(teacherId, curriculumId, "REVOKED");
  },

  importOfficialCurriculumSpec(spec: CurriculumSpec): boolean {
    REGISTERED_CURRICULUM_SPECS[spec.id] = spec;
    return true;
  },

  // ── Curriculum Lifecycle: Add ─────────────────────────────────────────────
  addCurriculumSpec(spec: CurriculumSpec): { success: boolean; message: string } {
    if (REGISTERED_CURRICULUM_SPECS[spec.id]) {
      return { success: false, message: `A curriculum with ID "${spec.id}" already exists.` };
    }
    REGISTERED_CURRICULUM_SPECS[spec.id] = {
      ...spec,
      registeredAt: new Date().toISOString().split("T")[0],
      archivedAt: null,
      policy: spec.policy ?? { ...DEFAULT_CURRICULUM_POLICY }
    };
    return { success: true, message: `Curriculum "${spec.name}" registered successfully.` };
  },

  updateCurriculumPolicy(curriculumId: string, policy: CurriculumPolicy): boolean {
    if (!REGISTERED_CURRICULUM_SPECS[curriculumId]) return false;
    REGISTERED_CURRICULUM_SPECS[curriculumId].policy = policy;
    return true;
  },

  // ── Curriculum Lifecycle: Dependency Inspection ───────────────────────────
  getCurriculumDependencies(curriculumId: string): {
    authorizedTeachers: TeacherAssignment[];
    affectedPackages: ClassRecord[];
  } {
    const authorizedTeachers = mockTeacherAssignments.filter(t =>
      t.approvedCurriculumIds.includes(curriculumId)
    );
    const affectedPackages = mockClasses.filter(
      c => c.curriculumPackageId === curriculumId
    );
    return { authorizedTeachers, affectedPackages };
  },

  // ── Curriculum Lifecycle: Remove (cascade archive) ────────────────────────
  removeCurriculumSpec(curriculumId: string): { success: boolean; report: CurriculumRemovalReport | null } {
    const spec = REGISTERED_CURRICULUM_SPECS[curriculumId];
    if (!spec) return { success: false, report: null };

    const report: CurriculumRemovalReport = {
      curriculumId,
      curriculumName: spec.name,
      revokedFromTeachers: [],
      archivedPackages: []
    };

    // 1. Revoke from all teacher assignments
    mockTeacherAssignments.forEach(t => {
      if (t.approvedCurriculumIds.includes(curriculumId)) {
        t.approvedCurriculumIds = t.approvedCurriculumIds.filter(id => id !== curriculumId);
        report.revokedFromTeachers.push(t.teacherName);
      }
    });

    // 2. Archive all packages using this curriculum
    mockClasses.forEach(cls => {
      if (cls.curriculumPackageId === curriculumId) {
        (cls as any).archivedAt = new Date().toISOString();
        report.archivedPackages.push(cls.name);
      }
    });

    // 3. Mark curriculum as archived (soft delete)
    REGISTERED_CURRICULUM_SPECS[curriculumId].archivedAt = new Date().toISOString().split("T")[0];
    delete REGISTERED_CURRICULUM_SPECS[curriculumId];

    return { success: true, report };
  },

  // ── Admin Executive Suite Methods ─────────────────────────────────────────
  getAdminAlarms(): AdminAlarm[] {
    // Dynamically calculate live alarms alongside static ones
    const liveAlarms: AdminAlarm[] = [];

    // 1. Pending registration backlog alarm
    const pendingCount = mockPendingRegistrations.filter(r => r.status === "PENDING").length;
    if (pendingCount > 0) {
      liveAlarms.push({
        id: "live_alarm_pending",
        title: "Unreviewed Student Registrations Backlog",
        message: `${pendingCount} student registration request(s) are awaiting teacher review.`,
        severity: pendingCount > 3 ? "CRITICAL" : "WARNING",
        category: "PENDING_REGISTRATION",
        timestamp: new Date().toISOString(),
        resolved: false,
        actionLabel: "Review Registrations"
      });
    }

    return [...liveAlarms, ...mockAdminAlarms];
  },

  resolveAdminAlarm(alarmId: string): boolean {
    const alarm = mockAdminAlarms.find(a => a.id === alarmId);
    if (!alarm) return false;
    alarm.resolved = true;
    return true;
  },

  getAllBroadcasts(): AdminBroadcast[] {
    return [...mockAdminBroadcasts].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
  },

  createBroadcast(broadcast: Omit<AdminBroadcast, "id" | "sentAt">): AdminBroadcast {
    const newEntry: AdminBroadcast = {
      ...broadcast,
      id: `bcast_${Date.now()}`,
      sentAt: new Date().toISOString(),
      readCount: 0
    };
    mockAdminBroadcasts.unshift(newEntry);
    return newEntry;
  },

  getAllAdminNotes(): AdminDirectiveNote[] {
    return [...mockAdminDirectiveNotes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createAdminNote(note: Omit<AdminDirectiveNote, "id" | "createdAt">): AdminDirectiveNote {
    const newEntry: AdminDirectiveNote = {
      ...note,
      id: `note_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    mockAdminDirectiveNotes.unshift(newEntry);
    return newEntry;
  },

  updateAdminNote(id: string, update: Partial<AdminDirectiveNote>): boolean {
    const note = mockAdminDirectiveNotes.find(n => n.id === id);
    if (!note) return false;
    Object.assign(note, update);
    return true;
  },

  deleteAdminNote(id: string): boolean {
    mockAdminDirectiveNotes = mockAdminDirectiveNotes.filter(n => n.id !== id);
    return true;
  },

  getExecutiveAuditReport(): ExecutiveAuditReport {
    // 1. Academic Readiness Breakdown calculated from student overall grades
    let readyCount = 0;
    let readyWithSupportCount = 0;
    let bridgingRecommendedCount = 0;
    let foundationRequiredCount = 0;

    mockStudents.forEach(s => {
      const grade = s.overallGrade ?? 80;
      if (grade >= 85) readyCount++;
      else if (grade >= 70) readyWithSupportCount++;
      else if (grade >= 50) bridgingRecommendedCount++;
      else foundationRequiredCount++;
    });

    const totalDiagnosed = readyCount + readyWithSupportCount + bridgingRecommendedCount + foundationRequiredCount;
    const masteryPercentage = totalDiagnosed > 0 ? Math.round(((readyCount + readyWithSupportCount) / totalDiagnosed) * 100) : 85;

    // 2. Financial Metrics
    const activeClasses = mockClasses.filter(c => !c.archivedAt);
    const archivedClasses = mockClasses.filter(c => !!c.archivedAt);

    let grossVolumeUSD = 0;
    let totalEnrolled = 0;

    activeClasses.forEach(c => {
      const rate = this.calculateEffectiveRate(c);
      const enrolled = c.studentIds.length;
      totalEnrolled += enrolled;
      grossVolumeUSD += rate * enrolled;
    });

    const averageRate = totalEnrolled > 0 ? Math.round(grossVolumeUSD / totalEnrolled) : 40;

    // 3. Teacher Metrics
    const leadReviewerCount = mockTeacherAssignments.filter(t => t.permissions?.canReviewCurriculumTanks).length;

    let parentNotesCount = 0;
    mockStudents.forEach(s => { parentNotesCount += s.followUpLogs.length; });

    return {
      timestamp: new Date().toISOString(),
      academics: {
        totalStudents: mockStudents.length,
        readyCount,
        readyWithSupportCount,
        bridgingRecommendedCount,
        foundationRequiredCount,
        masteryPercentage
      },
      financials: {
        totalActivePackages: activeClasses.length,
        archivedPackagesCount: archivedClasses.length,
        totalEnrolledStudents: totalEnrolled,
        grossVolumeUSD,
        volumeDiscountSavingsUSD: 140, // Tiered discount savings
        averageRatePerStudent: averageRate
      },
      teachers: {
        totalTeachers: mockTeacherAssignments.length,
        authorizedTeacherCount: mockTeacherAssignments.filter(t => t.approvedCurriculumIds.length > 0).length,
        leadReviewerCount,
        totalParentNotesSent: parentNotesCount
      },
      aiEngine: {
        activeProvider: "Gemini 2.5 Flash + Ollama Local Fallback",
        failoverEnabled: true,
        distillationMemoryCount: 42
      }
    };
  },

  // ── Question DNA Tank Bank Removal & Pruning Methods ─────────────────────
  getQuestionDNABank(lessonId: string): QuestionDNA[] {
    return activeQuestionDNABanks[lessonId] || [];
  },

  purgeEntireLessonTank(lessonId: string): boolean {
    activeQuestionDNABanks[lessonId] = [];
    return true;
  },

  purgeEntireCurriculumTanks(curriculumId: string): boolean {
    const spec = REGISTERED_CURRICULUM_SPECS[curriculumId];
    if (!spec) return false;
    spec.lessons.forEach(l => {
      activeQuestionDNABanks[l.id] = [];
    });
    return true;
  },

  deleteQuestionDNAItem(lessonId: string, bQuestionId: string): boolean {
    const bank = activeQuestionDNABanks[lessonId];
    if (!bank) return false;
    activeQuestionDNABanks[lessonId] = bank.filter(dna => dna.bQuestion.id !== bQuestionId);
    return true;
  },

  deletePreTrial(lessonId: string, bQuestionId: string, trialId: string): boolean {
    const bank = activeQuestionDNABanks[lessonId];
    if (!bank) return false;
    const dna = bank.find(d => d.bQuestion.id === bQuestionId);
    if (!dna) return false;
    dna.preTrials = dna.preTrials.filter(t => t.id !== trialId);
    return true;
  },

  deleteCQuestion(lessonId: string, bQuestionId: string, cQuestionId: string): boolean {
    const bank = activeQuestionDNABanks[lessonId];
    if (!bank) return false;
    const dna = bank.find(d => d.bQuestion.id === bQuestionId);
    if (!dna) return false;
    dna.cQuestions = dna.cQuestions.filter(c => c.id !== cQuestionId);
    return true;
  },

  restoreDefaultLessonTank(lessonId: string): boolean {
    if (DEFAULT_QUESTION_DNA_BANKS[lessonId]) {
      activeQuestionDNABanks[lessonId] = JSON.parse(JSON.stringify(DEFAULT_QUESTION_DNA_BANKS[lessonId]));
      return true;
    }
    return false;
  },

  // ── Multi-Policy Profile Management Methods ──────────────────────────────
  getCurriculumPolicyProfiles(curriculumId: string): CurriculumPolicyProfile[] {
    const spec = REGISTERED_CURRICULUM_SPECS[curriculumId];
    if (!spec) return DEFAULT_POLICY_PROFILES;
    if (!spec.policies || spec.policies.length === 0) {
      spec.policies = JSON.parse(JSON.stringify(DEFAULT_POLICY_PROFILES));
      spec.activePolicyId = "pol_standard";
    }
    return spec.policies!;
  },

  addPolicyProfileToCurriculum(curriculumId: string, profile: Omit<CurriculumPolicyProfile, "id">): CurriculumPolicyProfile | null {
    const spec = REGISTERED_CURRICULUM_SPECS[curriculumId];
    if (!spec) return null;
    const profiles = this.getCurriculumPolicyProfiles(curriculumId);
    const newProfile: CurriculumPolicyProfile = {
      ...profile,
      id: `pol_${Date.now()}`
    };
    profiles.push(newProfile);
    spec.policies = profiles;
    return newProfile;
  },

  updatePolicyProfile(curriculumId: string, profileId: string, update: Partial<CurriculumPolicyProfile>): boolean {
    const profiles = this.getCurriculumPolicyProfiles(curriculumId);
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return false;
    Object.assign(profile, update);
    return true;
  },

  deletePolicyProfile(curriculumId: string, profileId: string): boolean {
    const spec = REGISTERED_CURRICULUM_SPECS[curriculumId];
    if (!spec || !spec.policies) return false;
    spec.policies = spec.policies.filter(p => p.id !== profileId);
    if (spec.activePolicyId === profileId && spec.policies.length > 0) {
      spec.activePolicyId = spec.policies[0].id;
    }
    return true;
  },

  setActivePolicyProfile(curriculumId: string, profileId: string): boolean {
    const spec = REGISTERED_CURRICULUM_SPECS[curriculumId];
    if (!spec) return false;
    const profiles = this.getCurriculumPolicyProfiles(curriculumId);
    const target = profiles.find(p => p.id === profileId);
    if (!target) return false;
    spec.activePolicyId = profileId;
    spec.policy = { ...target };
    return true;
  },

  getCurriculumDomainPolicies(curriculumId: string): CurriculumDomainPolicies {
    const spec = REGISTERED_CURRICULUM_SPECS[curriculumId];
    return spec?.policy?.domains || DEFAULT_DOMAIN_POLICIES;
  },

  updateCurriculumDomainPolicies(curriculumId: string, domains: Partial<CurriculumDomainPolicies>): boolean {
    const spec = REGISTERED_CURRICULUM_SPECS[curriculumId];
    if (!spec) return false;
    if (!spec.policy) spec.policy = { ...DEFAULT_CURRICULUM_POLICY };
    spec.policy.domains = {
      ...(spec.policy.domains || DEFAULT_DOMAIN_POLICIES),
      ...domains
    };
    return true;
  },

  checkDomainPermission(
    curriculumId: string,
    domain: keyof CurriculumDomainPolicies,
    action: "canAdd" | "canModify" | "canRemove"
  ): { allowed: boolean; reason?: string } {
    const policies = this.getCurriculumDomainPolicies(curriculumId);
    const domainPolicy = policies[domain];
    if (!domainPolicy) return { allowed: true };
    const allowed = domainPolicy[action];
    if (!allowed) {
      const actionName = action === "canAdd" ? "ADD" : action === "canModify" ? "MODIFY" : "REMOVE";
      const domainName = domain === "questionTank" ? "Question DNA Tank" : domain === "syllabus" ? "Syllabus Structure" : domain === "packages" ? "Packages & Offerings" : "Carousel Content";
      return {
        allowed: false,
        reason: `Policy Restriction: Teachers do not have permission to ${actionName} items in ${domainName}. An administrative proposal or approval is required.`
      };
    }
    return { allowed: true };
  },

  adminUpdateCurriculumStructure(
    curriculumId: string,
    patch: {
      name?: string;
      chapters?: string[];
      lessons?: Array<{ id: string; title: string }>;
      notes?: string;
      version?: string;
    }
  ): { success: boolean; message: string } {
    const spec = REGISTERED_CURRICULUM_SPECS[curriculumId];
    if (!spec) return { success: false, message: `Curriculum "${curriculumId}" not found in registry.` };

    if (patch.name !== undefined) spec.name = patch.name;
    if (patch.chapters !== undefined) spec.chapters = patch.chapters;
    if (patch.lessons !== undefined) spec.lessons = patch.lessons;
    if (patch.version !== undefined) spec.version = patch.version;
    if (patch.notes !== undefined) {
      if (!spec.policy) spec.policy = { ...DEFAULT_CURRICULUM_POLICY };
      spec.policy.notes = (spec.policy.notes ? spec.policy.notes + "\n\n" : "") +
        `[AI Studio Update — ${new Date().toISOString()}]\n${patch.notes}`;
    }

    return {
      success: true,
      message: `Curriculum "${spec.name}" updated: ${[
        patch.chapters ? `${patch.chapters.length} chapters` : "",
        patch.lessons ? `${patch.lessons.length} lessons` : "",
        patch.notes ? "notes updated" : ""
      ].filter(Boolean).join(", ")}.`
    };
  },

  // --- Teacher Soft Lesson Exclusion (Teacher hides a lesson in their class, Admin master remains intact) ---
  toggleTeacherLessonExclusion(teacherId: string, curriculumId: string, lessonId: string): { isExcluded: boolean; message: string } {
    const assignment = mockTeacherAssignments.find(a => a.teacherId === teacherId);
    if (!assignment) return { isExcluded: false, message: "Teacher assignment not found." };
    if (!assignment.excludedLessonIds) assignment.excludedLessonIds = {};
    const excludedList = assignment.excludedLessonIds[curriculumId] || [];

    const isCurrentlyExcluded = excludedList.includes(lessonId);
    if (isCurrentlyExcluded) {
      assignment.excludedLessonIds[curriculumId] = excludedList.filter(id => id !== lessonId);
      return { isExcluded: false, message: `Lesson restored to your active teaching track.` };
    } else {
      assignment.excludedLessonIds[curriculumId] = [...excludedList, lessonId];
      return { isExcluded: true, message: `Lesson excluded from your active teaching track. (Admin master copy remains safe)` };
    }
  },

  getEffectiveLessonsForTeacher(teacherId: string, curriculumId: string): Array<{ id: string; title: string; isExcluded: boolean }> {
    const spec = REGISTERED_CURRICULUM_SPECS[curriculumId];
    if (!spec) return [];
    const assignment = mockTeacherAssignments.find(a => a.teacherId === teacherId);
    const excludedList = assignment?.excludedLessonIds?.[curriculumId] || [];
    return spec.lessons.map(l => ({
      ...l,
      isExcluded: excludedList.includes(l.id)
    }));
  },

  // --- Admin Master Lesson Management ---
  adminDeleteLessonFromMaster(curriculumId: string, lessonId: string): { success: boolean; message: string } {
    const spec = REGISTERED_CURRICULUM_SPECS[curriculumId];
    if (!spec) return { success: false, message: "Curriculum not found." };
    const initialCount = spec.lessons.length;
    spec.lessons = spec.lessons.filter(l => l.id !== lessonId);
    if (spec.lessons.length === initialCount) return { success: false, message: "Lesson ID not found in master spec." };
    return { success: true, message: `Lesson permanently removed from Master Registry.` };
  },

  adminUpdateMasterLesson(curriculumId: string, lessonId: string, newTitle: string): { success: boolean; message: string } {
    const spec = REGISTERED_CURRICULUM_SPECS[curriculumId];
    if (!spec) return { success: false, message: "Curriculum not found." };
    const target = spec.lessons.find(l => l.id === lessonId);
    if (!target) return { success: false, message: "Lesson ID not found." };
    target.title = newTitle;
    return { success: true, message: `Master lesson updated to "${newTitle}".` };
  },

  // --- Sovereign Per-Curriculum Rulebook Engine ---
  getCurriculumRules(curriculumId: string): CurriculumRules {
    const spec = REGISTERED_CURRICULUM_SPECS[curriculumId];
    if (spec?.rules) return spec.rules;
    const initialRules: CurriculumRules = JSON.parse(JSON.stringify(DEFAULT_CURRICULUM_RULES));
    if (spec) spec.rules = initialRules;
    return initialRules;
  },

  updateCurriculumRules(curriculumId: string, patch: Partial<CurriculumRules>): { success: boolean; message: string } {
    const spec = REGISTERED_CURRICULUM_SPECS[curriculumId];
    if (!spec) return { success: false, message: `Curriculum "${curriculumId}" not found.` };
    const currentRules = spec.rules || JSON.parse(JSON.stringify(DEFAULT_CURRICULUM_RULES));

    if (patch.lessonsPolicy) currentRules.lessonsPolicy = { ...currentRules.lessonsPolicy, ...patch.lessonsPolicy };
    if (patch.packageRules) currentRules.packageRules = { ...currentRules.packageRules, ...patch.packageRules };
    if (patch.teacherRules) currentRules.teacherRules = { ...currentRules.teacherRules, ...patch.teacherRules };
    if (patch.domainPolicies) currentRules.domainPolicies = { ...currentRules.domainPolicies, ...patch.domainPolicies };
    if (patch.assessmentRules) currentRules.assessmentRules = { ...currentRules.assessmentRules, ...patch.assessmentRules };

    spec.rules = currentRules;
    return { success: true, message: `Sovereign rules updated for "${spec.name}".` };
  },

  isTeacherAuthorizedForCurriculum(curriculumId: string, teacherId: string): boolean {
    const rules = this.getCurriculumRules(curriculumId);
    if (!rules.teacherRules.allowedTeacherIds.includes(teacherId)) return false;
    if (rules.teacherRules.suspendedTeacherIds.includes(teacherId)) return false;
    return true;
  },

  toggleTeacherCurriculumSuspension(curriculumId: string, teacherId: string): { isSuspended: boolean; message: string } {
    const rules = this.getCurriculumRules(curriculumId);
    const suspended = rules.teacherRules.suspendedTeacherIds;
    const isCurrentlySuspended = suspended.includes(teacherId);

    if (isCurrentlySuspended) {
      rules.teacherRules.suspendedTeacherIds = suspended.filter(id => id !== teacherId);
      return { isSuspended: false, message: `Teacher ${teacherId} reinstated for ${curriculumId}.` };
    } else {
      rules.teacherRules.suspendedTeacherIds = [...suspended, teacherId];
      return { isSuspended: true, message: `Teacher ${teacherId} suspended from ${curriculumId}.` };
    }
  },

  // --- Admin Curriculum Cloning & Versioning Engine (Clones for New Academic Year / Version) ---
  adminCloneCurriculum(
    sourceCurriculumId: string,
    newVersionTag: string,
    newName?: string
  ): { success: boolean; newCurriculumId: string; message: string } {
    const source = REGISTERED_CURRICULUM_SPECS[sourceCurriculumId];
    if (!source) return { success: false, newCurriculumId: "", message: `Source curriculum "${sourceCurriculumId}" not found.` };

    const cleanSlug = (newName || `${source.name} (${newVersionTag})`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    
    const newId = `${cleanSlug}-${Date.now().toString(36).slice(-4)}`;

    const clonedSpec: CurriculumSpec = {
      id: newId,
      name: newName || `${source.name} (${newVersionTag})`,
      publisher: source.publisher,
      subject: source.subject,
      gradeLevel: source.gradeLevel,
      version: newVersionTag,
      terms: JSON.parse(JSON.stringify(source.terms)),
      chapters: JSON.parse(JSON.stringify(source.chapters)),
      lessons: JSON.parse(JSON.stringify(source.lessons)),
      policy: source.policy ? { ...source.policy } : { ...DEFAULT_CURRICULUM_POLICY },
      rules: source.rules ? JSON.parse(JSON.stringify(source.rules)) : JSON.parse(JSON.stringify(DEFAULT_CURRICULUM_RULES)),
      registeredAt: new Date().toISOString()
    };

    REGISTERED_CURRICULUM_SPECS[newId] = clonedSpec;

    return {
      success: true,
      newCurriculumId: newId,
      message: `Successfully cloned "${source.name}" as new version "${clonedSpec.name}" (ID: ${newId}). All lessons, chapters, policies, and sovereign rules duplicated.`
    };
  }
};

// Seed Question DNA Store
const DEFAULT_QUESTION_DNA_BANKS: Record<string, QuestionDNA[]> = {
  "CAROUSEL-PHYS-EB-MECH-1-1": lesson11QuestionDNA,
  "CAROUSEL-PHYS-EB-MECH-1-2": lesson12QuestionDNA,
  "CAROUSEL-PHYS-EB-MECH-1-3": lesson13QuestionDNA,
  "CAROUSEL-PHYS-EB-MECH-1-4": lesson14QuestionDNA,
  "CAROUSEL-PHYS-EB-MECH-1-5": lesson15QuestionDNA,
  "CAROUSEL-PHYS-EB-MECH-1-6": lesson16QuestionDNA,
  "CAROUSEL-PHYS-EB-MECH-1-7": lesson17QuestionDNA,
  "CAROUSEL-PHYS-EB-MECH-1-8": lesson18QuestionDNA,
  "CAROUSEL-PHYS-EB-MECH-1-9": lesson19QuestionDNA,
  "CAROUSEL-PHYS-EB-MECH-1-10": lesson110QuestionDNA,
  "CAROUSEL-PHYS-EB-MECH-1-11": lesson111QuestionDNA,
  "CAROUSEL-PHYS-EB-MECH-1-12": lesson112QuestionDNA,
};

let activeQuestionDNABanks: Record<string, QuestionDNA[]> = JSON.parse(JSON.stringify(DEFAULT_QUESTION_DNA_BANKS));
