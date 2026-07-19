const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'yesterday_edits.txt');
const buf = fs.readFileSync(filePath);
const content = buf.toString('utf16le');

console.log('Total length of yesterday_edits:', content.length);

const term = 'mergeCartItems';
let idx = 0;
let count = 0;

while ((idx = content.indexOf(term, idx)) > -1 && count < 5) {
  count++;
  console.log(`\n========================================`);
  console.log(`Occurrence ${count} at index ${idx}:`);
  console.log(`========================================`);
  
  // Print 400 characters before and 1200 characters after
  const start = Math.max(0, idx - 400);
  const end = Math.min(content.length, idx + 1200);
  console.log(content.substring(start, end));
  
  idx += term.length;
}
