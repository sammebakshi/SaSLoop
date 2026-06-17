const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../routes/crmRoutes.js');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const queries = ['loyalty', 'balance', 'customer', 'number', 'phone'];

queries.forEach(q => {
  console.log(`=== Matches for "${q}" ===`);
  let count = 0;
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes(q.toLowerCase())) {
      count++;
      if (count <= 30) {
        console.log(`${idx + 1}: ${line.trim()}`);
      }
    }
  });
  console.log(`Total matches for "${q}": ${count}\n`);
});
