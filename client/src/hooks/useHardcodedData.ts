// Custom hooks to work with database API calls
import { useState, useEffect } from 'react';
import type { Student, WeeklyReflection } from '../../../shared/schema';

// Hook to manage students data
export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/students');
        const data = await response.json();
        setStudents(data.students || []);
      } catch (error) {
        console.error('Failed to load students:', error);
        setStudents([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, []);

  const addStudent = async (studentData: Omit<Student, 'id' | 'createdAt' | 'lastUpdated'>) => {
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: studentData.username,
          name: studentData.name,
          avatar: studentData.avatar
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create student');
      }
      
      const data = await response.json();
      const newStudent = data.student;
      setStudents(prev => [...prev, newStudent]);
      return newStudent;
    } catch (error) {
      console.error('Failed to add student:', error);
      throw error;
    }
  };

  const updateStudent = async (id: number, updates: Partial<Student>) => {
    try {
      const response = await fetch(`/api/students/${id}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update student');
      }
      
      const data = await response.json();
      const updatedStudent = data.student;
      setStudents(prev => prev.map(s => s.id === id ? updatedStudent : s));
      return updatedStudent;
    } catch (error) {
      console.error('Failed to update student:', error);
      throw error;
    }
  };

  const markProblemsAsSolved = async (id: number, topic: string, count: number) => {
    try {
      const response = await fetch(`/api/admin/students/${id}/mark-solved`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, count })
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark problems as solved');
      }
      
      const data = await response.json();
      const updatedStudent = data.student;
      setStudents(prev => prev.map(s => s.id === id ? updatedStudent : s));
      return updatedStudent;
    } catch (error) {
      console.error('Failed to mark problems as solved:', error);
      throw error;
    }
  };

  const resetStudent = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/students/${id}/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to reset student');
      }
      
      const data = await response.json();
      const resetStudent = data.student;
      setStudents(prev => prev.map(s => s.id === id ? resetStudent : s));
      return resetStudent;
    } catch (error) {
      console.error('Failed to reset student:', error);
      throw error;
    }
  };

  const deleteStudent = async (id: number) => {
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete student');
      }
      
      setStudents(prev => prev.filter(s => s.id !== id));
      return true;
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
    refetch: async () => {
      try {
        const response = await fetch('/api/students');
        const data = await response.json();
        setStudents(data.students || []);
      } catch (error) {
        console.error('Failed to refetch students:', error);
      }
    }
  };
}

// Hook to manage weekly reflections
export function useWeeklyReflections() {
  const [reflections, setReflections] = useState<WeeklyReflection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReflections = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/reflections');
        const data = await response.json();
        setReflections(data.reflections || []);
      } catch (error) {
        console.error('Failed to load reflections:', error);
        setReflections([]);
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