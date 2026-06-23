const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = '';

content = fs.readFileSync(filePath, 'utf8');
if (content.includes('\u0000')) {
  content = fs.readFileSync(filePath, 'utf16le');
}

const lines = content.split(/\r?\n/);

console.log("=== Actions Bar (lines 8460-8520) ===");
for (let i = 8460; i <= 8520; i++) {
  console.log(`${i}: ${lines[i - 1]}`);
}
