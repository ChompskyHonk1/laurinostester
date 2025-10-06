// Simple test script to verify the Google rating API endpoint
// Run this with: node test-google-rating.js

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/google-rating',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('Response:', JSON.stringify(response, null, 2));
      
      if (response.success) {
        console.log(`✅ Success! Current rating: ${response.currentRating}, Threshold: ${response.threshold}`);
      } else {
        console.log(`❌ Failed: ${response.error}`);
      }
    } catch (error) {
      console.error('Error parsing response:', error);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.end();