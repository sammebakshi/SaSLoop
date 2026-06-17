const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../routes/orderRoutes.js');
console.log('Reading file:', filePath);

try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let insideInsert = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('INSERT INTO orders')) {
      insideInsert = true;
    }
    if (insideInsert) {
      console.log(`Line ${i + 1}: ${lines[i]}`);
      if (lines[i].includes(')') && (lines[i].includes('RETURNING') || lines[i].includes('values') || lines[i].includes('VALUES'))) {
        // keep printing values
      }
      if (lines[i].includes(';')) {
        insideInsert = false;
      }
    }
  }
} catch (err) {
  console.error('Error:', err);
}
