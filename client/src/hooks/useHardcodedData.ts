// Frontend-only hooks for TUF Class Tracker
import { useState, useEffect } from 'react';
import { hardcodedAPI, getInitialData, type StudentData } from '../data/hardcodedData';

// Hook to manage students data without backend
export function useStudents() {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      setIsLoading(true);
      try {
        const studentData = await hardcodedAPI.getAllStudents();
        setStudents(studentData);
      } catch (error) {
        console.error('Failed to load students:', error);
        setStudents(getInitialData());
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, []);

  const addStudent = async (name: string, username: string) => {
    try {
      const newStudent = await hardcodedAPI.addStudent(name, username);
      setStudents(prev => [...prev, newStudent]);
      return newStudent;
    } catch (error) {
      console.error('Failed to add student:', error);
      throw error;
    }
  };

  const deleteStudent = async (id: number) => {
    try {
      const success = await hardcodedAPI.deleteStudent(id);
      if (success) {
        setStudents(prev => prev.filter(s => s.id !== id));
      }
      return success;
    } catch (error) {
      console.error('Failed to delete student:', error);
      throw error;
    }
  };

  const scrapeStudent = async (id: number) => {
    try {
      const updatedStudent = await hardcodedAPI.scrapeStudent(id);
      if (updatedStudent) {
        setStudents(prev => prev.map(s => s.id === id ? updatedStudent : s));
      }
      return updatedStudent;
    } catch (error) {
      console.error('Failed to scrape student:', error);
      throw error;
    }
  };

  const scrapeAllStudents = async () => {
    try {
      await hardcodedAPI.scrapeAllStudents();
      const updatedStudents = await hardcodedAPI.getAllStudents();
      setStudents(updatedStudents);
    } catch (error) {
      console.error('Failed to bulk scrape:', error);
      throw error;
    }
  };

  const testScraping = async (username: string) => {
    try {
      return await hardcodedAPI.testScraping(username);
    } catch (error) {
      console.error('Failed to test scraping:', error);
      throw error;
    }
  };

  return {
    students,
    isLoading,
    addStudent,
    deleteStudent,
    scrapeStudent,
    scrapeAllStudents,
    testScraping
  };
}

// Hook for frontend-only weekly reflections (placeholder)
export function useWeeklyReflections() {
  const [reflections, setReflections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  return {
    reflections,
    isLoading,
    addReflection: async () => {},
    refetch: () => {}
  };
}

// Hook for individual student data
export function useStudent(id: number) {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStudent = async () => {
      setIsLoading(true);
      try {
        const students = await hardcodedAPI.getAllStudents();
        const foundStudent = students.find(s => s.id === id);
        setStudent(foundStudent || null);
      } catch (error) {
        console.error('Failed to load student:', error);
        setStudent(null);
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