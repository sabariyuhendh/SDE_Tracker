import express from 'express';
import { HTTPTUFScraper } from './http-scraper';
import { storage } from './storage';

const router = express.Router();
const httpScraper = new HTTPTUFScraper();

// HTTP-based test scraping endpoint
router.post('/api/scrape/http-test', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    console.log(`🧪 HTTP Test scraping TUF profile for: ${username}`);
    
    const profileData = await httpScraper.scrapeProfile(username);
    
    res.json({
      message: 'HTTP test scraping successful',
      profileData: {
        username: profileData.username,
        totalSolved: profileData.totalSolved,
        difficultyStats: profileData.difficultyStats,
        topicProgress: profileData.topicProgress,
        lastUpdated: profileData.lastUpdated
      },
      profileUrl: `https://takeuforward.org/profile/${username}`,
      method: 'HTTP + Cheerio (No Puppeteer)'
    });
  } catch (error) {
    console.error('HTTP scraping error:', error);
    res.status(500).json({ 
      error: 'Failed to scrape profile using HTTP method',
      details: error.message 
    });
  }
});

// HTTP-based bulk scraping endpoint
router.post('/api/scrape/http-bulk', async (req, res) => {
  try {
    console.log('🚀 Starting HTTP bulk scraping for all students...');
    
    const students = await storage.getAllStudents();
    const usernames = students.map(s => s.username);
    
    res.json({
      message: 'HTTP bulk scraping started in background',
      note: 'Check server logs for progress',
      students: usernames,
      method: 'HTTP + Cheerio'
    });

    // Process in background
    processHTTPBulkScraping(usernames);
  } catch (error) {
    console.error('HTTP bulk scraping error:', error);
    res.status(500).json({ 
      error: 'Failed to start HTTP bulk scraping',
      details: error.message 
    });
  }
});

// HTTP-based individual student scraping
router.post('/api/students/:id/scrape-http', async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);
    const student = await storage.getStudentById(studentId);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    console.log(`🔄 HTTP scraping data for student: ${student.name} (${student.username})`);
    
    const profileData = await httpScraper.scrapeProfile(student.username);
    
    // Update student with scraped data
    const updatedStudent = await storage.updateStudent(studentId, {
      totalSolved: profileData.totalSolved,
      difficultyStats: profileData.difficultyStats,
      topicProgress: profileData.topicProgress,
      lastUpdated: new Date()
    });

    res.json({
      message: 'Student data updated successfully using HTTP scraper',
      student: updatedStudent,
      scrapedData: {
        username: profileData.username,
        totalSolved: profileData.totalSolved,
        difficultyStats: profileData.difficultyStats,
        topicProgress: profileData.topicProgress
      },
      method: 'HTTP + Cheerio'
    });
  } catch (error) {
    console.error('HTTP individual scraping error:', error);
    res.status(500).json({ 
      error: 'Failed to scrape and update student using HTTP method',
      details: error.message 
    });
  }
});

// Export scraped data as JSON
router.get('/api/scrape/export-json', async (req, res) => {
  try {
    const students = await storage.getAllStudents();
    const exportData = students.map(student => ({
      username: student.username,
      name: student.name,
      totalSolved: student.totalSolved,
      difficultyStats: student.difficultyStats,
      topicProgress: student.topicProgress,
      lastUpdated: student.lastUpdated,
      exportedAt: new Date().toISOString()
    }));

    // Save to file
    await httpScraper.exportToJSON(exportData, 'tuf_students_export.json');

    res.json({
      message: 'Student data exported successfully',
      filename: 'tuf_students_export.json',
      studentCount: exportData.length,
      data: exportData
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ 
      error: 'Failed to export student data',
      details: error.message 
    });
  }
});

// Background processing function
async function processHTTPBulkScraping(usernames: string[]) {
  console.log(`Found ${usernames.length} students to scrape using HTTP method`);
  
  for (const username of usernames) {
    try {
      const student = await storage.getStudentByUsername(username);
      if (!student) continue;

      console.log(`🔄 HTTP scraping data for student: ${student.name} (${username})`);
      
      const profileData = await httpScraper.scrapeProfile(username);
      
      await storage.updateStudent(student.id!, {
        totalSolved: profileData.totalSolved,
        difficultyStats: profileData.difficultyStats,
        topicProgress: profileData.topicProgress,
        lastUpdated: new Date()
      });
      
      console.log(`✅ HTTP scraping successful for ${student.name}: ${profileData.totalSolved} problems`);
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ HTTP scraping failed for ${username}:`, error.message);
    }
  }
  
  console.log('🎉 HTTP bulk scraping completed');
}

export default router;