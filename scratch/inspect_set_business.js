const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('setBusiness(')) {
    console.log(`${i + 1}: ${lines[i].trim()}`);
    // Print around the setBusiness call
    for (let j = Math.max(0, i - 5); j < Math.min(lines.length, i + 10); j++) {
      console.log(`  ${j + 1}: ${lines[j]}`);
    }
  }
}
