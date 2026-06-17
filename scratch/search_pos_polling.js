const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(appPath, 'utf8');
const lines = content.split('\n');

console.log("=== SEARCH FOR FETCH/POLLING IN App.jsx ===");
lines.forEach((line, idx) => {
  if (line.includes('fetchOrdersForMode') || line.includes('setInterval') || line.includes('clearInterval')) {
    if (line.length < 150) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
