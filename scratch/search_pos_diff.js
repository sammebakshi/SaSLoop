const fs = require('fs');
const diff = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/scratch/pos_diff.diff', 'utf8');
const lines = diff.split('\n');
console.log(`Total lines: ${lines.length}`);
lines.forEach((line, idx) => {
  if (line.includes('orderPrinters') || line.includes('settingsActiveTab === \'printer\'')) {
    console.log(`Line ${idx + 1}: ${line}`);
  }
});
