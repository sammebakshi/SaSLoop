const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const queries = ['settingsActiveTab ==='];

queries.forEach(q => {
  console.log(`=== Matches for "${q}" ===`);
  let count = 0;
  lines.forEach((line, idx) => {
    if (line.includes(q)) {
      count++;
      console.log(`${idx + 1}: ${line.trim()}`);
    }
  });
});
