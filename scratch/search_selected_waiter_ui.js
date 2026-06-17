const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
console.log('Reading file:', filePath);

try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('selectedWaiter') && (lines[i].includes('<div') || lines[i].includes('<span') || lines[i].includes('<p') || lines[i].includes('button') || lines[i].includes('text') || lines[i].includes('icon'))) {
      console.log(`Line ${i + 1}: ${lines[i].trim()}`);
      for (let j = 1; j <= 5; j++) {
        console.log(`  +${j}: ${lines[i+j]}`);
      }
    }
  }
} catch (err) {
  console.error('Error:', err);
}
