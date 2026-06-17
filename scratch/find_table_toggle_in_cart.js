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

// Search for areas where the table button or icon is conditionally displayed
// Common checks: orderType === 'DINE_IN' or activeOrderType === 'DINE_IN'
const terms = ['selectedTable', 'Tables View', 'table-select', 'DineIn', 'DINE_IN'];
terms.forEach(term => {
  let idx = 0;
  let count = 0;
  console.log(`\n--- Occurrences of "${term}" ---`);
  while ((idx = content.indexOf(term, idx)) > -1) {
    count++;
    if (count <= 10) {
      const start = Math.max(0, idx - 150);
      const end = Math.min(content.length, idx + 250);
      console.log(`  [Match ${count}]: ...${content.substring(start, end).replace(/\n/g, ' ')}...`);
    }
    idx += term.length;
  }
  console.log(`Total occurrences: ${count}`);
});
