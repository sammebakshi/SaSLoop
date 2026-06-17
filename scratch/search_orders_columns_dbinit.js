const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../dbInit.js');
console.log('Reading file:', filePath);

try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('orders') && (lines[i].includes('ADD COLUMN') || lines[i].includes('ALTER TABLE'))) {
      console.log(`Line ${i + 1}: ${lines[i].trim()}`);
    }
  }
} catch (err) {
  console.error('Error:', err);
}
