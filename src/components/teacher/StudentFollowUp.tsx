"use client";

import React, { useState, useEffect } from "react";
import { ClassRegistry, StudentProfile, ClassRecord } from "../../core/services/class-registry";
import { Target, Activity, Search, AlertTriangle, ArrowLeft } from "lucide-react";

export default function StudentFollowUp() {
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [allStudents, setAllStudents] = useState<{ student: StudentProfile, className: string }[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // In a real app, teacherId would come from auth context
    const teacherId = "teacher_1";
    const tClasses = ClassRegistry.getClassesByTeacher(teacherId);
    setClasses(tClasses);
    
    const studentsList: { student: StudentProfile, className: string }[] = [];
    tClasses.forEach(cls => {
      const clsStudents = ClassRegistry.getStudentsForClass(cls.id);
      clsStudents.forEach(st => studentsList.push({ student: st, className: cls.name }));
    });
    setAllStudents(studentsList);
  }, []);

  const filteredStudents = allStudents.filter(s => 
    s.student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedStudent) {
    return (
      <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={() => setSelectedStudent(null)}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Student List
        </button>

        <header className="flex items-start justify-between border-b border-neutral-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{selectedStudent.name}</h1>
            <p className="text-neutral-400 text-sm flex items-center gap-4">
              <span>Overall Grade: <strong className="text-amber-500">{selectedStudent.overallGrade}%</strong></span>
              <span>Attendance: <strong>{selectedStudent.attendanceRate}%</strong></span>
            </p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold transition-colors">
            Message Parent
          </button>
        </header>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-red-400" /> Need Care (Weaknesses)
            </h2>
            {selectedStudent.weaknesses.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedStudent.weaknesses.map(w => (
                  <span key={w} className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                    {w}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-sm">No critical weaknesses detected currently.</p>
            )}
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-400" /> Recent Diagnostic Attempts
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-neutral-800/50 border border-neutral-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-white">Lesson 1: Projectile Motion</span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Passed (Attempt 2)</span>
                </div>
                <p className="text-xs text-neutral-400">Mastered after resolving weakness in vector components.</p>
              </div>
              
              {selectedStudent.weaknesses.length > 0 && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-white">Lesson 2: Newton's Laws</span>
                    <span className="text-xs flex items-center gap-1 text-red-400"><AlertTriangle className="h-3 w-3" /> Failed (Attempt 1)</span>
                  </div>
                  <p className="text-xs text-neutral-400">Exhausted Pre-trials. Parent notification sent automatically.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white mb-2">Student Follow-up</h1>
        <p className="text-neutral-400 text-sm">Track individual student diagnostic progress and view weakness reports.</p>
      </header>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
        <input 
          type="text" 
          placeholder="Search students by name..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-amber-500 transition-colors"
        />
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-900 text-neutral-400 border-b border-neutral-800">
            <tr>
              <th className="px-6 py-4 font-semibold">Student Name</th>
              <th className="px-6 py-4 font-semibold">Class</th>
              <th className="px-6 py-4 font-semibold">Alerts</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 text-neutral-300">
            {filteredStudents.map(({student, className}) => (
              <tr key={student.id} className="hover:bg-neutral-800/50 transition-colors">
                <td className="px-6 py-4 font-bold text-white">{student.name}</td>
                <td className="px-6 py-4 text-neutral-400">{className}</td>
                <td className="px-6 py-4">
                  {student.weaknesses.length > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-md font-medium">
                      <AlertTriangle className="h-3 w-3" /> {student.weaknesses.length} Weaknesses
                    </span>
                  ) : (
                    <span className="text-neutral-600 text-xs">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setSelectedStudent(student)}
                    className="text-amber-500 hover:text-amber-400 font-semibold transition-colors"
                  >
                    View Report
                  </button>
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                  No students found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
