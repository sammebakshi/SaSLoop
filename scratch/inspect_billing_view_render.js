const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = '';

content = fs.readFileSync(filePath, 'utf8');
if (content.includes('\u0000')) {
  content = fs.readFileSync(filePath, 'utf16le');
}

const lines = content.split(/\r?\n/);
console.log("=== Matches for billingView rendering ===");
lines.forEach((line, index) => {
  if (line.includes("billingView === 'tables'") || line.includes('billingView === "tables"') || line.includes('billingView === \'menu\'') || line.includes('billingView === "menu"')) {
    console.log(`${index + 1}: ${line.trim()}`);
  }
});
