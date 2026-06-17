const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../routes/orderRoutes.js');
console.log('Reading file:', filePath);

try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('router.get')) {
      console.log(`Line ${i + 1}: ${lines[i].trim()}`);
    }
  }
} catch (err) {
  console.error('Error:', err);
}
