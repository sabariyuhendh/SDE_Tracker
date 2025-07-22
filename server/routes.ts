
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { storage } from "./storage";
import { insertStudentSchema, updateStudentProgressSchema, insertWeeklyReflectionSchema } from "@shared/schema";
import { z } from "zod";

const app = new Hono();

// Students routes
app.get("/api/students", async (c) => {
  try {
    const students = await storage.getAllStudents();
    return c.json({ students });
  } catch (error) {
    return c.json({ error: "Failed to fetch students" }, 500);
  }
});

app.get("/api/students/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const student = await storage.getStudent(id);
    
    if (!student) {
      return c.json({ error: "Student not found" }, 404);
    }
    
    return c.json({ student });
  } catch (error) {
    return c.json({ error: "Failed to fetch student" }, 500);
  }
});

app.post("/api/students", zValidator("json", insertStudentSchema), async (c) => {
  try {
    const studentData = c.req.valid("json");
    
    // Check if username already exists
    const existing = await storage.getStudentByUsername(studentData.username);
    if (existing) {
      return c.json({ error: "Username already exists" }, 400);
    }
    
    const student = await storage.createStudent(studentData);
    return c.json({ student }, 201);
  } catch (error) {
    return c.json({ error: "Failed to create student" }, 500);
  }
});

app.put("/api/students/:id/progress", zValidator("json", updateStudentProgressSchema), async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const updates = c.req.valid("json");
    
    const student = await storage.updateStudentProgress(id, updates);
    
    if (!student) {
      return c.json({ error: "Student not found" }, 404);
    }
    
    return c.json({ student });
  } catch (error) {
    return c.json({ error: "Failed to update student progress" }, 500);
  }
});

app.delete("/api/students/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const deleted = await storage.deleteStudent(id);
    
    if (!deleted) {
      return c.json({ error: "Student not found" }, 404);
    }
    
    return c.json({ message: "Student deleted successfully" });
  } catch (error) {
    return c.json({ error: "Failed to delete student" }, 500);
  }
});

// Class statistics
app.get("/api/class/stats", async (c) => {
  try {
    const students = await storage.getAllStudents();
    
    if (students.length === 0) {
      return c.json({
        totalStudents: 0,
        averageSolved: 0,
        totalSolved: 0,
        topPerformer: null,
        completionRate: 0
      });
    }

    const totalSolved = students.reduce((sum, s) => sum + s.totalSolved, 0);
    const averageSolved = Math.round(totalSolved / students.length);
    const topPerformer = students.reduce((top, current) => 
      current.totalSolved > top.totalSolved ? current : top
    );
    const completionRate = Math.round((totalSolved / (students.length * 190)) * 100);

    return c.json({
      totalStudents: students.length,
      averageSolved,
      totalSolved,
      topPerformer,
      completionRate
    });
  } catch (error) {
    return c.json({ error: "Failed to fetch class stats" }, 500);
  }
});

app.get("/api/class/leaderboard", async (c) => {
  try {
    const students = await storage.getAllStudents();
    const leaderboard = students
      .map(student => ({
        ...student,
        percentage: Math.round((student.totalSolved / 190) * 100)
      }))
      .sort((a, b) => b.totalSolved - a.totalSolved);
    
    return c.json({ leaderboard });
  } catch (error) {
    return c.json({ error: "Failed to fetch leaderboard" }, 500);
  }
});

// Weekly reflections routes
app.get("/api/reflections", async (c) => {
  try {
    const reflections = await storage.getWeeklyReflections();
    return c.json({ reflections });
  } catch (error) {
    return c.json({ error: "Failed to fetch reflections" }, 500);
  }
});

app.get("/api/reflections/:weekStart", async (c) => {
  try {
    const weekStart = c.req.param("weekStart");
    const reflection = await storage.getWeeklyReflection(weekStart);
    
    if (!reflection) {
      return c.json({ error: "Reflection not found" }, 404);
    }
    
    return c.json({ reflection });
  } catch (error) {
    return c.json({ error: "Failed to fetch reflection" }, 500);
  }
});

app.post("/api/reflections", zValidator("json", insertWeeklyReflectionSchema), async (c) => {
  try {
    const reflectionData = c.req.valid("json");
    const reflection = await storage.createWeeklyReflection(reflectionData);
    return c.json({ reflection }, 201);
  } catch (error) {
    return c.json({ error: "Failed to create reflection" }, 500);
  }
});

app.put("/api/reflections/:weekStart", zValidator("json", insertWeeklyReflectionSchema.partial()), async (c) => {
  try {
    const weekStart = c.req.param("weekStart");
    const updates = c.req.valid("json");
    
    const reflection = await storage.updateWeeklyReflection(weekStart, updates);
    
    if (!reflection) {
      return c.json({ error: "Reflection not found" }, 404);
    }
    
    return c.json({ reflection });
  } catch (error) {
    return c.json({ error: "Failed to update reflection" }, 500);
  }
});

export default app;
