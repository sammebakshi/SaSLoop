const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\pos-app\\src\\App.jsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log("Searching for setSelectedItemForModifiers in App.jsx:");
lines.forEach((line, index) => {
  if (line.includes('setSelectedItemForModifiers')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
    // Print 3 lines before and after
    const start = Math.max(0, index - 3);
    const end = Math.min(lines.length, index + 4);
    for (let i = start; i < end; i++) {
      console.log(`  [${i + 1}] ${lines[i]}`);
    }
    console.log("---");
  }
});
