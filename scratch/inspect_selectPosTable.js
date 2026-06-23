const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = '';

content = fs.readFileSync(filePath, 'utf8');
if (content.includes('\u0000')) {
  content = fs.readFileSync(filePath, 'utf16le');
}

const lines = content.split(/\r?\n/);

console.log("=== selectPosTable function ===");
let found = -1;
lines.forEach((line, index) => {
  if (line.includes('const selectPosTable =')) {
    found = index;
  }
});
if (found !== -1) {
  for (let i = found - 2; i <= found + 50; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}
