const http = require('http');

function fetchStatus(userId, table) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5000/api/public/table-status/${userId}/${table}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { resolve(data); }
      });
    }).on('error', err => reject(err));
  });
}

async function run() {
  try {
    console.log("=== Testing /api/public/table-status/3/4 ===");
    const res3 = await fetchStatus(3, 4);
    console.log("Response for User/Outlet 3, Table 4:", res3);

    console.log("\n=== Testing /api/public/table-status/55/4 ===");
    const res55 = await fetchStatus(55, 4);
    console.log("Response for User/Outlet 55, Table 4:", res55);
  } catch (err) {
    console.error("HTTP error:", err.message);
  }
}

run();
