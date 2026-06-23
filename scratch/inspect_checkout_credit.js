const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

for (let i = 7490; i <= 7530; i++) {
  console.log(`${i}: ${lines[i - 1]}`);
}
