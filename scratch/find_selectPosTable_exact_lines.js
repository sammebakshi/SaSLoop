const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const selectPosTable =')) {
    console.log(`selectPosTable starts at line ${i + 1}`);
    for (let j = i; j < i + 100; j++) {
      console.log(`${j + 1}: ${lines[j]}`);
    }
    break;
  }
}
