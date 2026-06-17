const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\pos-app\\src\\App.jsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log("Searching for 'item_id' in App.jsx:");
lines.forEach((line, index) => {
  if (line.includes('item_id')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
