const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = '';

content = fs.readFileSync(filePath, 'utf8');
if (content.includes('\u0000')) {
  content = fs.readFileSync(filePath, 'utf16le');
}

const lines = content.split(/\r?\n/);
console.log("=== Matches for table click ===");
lines.forEach((line, index) => {
  if (line.includes('handleTableClick') || (line.includes('onClick') && line.includes('table') && (line.includes('selected') || line.includes('active')))) {
    if (line.includes('onClick')) {
      console.log(`${index + 1}: ${line.trim().substring(0, 150)}`);
    }
  }
});
