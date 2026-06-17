const fs = require('fs');
const content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');
const lines = content.split('\n');

const idx = lines.findIndex(line => line.includes('const calculateTotals') || line.includes('function calculateTotals'));
if (idx !== -1) {
  console.log(`calculateTotals found at line ${idx + 1}`);
  for (let i = idx; i < idx + 100; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
} else {
  console.log('calculateTotals not found');
}
