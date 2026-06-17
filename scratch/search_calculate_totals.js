const fs = require('fs');
const content = fs.readFileSync('scratch/App_working_backup_v2.jsx', 'utf8');
const lines = content.split('\n');

console.log('calculateTotals function:');
let found = false;
let braceCount = 0;
lines.forEach((line, idx) => {
  if (line.includes('const calculateTotals') || line.includes('function calculateTotals')) {
    found = true;
    console.log(`${idx + 1}: ${line}`);
    return;
  }
  if (found) {
    console.log(`${idx + 1}: ${line}`);
    // Count braces to find the end of the function
    const open = (line.match(/{/g) || []).length;
    const close = (line.match(/}/g) || []).length;
    braceCount += open - close;
    if (braceCount <= 0 && idx > 5000) { // Safety check to ensure we started
      found = false;
    }
  }
});
