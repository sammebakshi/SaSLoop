const fs = require('fs');
const content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');
const lines = content.split('\n');

console.log('Discount/Packing/Delivery button rendering:');
lines.forEach((line, idx) => {
  if (line.includes('Discount') && line.includes('<Percent') || line.includes('appliedAdditionalCharges') || line.includes('openCustomCharges')) {
    console.log(`${idx + 1}: ${line.trim()}`);
    // Print 10 lines after
    for (let i = 1; i <= 15; i++) {
      console.log(`   ${idx + 1 + i}: ${lines[idx + i]}`);
    }
  }
});
