const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const queries = ['clear', 'remove', 'delete', 'wipe', 'reset'];

queries.forEach(q => {
  console.log(`=== Matches for "${q}" in Settings Modal ===`);
  let count = 0;
  for (let idx = 16390; idx < 17500; idx++) {
    if (lines[idx] && lines[idx].toLowerCase().includes(q.toLowerCase())) {
      count++;
      console.log(`${idx + 1}: ${lines[idx].trim()}`);
    }
  }
});
