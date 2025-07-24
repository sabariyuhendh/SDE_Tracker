// Scheduled Scraping Service
// Automatically scrapes student data at regular intervals

import cron from 'node-cron';

export class ScheduledScraper {
  constructor(scraper, studentManager) {
    this.scraper = scraper;
    this.studentManager = studentManager;
    this.isRunning = false;
    this.cronJob = null;
  }

  start() {
    if (this.isRunning) {
      console.log('⚠️ Scheduled scraper already running');
      return;
    }

    // Schedule scraping every day at 6 AM
    this.cronJob = cron.schedule('0 6 * * *', async () => {
      await this.performScheduledScraping();
    }, {
      scheduled: false,
      timezone: 'UTC'
    });

    this.cronJob.start();
    this.isRunning = true;
    
    console.log('⏰ Scheduled scraper started - runs daily at 6:00 AM UTC');
  }

  stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
    }
    this.isRunning = false;
    console.log('⏹️ Scheduled scraper stopped');
  }

  async performScheduledScraping() {
    console.log('🕒 Starting scheduled scraping...');
    
    try {
      const students = await this.studentManager.getAllStudents();
      
      if (students.length === 0) {
        console.log('📭 No students to scrape');
        return;
      }

      console.log(`🚀 Scraping ${students.length} students...`);
      let successCount = 0;
      let failureCount = 0;

      for (const student of students) {
        try {
          console.log(`🔄 Scraping: ${student.name} (${student.username})`);
          const profileData = await this.scraper.scrapeProfile(student.username);
          await this.studentManager.updateStudentData(student.id, profileData);
          
          successCount++;
          console.log(`✅ Updated: ${student.name} - ${profileData.totalSolved} problems`);
          
          // Rate limiting between requests
          await new Promise(resolve => setTimeout(resolve, 3000));
        } catch (error) {
          failureCount++;
          console.error(`❌ Failed to scrape ${student.name}: ${error.message}`);
        }
      }

      console.log(`🎉 Scheduled scraping completed:`);
      console.log(`   ✅ Success: ${successCount} students`);
      console.log(`   ❌ Failed: ${failureCount} students`);

    } catch (error) {
      console.error('💥 Scheduled scraping failed:', error);
    }
  }

  // Manual trigger for testing
  async triggerManualScraping() {
    if (!this.isRunning) {
      console.log('⚠️ Scheduled scraper not running');
      return;
    }

    console.log('🎯 Manual scraping triggered');
    await this.performScheduledScraping();
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      nextRun: this.cronJob ? this.cronJob.nextDate() : null,
      schedule: '0 6 * * * (Daily at 6:00 AM UTC)'
    };
  }
}