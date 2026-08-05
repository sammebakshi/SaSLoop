const http = require('http');

http.get('http://localhost:5000/menu', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("Status:", res.statusCode);
    console.log("Is HTML:", data.includes('<!DOCTYPE html>') || data.includes('<html'));
    console.log("Length:", data.length);
  });
}).on('error', err => console.error("Fetch Error:", err.message));
