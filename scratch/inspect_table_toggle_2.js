const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = '';

content = fs.readFileSync(filePath, 'utf8');
if (content.includes('\u0000')) {
  content = fs.readFileSync(filePath, 'utf16le');
}

const lines = content.split(/\r?\n/);

console.log("=== Second LayoutGrid button (lines 8930-8960) ===");
for (let i = 8930; i <= 8960; i++) {
  console.log(`${i}: ${lines[i - 1]}`);
}
