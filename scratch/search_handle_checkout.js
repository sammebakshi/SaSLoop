const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../pos-app/src/App.jsx');
const lines = fs.readFileSync(file, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const calculateTotals')) {
    console.log(`Line ${i + 1}: ${lines[i].trim()}`);
    for (let j = i; j < i + 30; j++) {
      console.log(`  ${j+1}: ${lines[j]}`);
    }
    break;
  }
}
