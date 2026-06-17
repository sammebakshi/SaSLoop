const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'SaSLoop-dashboard', 'src', 'App.js');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
  if (line.includes('/staff')) {
    console.log(`${index + 1}: ${line.trim()}`);
  }
});
