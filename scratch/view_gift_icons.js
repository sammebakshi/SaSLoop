const fs = require('fs');
const content = fs.readFileSync('scratch/App_working_backup_v2.jsx', 'utf8');
const lines = content.split('\n');

console.log('Matches for Gift icon in App_working_backup_v2.jsx:');
lines.forEach((line, idx) => {
  if (line.includes('Gift')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
