const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = '';

content = fs.readFileSync(filePath, 'utf8');
if (content.includes('\u0000')) {
  content = fs.readFileSync(filePath, 'utf16le');
}

const lines = content.split(/\r?\n/);
console.log("=== Matches for header buttons ===");
lines.forEach((line, index) => {
  if (line.includes('<Settings') || line.includes('onClick={() => setActiveTab(') || line.includes('onClick={() => handleLogout')) {
    console.log(`${index + 1}: ${line.trim()}`);
  }
});
