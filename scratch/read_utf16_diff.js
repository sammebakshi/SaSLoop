const { execSync } = require('child_process');
const fs = require('fs');

const diff = execSync('git show eb9b7e3 -- pos-app/src/App.jsx', {
  cwd: 'C:/Users/Sajad/Desktop/SaSLoop_Backups',
  maxBuffer: 10 * 1024 * 1024
}).toString();

// Write to a file so we can view it
fs.writeFileSync('c:/Users/Sajad/Desktop/SaSLoop/scratch/pos_diff.diff', diff, 'utf8');
console.log("Written diff to scratch/pos_diff.diff!");
