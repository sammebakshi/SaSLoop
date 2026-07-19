const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'yesterday_edits.txt');
const buf = fs.readFileSync(filePath);
const content = buf.toString('utf16le');

const lines = content.split('\n');
console.log('List of Yesterday Edits:');
lines.forEach(line => {
  if (line.includes('Edit #') || line.includes('Description:') || line.includes('Instruction:')) {
    console.log(line.trim());
  }
});
