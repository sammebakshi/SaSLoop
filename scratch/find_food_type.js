const fs = require('fs');

const content = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx', 'utf8');
const lines = content.split(/\r?\n/);

console.log("Searching for food_type:");
lines.forEach((line, idx) => {
  if (line.includes('food_type')) {
    console.log(`Line ${idx+1}: ${line.trim()}`);
  }
});
