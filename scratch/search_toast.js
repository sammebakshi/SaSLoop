const fs = require('fs');
const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);
let found = 0;
lines.forEach((line, idx) => {
  if (line.includes('toast.') && found < 10) {
    console.log(`${idx + 1}: ${line.trim()}`);
    found++;
  }
});
