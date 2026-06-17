const fs = require('fs');
const filepath = "c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/services/api.js";
const content = fs.readFileSync(filepath, 'utf8');
const lines = content.split('\n');

for (let idx = 0; idx < lines.length; idx++) {
  const line = lines[idx];
  if (line.includes('baseURL') || line.includes('http')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
}
