const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../dbInit.js');
console.log('Reading file:', filePath);

try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('CREATE TABLE') && lines[i].includes('waiters')) {
      console.log(`Line ${i + 1}: ${lines[i]}`);
      for (let j = 1; j <= 15; j++) {
        console.log(`Line ${i + 1 + j}: ${lines[i + j]}`);
      }
    }
  }
} catch (err) {
  console.error('Error:', err);
}
