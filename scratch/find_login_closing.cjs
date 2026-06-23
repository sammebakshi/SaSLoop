const fs = require('fs');

const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

let braceCount = 0;
let started = false;
let startLine = 8498; // 1-indexed (line 8498 is 'if (!isAuthenticated) {')

for (let i = startLine - 1; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('{')) {
    braceCount += (line.match(/{/g) || []).length;
    started = true;
  }
  if (line.includes('}')) {
    braceCount -= (line.match(/}/g) || []).length;
  }
  if (started && braceCount === 0) {
    console.log(`Matching closing brace for 'if (!isAuthenticated)' is on line ${i + 1}`);
    console.log(`Line content: ${line}`);
    break;
  }
}
