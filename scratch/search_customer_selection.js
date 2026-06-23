const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = '';

content = fs.readFileSync(filePath, 'utf8');
if (content.includes('\u0000')) {
  content = fs.readFileSync(filePath, 'utf16le');
}

const lines = content.split(/\r?\n/);
console.log("=== Matches for customer selection/typing/keypress ===");
lines.forEach((line, index) => {
  if (line.includes('handleSelectCustomer') || line.includes('customerDb') || line.includes('setSelectedCustomer') || line.includes('onKeyDown') || line.includes('onKeyPress')) {
    if (line.includes('customer') || line.includes('Customer') || line.includes('Phone') || line.includes('phone') || line.includes('key')) {
      console.log(`${index + 1}: ${line.trim().substring(0, 150)}`);
    }
  }
});
