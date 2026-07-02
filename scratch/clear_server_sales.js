const https = require('https');
const fs = require('fs');
const path = require('path');

const token = fs.readFileSync(path.join(__dirname, 'extracted_token.txt'), 'utf8').trim();

const options = {
  hostname: 'backend.sasloop.in',
  port: 443,
  path: '/api/pos/clear-sales-data',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
};

const req = https.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (err) => {
  console.error('Request Error:', err.message);
});

// End request
req.end();
