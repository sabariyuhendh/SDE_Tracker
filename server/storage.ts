
import { students, weeklyReflections, users, type Student, type InsertStudent, type UpdateStudentProgress, type WeeklyReflection, type InsertWeeklyReflection, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Student methods
  getStudent(id: number): Promise<Student | undefined>;
  getStudentByUsername(username: string): Promise<Student | undefined>;
  getAllStudents(): Promise<Student[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudentProgress(id: number, updates: UpdateStudentProgress): Promise<Student | undefined>;
  deleteStudent(id: number): Promise<boolean>;
  
  // Weekly reflection methods
  getWeeklyReflections(): Promise<WeeklyReflection[]>;
  getWeeklyReflection(weekStart: string): Promise<WeeklyReflection | undefined>;
  createWeeklyReflection(reflection: InsertWeeklyReflection): Promise<WeeklyReflection>;
  updateWeeklyReflection(weekStart: string, reflection: Partial<InsertWeeklyReflection>): Promise<WeeklyReflection | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private students: Map<number, Student>;
  private reflections: Map<string, WeeklyReflection>;
  private currentUserId: number;
  private currentStudentId: number;
  private currentReflectionId: number;

  constructor() {
    this.users = new Map();
    this.students = new Map();
    this.reflections = new Map();
    this.currentUserId = 1;
    this.currentStudentId = 1;
    this.currentReflectionId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add sample students
    const sampleStudents = [
      { username: "student1", name: "Alice Johnson" },
      { username: "student2", name: "Bob Smith" },
      { username: "student3", name: "Charlie Brown" },
    ];

    sampleStudents.forEach(student => {
      this.createStudent(student);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Student methods
  async getStudent(id: number): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async getStudentByUsername(username: string): Promise<Student | undefined> {
    return Array.from(this.students.values()).find(
      (student) => student.username === username,
    );
  }

  async getAllStudents(): Promise<Student[]> {
    return Array.from(this.students.values()).sort((a, b) => (b.totalSolved || 0) - (a.totalSolved || 0));
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = this.currentStudentId++;
    const now = new Date();
    
    // Initialize topic progress based on frontend TOPICS array
    const TOPICS = [
      "Array", "Matrix", "String", "Searching & Sorting", "Linked List",
      "Binary Trees", "Binary Search Trees", "Greedy", "Backtracking",
      "Stacks and Queues", "Heap", "Graph", "Trie", "Dynamic Programming"
    ];

    const topicTotals: Record<string, number> = {
      "Array": 25, "Matrix": 6, "String": 15, "Searching & Sorting": 18,
      "Linked List": 14, "Binary Trees": 25, "Binary Search Trees": 10,
      "Greedy": 12, "Backtracking": 9, "Stacks and Queues": 12,
      "Heap": 6, "Graph": 15, "Trie": 6, "Dynamic Programming": 17
    };

    const topicProgress = TOPICS.reduce((acc, topic) => ({
      ...acc,
      [topic]: { solved: 0, total: topicTotals[topic] || 0, percentage: 0 }
    }), {});

    const student: Student = {
      id,
      username: insertStudent.username,
      name: insertStudent.name,
      avatar: insertStudent.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${insertStudent.username}`,
      totalSolved: 0,
      weeklyProgress: {},
      topicProgress,
      difficultyStats: { easy: 0, medium: 0, hard: 0 },
      reflection: null,
      lastUpdated: now,
      createdAt: now,
    };

    this.students.set(id, student);
    return student;
  }

  async updateStudentProgress(id: number, updates: UpdateStudentProgress): Promise<Student | undefined> {
    const student = this.students.get(id);
    if (!student) return undefined;

    const currentWeek = this.getCurrentWeek();
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

    const updatedStudent: Student = {
      ...student,
      ...updates,
      totalSolved: newTotalSolved,
      weeklyProgress: newWeeklyProgress,
      lastUpdated: new Date(),
    };

    this.students.set(id, updatedStudent);
    return updatedStudent;
  }

  async deleteStudent(id: number): Promise<boolean> {
    return this.students.delete(id);
  }

  // Weekly reflection methods
  async getWeeklyReflections(): Promise<WeeklyReflection[]> {
    return Array.from(this.reflections.values()).sort((a, b) => 
      new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime()
    );
  }

  async getWeeklyReflection(weekStart: string): Promise<WeeklyReflection | undefined> {
    return this.reflections.get(weekStart);
  }

  async createWeeklyReflection(insertReflection: InsertWeeklyReflection): Promise<WeeklyReflection> {
    const id = this.currentReflectionId++;
    const reflection: WeeklyReflection = {
      id,
      weekStart: insertReflection.weekStart,
      classStats: insertReflection.classStats ?? null,
      topicBreakdown: insertReflection.topicBreakdown ?? null,
      highlights: Array.isArray(insertReflection.highlights) ? insertReflection.highlights : null,
      notes: insertReflection.notes ?? null,
      createdAt: new Date(),
    };

    this.reflections.set(insertReflection.weekStart, reflection);
    return reflection;
  }

  async updateWeeklyReflection(weekStart: string, updates: Partial<InsertWeeklyReflection>): Promise<WeeklyReflection | undefined> {
    const existing = this.reflections.get(weekStart);
    if (!existing) return undefined;

    const updated: WeeklyReflection = {
      ...existing,
      weekStart: updates.weekStart ?? existing.weekStart,
      classStats: updates.classStats !== undefined ? updates.classStats : existing.classStats,
      topicBreakdown: updates.topicBreakdown !== undefined ? updates.topicBreakdown : existing.topicBreakdown,
      highlights: Array.isArray(updates.highlights) ? updates.highlights : existing.highlights,
      notes: updates.notes !== undefined ? updates.notes : existing.notes,
    };

    this.reflections.set(weekStart, updated);
    return updated;
  }

  private getCurrentWeek(): string {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of this week (Sunday)
    return startOfWeek.toISOString().split('T')[0];
  }
}

export const storage = new MemStorage();
