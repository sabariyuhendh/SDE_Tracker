
import { Router, type Request, type Response } from "express";
import { storage } from "./storage";
import { insertStudentSchema, updateStudentProgressSchema, insertWeeklyReflectionSchema } from "@shared/schema";
import { z } from "zod";
import { tufScraper } from "./scraper";

const router = Router();

// Students routes
router.get("/api/students", async (req: Request, res: Response) => {
  try {
    const students = await storage.getAllStudents();
    res.json({ students });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

router.get("/api/students/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const student = await storage.getStudent(id);
    
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    res.json({ student });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch student" });
  }
});

router.post("/api/students", async (req: Request, res: Response) => {
  try {
    const result = insertStudentSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid student data", details: result.error.errors });
    }
    
    const studentData = result.data;
    
    // Check if username already exists
    const existing = await storage.getStudentByUsername(studentData.username);
    if (existing) {
      return res.status(400).json({ error: "Username already exists" });
    }
    
    const student = await storage.createStudent(studentData);
    res.status(201).json({ student });
  } catch (error) {
    res.status(500).json({ error: "Failed to create student" });
  }
});

router.put("/api/students/:id/progress", async (req: Request, res: Response) => {
  try {
    const result = updateStudentProgressSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid update data", details: result.error.errors });
    }
    
    const id = parseInt(req.params.id);
    const updates = result.data;
    
    const student = await storage.updateStudentProgress(id, updates);
    
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    res.json({ student });
  } catch (error) {
    res.status(500).json({ error: "Failed to update student progress" });
  }
});

router.delete("/api/students/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteStudent(id);
    
    if (!deleted) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete student" });
  }
});

// Class statistics
router.get("/api/class/stats", async (req: Request, res: Response) => {
  try {
    const students = await storage.getAllStudents();
    
    if (students.length === 0) {
      return res.json({
        totalStudents: 0,
        averageSolved: 0,
        totalSolved: 0,
        topPerformer: null,
        completionRate: 0
      });
    }

    const totalSolved = students.reduce((sum, s) => sum + (s.totalSolved || 0), 0);
    const averageSolved = Math.round(totalSolved / students.length);
    const topPerformer = students.reduce((top, current) => 
      (current.totalSolved || 0) > (top.totalSolved || 0) ? current : top
    );
    const completionRate = Math.round((totalSolved / (students.length * 190)) * 100);

    res.json({
      totalStudents: students.length,
      averageSolved,
      totalSolved,
      topPerformer,
      completionRate
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch class stats" });
  }
});

router.get("/api/class/leaderboard", async (req: Request, res: Response) => {
  try {
    const students = await storage.getAllStudents();
    const leaderboard = students
      .map(student => ({
        ...student,
        percentage: Math.round(((student.totalSolved || 0) / 190) * 100)
      }))
      .sort((a, b) => (b.totalSolved || 0) - (a.totalSolved || 0));
    
    res.json({ leaderboard });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// Weekly reflections routes
router.get("/api/reflections", async (req: Request, res: Response) => {
  try {
    const reflections = await storage.getWeeklyReflections();
    res.json({ reflections });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reflections" });
  }
});

router.get("/api/reflections/:weekStart", async (req: Request, res: Response) => {
  try {
    const weekStart = req.params.weekStart;
    const reflection = await storage.getWeeklyReflection(weekStart);
    
    if (!reflection) {
      return res.status(404).json({ error: "Reflection not found" });
    }
    
    res.json({ reflection });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reflection" });
  }
});

router.post("/api/reflections", async (req: Request, res: Response) => {
  try {
    const result = insertWeeklyReflectionSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid reflection data", details: result.error.errors });
    }
    
    const reflectionData = result.data;
    const reflection = await storage.createWeeklyReflection(reflectionData);
    res.status(201).json({ reflection });
  } catch (error) {
    res.status(500).json({ error: "Failed to create reflection" });
  }
});

router.put("/api/reflections/:weekStart", async (req: Request, res: Response) => {
  try {
    const result = insertWeeklyReflectionSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid reflection update data", details: result.error.errors });
    }
    
    const weekStart = req.params.weekStart;
    const updates = result.data;
    
    const reflection = await storage.updateWeeklyReflection(weekStart, updates);
    
    if (!reflection) {
      return res.status(404).json({ error: "Reflection not found" });
    }
    
    res.json({ reflection });
  } catch (error) {
    res.status(500).json({ error: "Failed to update reflection" });
  }
});

// Admin routes for bulk operations
router.post("/api/admin/students/bulk", async (req: Request, res: Response) => {
  try {
    const result = z.array(insertStudentSchema).safeParse(req.body.students);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid students data", details: result.error.errors });
    }
    
    const createdStudents = await (storage as any).bulkCreateStudents(result.data);
    res.status(201).json({ students: createdStudents, count: createdStudents.length });
  } catch (error) {
    res.status(500).json({ error: "Failed to bulk create students" });
  }
});

router.post("/api/admin/students/:id/mark-solved", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { topic, count } = req.body;
    
    if (!topic || !count || count <= 0) {
      return res.status(400).json({ error: "Topic and count are required" });
    }
    
    const student = await (storage as any).markProblemsAsSolved(id, topic, count);
    
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    res.json({ student });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark problems as solved" });
  }
});

