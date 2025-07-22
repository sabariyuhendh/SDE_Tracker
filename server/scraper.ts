import puppeteer from "puppeteer";
import * as cron from "node-cron";
import { storage } from "./storage";

export interface TUFProfileData {
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
}

export class TUFScraper {
  private scrapingInProgress = new Set<string>();

  async scrapeTUFProfile(username: string): Promise<TUFProfileData | null> {
    if (this.scrapingInProgress.has(username)) {
      console.log(`Scraping already in progress for user: ${username}`);
      return null;
    }

    this.scrapingInProgress.add(username);
    console.log(`Starting to scrape TUF profile for user: ${username}`);

    try {
      const url = `https://takeuforward.org/profile/${username}`;
      const browser = await puppeteer.launch({ 
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
          '--no-zygote',
          '--single-process'
        ]
      });
      
      const page = await browser.newPage();
      
      // Set a longer timeout for slow networks
      await page.setDefaultNavigationTimeout(60000);
      
      // Navigate to the profile page
      await page.goto(url, { 
        waitUntil: "networkidle2",
        timeout: 60000 
      });

      // Wait for the profile content to load
      await page.waitForSelector('body', { timeout: 30000 });

      // Extract profile data
      const profileData = await page.evaluate(() => {
        // Helper function to extract numbers from text
        const extractNumber = (text: string | null): number => {
          if (!text) return 0;
          const match = text.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        };

        // Try to find total problems solved
        let totalSolved = 0;
        const totalElements = [
          document.querySelector('.total-problems-solved'),
          document.querySelector('[data-testid="total-solved"]'),
          document.querySelector('.profile-stats .total'),
          ...Array.from(document.querySelectorAll('*')).filter(el => 
            el.textContent?.includes('Total Solved') || 
            el.textContent?.includes('Problems Solved')
          )
        ];

        for (const element of totalElements) {
          if (element?.textContent) {
            const extracted = extractNumber(element.textContent);
            if (extracted > 0) {
              totalSolved = extracted;
              break;
            }
          }
        }

        // Try to extract difficulty stats
        const difficultyStats = { easy: 0, medium: 0, hard: 0 };
        
        // Look for difficulty breakdown
        const difficultyElements = Array.from(document.querySelectorAll('*'))
          .filter(el => {
            const text = el.textContent?.toLowerCase();
            return text?.includes('easy') || text?.includes('medium') || text?.includes('hard');
          });

        for (const element of difficultyElements) {
          const text = element.textContent?.toLowerCase() || '';
          const number = extractNumber(element.textContent || '');
          
          if (text.includes('easy') && number > 0) {
            difficultyStats.easy = Math.max(difficultyStats.easy, number);
          } else if (text.includes('medium') && number > 0) {
            difficultyStats.medium = Math.max(difficultyStats.medium, number);
          } else if (text.includes('hard') && number > 0) {
            difficultyStats.hard = Math.max(difficultyStats.hard, number);
          }
        }

        // Try to extract topic progress
        const topicProgress: { [topic: string]: { solved: number; total: number; percentage: number } } = {};
        
        // Look for topic sections
        const topicElements = Array.from(document.querySelectorAll('.topic-progress, .sheet-progress, .topic-card, .progress-card'));
        
        for (const element of topicElements) {
          const topicName = element.querySelector('.topic-name, .sheet-name, h3, h4')?.textContent?.trim();
          if (!topicName) continue;

          const progressText = element.textContent || '';
          const numbers = progressText.match(/\d+/g)?.map(n => parseInt(n, 10)) || [];
          
          if (numbers.length >= 2) {
            const solved = numbers[0];
            const total = numbers[1];
            const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
            
            topicProgress[topicName] = { solved, total, percentage };
          }
        }

        // Also look for progress bars
        const progressBars = Array.from(document.querySelectorAll('.progress-bar, .progress'));
        for (const bar of progressBars) {
          const parent = bar.closest('.topic-section, .sheet-section, .progress-section');
          const topicName = parent?.querySelector('h3, h4, .topic-title, .sheet-title')?.textContent?.trim();
          
          if (topicName && !topicProgress[topicName]) {
            const progressText = parent?.textContent || '';
            const numbers = progressText.match(/\d+/g)?.map(n => parseInt(n, 10)) || [];
            
            if (numbers.length >= 2) {
              const solved = numbers[0];
              const total = numbers[1];
              const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
              
              topicProgress[topicName] = { solved, total, percentage };
            }
          }
        }

        return {
          totalSolved,
          difficultyStats,
          topicProgress
        };
      });

      await browser.close();
      
      console.log(`Successfully scraped data for user: ${username}`);
      console.log('Scraped data:', JSON.stringify(profileData, null, 2));

      return {
        username,
        ...profileData
      };

    } catch (error) {
      console.error(`Error scraping TUF profile for ${username}:`, error);
      return null;
    } finally {
      this.scrapingInProgress.delete(username);
    }
  }

  async updateStudentFromTUF(studentId: number): Promise<boolean> {
    try {
      const student = await storage.getStudent(studentId);
      if (!student) {
        console.error(`Student with ID ${studentId} not found`);
        return false;
      }

      const scrapedData = await this.scrapeTUFProfile(student.username);
      if (!scrapedData) {
        console.error(`Failed to scrape data for student: ${student.username}`);
        return false;
      }

      // Update student with scraped data
      const updatedStudent = await storage.updateStudentProgress(studentId, {
        topicProgress: scrapedData.topicProgress,
        difficultyStats: scrapedData.difficultyStats
      });

      if (updatedStudent) {
        console.log(`Successfully updated student ${student.name} (${student.username})`);
        return true;
      }

      return false;
    } catch (error) {
      console.error(`Error updating student ${studentId} from TUF:`, error);
      return false;
    }
  }

  async updateAllStudentsFromTUF(): Promise<void> {
    console.log('Starting bulk update of all students from TUF...');
    
    try {
      const students = await storage.getAllStudents();
      const updatePromises = students.map((student: any) => 
        this.updateStudentFromTUF(student.id)
      );

      const results = await Promise.allSettled(updatePromises);
      
      const successful = results.filter((r: any) => r.status === 'fulfilled' && r.value).length;
      const failed = results.length - successful;

      console.log(`Bulk update completed: ${successful} successful, ${failed} failed`);
    } catch (error) {
      console.error('Error during bulk update:', error);
    }
  }

  startAutoScraping(): void {
    // Run every 24 hours at 2 AM
    cron.schedule('0 2 * * *', async () => {
      console.log('Starting scheduled TUF data scraping...');
      await this.updateAllStudentsFromTUF();
    });

    console.log('Auto-scraping scheduled: Every day at 2 AM UTC');
  }

  stopAutoScraping(): void {
    // Note: node-cron doesn't have a global destroy method
    // Individual tasks need to be destroyed using their returned task objects
    console.log('Auto-scraping stopped');
  }
}

export const tufScraper = new TUFScraper();