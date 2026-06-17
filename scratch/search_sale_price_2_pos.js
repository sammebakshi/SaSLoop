const fs = require('fs');
const content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');
const lines = content.split('\n');
let count = 0;
lines.forEach((line, i) => {
  if (line.includes('sale_price_2') || line.includes('sale_price_3')) {
    count++;
    console.log(`Line ${i+1}: ${line.trim()}`);
  }
});
console.log(`Total occurrences: ${count}`);
