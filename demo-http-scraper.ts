// Standalone demo of HTTP-based TUF scraper (No Puppeteer required)
import { HTTPTUFScraper } from './server/http-scraper';

async function demonstrateHTTPScraper() {
  console.log('🚀 TUF HTTP Scraper Demo - Puppeteer Alternative\n');
  
  const scraper = new HTTPTUFScraper();
  
  // Demo 1: Single profile scraping
  console.log('=== DEMO 1: Single Profile Scraping ===');
  try {
    const profile = await scraper.scrapeProfile('Volcaryx');
    
    console.log('✅ Profile scraped successfully:');
    console.log(`- Username: ${profile.username}`);
    console.log(`- Total Problems: ${profile.totalSolved}`);
    console.log(`- Easy: ${profile.difficultyStats.easy}`);
    console.log(`- Medium: ${profile.difficultyStats.medium}`);
    console.log(`- Hard: ${profile.difficultyStats.hard}`);
    console.log(`- Topics tracked: ${Object.keys(profile.topicProgress).length}`);
    console.log(`- Last updated: ${profile.lastUpdated}`);
  } catch (error) {
    console.error('❌ Single profile demo failed:', error.message);
  }
  
  console.log('\n=== DEMO 2: Batch Processing ===');
  try {
    const profiles = await scraper.scrapeMultipleProfiles(['Volcaryx', 'aagnesh']);
    
    console.log(`✅ Batch scraping completed: ${profiles.length} profiles`);
    profiles.forEach(p => {
      console.log(`- ${p.username}: ${p.totalSolved} problems`);
    });
  } catch (error) {
    console.error('❌ Batch demo failed:', error.message);
  }
  
  console.log('\n=== DEMO 3: JSON Export ===');
  try {
    const testData = {
      username: 'demo-user',
      totalSolved: 150,
      difficultyStats: { easy: 70, medium: 60, hard: 20 },
      topicProgress: { 'Arrays': { solved: 25, total: 50, percentage: 50 } },
      lastUpdated: new Date().toISOString()
    };
    
    const filename = await scraper.exportToJSON(testData, 'demo_export.json');
    console.log(`✅ JSON export successful: ${filename}`);
  } catch (error) {
    console.error('❌ Export demo failed:', error.message);
  }
  
  console.log('\n🎉 HTTP Scraper Demo Complete!');
  console.log('Features demonstrated:');
  console.log('- ✅ No Puppeteer dependencies');
  console.log('- ✅ Works entirely in Replit');
  console.log('- ✅ Fetch + Cheerio HTML parsing');
  console.log('- ✅ Authentic TUF data extraction');
  console.log('- ✅ JSON export functionality');
  console.log('- ✅ Batch processing capabilities');
}

// Run the demo
demonstrateHTTPScraper().catch(console.error);