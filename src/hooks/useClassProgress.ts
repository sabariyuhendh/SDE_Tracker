// TUF Class Tracker - Class Progress Management Hook

import { useState, useEffect } from 'react';
import { Student, WeeklyReflection, createNewStudent, getCurrentWeek, Topic } from '@/data/classData';

const STORAGE_KEY = 'tuf-class-progress';
const REFLECTIONS_KEY = 'tuf-weekly-reflections';

export const useClassProgress = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [weeklyReflections, setWeeklyReflections] = useState<WeeklyReflection[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedStudents = localStorage.getItem(STORAGE_KEY);
      const savedReflections = localStorage.getItem(REFLECTIONS_KEY);
      
      if (savedStudents) {
        const parsedStudents = JSON.parse(savedStudents);
        setStudents(parsedStudents);
        if (parsedStudents.length > 0 && !selectedStudent) {
          setSelectedStudent(parsedStudents[0].id);
        }
      }

      if (savedReflections) {
        setWeeklyReflections(JSON.parse(savedReflections));
      }
    } catch (error) {
      console.error('Error loading class data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    }
  }, [students, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(weeklyReflections));
    }
  }, [weeklyReflections, loading]);

  // Add new student
  const addStudent = (username: string, name: string) => {
    const newStudent = createNewStudent(username, name);
    setStudents(prev => [...prev, newStudent]);
    if (!selectedStudent) {
      setSelectedStudent(newStudent.id);
    }
    return newStudent.id;
  };

  // Update student progress
  const updateStudentProgress = (
    studentId: string, 
    updates: {
      topicProgress?: { [topic: string]: { solved: number; total: number; percentage: number } };
      difficultyStats?: { easy: number; medium: number; hard: number };
      reflection?: string;
      weeklyIncrease?: number;
    }
  ) => {
    setStudents(prev => prev.map(student => {
      if (student.id !== studentId) return student;

      const currentWeek = getCurrentWeek();
      let newTotalSolved = student.totalSolved;
      let newWeeklyProgress = { ...student.weeklyProgress };

      // Calculate new total if topic progress updated
      if (updates.topicProgress) {
        newTotalSolved = Object.values(updates.topicProgress).reduce(
          (sum, topic) => sum + topic.solved, 0
        );
      }

      // Update weekly progress if there's an increase
      if (updates.weeklyIncrease && updates.weeklyIncrease > 0) {
        newWeeklyProgress[currentWeek] = (newWeeklyProgress[currentWeek] || 0) + updates.weeklyIncrease;
      }

      return {
        ...student,
        ...updates,
        totalSolved: newTotalSolved,
        weeklyProgress: newWeeklyProgress,
        lastUpdated: new Date().toISOString()
      };
    }));
  };

  // Quick update for topic completion
  const updateTopicProgress = (studentId: string, topic: Topic, solved: number, total: number) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const currentSolved = student.topicProgress[topic]?.solved || 0;
    const increase = Math.max(0, solved - currentSolved);

    updateStudentProgress(studentId, {
      topicProgress: {
        ...student.topicProgress,
        [topic]: {
          solved,
          total,
          percentage: total > 0 ? Math.round((solved / total) * 100) : 0
        }
      },
      weeklyIncrease: increase
    });
  };

  // Remove student
  const removeStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    if (selectedStudent === studentId) {
      const remaining = students.filter(s => s.id !== studentId);
      setSelectedStudent(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // Get current selected student
  const getCurrentStudent = () => {
    return students.find(s => s.id === selectedStudent) || null;
  };

  // Get class statistics
  const getClassStats = () => {
    if (students.length === 0) {
      return {
        totalStudents: 0,
        averageSolved: 0,
        totalSolved: 0,
        topPerformer: null,
        completionRate: 0
      };
    }

    const totalSolved = students.reduce((sum, s) => sum + s.totalSolved, 0);
    const averageSolved = Math.round(totalSolved / students.length);
    const topPerformer = students.reduce((top, current) => 
      current.totalSolved > top.totalSolved ? current : top
    );
    const completionRate = Math.round((totalSolved / (students.length * 190)) * 100);

    return {
      totalStudents: students.length,
      averageSolved,
      totalSolved,
      topPerformer,
      completionRate
    };
  };

  // Get weekly class stats
  const getWeeklyStats = () => {
    const currentWeek = getCurrentWeek();
    const weeklyTotals = students.map(s => s.weeklyProgress[currentWeek] || 0);
    const totalThisWeek = weeklyTotals.reduce((sum, val) => sum + val, 0);
    const averageThisWeek = students.length > 0 ? Math.round(totalThisWeek / students.length) : 0;

    return {
      totalThisWeek,
      averageThisWeek,
      individualProgress: students.map(s => ({
        id: s.id,
        name: s.name,
        weeklyCount: s.weeklyProgress[currentWeek] || 0
      }))
    };
  };

  // Save weekly reflection
  const saveWeeklyReflection = (reflection: Omit<WeeklyReflection, 'weekStart'>) => {
    const weekStart = getCurrentWeek();
    const newReflection: WeeklyReflection = {
      ...reflection,
      weekStart
    };

    setWeeklyReflections(prev => {
      const filtered = prev.filter(r => r.weekStart !== weekStart);
      return [...filtered, newReflection].sort((a, b) => 
        new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime()
      );
    });
  };

  return {
    students,
    selectedStudent,
    setSelectedStudent,
    weeklyReflections,
    loading,
    addStudent,
    updateStudentProgress,
    updateTopicProgress,
    removeStudent,
    getCurrentStudent,
    getClassStats,
    getWeeklyStats,
    saveWeeklyReflection
  };
};