// Custom hooks to work with hardcoded data instead of API calls
import { useState, useEffect } from 'react';
import { mockAPI, getStoredStudents, getStoredReflections } from '@/data/hardcodedData';
import type { Student, WeeklyReflection } from '../../../shared/schema';

// Hook to manage students data
export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      setIsLoading(true);
      try {
        const data = await mockAPI.getStudents();
        setStudents(data.students);
      } catch (error) {
        console.error('Failed to load students:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, []);

  const addStudent = async (studentData: Omit<Student, 'id' | 'createdAt' | 'lastUpdated'>) => {
    try {
      const newStudent = await mockAPI.addStudent(studentData);
      setStudents(prev => [...prev, newStudent]);
      return newStudent;
    } catch (error) {
      console.error('Failed to add student:', error);
      throw error;
    }
  };

  const updateStudent = async (id: number, updates: Partial<Student>) => {
    try {
      const updatedStudent = await mockAPI.updateStudent(id, updates);
      if (updatedStudent) {
        setStudents(prev => prev.map(s => s.id === id ? updatedStudent : s));
      }
      return updatedStudent;
    } catch (error) {
      console.error('Failed to update student:', error);
      throw error;
    }
  };

  const markProblemsAsSolved = async (id: number, topic: string, count: number) => {
    try {
      const updatedStudent = await mockAPI.markProblemsAsSolved(id, topic, count);
      if (updatedStudent) {
        setStudents(prev => prev.map(s => s.id === id ? updatedStudent : s));
      }
      return updatedStudent;
    } catch (error) {
      console.error('Failed to mark problems as solved:', error);
      throw error;
    }
  };

  const resetStudent = async (id: number) => {
    try {
      const resetStudent = await mockAPI.resetStudent(id);
      if (resetStudent) {
        setStudents(prev => prev.map(s => s.id === id ? resetStudent : s));
      }
      return resetStudent;
    } catch (error) {
      console.error('Failed to reset student:', error);
      throw error;
    }
  };

  const deleteStudent = async (id: number) => {
    try {
      const success = await mockAPI.deleteStudent(id);
      if (success) {
        setStudents(prev => prev.filter(s => s.id !== id));
      }
      return success;
    } catch (error) {
      console.error('Failed to delete student:', error);
      throw error;
    }
  };

  return {
    students,
    isLoading,
    addStudent,
    updateStudent,
    markProblemsAsSolved,
    resetStudent,
    deleteStudent,
    refetch: () => {
      const data = getStoredStudents();
      setStudents(data);
    }
  };
}

// Hook to manage weekly reflections
export function useWeeklyReflections() {
  const [reflections, setReflections] = useState<WeeklyReflection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReflections = () => {
      setIsLoading(true);
      try {
        const data = getStoredReflections();
        setReflections(data);
      } catch (error) {
        console.error('Failed to load reflections:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReflections();
  }, []);

  return {
    reflections,
    isLoading,
    refetch: () => {
      const data = getStoredReflections();
      setReflections(data);
    }
  };
}

// Hook to get individual student data
export function useStudent(id: number) {
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStudent = () => {
      setIsLoading(true);
      try {
        const students = getStoredStudents();
        const foundStudent = students.find(s => s.id === id);
        setStudent(foundStudent || null);
      } catch (error) {
        console.error('Failed to load student:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudent();
  }, [id]);

  return {
    student,
    isLoading
  };
}