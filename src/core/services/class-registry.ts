export interface StudentProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  attendanceRate: number;
  overallGrade: number;
  weaknesses: string[];
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
  gradeLevel: string;
  studentIds: string[];
}

// Mock initial data
let mockClasses: ClassRecord[] = [
  {
    id: "cls_101",
    teacherId: "teacher_1",
    name: "Year 11 Physics - Section A",
    gradeLevel: "11",
    studentIds: ["std_001", "std_002", "std_003"],
  },
  {
    id: "cls_102",
    teacherId: "teacher_1",
    name: "Year 12 Advanced Physics",
    gradeLevel: "12",
    studentIds: ["std_004", "std_005"],
  },
];

let mockStudents: StudentProfile[] = [
  { id: "std_001", name: "Ahmed Youssef", attendanceRate: 95, overallGrade: 88, weaknesses: ["Vector Components", "Friction Analysis"] },
  { id: "std_002", name: "Sara Mahmoud", attendanceRate: 98, overallGrade: 94, weaknesses: ["Circular Motion"] },
  { id: "std_003", name: "Omar Hassan", attendanceRate: 82, overallGrade: 76, weaknesses: ["Tension Forces", "Free Body Diagrams"] },
  { id: "std_004", name: "Laila Karim", attendanceRate: 100, overallGrade: 98, weaknesses: [] },
  { id: "std_005", name: "Ziad Fares", attendanceRate: 90, overallGrade: 85, weaknesses: ["Energy Conservation"] },
];

let mockSessions: LiveSession[] = [
  {
    id: "session_001",
    classId: "cls_101",
    title: "Weekly Review: Vectors & Forces",
    scheduledTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    meetingLink: "https://meet.google.com/abc-defg-hij",
    status: "scheduled",
  },
];

// In-memory registry service (simulating a DB)
export const ClassRegistry = {
  // Classes
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

  // Students
  getStudentsForClass(classId: string): StudentProfile[] {
    const cls = this.getClassById(classId);
    if (!cls) return [];
    return cls.studentIds.map((id) => mockStudents.find((s) => s.id === id)!).filter(Boolean);
  },
  getStudentById(studentId: string): StudentProfile | undefined {
    return mockStudents.find((s) => s.id === studentId);
  },

  // Sessions
  getSessionsForClass(classId: string): LiveSession[] {
    return mockSessions.filter((s) => s.classId === classId);
  },
  getSessionsForStudent(studentId: string): LiveSession[] {
    // Find all classes the student is in
    const classes = mockClasses.filter(c => c.studentIds.includes(studentId));
    const classIds = classes.map(c => c.id);
    return mockSessions.filter(s => classIds.includes(s.classId));
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
  },
};
