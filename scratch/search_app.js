const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'Sajad', 'Desktop', 'SaSLoop', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('change') && line.includes('amount')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
