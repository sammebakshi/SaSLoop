const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('TemporaryKOT') || line.includes('SaveKOT') || line.includes('saveKOT') || line.includes('SaveTemporaryKOT')) {
    console.log(`${i + 1}: ${line.trim()}`);
  }
}
