const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = '';

content = fs.readFileSync(filePath, 'utf8');
if (content.includes('\u0000')) {
  content = fs.readFileSync(filePath, 'utf16le');
}

const lines = content.split(/\r?\n/);
console.log("=== Matches for customer input/placeholder/search dropdown ===");
lines.forEach((line, index) => {
  if (line.includes('customerPhone') || line.includes('customerDb') || line.includes('Search Customer') || line.includes('Customer Mobile') || line.includes('search_results') || line.includes('searchResults')) {
    if (line.includes('<input') || line.includes('onClick') || line.includes('placeholder') || line.includes('onChange')) {
      console.log(`${index + 1}: ${line.trim().substring(0, 150)}`);
    }
  }
});
