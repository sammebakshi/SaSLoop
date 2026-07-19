const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'yesterday_edits.txt');
const buf = fs.readFileSync(filePath);
const content = buf.toString('utf16le');

const lines = content.split('\n');
console.log('Column / Colspan / Empty Edits:');

let currentEdit = '';
let editLines = [];

lines.forEach(line => {
  if (line.includes('Edit #')) {
    if (currentEdit) {
      const editNum = parseInt(currentEdit.match(/Edit #(\d+)/)[1]);
      if (editNum <= 36) {
        const editBlock = editLines.join('\n');
        const keywords = ['column', 'colspan', 'empty', 'billing', 'table'];
        const lowercaseBlock = editBlock.toLowerCase();
        if (keywords.some(kw => lowercaseBlock.includes(kw))) {
          console.log(`\n========================================`);
          console.log(currentEdit);
          console.log(`========================================`);
          console.log(editLines.filter(l => l.includes('Description:') || l.includes('Instruction:')).map(l => l.trim()).join('\n'));
        }
      }
    }
    currentEdit = line.trim();
    editLines = [];
  }
  editLines.push(line);
});
