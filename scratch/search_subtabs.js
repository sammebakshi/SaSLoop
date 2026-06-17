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

// Search for "Order/KOT" buttons in the code
const searchStr = 'Order/KOT';
let idx = 0;
let count = 0;
while ((idx = content.indexOf(searchStr, idx)) > -1) {
  count++;
  console.log(`\nOccurrence ${count} of "Order/KOT" at index ${idx}:`);
  const start = Math.max(0, idx - 800);
  const end = Math.min(content.length, idx + 800);
  console.log(content.substring(start, end));
  idx += searchStr.length;
}
