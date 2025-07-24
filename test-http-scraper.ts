import { testHTTPScraper } from './server/http-scraper';

// Run the HTTP scraper test
testHTTPScraper()
  .then((results) => {
    console.log('\n✅ HTTP Scraper Test Completed Successfully!');
    console.log(`📊 Scraped ${results.length} profiles`);
    results.forEach(profile => {
      console.log(`- ${profile.username}: ${profile.totalSolved} problems solved`);
    });
  })
  .catch((error) => {
    console.error('❌ HTTP Scraper Test Failed:', error);
  });