const fs = require('fs');
const content = fs.readFileSync('routes/orderRoutes.js', 'utf8');
const lines = content.split('\n');
let count = 0;
lines.forEach((line, i) => {
  if (line.toLowerCase().includes('order_type')) {
    count++;
    if (count < 10) {
      console.log(`Line ${i+1}: ${line.trim()}`);
    }
  }
});
console.log(`Total occurrences: ${count}`);
