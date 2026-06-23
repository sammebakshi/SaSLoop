const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

for (let i = 16120; i <= 16150; i++) {
  console.log(`${i}: ${lines[i - 1]}`);
}
