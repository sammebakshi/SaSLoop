const https = require('https');

https.get('https://backend.sasloop.in/api/catalog', (res) => {
  console.log("Server Headers:", res.headers);
  console.log("Server Date Header:", res.headers.date);
}).on('error', (err) => {
  console.error("Error:", err.message);
});
