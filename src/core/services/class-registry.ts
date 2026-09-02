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
  status: "scheduled" | "live" | "completed";
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
}

// Initial Mock Data
let mockClasses: ClassRecord[] = [
  {
    id: "cls_101",
    teacherId: "teacher_1",
    name: "Year 11 Physics - Section A (Full Term 1)",
    curriculumPackageId: "egypt-baccalaureate-second-year-physics",
    curriculumPackageName: "Egyptian Baccalaureate 2nd Year Physics",
    gradeLevel: "11",
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
    curriculumPackageId: "egypt-baccalaureate-second-year-physics",
    curriculumPackageName: "Egyptian Baccalaureate 2nd Year Physics",
    gradeLevel: "11",
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
    title: "Weekly Review: Vectors & Forces",
    scheduledTime: new Date(Date.now() + 86400000).toISOString(),
    meetingLink: "https://meet.google.com/abc-defg-hij",
    status: "scheduled"
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
  updateSessionStatus(sessionId: string, status: LiveSession["status"]): void {
    const session = mockSessions.find((s) => s.id === sessionId);
    if (session) {
      session.status = status;
    }
  }
};
