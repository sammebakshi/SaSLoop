const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../routes/orderRoutes.js');
console.log('Reading file:', filePath);

try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('INSERT INTO orders') || line.includes('UPDATE orders') || line.includes('RETURNING')) {
      console.log(`Line ${i + 1}: ${line.trim()}`);
    }
  }
} catch (err) {
  console.error('Error:', err);
}
