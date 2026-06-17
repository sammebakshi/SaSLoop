const fs = require('fs');
const content = fs.readFileSync('scratch/App_working_backup_v2.jsx', 'utf8');
const lines = content.split('\n');

console.log('Waiter occurrences in App_working_backup_v2.jsx:');
let count = 0;
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('waiter')) {
    count++;
    if (count <= 25) {
      console.log(`${idx + 1}: ${line.trim()}`);
    }
  }
});
if (count > 25) {
  console.log(`... and ${count - 25} more matches`);
}
