const fs = require('fs');

const content = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx', 'utf8');
const lines = content.split(/\r?\n/);

const targets = [1562, 1805, 1839, 1881];
targets.forEach(t => {
  console.log(`\n--- Line ${t} ---`);
  for (let idx = t - 5; idx <= t + 15; idx++) {
    if (lines[idx]) {
      console.log(`${idx + 1}: ${lines[idx]}`);
    }
  }
});
