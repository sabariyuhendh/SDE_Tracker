// Hardcoded data for the TUF Class Tracker to work without database
import { Student, WeeklyReflection } from '../../../shared/schema';

// Sample hardcoded students data
export const hardcodedStudents: Student[] = [
  {
    id: 1,
    userId: "Volcaryx",
    username: "student1_tuf",
    name: "Alex Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    totalSolved: 145,
    weeklyProgress: {
      "Week 1": 20,
      "Week 2": 35,
      "Week 3": 45,
      "Week 4": 65,
      "Week 5": 85,
      "Week 6": 105,
      "Week 7": 125,
      "Week 8": 145
    },
    topicProgress: {
      "Arrays": { solved: 25, total: 30, percentage: 83 },
      "Strings": { solved: 20, total: 25, percentage: 80 },
      "Linked List": { solved: 18, total: 22, percentage: 82 },
      "Binary Trees": { solved: 15, total: 20, percentage: 75 },
      "Dynamic Programming": { solved: 12, total: 18, percentage: 67 },
      "Graph": { solved: 10, total: 15, percentage: 67 },
      "Stack & Queue": { solved: 22, total: 25, percentage: 88 },
      "Heap": { solved: 8, total: 12, percentage: 67 },
      "Trie": { solved: 5, total: 8, percentage: 63 },
      "Sliding Window": { solved: 10, total: 15, percentage: 67 }
    },
    difficultyStats: {
      easy: 65,
      medium: 55,
      hard: 25
    },
    reflection: "Making great progress on data structures. Need to focus more on dynamic programming.",
    lastUpdated: new Date(),
    createdAt: new Date()
  },
  {
    id: 2,
    userId: "Volcaryx",
    username: "student2_tuf",
    name: "Sarah Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    totalSolved: 178,
    weeklyProgress: {
      "Week 1": 25,
      "Week 2": 45,
      "Week 3": 65,
      "Week 4": 85,
      "Week 5": 105,
      "Week 6": 130,
      "Week 7": 155,
      "Week 8": 178
    },
    topicProgress: {
      "Arrays": { solved: 28, total: 30, percentage: 93 },
      "Strings": { solved: 23, total: 25, percentage: 92 },
      "Linked List": { solved: 20, total: 22, percentage: 91 },
      "Binary Trees": { solved: 18, total: 20, percentage: 90 },
      "Dynamic Programming": { solved: 15, total: 18, percentage: 83 },
      "Graph": { solved: 13, total: 15, percentage: 87 },
      "Stack & Queue": { solved: 24, total: 25, percentage: 96 },
      "Heap": { solved: 11, total: 12, percentage: 92 },
      "Trie": { solved: 7, total: 8, percentage: 88 },
      "Sliding Window": { solved: 14, total: 15, percentage: 93 }
    },
    difficultyStats: {
      easy: 75,
      medium: 68,
      hard: 35
    },
    reflection: "Consistently performing well across all topics. Strong in algorithms.",
    lastUpdated: new Date(),
    createdAt: new Date()
  },
  {
    id: 3,
    userId: "Volcaryx",
    username: "student3_tuf",
    name: "Mike Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    totalSolved: 132,
    weeklyProgress: {
      "Week 1": 15,
      "Week 2": 28,
      "Week 3": 42,
      "Week 4": 58,
      "Week 5": 75,
      "Week 6": 95,
      "Week 7": 115,
      "Week 8": 132
    },
    topicProgress: {
      "Arrays": { solved: 22, total: 30, percentage: 73 },
      "Strings": { solved: 18, total: 25, percentage: 72 },
      "Linked List": { solved: 16, total: 22, percentage: 73 },
      "Binary Trees": { solved: 12, total: 20, percentage: 60 },
      "Dynamic Programming": { solved: 8, total: 18, percentage: 44 },
      "Graph": { solved: 7, total: 15, percentage: 47 },
      "Stack & Queue": { solved: 20, total: 25, percentage: 80 },
      "Heap": { solved: 6, total: 12, percentage: 50 },
      "Trie": { solved: 3, total: 8, percentage: 38 },
      "Sliding Window": { solved: 8, total: 15, percentage: 53 }
    },
    difficultyStats: {
      easy: 58,
      medium: 48,
      hard: 26
    },
    reflection: "Need to improve on advanced topics like DP and graphs. Good foundation in basics.",
    lastUpdated: new Date(),
    createdAt: new Date()
  },
  {
    id: 4,
    userId: "Volcaryx",
    username: "student4_tuf",
    name: "Emma Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
    totalSolved: 198,
    weeklyProgress: {
      "Week 1": 30,
      "Week 2": 52,
      "Week 3": 75,
      "Week 4": 98,
      "Week 5": 125,
      "Week 6": 150,
      "Week 7": 175,
      "Week 8": 198
    },
    topicProgress: {
      "Arrays": { solved: 30, total: 30, percentage: 100 },
      "Strings": { solved: 25, total: 25, percentage: 100 },
      "Linked List": { solved: 22, total: 22, percentage: 100 },
      "Binary Trees": { solved: 20, total: 20, percentage: 100 },
      "Dynamic Programming": { solved: 17, total: 18, percentage: 94 },
      "Graph": { solved: 15, total: 15, percentage: 100 },
      "Stack & Queue": { solved: 25, total: 25, percentage: 100 },
      "Heap": { solved: 12, total: 12, percentage: 100 },
      "Trie": { solved: 8, total: 8, percentage: 100 },
      "Sliding Window": { solved: 15, total: 15, percentage: 100 }
    },
    difficultyStats: {
      easy: 85,
      medium: 78,
      hard: 35
    },
    reflection: "Excellent progress across all areas. Ready for advanced competitive programming.",
    lastUpdated: new Date(),
    createdAt: new Date()
  }
];

