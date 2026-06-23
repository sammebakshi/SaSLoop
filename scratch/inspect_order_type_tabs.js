const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = '';

content = fs.readFileSync(filePath, 'utf8');
if (content.includes('\u0000')) {
  content = fs.readFileSync(filePath, 'utf16le');
}

const lines = content.split(/\r?\n/);

console.log("=== Order Type Tabs Section (lines 11390-11440) ===");
for (let i = 11390; i <= 11440; i++) {
  console.log(`${i}: ${lines[i - 1]}`);
}
