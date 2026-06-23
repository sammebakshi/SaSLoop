const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = '';

content = fs.readFileSync(filePath, 'utf8');
if (content.includes('\u0000')) {
  content = fs.readFileSync(filePath, 'utf16le');
}

const lines = content.split(/\r?\n/);
console.log("=== Title Bar Drag matches ===");
lines.forEach((line, index) => {
  if (line.includes('WebkitAppRegion') || line.includes('drag') || line.includes('TitleBar') || line.includes('titlebar')) {
    console.log(`${index + 1}: ${line.trim()}`);
  }
});
