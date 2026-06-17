const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
console.log('Reading file:', filePath);

try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let insideCheckout = false;
  let linesToPrint = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const handleCheckout =') || lines[i].includes('async function handleCheckout')) {
      insideCheckout = true;
      linesToPrint = 150;
    }
    if (insideCheckout && linesToPrint > 0) {
      console.log(`Line ${i + 1}: ${lines[i]}`);
      linesToPrint--;
      if (linesToPrint === 0) {
        insideCheckout = false;
      }
    }
  }
} catch (err) {
  console.error('Error:', err);
}
