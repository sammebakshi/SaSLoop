const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'commit_83e6cc5_diff_utf8.diff');
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
console.log('Search results in commit 83e6cc5 diff:');
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('column') || line.toLowerCase().includes('empty') || line.toLowerCase().includes('colspan')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
