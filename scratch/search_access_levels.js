const fs = require('fs');
const filepath = "c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx";
const content = fs.readFileSync(filepath, 'utf8');
const lines = content.split('\n');

console.log("Searching for 'accessLevels' in App.jsx...");
let count = 0;
for (let idx = 0; idx < lines.length; idx++) {
  const line = lines[idx];
  if (line.includes('accessLevels')) {
    count++;
    console.log(`${idx + 1}: ${line.trim()}`);
  }
}
console.log(`Total occurrences found: ${count}`);
