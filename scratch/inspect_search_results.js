const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = '';

content = fs.readFileSync(filePath, 'utf8');
if (content.includes('\u0000')) {
  content = fs.readFileSync(filePath, 'utf16le');
}

const lines = content.split(/\r?\n/);

console.log("=== Dropdown rendering (lines 10000-10050) ===");
for (let i = 10000; i <= 10050; i++) {
  console.log(`${i}: ${lines[i - 1]}`);
}
