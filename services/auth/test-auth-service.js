/**
 * Test script for Career Canvas Authentication Service
 * 
 * This script tests the serverless authentication service endpoints:
 * - Request Email OTP
 * - Verify OTP
 * - Request Magic Link
 * - Verify Magic Link
 */

const axios = require('axios');
const readline = require('readline');

// Configuration
const PROD_ENDPOINT = 'https://kecvilnt2j.execute-api.ap-southeast-1.amazonaws.com/prod/';
const LOCAL_ENDPOINT = 'http://127.0.0.1:3000';

// Use environment variable to switch between local and production endpoints
const API_ENDPOINT = process.env.USE_LOCAL === 'true' ? LOCAL_ENDPOINT : PROD_ENDPOINT;
console.log(`Using API endpoint: ${API_ENDPOINT}`);


// Configure axios with error handling
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return Promise.reject(error);
  }
);
const TEST_EMAIL = 'admin@careercanvas.pro'; // Replace with your test email

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to prompt for input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Test Email OTP Flow
async function testEmailOtpFlow() {
  console.log('\n===== Testing Email OTP Flow =====');
  
  try {
    // Step 1: Request OTP
    console.log(`\nRequesting OTP for ${TEST_EMAIL}...`);
    const requestOtpResponse = await axios.post(`${API_ENDPOINT}/auth/otp/request/email`, {
      email: TEST_EMAIL
    });
    
    console.log('Response:', JSON.stringify(requestOtpResponse.data, null, 2));
    
    if (requestOtpResponse.status === 200) {
      console.log('✅ OTP request successful');
      
      // Step 2: Get OTP from user input
      const otp = await prompt('\nCheck your email and enter the OTP: ');
      
      // Step 3: Verify OTP
      console.log('\nVerifying OTP...');
      const verifyOtpResponse = await axios.get(
        `${API_ENDPOINT}/auth/otp/verify?otp=${otp}&username=${TEST_EMAIL}`
      );
      
      console.log('Response:', JSON.stringify(verifyOtpResponse.data, null, 2));
      
      if (verifyOtpResponse.status === 200) {
        console.log('✅ OTP verification successful');
        console.log('Access Token:', verifyOtpResponse.data.data.accessToken);
        console.log('Is New User:', verifyOtpResponse.data.data.isNewUser);
      } else {
        console.log('❌ OTP verification failed');
      }
    } else {
      console.log('❌ OTP request failed');
    }
  } catch (error) {
    console.error('Error in OTP flow:', error.response ? error.response.data : error.message);
  }
}

// Test Magic Link Flow
async function testMagicLinkFlow() {
  console.log('\n===== Testing Magic Link Flow =====');
  
  try {
    // Step 1: Request Magic Link
    console.log(`\nRequesting Magic Link for ${TEST_EMAIL}...`);
    const requestLinkResponse = await axios.post(`${API_ENDPOINT}/auth/magic-link/request`, {
      email: TEST_EMAIL
    });
    
    console.log('Response:', JSON.stringify(requestLinkResponse.data, null, 2));
    
    if (requestLinkResponse.status === 200) {
      console.log('✅ Magic Link request successful');
      console.log('\nCheck your email for the magic link. The link will redirect you to the application.');
      console.log('Note: The verification happens automatically when you click the link.');
      
      await prompt('\nPress Enter after testing the magic link to continue...');
    } else {
      console.log('❌ Magic Link request failed');
    }
  } catch (error) {
    console.error('Error in Magic Link flow:', error.response ? error.response.data : error.message);
  }
}

// Main function to run tests
async function runTests() {
  console.log('Career Canvas Authentication Service Test');
  console.log('======================================');
  
  const testChoice = await prompt('\nSelect test to run:\n1. Email OTP Flow\n2. Magic Link Flow\n3. Both\nEnter choice (1-3): ');
  
  switch (testChoice) {
    case '1':
      await testEmailOtpFlow();
      break;
    case '2':
      await testMagicLinkFlow();
      break;
    case '3':
      await testEmailOtpFlow();
      await testMagicLinkFlow();
      break;
    default:
      console.log('Invalid choice. Exiting.');
  }
  
  rl.close();
  console.log('\nTest completed.');
}

// Run the tests
runTests().catch(error => {
  console.error('Test failed:', error);
  rl.close();
});