const fs = require('fs');
const path = require('path');

const appJsxPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(appJsxPath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
  if (line.includes('preOrders')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
