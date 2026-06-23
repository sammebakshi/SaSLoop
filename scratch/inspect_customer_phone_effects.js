const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = '';

content = fs.readFileSync(filePath, 'utf8');
if (content.includes('\u0000')) {
  content = fs.readFileSync(filePath, 'utf16le');
}

const lines = content.split(/\r?\n/);

console.log("=== customerPhone side-effects block 1 (lines 1610-1625) ===");
for (let i = 1610; i <= 1625; i++) {
  console.log(`${i}: ${lines[i - 1]}`);
}

console.log("\n=== customerPhone side-effects block 2 (lines 3940-3965) ===");
for (let i = 3940; i <= 3965; i++) {
  console.log(`${i}: ${lines[i - 1]}`);
}
