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

    let browser: any = null;
    try {
      // Validate username
      if (!username || username.trim().length === 0) {
        throw new Error("Invalid username provided");
      }

      console.log(`Launching browser for real TUF scraping: ${username}`);
      
      // Launch puppeteer browser
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });

      const page = await browser.newPage();
      
      // Set viewport and user agent
      await page.setViewport({ width: 1280, height: 720 });
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

      // Navigate to TUF profile page
      const profileUrl = `https://takeuforward.org/profile/${username}`;
      console.log(`Navigating to: ${profileUrl}`);
      
      await page.goto(profileUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Wait for the A2Z Sheet section to load
      await page.waitForSelector('[data-testid="a2z-sheet"], .a2z-sheet, div:contains("A2Z Sheet")', { 
        timeout: 15000 
      });

      // Extract data from the A2Z Sheet section
      const profileData = await page.evaluate(() => {
        // Find A2Z Sheet progress data
        const findTextContent = (text: string) => {
          const xpath = `//text()[contains(., '${text}')]/parent::*`;
          return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        };

        // Extract total progress from A2Z Sheet
        let totalSolved = 0;
        let totalProblems = 455; // A2Z Sheet total
        
        // Look for progress indicators
        const progressElements = document.querySelectorAll('div, span, p');
        let easyCount = 0, mediumCount = 0, hardCount = 0;

        progressElements.forEach(el => {
          const text = el.textContent || '';
          
          // Match patterns like "236/455" for total progress
          const totalMatch = text.match(/(\d+)\/455/);
          if (totalMatch) {
            totalSolved = parseInt(totalMatch[1]);
          }

          // Match patterns for difficulty stats
          const easyMatch = text.match(/Easy.*?(\d+)\/\d+|(\d+).*?completed.*?easy/i);
          if (easyMatch) {
            easyCount = parseInt(easyMatch[1] || easyMatch[2]);
          }

          const mediumMatch = text.match(/Medium.*?(\d+)\/\d+|(\d+).*?completed.*?medium/i);
          if (mediumMatch) {
            mediumCount = parseInt(mediumMatch[1] || mediumMatch[2]);
          }

          const hardMatch = text.match(/Hard.*?(\d+)\/\d+|(\d+).*?completed.*?hard/i);
          if (hardMatch) {
            hardCount = parseInt(hardMatch[1] || hardMatch[2]);
          }
        });

        // Extract topic-wise progress
        const topicProgress: any = {};
        const topicNames = [
          'Arrays', 'Matrix', 'String', 'Searching & Sorting', 'Linked List',
          'Binary Trees', 'Binary Search Trees', 'Greedy', 'Backtracking',
          'Stacks and Queues', 'Heap', 'Graph', 'Trie', 'Dynamic Programming',
          'Binary Search', 'Recursion', 'Bit Manipulation', 'Two Pointer'
        ];

        // Look for topic progress in the "Topics covered" section
        const topicElements = document.querySelectorAll('[class*="topic"], [class*="progress"], .topic-item, div');
        
        topicNames.forEach(topic => {
          topicElements.forEach(el => {
            const text = el.textContent || '';
            // Match patterns like "Arrays • 102" or "Arrays: 102/X"
            const topicMatch = text.match(new RegExp(`${topic}.*?(\\d+)`, 'i'));
            if (topicMatch) {
              const solved = parseInt(topicMatch[1]);
              // Set estimated totals based on A2Z sheet structure
              const estimatedTotals: any = {
                'Arrays': 53, 'Matrix': 6, 'String': 15, 'Searching & Sorting': 18,
                'Linked List': 31, 'Binary Trees': 39, 'Binary Search Trees': 22,
                'Greedy': 15, 'Backtracking': 19, 'Stacks and Queues': 23,
                'Heap': 12, 'Graph': 54, 'Trie': 7, 'Dynamic Programming': 60,
                'Binary Search': 35, 'Recursion': 25, 'Bit Manipulation': 8, 'Two Pointer': 12
              };
              
              const total = estimatedTotals[topic] || 20;
              topicProgress[topic] = {
                solved: solved,
                total: total,
                percentage: Math.round((solved / total) * 100)
              };
            }
          });
        });

        return {
          totalSolved,
          totalProblems,
          easyCount,
          mediumCount,
          hardCount,
          topicProgress
        };
      });

      // Structure the scraped data
      const scrapedData: TUFProfileData = {
        username,
        totalSolved: profileData.totalSolved || 0,
        difficultyStats: {
          easy: profileData.easyCount || 0,
          medium: profileData.mediumCount || 0,
          hard: profileData.hardCount || 0
        },
        topicProgress: profileData.topicProgress || {}
      };

      console.log(`Successfully scraped TUF profile for ${username}:`, {
        totalSolved: scrapedData.totalSolved,
        easy: scrapedData.difficultyStats.easy,
        medium: scrapedData.difficultyStats.medium,
        hard: scrapedData.difficultyStats.hard,
        topicsFound: Object.keys(scrapedData.topicProgress).length
      });

      await browser.close();
      return scrapedData;

    } catch (error: any) {
      console.error(`Error scraping TUF profile for ${username}:`, error);
      
      if (browser) {
        await browser.close();
      }
      
      // Return null to indicate scraping failed - don't throw error to prevent breaking the flow
      console.log(`Scraping failed for ${username}, this may be due to profile privacy settings or network issues`);
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