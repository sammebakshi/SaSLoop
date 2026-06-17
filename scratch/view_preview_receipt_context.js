const fs = require('fs');

const content = fs.readFileSync('scratch/App_working_backup_v2.jsx', 'utf8');
const lines = content.split('\n');

console.log('Occurrences of waiter/Waiter after line 16000:');
lines.forEach((line, idx) => {
  if (idx + 1 > 16000 && line.toLowerCase().includes('waiter')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
