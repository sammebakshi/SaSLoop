const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = '';

content = fs.readFileSync(filePath, 'utf8');
if (content.includes('\u0000')) {
  content = fs.readFileSync(filePath, 'utf16le');
}

const lines = content.split(/\r?\n/);
const matches = [];
lines.forEach((line, index) => {
  if (line.includes('getLoyaltySetting')) {
    matches.push(`${index + 1}: ${line.trim()}`);
  }
});

console.log('=== getLoyaltySetting Lookups ===');
matches.forEach(m => console.log(m));
