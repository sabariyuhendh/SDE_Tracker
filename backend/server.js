// TUF Class Tracker Backend Server
// Designed for Render deployment with full Puppeteer support

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { TUFScraper } from './services/TUFScraper.js';
import { StudentManager } from './services/StudentManager.js';
import { ScheduledScraper } from './services/ScheduledScraper.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Services
const scraper = new TUFScraper();
const studentManager = new StudentManager();
const scheduledScraper = new ScheduledScraper(scraper, studentManager);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

// Student Management Routes
app.get('/api/students', async (req, res) => {
  try {
    const students = await studentManager.getAllStudents();
    res.json({ students, count: students.length });
  } catch (error) {
    console.error('Failed to get students:', error);
    res.status(500).json({ error: 'Failed to retrieve students' });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { name, username } = req.body;
    
    if (!name || !username) {
      return res.status(400).json({ error: 'Name and username are required' });
    }

    // Check if student already exists
    const existingStudent = await studentManager.getStudentByUsername(username);
    if (existingStudent) {
      return res.status(409).json({ error: 'Student with this username already exists' });
    }

    const student = await studentManager.addStudent(name, username);
    
    // Auto-scrape new student data in background
    scraper.scrapeProfile(username)
      .then(data => studentManager.updateStudentData(student.id, data))
      .catch(err => console.error(`Auto-scraping failed for ${username}:`, err));

    res.status(201).json({ student, message: 'Student added successfully' });
  } catch (error) {
    console.error('Failed to add student:', error);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);
    const success = await studentManager.deleteStudent(studentId);
    
    if (!success) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Failed to delete student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// Scraping Routes
app.post('/api/scrape/test', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    console.log(`🧪 Test scraping for: ${username}`);
    const profileData = await scraper.scrapeProfile(username);

    res.json({
      message: 'Test scraping successful',
      username,
      profileData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test scraping failed:', error);
    res.status(500).json({ 
      error: 'Test scraping failed',
      details: error.message,
      username: req.body.username
    });
  }
});

app.post('/api/scrape/student/:id', async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);
    const student = await studentManager.getStudentById(studentId);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    console.log(`🔄 Scraping data for: ${student.name} (${student.username})`);
    const profileData = await scraper.scrapeProfile(student.username);
    const updatedStudent = await studentManager.updateStudentData(studentId, profileData);

    res.json({
      message: 'Student data updated successfully',
      student: updatedStudent,
      scrapedData: profileData
    });
  } catch (error) {
    console.error('Student scraping failed:', error);
    res.status(500).json({ 
      error: 'Failed to scrape student data',
      details: error.message
    });
  }
});

app.post('/api/scrape/bulk', async (req, res) => {
  try {
    const students = await studentManager.getAllStudents();
    
    if (students.length === 0) {
      return res.status(400).json({ error: 'No students to scrape' });
    }

    res.json({
      message: 'Bulk scraping started',
      studentCount: students.length,
      note: 'Check server logs for progress'
    });

    // Process bulk scraping in background
    processBulkScraping(students, scraper, studentManager);
  } catch (error) {
    console.error('Bulk scraping failed:', error);
    res.status(500).json({ 
      error: 'Failed to start bulk scraping',
      details: error.message
    });
  }
});

// Analytics Routes
app.get('/api/analytics/class-stats', async (req, res) => {
  try {
    const students = await studentManager.getAllStudents();
    const stats = calculateClassStats(students);
    res.json(stats);
  } catch (error) {
    console.error('Failed to get class stats:', error);
    res.status(500).json({ error: 'Failed to retrieve class statistics' });
  }
});

app.get('/api/analytics/leaderboard', async (req, res) => {
  try {
    const students = await studentManager.getAllStudents();
    const { sortBy = 'totalSolved' } = req.query;
    
    const leaderboard = students
      .sort((a, b) => {
        if (sortBy === 'percentage') {
          const aPercentage = (a.totalSolved / 455) * 100;
          const bPercentage = (b.totalSolved / 455) * 100;
          return bPercentage - aPercentage;
        }
        return b.totalSolved - a.totalSolved;
      })
      .map((student, index) => ({
        ...student,
        rank: index + 1,
        percentage: Math.round((student.totalSolved / 455) * 100)
      }));

    res.json({ leaderboard, sortBy });
  } catch (error) {
    console.error('Failed to get leaderboard:', error);
    res.status(500).json({ error: 'Failed to retrieve leaderboard' });
  }
});

// Export Routes
app.get('/api/export/json', async (req, res) => {
  try {
    const students = await studentManager.getAllStudents();
    const exportData = {
      exportedAt: new Date().toISOString(),
      studentCount: students.length,
      students: students.map(student => ({
        name: student.name,
        username: student.username,
        totalSolved: student.totalSolved,
        difficultyStats: student.difficultyStats,
        topicProgress: student.topicProgress,
        lastUpdated: student.lastUpdated,
        profileUrl: `https://takeuforward.org/profile/${student.username}`
      }))
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=tuf-class-export.json');
    res.json(exportData);
  } catch (error) {
    console.error('Export failed:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Background bulk scraping function
async function processBulkScraping(students, scraper, studentManager) {
  console.log(`🚀 Starting bulk scraping for ${students.length} students`);
  
  for (const student of students) {
    try {
      console.log(`🔄 Scraping: ${student.name} (${student.username})`);
      const profileData = await scraper.scrapeProfile(student.username);
      await studentManager.updateStudentData(student.id, profileData);
      console.log(`✅ Updated: ${student.name} - ${profileData.totalSolved} problems`);
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.error(`❌ Failed to scrape ${student.name}:`, error.message);
    }
  }
  
  console.log('🎉 Bulk scraping completed');
}

// Calculate class statistics
function calculateClassStats(students) {
  if (students.length === 0) {
    return {
      totalStudents: 0,
      totalProblems: 0,
      averageProblems: 0,
      topPerformer: null,
      difficultyBreakdown: { easy: 0, medium: 0, hard: 0 }
    };
  }

  const totalProblems = students.reduce((sum, s) => sum + s.totalSolved, 0);
  const averageProblems = Math.round(totalProblems / students.length);
  const topPerformer = students.reduce((top, current) => 
    current.totalSolved > top.totalSolved ? current : top
  );

  const difficultyBreakdown = students.reduce((acc, student) => ({
    easy: acc.easy + student.difficultyStats.easy,
    medium: acc.medium + student.difficultyStats.medium,
    hard: acc.hard + student.difficultyStats.hard
  }), { easy: 0, medium: 0, hard: 0 });

  return {
    totalStudents: students.length,
    totalProblems,
    averageProblems,
    topPerformer: {
      name: topPerformer.name,
      username: topPerformer.username,
      totalSolved: topPerformer.totalSolved
    },
    difficultyBreakdown
  };
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TUF Tracker Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Start scheduled scraping
  scheduledScraper.start();
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down server gracefully...');
  await scraper.cleanup();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Shutting down server gracefully...');
  await scraper.cleanup();
  process.exit(0);
});