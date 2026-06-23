const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = '';

content = fs.readFileSync(filePath, 'utf8');
if (content.includes('\u0000')) {
  content = fs.readFileSync(filePath, 'utf16le');
}

const lines = content.split(/\r?\n/);

console.log("=== Payment Modal Loyalty block (lines 16110-16160) ===");
for (let i = 16110; i <= 16160; i++) {
  console.log(`${i}: ${lines[i - 1]}`);
}
