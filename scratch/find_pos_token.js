const fs = require('fs');
const filepath = "c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx";
const content = fs.readFileSync(filepath, 'utf8');
const lines = content.split('\n');

for (let idx = 0; idx < lines.length; idx++) {
  if (lines[idx].includes('pos_token')) {
    console.log(`${idx + 1}: ${lines[idx].trim()}`);
  }
}
