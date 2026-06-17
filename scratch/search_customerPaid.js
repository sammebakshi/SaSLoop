const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const queries = ['customerPaidAmount'];

queries.forEach(q => {
  console.log(`=== Matches for "${q}" ===`);
  let count = 0;
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes(q.toLowerCase())) {
      count++;
      console.log(`${idx + 1}: ${line.trim()}`);
    }
  });
});