// Sample weekly reflections
export const hardcodedWeeklyReflections: WeeklyReflection[] = [
  {
    id: 1,
    weekStart: "2024-01-01",
    classStats: {
      totalSolved: 653,
      averageSolved: 163,
      topPerformer: "Emma Wilson",
      mostImproved: "Mike Rodriguez"
    },
    topicBreakdown: {
      "Arrays": { studentsCompleted: 4, averageProgress: 87 },
      "Strings": { studentsCompleted: 4, averageProgress: 86 },
      "Linked List": { studentsCompleted: 4, averageProgress: 87 },
      "Binary Trees": { studentsCompleted: 3, averageProgress: 81 },
      "Dynamic Programming": { studentsCompleted: 2, averageProgress: 72 },
      "Graph": { studentsCompleted: 2, averageProgress: 75 }
    },
    highlights: [
      "Emma Wilson completed all basic data structure topics",
      "Sarah Chen showed consistent improvement in algorithms",
      "Mike Rodriguez improved significantly in arrays and strings",
      "Alex Johnson demonstrated strong problem-solving skills"
    ],
    notes: "Great week overall. The class is progressing well with data structures fundamentals. Need to focus more on advanced topics like DP and graphs in the coming weeks.",
    createdAt: new Date()
  }
];

// Local storage keys for persistence
export const STORAGE_KEYS = {
  STUDENTS: 'tuf_tracker_students',
  WEEKLY_REFLECTIONS: 'tuf_tracker_reflections'
};

// Helper functions for local storage
export const getStoredStudents = (): Student[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return stored ? JSON.parse(stored) : hardcodedStudents;
  } catch {
    return hardcodedStudents;
  }
};

export const setStoredStudents = (students: Student[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (error) {
    console.error('Failed to store students:', error);
  }
};

export const getStoredReflections = (): WeeklyReflection[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.WEEKLY_REFLECTIONS);
    return stored ? JSON.parse(stored) : hardcodedWeeklyReflections;
  } catch {
    return hardcodedWeeklyReflections;
  }
};

export const setStoredReflections = (reflections: WeeklyReflection[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.WEEKLY_REFLECTIONS, JSON.stringify(reflections));
  } catch (error) {
    console.error('Failed to store reflections:', error);
  }
};

// Function to load static JSON data
const loadStaticData = async (filename: string) => {
  try {
    const response = await fetch(`/data/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`Failed to load static data from ${filename}, using hardcoded data`);
    return null;
  }
};

// Mock API functions that work with local storage and static JSON
export const mockAPI = {
  // Get all students - try static data first, fall back to localStorage
  getStudents: async (): Promise<{ students: Student[] }> => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    
    // Try to load from static JSON first
    const staticData = await loadStaticData('students.json');
    if (staticData) {
      // Store in localStorage for consistency
      setStoredStudents(staticData);
      return { students: staticData };
    }
    
    return { students: getStoredStudents() };
  },

  // Add a new student
  addStudent: async (student: Omit<Student, 'id' | 'createdAt' | 'lastUpdated'>): Promise<Student> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const students = getStoredStudents();
    const newStudent: Student = {
      ...student,
      id: Math.max(...students.map(s => s.id), 0) + 1,
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    const updatedStudents = [...students, newStudent];
    setStoredStudents(updatedStudents);
    return newStudent;
  },

  // Update student progress
  updateStudent: async (id: number, updates: Partial<Student>): Promise<Student | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const students = getStoredStudents();
    const studentIndex = students.findIndex(s => s.id === id);
    if (studentIndex === -1) return null;
    
    const updatedStudent = {
      ...students[studentIndex],
      ...updates,
      lastUpdated: new Date()
    };
    students[studentIndex] = updatedStudent;
    setStoredStudents(students);
    return updatedStudent;
  },

  // Mark problems as solved
  markProblemsAsSolved: async (id: number, topic: string, count: number): Promise<Student | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const students = getStoredStudents();
    const student = students.find(s => s.id === id);
    if (!student) return null;

    const currentProgress = student.topicProgress?.[topic] || { solved: 0, total: 50, percentage: 0 };
    const newSolved = Math.min(currentProgress.solved + count, currentProgress.total);
    const newPercentage = Math.round((newSolved / currentProgress.total) * 100);

    const updatedTopicProgress = {
      ...(student.topicProgress || {}),
      [topic]: {
        ...currentProgress,
        solved: newSolved,
        percentage: newPercentage
      }
    };

    // Update total solved count
    const totalIncrease = newSolved - currentProgress.solved;
    const newTotalSolved = (student.totalSolved || 0) + totalIncrease;

    return mockAPI.updateStudent(id, {
      topicProgress: updatedTopicProgress,
      totalSolved: newTotalSolved
    });
  },

  // Reset student progress
  resetStudent: async (id: number): Promise<Student | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const students = getStoredStudents();
    const student = students.find(s => s.id === id);
    if (!student) return null;

    const resetTopicProgress: Record<string, { solved: number; total: number; percentage: number }> = {};
    if (student.topicProgress) {
      Object.keys(student.topicProgress).forEach(topic => {
        resetTopicProgress[topic] = {
          solved: 0,
          total: student.topicProgress![topic].total,
          percentage: 0
        };
      });
    }

    return mockAPI.updateStudent(id, {
      totalSolved: 0,
      topicProgress: resetTopicProgress,
      difficultyStats: { easy: 0, medium: 0, hard: 0 },
      weeklyProgress: {}
    });
  },

  // Delete student
  deleteStudent: async (id: number): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const students = getStoredStudents();
    const filteredStudents = students.filter(s => s.id !== id);
    if (filteredStudents.length === students.length) return false; // Student not found
    setStoredStudents(filteredStudents);
    return true;
  }
};