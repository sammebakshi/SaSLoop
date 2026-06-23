const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = '';

content = fs.readFileSync(filePath, 'utf8');
if (content.includes('\u0000')) {
  content = fs.readFileSync(filePath, 'utf16le');
}

const lines = content.split(/\r?\n/);
const keywords = ['Utensils', 'ShoppingBag', 'Truck', 'QuickIcon', 'Coffee', 'Bike'];

keywords.forEach(keyword => {
  console.log(`\n=== Matches for ${keyword} ===`);
  lines.forEach((line, index) => {
    if (line.includes(keyword) && !line.includes('import')) {
      console.log(`${index + 1}: ${line.trim()}`);
    }
  });
});
