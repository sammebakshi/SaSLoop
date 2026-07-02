const https = require('https');

function testUrl(url) {
  return new Promise((resolve) => {
    console.log(`Pinging ${url}...`);
    const req = https.get(url, { timeout: 5000 }, (res) => {
      console.log(`Response Code for ${url}: ${res.statusCode}`);
      resolve(res.statusCode);
    });

    req.on('error', (err) => {
      console.error(`Error pinging ${url}:`, err.message);
      resolve(null);
    });

    req.on('timeout', () => {
      console.error(`Timeout pinging ${url}`);
      req.destroy();
      resolve(null);
    });
  });
}

testUrl('https://backend.sasloop.in/api/catalog');
