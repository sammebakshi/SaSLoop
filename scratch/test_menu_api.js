const http = require('http');

http.get('http://localhost:5000/api/public/menu/3', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("Status:", res.statusCode);
    try {
      const json = JSON.parse(data);
      console.log("Business:", json.business?.name);
      console.log("Items count:", json.items?.length);
    } catch(e) {
      console.log("Raw output:", data.substring(0, 300));
    }
  });
}).on('error', err => console.error("Error:", err.message));
