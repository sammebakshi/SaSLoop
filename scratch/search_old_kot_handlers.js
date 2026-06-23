const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../pos-app/src/App.jsx');
const lines = fs.readFileSync(file, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Expense') || lines[i].includes('expense')) {
    console.log(`Line ${i + 1}: ${lines[i].trim()}`);
  }
}
