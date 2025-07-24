// Test the serverless API locally
import { execSync } from 'child_process';

console.log('🧪 Testing Serverless TUF Scraper API\n');

// Test cases
const testCases = [
  { username: 'Volcaryx', description: 'Known working profile' },
  { username: 'invaliduser123', description: 'Invalid profile test' }
];

for (const testCase of testCases) {
  console.log(`Testing: ${testCase.description} (${testCase.username})`);
  
  try {
    const result = execSync(
      `curl -s "http://localhost:5000/api/scrape?username=${testCase.username}" | head -100`,
      { encoding: 'utf8' }
    );
    
    console.log('Response:', result.substring(0, 200) + '...\n');
  } catch (error) {
    console.log('❌ API Test Failed:', error.message);
  }
}

console.log('✅ Serverless API tests completed');
console.log('🚀 Ready for Vercel deployment with: vercel deploy');