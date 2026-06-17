const fs = require('fs');
const content = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/pos-app/dist/assets/index-aH5wDIj0.js', 'utf8');
const lines = content.split('\n');
console.log('Total lines:', lines.length);
const line = lines[1293] || ''; // 0-indexed for line 1294
console.log('Line length:', line.length);
const start = Math.max(0, 12831 - 150);
const end = Math.min(line.length, 12831 + 150);
console.log('Code chunk:', line.substring(start, end));
