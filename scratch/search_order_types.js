const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = '';

content = fs.readFileSync(filePath, 'utf8');
if (content.includes('\u0000')) {
  content = fs.readFileSync(filePath, 'utf16le');
}

const lines = content.split(/\r?\n/);

console.log("=== Matches for Order Type Tab Buttons ===");
lines.forEach((line, index) => {
  if ((line.includes('DINE_IN') || line.includes('TAKE_AWAY') || line.includes('TAKEAWAY') || line.includes('DELIVERY')) && 
      (line.includes('<button') || line.includes('onClick') || line.includes('active') || line.includes('orderType'))) {
    if (line.includes('className') && (line.includes('flex') || line.includes('rounded') || line.includes('text-'))) {
      console.log(`${index + 1}: ${line.trim().substring(0, 150)}`);
    }
  }
});
