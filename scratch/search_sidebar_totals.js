const fs = require('fs');
const content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');
const lines = content.split('\n');

console.log('calculateTotals calls in JSX rendering:');
lines.forEach((line, idx) => {
  if (idx + 1 > 10000 && idx + 1 < 15000) {
    if (line.includes('calculateTotals(') || line.includes('calculateTotals().') || line.includes('const totals =')) {
      console.log(`${idx + 1}: ${line.trim()}`);
      for (let i = 1; i <= 10; i++) {
        console.log(`   ${idx + 1 + i}: ${lines[idx + i]}`);
      }
    }
  }
});
