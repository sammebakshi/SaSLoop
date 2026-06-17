const fs = require('fs');
const content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');
const lines = content.split('\n');
let count = 0;
lines.forEach((line, i) => {
  if (line.includes('addToCart') || line.includes('selectedPriceTier') || line.includes('priceTier') || line.includes('handleItemClick')) {
    count++;
    if (count < 30) {
      console.log(`Line ${i+1}: ${line.trim()}`);
    }
  }
});
console.log(`Total occurrences: ${count}`);
