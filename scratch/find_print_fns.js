const fs = require('fs');
const content = fs.readFileSync('scratch/App_working_backup_v2.jsx', 'utf8');
const lines = content.split('\n');

console.log('Printing functions/calls in App_working_backup_v2.jsx:');
lines.forEach((line, idx) => {
  if (line.includes('const print') || line.includes('function print') || line.includes('handlePrint') || line.includes('printBill') || line.includes('executePrint') || line.includes('window.print') || line.includes('printKOT')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
