const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = '';

content = fs.readFileSync(filePath, 'utf8');
if (content.includes('\u0000')) {
  content = fs.readFileSync(filePath, 'utf16le');
}

const lines = content.split(/\r?\n/);
console.log("=== justSelectedCustomerRef matches ===");
lines.forEach((line, index) => {
  if (line.includes('justSelectedCustomerRef')) {
    console.log(`${index + 1}: ${line.trim()}`);
  }
});
