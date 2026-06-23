const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = '';

content = fs.readFileSync(filePath, 'utf8');
if (content.includes('\u0000')) {
  content = fs.readFileSync(filePath, 'utf16le');
}

const lines = content.split(/\r?\n/);
console.log("=== Main orderType/setOrderType Matches ===");
lines.forEach((line, index) => {
  if ((line.includes('orderType ===') || line.includes('setOrderType(')) && (line.includes('<button') || line.includes('onClick') || line.includes('Utensils') || line.includes('Bike') || line.includes('ShoppingBag'))) {
    console.log(`${index + 1}: ${line.trim().substring(0, 150)}`);
  }
});
