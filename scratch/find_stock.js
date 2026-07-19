const fs = require('fs');
const path = require('path');

const appJsxPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(appJsxPath, 'utf8');

const lines = content.split(/\r?\n/);

lines.forEach((line, index) => {
  if (line.toLowerCase().includes('stock') || line.toLowerCase().includes('inventory')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
