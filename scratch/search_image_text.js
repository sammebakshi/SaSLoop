const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('RETAIL') || lines[i].includes('Retail') || lines[i].includes('invoice') || lines[i].includes('Invoice')) {
      if (lines[i].includes('<div') || lines[i].includes('<span') || lines[i].includes('<p') || lines[i].includes('h1') || lines[i].includes('h2') || lines[i].includes('h3') || lines[i].includes('h4')) {
        console.log(`Line ${i + 1}: ${lines[i].trim()}`);
      }
    }
  }
} catch (err) {
  console.error(err);
}