router.post("/api/admin/students/:id/reset", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const student = await (storage as any).resetStudentProgress(id);
    
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    res.json({ student });
  } catch (error) {
    res.status(500).json({ error: "Failed to reset student progress" });
  }
});

// Test TUF scraping route
router.post("/api/scrape/test", async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    
    console.log(`Test scraping TUF profile for: ${username}`);
    const profileData = await tufScraper.scrapeTUFProfile(username);
    
    if (!profileData) {
      return res.status(400).json({ 
        error: "Failed to scrape TUF profile", 
        details: "Profile may be private or username doesn't exist" 
      });
    }
    
    res.json({ 
      message: "Test scraping successful", 
      profileData: profileData,
      profileUrl: `https://takeuforward.org/profile/${username}`
    });
  } catch (error: any) {
    console.error("Error in test scraping:", error);
    res.status(500).json({ 
      error: "Failed to test scrape profile", 
      details: error.message || "Unknown error occurred"
    });
  }
});

// TUF Scraper routes
router.post("/api/students/:id/scrape", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid student ID" });
    }
    
    console.log(`Starting scrape for student ID: ${id}`);
    const success = await tufScraper.updateStudentFromTUF(id);
    
    if (!success) {
      return res.status(400).json({ 
        error: "Failed to scrape student data", 
        details: "Scraper returned false - check server logs for details" 
      });
    }
    
    const updatedStudent = await storage.getStudent(id);
    res.json({ 
      message: "Student data updated successfully", 
      student: updatedStudent,
      source: "mock_data"
    });
  } catch (error: any) {
    console.error("Error scraping student data:", error);
    res.status(500).json({ 
      error: "Failed to scrape student data", 
      details: error.message || "Unknown error occurred"
    });
  }
});

router.post("/api/scrape/all", async (req: Request, res: Response) => {
  try {
    // Run in background to avoid timeout
    tufScraper.updateAllStudentsFromTUF().catch(console.error);
    res.json({ message: "Bulk scraping started in background" });
  } catch (error) {
    console.error("Error starting bulk scrape:", error);
    res.status(500).json({ error: "Failed to start bulk scraping" });
  }
});

router.post("/api/scrape/start-auto", async (req: Request, res: Response) => {
  try {
    tufScraper.startAutoScraping();
    res.json({ message: "Auto-scraping started (daily at 2 AM UTC)" });
  } catch (error) {
    console.error("Error starting auto-scraping:", error);
    res.status(500).json({ error: "Failed to start auto-scraping" });
  }
});

router.post("/api/scrape/stop-auto", async (req: Request, res: Response) => {
  try {
    tufScraper.stopAutoScraping();
    res.json({ message: "Auto-scraping stopped" });
  } catch (error) {
    console.error("Error stopping auto-scraping:", error);
    res.status(500).json({ error: "Failed to stop auto-scraping" });
  }
});

// Test scraping endpoint for a specific TUF username
router.post("/api/scrape/test", async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      return res.status(400).json({ error: "Valid username is required" });
    }
    
    const cleanUsername = username.trim();
    console.log(`Testing scrape for username: ${cleanUsername}`);
    
    const scrapedData = await tufScraper.scrapeTUFProfile(cleanUsername);
    
    if (!scrapedData) {
      return res.status(400).json({ 
        error: "Failed to scrape profile data", 
        details: "No data returned from scraper" 
      });
    }
    
    res.json({ 
      message: "Profile scraped successfully", 
      data: scrapedData,
      source: "mock_data" // Indicate this is mock data for now
    });
  } catch (error: any) {
    console.error("Error testing scrape:", error);
    res.status(500).json({ 
      error: "Failed to test scraping", 
      details: error.message || "Unknown error occurred"
    });
  }
});

export function registerRoutes(app: any) {
  app.use(router);
  return app;
}
