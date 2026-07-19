const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'yesterday_edits.txt');
const buf = fs.readFileSync(filePath);
const content = buf.toString('utf16le');

const lines = content.split('\n');
console.log('--- FIRST PART OF YESTERDAY EDITS ---');
let currentEdit = '';
let printCount = 0;
lines.forEach(line => {
  if (line.includes('Edit #')) {
    currentEdit = line.trim();
  }
  if (line.includes('Description:') && currentEdit) {
    printCount++;
    if (printCount <= 68) {
      console.log(`${currentEdit} | ${line.trim()}`);
    }
    currentEdit = '';
  }
});
