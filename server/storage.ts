
import { students, weeklyReflections, users, type Student, type InsertStudent, type UpdateStudentProgress, type WeeklyReflection, type InsertWeeklyReflection, type User, type InsertUser } from "@shared/schema";
import { db } from './db';
import { eq } from "drizzle-orm";

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
    try {
      const currentStudent = await this.getStudent(id);
      if (!currentStudent) return undefined;

      // Calculate new total solved from topic progress
      let newTotalSolved = currentStudent.totalSolved;
      if (updates.topicProgress) {
        newTotalSolved = Object.values(updates.topicProgress).reduce(
          (sum, topic) => sum + topic.solved, 0
        );
      }

      const [updated] = await db
        .update(students)
        .set({
          totalSolved: newTotalSolved,
          topicProgress: updates.topicProgress || currentStudent.topicProgress,
          difficultyStats: updates.difficultyStats || currentStudent.difficultyStats,
          weeklyProgress: updates.weeklyProgress || currentStudent.weeklyProgress,
          lastUpdated: new Date(),
        })
        .where(eq(students.id, id))
        .returning();

      return updated;
    } catch (error) {
      console.error('Error updating student progress:', error);
      return undefined;
    }
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
      highlights: insertReflection.highlights || [],
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
      highlights: updates.highlights || existing.highlights || [],
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

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user || undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user || undefined;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db.insert(users).values(insertUser).returning();
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Student methods
  async getStudent(id: number): Promise<Student | undefined> {
    try {
      const [student] = await db.select().from(students).where(eq(students.id, id));
      return student || undefined;
    } catch (error) {
      console.error('Error getting student:', error);
      return undefined;
    }
  }

  async getStudentByUsername(username: string): Promise<Student | undefined> {
    try {
      const [student] = await db.select().from(students).where(eq(students.username, username));
      return student || undefined;
    } catch (error) {
      console.error('Error getting student by username:', error);
      return undefined;
    }
  }

  async getAllStudents(): Promise<Student[]> {
    try {
      const allStudents = await db.select().from(students).orderBy(students.totalSolved);
      return allStudents;
    } catch (error) {
      console.error('Error getting all students:', error);
      return [];
    }
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    try {
      // Initialize topic progress
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

      const avatar = insertStudent.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${insertStudent.username}`;
      
      const [student] = await db.insert(students).values({
        username: insertStudent.username,
        name: insertStudent.name,
        avatar: avatar,
        topicProgress: topicProgress,
        difficultyStats: { easy: 0, medium: 0, hard: 0 },
        weeklyProgress: {},
        totalSolved: 0
      }).returning();

      return student;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  async updateStudentProgress(id: number, updates: UpdateStudentProgress): Promise<Student | undefined> {
    const student = await this.getStudent(id);
    if (!student) return undefined;

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
      const currentWeek = this.getCurrentWeek();
      newWeeklyProgress[currentWeek] = (newWeeklyProgress[currentWeek] || 0) + updates.weeklyIncrease;
    }

    const result = await pool.query(
      `UPDATE students SET 
       total_solved = $1,
       topic_progress = $2,
       difficulty_stats = $3,
       reflection = $4,
       weekly_progress = $5,
       last_updated = CURRENT_TIMESTAMP
       WHERE id = $6 RETURNING *`,
      [
        newTotalSolved,
        JSON.stringify(updates.topicProgress || student.topicProgress),
        JSON.stringify(updates.difficultyStats || student.difficultyStats),
        updates.reflection !== undefined ? updates.reflection : student.reflection,
        JSON.stringify(newWeeklyProgress),
        id
      ]
    );

    if (result.rows.length === 0) return undefined;

    const updatedStudent = result.rows[0];
    return {
      id: updatedStudent.id,
      username: updatedStudent.username,
      name: updatedStudent.name,
      avatar: updatedStudent.avatar,
      totalSolved: updatedStudent.total_solved,
      weeklyProgress: updatedStudent.weekly_progress || {},
      topicProgress: updatedStudent.topic_progress || {},
      difficultyStats: updatedStudent.difficulty_stats || { easy: 0, medium: 0, hard: 0 },
      reflection: updatedStudent.reflection,
      lastUpdated: updatedStudent.last_updated,
      createdAt: updatedStudent.created_at,
    };
  }

  async deleteStudent(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM students WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Weekly reflection methods
  async getWeeklyReflections(): Promise<WeeklyReflection[]> {
    const result = await pool.query('SELECT * FROM weekly_reflections ORDER BY created_at DESC');
    return result.rows.map(row => ({
      id: row.id,
      weekStart: row.week_start,
      classStats: row.class_stats,
      topicBreakdown: row.topic_breakdown || {},
      highlights: row.highlights || [],
      notes: row.notes,
      createdAt: row.created_at,
    }));
  }

  async getWeeklyReflection(weekStart: string): Promise<WeeklyReflection | undefined> {
    const result = await pool.query('SELECT * FROM weekly_reflections WHERE week_start = $1', [weekStart]);
    if (result.rows.length === 0) return undefined;
    
    const row = result.rows[0];
    return {
      id: row.id,
      weekStart: row.week_start,
      classStats: row.class_stats,
      topicBreakdown: row.topic_breakdown || {},
      highlights: row.highlights || [],
      notes: row.notes,
      createdAt: row.created_at,
    };
  }

  async createWeeklyReflection(insertReflection: InsertWeeklyReflection): Promise<WeeklyReflection> {
    const result = await pool.query(
      `INSERT INTO weekly_reflections (week_start, class_stats, topic_breakdown, highlights, notes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        insertReflection.weekStart,
        JSON.stringify(insertReflection.classStats),
        JSON.stringify(insertReflection.topicBreakdown || {}),
        JSON.stringify(insertReflection.highlights || []),
        insertReflection.notes
      ]
    );

    const row = result.rows[0];
    return {
      id: row.id,
      weekStart: row.week_start,
      classStats: row.class_stats,
      topicBreakdown: row.topic_breakdown || {},
      highlights: row.highlights || [],
      notes: row.notes,
      createdAt: row.created_at,
    };
  }

  async updateWeeklyReflection(weekStart: string, updates: Partial<InsertWeeklyReflection>): Promise<WeeklyReflection | undefined> {
    const existing = await this.getWeeklyReflection(weekStart);
    if (!existing) return undefined;

    const result = await pool.query(
      `UPDATE weekly_reflections SET
       class_stats = $1,
       topic_breakdown = $2,
       highlights = $3,
       notes = $4
       WHERE week_start = $5 RETURNING *`,
      [
        JSON.stringify(updates.classStats !== undefined ? updates.classStats : existing.classStats),
        JSON.stringify(updates.topicBreakdown !== undefined ? updates.topicBreakdown : existing.topicBreakdown),
        JSON.stringify(updates.highlights !== undefined ? updates.highlights : existing.highlights),
        updates.notes !== undefined ? updates.notes : existing.notes,
        weekStart
      ]
    );

    if (result.rows.length === 0) return undefined;

    const row = result.rows[0];
    return {
      id: row.id,
      weekStart: row.week_start,
      classStats: row.class_stats,
      topicBreakdown: row.topic_breakdown || {},
      highlights: row.highlights || [],
      notes: row.notes,
      createdAt: row.created_at,
    };
  }

  private getCurrentWeek(): string {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of this week (Sunday)
    return startOfWeek.toISOString().split('T')[0];
  }

  // Admin bulk operations
  async bulkCreateStudents(students: InsertStudent[]): Promise<Student[]> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const createdStudents: Student[] = [];
      
      for (const studentData of students) {
        // Check if username already exists
        const existing = await this.getStudentByUsername(studentData.username);
        if (existing) {
          continue; // Skip if exists
        }
        
        const student = await this.createStudent(studentData);
        createdStudents.push(student);
      }
      
      await client.query('COMMIT');
      return createdStudents;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async markProblemsAsSolved(studentId: number, topic: string, count: number): Promise<Student | undefined> {
    const student = await this.getStudent(studentId);
    if (!student) return undefined;

    const topicProgress = { ...student.topicProgress };
    if (topicProgress[topic]) {
      topicProgress[topic].solved = Math.min(
        topicProgress[topic].solved + count,
        topicProgress[topic].total
      );
      topicProgress[topic].percentage = Math.round(
        (topicProgress[topic].solved / topicProgress[topic].total) * 100
      );
    }

    return this.updateStudentProgress(studentId, { topicProgress });
  }

  async resetStudentProgress(studentId: number): Promise<Student | undefined> {
    const student = await this.getStudent(studentId);
    if (!student) return undefined;

    const resetTopicProgress = Object.keys(student.topicProgress || {}).reduce((acc, topic) => {
      acc[topic] = {
        ...(student.topicProgress || {})[topic],
        solved: 0,
        percentage: 0
      };
      return acc;
    }, {} as any);

    return this.updateStudentProgress(studentId, {
      topicProgress: resetTopicProgress,
      difficultyStats: { easy: 0, medium: 0, hard: 0 }
    });
  }
}

export const storage = new DatabaseStorage();
