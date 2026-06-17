const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../dbInit.js');
console.log('Reading file:', filePath);

try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let insideOrders = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('CREATE TABLE IF NOT EXISTS orders')) {
      insideOrders = true;
    }
    if (insideOrders) {
      console.log(`Line ${i + 1}: ${lines[i]}`);
      if (lines[i].includes(');')) {
        insideOrders = false;
      }
    }
  }
} catch (err) {
  console.error('Error:', err);
}
