const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
console.log('Reading file:', filePath);

try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let printLines = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('handleCheckout') || lines[i].includes('posService.createOrder')) {
      printLines = 40;
    }
    if (printLines > 0) {
      console.log(`Line ${i + 1}: ${lines[i]}`);
      printLines--;
    }
  }
} catch (err) {
  console.error('Error:', err);
}
