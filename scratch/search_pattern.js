const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const query = process.argv[2];
if (!query) {
  console.log("Usage: node search_pattern.js <string>");
  process.exit(1);
}

console.log(`Searching for: "${query}"`);
let count = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].toLowerCase().includes(query.toLowerCase())) {
    console.log(`${i + 1}: ${lines[i].trim()}`);
    count++;
    if (count >= 50) {
      console.log("...truncated (too many matches)");
      break;
    }
  }
}
