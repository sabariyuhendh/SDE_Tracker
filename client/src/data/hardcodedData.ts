// Frontend-only data management for TUF Class Tracker
// All student data managed locally without backend dependency

export interface StudentData {
  id: number;
  name: string;
  username: string;
  totalSolved: number;
  difficultyStats: {
    easy: number;
    medium: number;
    hard: number;
  };
  topicProgress: {
    [topic: string]: {
      solved: number;
      total: number;
      percentage: number;
    };
  };
  lastUpdated: Date;
  profileUrl: string;
}

// In-memory storage for frontend-only mode
let studentsData: StudentData[] = [];

// API simulation functions for frontend-only mode
export const hardcodedAPI = {
  async getAllStudents(): Promise<StudentData[]> {
    return [...studentsData];
  },

  async addStudent(name: string, username: string): Promise<StudentData> {
    const newStudent: StudentData = {
      id: Date.now(),
      name,
      username,
      totalSolved: 0,
      difficultyStats: { easy: 0, medium: 0, hard: 0 },
      topicProgress: {},
      lastUpdated: new Date(),
      profileUrl: `https://takeuforward.org/profile/${username}`
    };
    
    studentsData.push(newStudent);
    
    // Auto-scrape new student data
    try {
      await this.scrapeStudent(newStudent.id);
    } catch (error) {
      console.warn(`Auto-scraping failed for ${username}:`, error);
    }
    
    return newStudent;
  },

  async deleteStudent(id: number): Promise<boolean> {
    const index = studentsData.findIndex(s => s.id === id);
    if (index !== -1) {
      studentsData.splice(index, 1);
      return true;
    }
    return false;
  },

  async scrapeStudent(id: number): Promise<StudentData | null> {
    const student = studentsData.find(s => s.id === id);
    if (!student) return null;

    try {
      const scrapedData = await this.scrapeProfile(student.username);
      
      // Update student with scraped data
      Object.assign(student, {
        totalSolved: scrapedData.totalSolved,
        difficultyStats: scrapedData.difficultyStats,
        topicProgress: scrapedData.topicProgress,
        lastUpdated: new Date()
      });
      
      return student;
    } catch (error) {
      console.error(`Scraping failed for ${student.username}:`, error);
      return student;
    }
  },

  async scrapeAllStudents(): Promise<void> {
    for (const student of studentsData) {
      try {
        await this.scrapeStudent(student.id);
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Bulk scraping failed for ${student.username}:`, error);
      }
    }
  },

  async scrapeProfile(username: string): Promise<{
    totalSolved: number;
    difficultyStats: { easy: number; medium: number; hard: number };
    topicProgress: { [topic: string]: { solved: number; total: number; percentage: number } };
  }> {
    // Call backend API for scraping
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/scrape/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username })
    });
    
    if (!response.ok) {
      throw new Error(`Scraping failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.profileData || data;
  },

  async testScraping(username: string): Promise<any> {
    try {
      return await this.scrapeProfile(username);
    } catch (error) {
      throw new Error(`Test scraping failed: ${error.message}`);
    }
  }
};

// Initialize with empty data - no hardcoded users
export const getInitialData = (): StudentData[] => {
  return [];
};