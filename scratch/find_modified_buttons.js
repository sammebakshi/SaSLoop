const fs = require('fs');
const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);
lines.forEach((line, idx) => {
  if (line.includes('Please save or print the bill first')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
    // Print 5 lines before and after
    for (let i = Math.max(0, idx - 5); i <= Math.min(lines.length - 1, idx + 5); i++) {
      console.log(`  ${i + 1}: ${lines[i]}`);
    }
  }
});
