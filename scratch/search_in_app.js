const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../pos-app/src/App.jsx');
const lines = fs.readFileSync(file, 'utf8').split('\n');

function printContext(query) {
  console.log(`\n=== Context for "${query}" ===`);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase().includes(query.toLowerCase())) {
      console.log(`Line ${i + 1}:`);
      for (let j = Math.max(0, i - 4); j <= Math.min(lines.length - 1, i + 4); j++) {
        const marker = j === i ? ' -> ' : '    ';
        console.log(`${marker}${j + 1}: ${lines[j]}`);
      }
    }
  }
}

printContext('Sync Bills');
printContext('reprint_bill');
printContext('search_table');
printContext('search_by_code');
