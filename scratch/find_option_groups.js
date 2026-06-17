const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\pos-app\\src\\App.jsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log("Searching for 'optionGroups' or 'OptionGroups' in App.jsx:");
lines.forEach((line, index) => {
  if (line.includes('optionGroups') || line.includes('OptionGroups')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
