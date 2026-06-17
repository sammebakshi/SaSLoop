const fs = require('fs');
const content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');
const lines = content.split('\n');
let found = false;
lines.forEach((line, i) => {
  if (line.includes('axios.post') || line.includes('fetch(') || line.includes('/api/orders') || line.includes('/api/kots')) {
    console.log(`Line ${i+1}: ${line.trim()}`);
  }
});
