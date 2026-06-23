const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = '';

content = fs.readFileSync(filePath, 'utf8');
if (content.includes('\u0000')) {
  content = fs.readFileSync(filePath, 'utf16le');
}

const lines = content.split(/\r?\n/);

console.log("=== Login Page Title Bar (lines 8140-8180) ===");
for (let i = 8140; i <= 8180; i++) {
  console.log(`${i}: ${lines[i - 1]}`);
}

console.log("\n=== Dashboard Title Bar (lines 8398-8435) ===");
for (let i = 8398; i <= 8435; i++) {
  console.log(`${i}: ${lines[i - 1]}`);
}
