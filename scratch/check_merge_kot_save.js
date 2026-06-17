const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'App_reconstructed.jsx');
if (!fs.existsSync(filePath)) {
  console.log('App_reconstructed.jsx does not exist');
  process.exit(1);
}

const buf = fs.readFileSync(filePath);
let content = buf.toString('utf16le');
if (!content.includes('import') && !content.includes('function')) {
  content = buf.toString('utf8');
}

// Search for mergeCartItems usages
const term = 'mergeCartItems';
let idx = 0;
let count = 0;
console.log(`mergeCartItems occurrences:`);
while ((idx = content.indexOf(term, idx)) > -1) {
  count++;
  console.log(`\nOccurrence ${count} at index ${idx}:`);
  console.log(content.substring(Math.max(0, idx - 150), Math.min(content.length, idx + 450)).replace(/\n/g, ' '));
  idx += term.length;
}
