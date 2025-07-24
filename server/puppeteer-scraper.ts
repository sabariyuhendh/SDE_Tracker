import puppeteer from 'puppeteer';
import fs from 'fs';

interface TUFProfileData {
  username: string;
  totalSolved: number;
  difficultyStats: {
    easy: number;
    medium: number;
    hard: number;
  };
  topicProgress: Record<string, {
    solved: number;
    total: number;
    percentage: number;
  }>;
}

export class PuppeteerTUFScraper {
  async scrapeTUFProfile(username: string): Promise<TUFProfileData> {
    // Try multiple possible URL patterns for TUF profiles
    const possibleUrls = [
      `https://takeuforward.org/profile/${username}`,
      `https://takeuforward.org/user/${username}`,
      `https://takeuforward.org/users/${username}`
    ];

    console.log(`🔍 Starting Puppeteer scraping for: ${username}`);
    
    const browser = await puppeteer.launch({ 
      headless: "new",
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    let scrapedData: TUFProfileData | null = null;

    for (const url of possibleUrls) {
      try {
        console.log(`🌐 Trying URL: ${url}`);
        await page.goto(url, { 
          waitUntil: "networkidle2", 
          timeout: 30000 
        });

        // Wait for potential dynamic content
        await page.waitForTimeout(3000);

        const data = await page.evaluate(() => {
          // Multiple selector strategies for finding profile data
          const getTextContent = (selectors: string[]): string => {
            for (const selector of selectors) {
              const element = document.querySelector(selector);
              if (element?.textContent?.trim()) {
                return element.textContent.trim();
              }
            }
            return "0";
          };

          const getNumber = (selectors: string[]): number => {
            const text = getTextContent(selectors);
            const match = text.match(/\d+/);
            return match ? parseInt(match[0], 10) : 0;
          };

          // Try various selectors that might contain the username
          const username = getTextContent([
            '.username', 
            '.profile-username', 
            '.user-name',
            'h1.name',
            '.profile-name',
            '[data-testid="username"]'
          ]);

          // Look for total problems solved with various selectors
          const totalSolved = getNumber([
            '.total-solved',
            '.totalSolved',
            '.problems-solved',
            '.total-problems',
            '[data-testid="total-solved"]',
            '.stats-total',
            '.count-total'
          ]);

          // Look for difficulty breakdown
          const easy = getNumber([
            '.easy-count',
            '.difficulty-easy',
            '.easy-solved',
            '[data-difficulty="easy"]',
            '.stats-easy'
          ]);

          const medium = getNumber([
            '.medium-count',
            '.difficulty-medium', 
            '.medium-solved',
            '[data-difficulty="medium"]',
            '.stats-medium'
          ]);

          const hard = getNumber([
            '.hard-count',
            '.difficulty-hard',
            '.hard-solved', 
            '[data-difficulty="hard"]',
            '.stats-hard'
          ]);

          // Look for topic progress sections
          const topicProgress: Record<string, any> = {};
          
          // Try multiple selector patterns for topic sections
          const topicSelectors = [
            '.topic-progress',
            '.topic-card',
            '.subject-progress',
            '.category-stats',
            '[data-topic]'
          ];

          topicSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach((el) => {
              const topicNameSelectors = ['.topic-name', '.subject-name', '.category-name', 'h3', 'h4'];
              const solvedSelectors = ['.solved-count', '.completed', '.solved', '.progress-solved'];
              const totalSelectors = ['.total-count', '.total', '.max', '.progress-total'];

              const topic = getTextContent(topicNameSelectors.map(s => `${selector} ${s}`));
              const solved = getNumber(solvedSelectors.map(s => `${selector} ${s}`));
              const total = getNumber(totalSelectors.map(s => `${selector} ${s}`));

              if (topic && topic !== "0" && (solved > 0 || total > 0)) {
                topicProgress[topic] = {
                  solved,
                  total: total || solved,
                  percentage: total ? Math.round((solved / total) * 100) : 0,
                };
              }
            });
          });

          // Also try to find progress from any elements containing numbers
          const allElements = document.querySelectorAll('*');
          const progressPattern = /(\d+)\/(\d+)/;
          
          allElements.forEach(el => {
            const text = el.textContent?.trim();
            if (text && progressPattern.test(text)) {
              const match = text.match(progressPattern);
              if (match) {
                const solved = parseInt(match[1]);
                const total = parseInt(match[2]);
                const parent = el.closest('[class*="topic"], [class*="subject"], [class*="category"]');
                if (parent) {
                  const topicName = parent.querySelector('h1, h2, h3, h4, h5, .title, .name')?.textContent?.trim();
                  if (topicName && solved <= total && total > 0) {
                    topicProgress[topicName] = {
                      solved,
                      total,
                      percentage: Math.round((solved / total) * 100)
                    };
                  }
                }
              }
            }
          });

          return {
            username: username || "Unknown",
            totalSolved,
            difficultyStats: { easy, medium, hard },
            topicProgress,
            pageTitle: document.title,
            bodyText: document.body.innerText?.substring(0, 500) || ""
          };
        });

        console.log(`📊 Extracted data from ${url}:`, {
          username: data.username,
          totalSolved: data.totalSolved,
          difficultyStats: data.difficultyStats,
          topicCount: Object.keys(data.topicProgress).length,
          pageTitle: data.pageTitle
        });

        // Check if we got meaningful data
        if (data.totalSolved > 0 || Object.keys(data.topicProgress).length > 0) {
          scrapedData = {
            username: data.username,
            totalSolved: data.totalSolved,
            difficultyStats: data.difficultyStats,
            topicProgress: data.topicProgress
          };
          
          // Save the data to file
          const filename = `tuf_${username}_${Date.now()}.json`;
          fs.writeFileSync(filename, JSON.stringify(scrapedData, null, 2));
          console.log(`✅ Scraped data saved as ${filename}`);
          break;
        } else {
          console.log(`⚠️  No meaningful data found at ${url}`);
          console.log(`Page sample: ${data.bodyText.substring(0, 200)}...`);
        }

      } catch (error) {
        console.log(`❌ Failed to scrape ${url}:`, error.message);
      }
    }

    await browser.close();

    if (!scrapedData) {
      throw new Error(`No valid TUF profile data found for username: ${username}`);
    }

    return scrapedData;
  }

  async testScrapeMultipleUsers(usernames: string[]): Promise<void> {
    console.log(`🧪 Testing scraper with usernames: ${usernames.join(', ')}`);
    
    for (const username of usernames) {
      try {
        const data = await this.scrapeTUFProfile(username);
        console.log(`✅ Successfully scraped ${username}:`, {
          totalSolved: data.totalSolved,
          topics: Object.keys(data.topicProgress).length
        });
      } catch (error) {
        console.log(`❌ Failed to scrape ${username}:`, error.message);
      }
    }
  }
}

// Test function
export async function testPuppeteerScraper() {
  const scraper = new PuppeteerTUFScraper();
  
  // Test with the usernames we have
  const testUsers = ['Volcaryx', 'aagnesh', 'dinesh'];
  
  console.log('🚀 Starting Puppeteer scraper test...');
  await scraper.testScrapeMultipleUsers(testUsers);
}