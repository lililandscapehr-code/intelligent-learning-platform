"use client";

import React, { useState, useEffect } from "react";
import { ClassRegistry, ClassRecord, StudentProfile } from "../../core/services/class-registry";
import { Users, GraduationCap, UserPlus, BookOpen, ChevronRight } from "lucide-react";

export default function ClassManager() {
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassRecord | null>(null);
  const [students, setStudents] = useState<StudentProfile[]>([]);

  useEffect(() => {
    // In a real app, teacherId would come from auth context
    const teacherId = "teacher_1";
    setClasses(ClassRegistry.getClassesByTeacher(teacherId));
  }, []);

  useEffect(() => {
    if (selectedClass) {
      setStudents(ClassRegistry.getStudentsForClass(selectedClass.id));
    }
  }, [selectedClass]);

  return (
    <div className="flex h-[calc(100vh-100px)] gap-6">
      {/* Left Sidebar - Class List */}
      <div className="w-1/3 border-r border-neutral-800 pr-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-500" />
            My Classes
          </h2>
          <button className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors">
            <UserPlus className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClass(cls)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedClass?.id === cls.id
                  ? "border-amber-500/50 bg-amber-500/10"
                  : "border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 hover:border-neutral-700"
              }`}
            >
              <h3 className="font-bold text-white mb-1">{cls.name}</h3>
              <div className="flex items-center gap-4 text-xs text-neutral-400">
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" /> Grade {cls.gradeLevel}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" /> {cls.studentIds.length} Students
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Area - Class Details & Roster */}
      <div className="flex-1 overflow-y-auto pl-2">
        {selectedClass ? (
          <div className="space-y-8">
            <header className="border-b border-neutral-800 pb-6">
              <h1 className="text-3xl font-bold text-white mb-2">{selectedClass.name}</h1>
              <p className="text-neutral-400 text-sm">Manage enrolled students and view class-wide performance metrics.</p>
            </header>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Student Roster ({students.length})</h2>
                <button className="text-sm font-semibold text-amber-500 hover:text-amber-400 flex items-center gap-1">
                  <UserPlus className="h-4 w-4" /> Invite Student
                </button>
              </div>

              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-900 text-neutral-400 border-b border-neutral-800">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Student Name</th>
                      <th className="px-6 py-4 font-semibold">Attendance</th>
                      <th className="px-6 py-4 font-semibold">Overall Grade</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800 text-neutral-300">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-neutral-800/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">{student.name}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2 py-1 rounded-md text-xs ${
                            student.attendanceRate > 90 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                          }`}>
                            {student.attendanceRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold">{student.overallGrade}%</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-neutral-400 hover:text-amber-400 transition-colors">
                            <ChevronRight className="h-5 w-5 inline-block" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-neutral-500">
            Select a class from the list to view details
          </div>
        )}
      </div>
    </div>
  );
}
