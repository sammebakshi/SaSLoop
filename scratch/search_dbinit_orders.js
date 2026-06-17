const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../dbInit.js');
console.log('Reading file:', filePath);

try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let printLines = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('CREATE TABLE') && lines[i].includes('orders')) {
      printLines = 45;
    }
    if (printLines > 0) {
      console.log(`Line ${i + 1}: ${lines[i]}`);
      printLines--;
    }
  }
} catch (err) {
  console.error('Error:', err);
}
