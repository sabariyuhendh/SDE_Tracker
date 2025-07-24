import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Students table for TUF Class Tracker
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().default("Volcaryx"), // User ID for student tracking
  username: text("username").notNull().unique(), // TUF username
  name: text("name").notNull(),
  avatar: text("avatar"),
  totalSolved: integer("total_solved").default(0),
  weeklyProgress: jsonb("weekly_progress").$type<{ [week: string]: number }>().default({}),
  topicProgress: jsonb("topic_progress").$type<{
    [topic: string]: {
      solved: number;
      total: number;
      percentage: number;
    };
  }>().default({}),
  difficultyStats: jsonb("difficulty_stats").$type<{
    easy: number;
    medium: number;
    hard: number;
  }>().default({ easy: 0, medium: 0, hard: 0 }),
  reflection: text("reflection"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Weekly reflections table
export const weeklyReflections = pgTable("weekly_reflections", {
  id: serial("id").primaryKey(),
  weekStart: text("week_start").notNull(),
  classStats: jsonb("class_stats").$type<{
    totalSolved: number;
    averageSolved: number;
    topPerformer: string;
    mostImproved: string;
  }>(),
  topicBreakdown: jsonb("topic_breakdown").$type<{
    [topic: string]: {
      studentsCompleted: number;
      averageProgress: number;
    };
  }>().default({}),
  highlights: jsonb("highlights").$type<string[]>().default([]),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin users (optional - for authentication)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Zod schemas
export const insertStudentSchema = createInsertSchema(students).pick({
  userId: true,
  username: true,
  name: true,
  avatar: true,
});

export const updateStudentProgressSchema = z.object({
  totalSolved: z.number().optional(),
  topicProgress: z.record(z.object({
    solved: z.number(),
    total: z.number(),
    percentage: z.number(),
  })).optional(),
  difficultyStats: z.object({
    easy: z.number(),
    medium: z.number(),
    hard: z.number(),
  }).optional(),
  reflection: z.string().optional(),
  weeklyIncrease: z.number().optional(),
});

export const insertWeeklyReflectionSchema = createInsertSchema(weeklyReflections).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Types
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type UpdateStudentProgress = z.infer<typeof updateStudentProgressSchema>;
export type WeeklyReflection = typeof weeklyReflections.$inferSelect;
export type InsertWeeklyReflection = z.infer<typeof insertWeeklyReflectionSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
