export type UserRole = "STUDENT" | "TEACHER" | "PARENT" | "ADMIN" | "BUSINESS_OWNER";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student extends User {
  role: "STUDENT";
  parentId?: string; // Links to a parent account
  activeCurriculums: string[]; // e.g., ["0580-vA"]
}

export interface Teacher extends User {
  role: "TEACHER";
  specializations: string[];
}
