const fs = require('fs');

const content = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx', 'utf8');
const lines = content.split(/\r?\n/);

console.log("Searching for renderFoodTypeIcon:");
lines.forEach((line, idx) => {
  if (line.includes('renderFoodTypeIcon =')) {
    console.log(`Line ${idx+1}: ${line.trim()}`);
    for (let j = idx; j < idx + 20; j++) {
      console.log(`  ${j+1}: ${lines[j]}`);
    }
  }
});
