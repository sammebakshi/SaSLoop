const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'yesterday_edits.txt');
if (!fs.existsSync(filePath)) {
  console.log('yesterday_edits.txt does not exist');
  process.exit(0);
}

const buf = fs.readFileSync(filePath);
let content = buf.toString('utf16le');
if (!content.includes('Instruction') && !content.includes('Change')) {
  content = buf.toString('utf8');
}

console.log('File read successfully. Length:', content.length);

// Search for some terms
const terms = ['8484', '8494', 'logo', 'ribbon', 'file', 'order/kot', 'billing tab', 'quick bill', 'table icon', 'pre-order', 'pre order', 'merge'];
terms.forEach(term => {
  const regex = new RegExp(term, 'gi');
  let match;
  console.log(`\n--- Matches for "${term}" ---`);
  let count = 0;
  while ((match = regex.exec(content)) && count < 10) {
    count++;
    const start = Math.max(0, match.index - 100);
    const end = Math.min(content.length, match.index + 100);
    console.log(`[Pos ${match.index}]: ...${content.substring(start, end).replace(/\n/g, ' ')}...`);
  }
  if (count === 10) {
    console.log('... truncated matches ...');
  }
});
