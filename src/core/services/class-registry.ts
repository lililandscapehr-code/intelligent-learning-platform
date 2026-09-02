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
export interface CurriculumPolicy {
  maxAuthorizedTeachers: number;        // 0 = unlimited
  teacherMustBeVerified: boolean;       // teacher profile verified before assignment
  allowTeacherCustomSlides: boolean;    // can teacher add their own slides?
  allowTeacherCustomQuestions: boolean; // can teacher add their own questions?
  aiTankEnabled: boolean;               // admin can push AI Question DNA tanks
  expiryDate: string | null;            // ISO date "2027-06-30" or null = no expiry
  notes: string;                        // admin internal notes
}

export const DEFAULT_CURRICULUM_POLICY: CurriculumPolicy = {
  maxAuthorizedTeachers: 0,
  teacherMustBeVerified: false,
  allowTeacherCustomSlides: true,
  allowTeacherCustomQuestions: true,
  aiTankEnabled: true,
  expiryDate: null,
  notes: ""
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
  canAddCarousels: boolean;       // Whom of teachers can add carousels, whom can not
  canContactParents: boolean;     // Whom of teachers can contact parents, whom can not
  canRecordDemos: boolean;        // Permission to use Screen/Mic recording studio
  canHostLiveSessions: boolean;   // Permission to schedule Meet/Zoom live classes
}

export const DEFAULT_TEACHER_PERMISSIONS: TeacherPermissions = {
  canAddCarousels: true,
  canContactParents: true,
  canRecordDemos: true,
  canHostLiveSessions: true
};

export interface TeacherAssignment {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  approvedCurriculumIds: string[];
  permissions: TeacherPermissions;
}

export interface ClassRecord {
  id: string;
  teacherId: string;
  name: string;
  curriculumPackageId: string;
  curriculumPackageName: string;
  gradeLevel: string;
  scope: ClassPackageScope;
  financials: PackageFinancials;
  studentIds: string[];
  announcement?: TeacherAnnouncement;
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

let mockTeacherAssignments: TeacherAssignment[] = [
  {
    teacherId: "teacher_1",
    teacherName: "Dr. Hassan Youssef",
    teacherEmail: "teacher@platform.com",
    approvedCurriculumIds: [
      "egypt-baccalaureate-second-year-physics-part1",
      "egypt-baccalaureate-second-year-physics-part2",
      "cambridge-igcse-0580",
      "egypt-secondary1-integrated-science"
    ],
    permissions: {
      canAddCarousels: true,
      canContactParents: true,
      canRecordDemos: true,
      canHostLiveSessions: true
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
    permissions: {
      canAddCarousels: false,  // Restricted: Cannot create carousels
      canContactParents: false, // Restricted: Cannot contact parents directly
      canRecordDemos: true,
      canHostLiveSessions: true
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
      .filter((c) => c.announcement && c.announcement.isPubliclyAnnounced)
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
          announcement: c.announcement!
        };
      });
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
  getApprovedCurriculumsForTeacher(teacherId: string): CurriculumSpec[] {
    const assignment = mockTeacherAssignments.find(t => t.teacherId === teacherId);
    if (!assignment) return Object.values(REGISTERED_CURRICULUM_SPECS); // Fallback to all if unassigned
    return assignment.approvedCurriculumIds
      .map(id => REGISTERED_CURRICULUM_SPECS[id])
      .filter((c): c is CurriculumSpec => c !== undefined);
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

  assignCurriculumToTeacher(teacherId: string, curriculumId: string): boolean {
    let assignment = mockTeacherAssignments.find(t => t.teacherId === teacherId);
    if (!assignment) {
      assignment = {
        teacherId,
        teacherName: "Teacher",
        teacherEmail: `${teacherId}@platform.com`,
        approvedCurriculumIds: [],
        permissions: { ...DEFAULT_TEACHER_PERMISSIONS }
      };
      mockTeacherAssignments.push(assignment);
    }
    if (!assignment.approvedCurriculumIds.includes(curriculumId)) {
      assignment.approvedCurriculumIds.push(curriculumId);
    }
    return true;
  },

  revokeCurriculumFromTeacher(teacherId: string, curriculumId: string): boolean {
    const assignment = mockTeacherAssignments.find(t => t.teacherId === teacherId);
    if (!assignment) return false;
    assignment.approvedCurriculumIds = assignment.approvedCurriculumIds.filter(id => id !== curriculumId);
    return true;
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
  }
};
