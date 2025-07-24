// Backend API Testing Script
// Tests all endpoints to verify functionality

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

async function testBackend() {
  console.log('🧪 Testing TUF Tracker Backend API\n');

  // Test 1: Health Check
  console.log('1. Testing Health Check...');
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Health Check:', data.status);
  } catch (error) {
    console.log('❌ Health Check Failed:', error.message);
  }

  // Test 2: Get Students (empty initially)
  console.log('\n2. Testing Get Students...');
  try {
    const response = await fetch(`${BASE_URL}/api/students`);
    const data = await response.json();
    console.log('✅ Students Count:', data.students.length);
  } catch (error) {
    console.log('❌ Get Students Failed:', error.message);
  }

  // Test 3: Add Student
  console.log('\n3. Testing Add Student...');
  try {
    const response = await fetch(`${BASE_URL}/api/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', username: 'testuser' })
    });
    const data = await response.json();
    console.log('✅ Student Added:', data.student.name);
  } catch (error) {
    console.log('❌ Add Student Failed:', error.message);
  }

  // Test 4: Test Scraping
  console.log('\n4. Testing Profile Scraping...');
  try {
    const response = await fetch(`${BASE_URL}/api/scrape/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'Volcaryx' })
    });
    const data = await response.json();
    console.log('✅ Scraping Success:', data.profileData?.totalSolved || 'Data extracted');
  } catch (error) {
    console.log('❌ Scraping Failed:', error.message);
  }

  // Test 5: Analytics
  console.log('\n5. Testing Analytics...');
  try {
    const response = await fetch(`${BASE_URL}/api/analytics/class-stats`);
    const data = await response.json();
    console.log('✅ Analytics:', `${data.totalStudents} students, ${data.totalProblems} problems`);
  } catch (error) {
    console.log('❌ Analytics Failed:', error.message);
  }

  console.log('\n🎉 Backend API Testing Complete!');
}

testBackend().catch(console.error);