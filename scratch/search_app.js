const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = '';

try {
  // Try reading as UTF-8
  content = fs.readFileSync(filePath, 'utf8');
} catch (err) {
  console.error('Error reading file:', err);
  process.exit(1);
}

// If it starts with BOM for UTF-16LE or contains null bytes, try decoding as UTF-16LE
if (content.includes('\u0000')) {
  console.log('Detected null bytes, re-reading as UTF-16LE...');
  content = fs.readFileSync(filePath, 'utf16le');
}

const lines = content.split(/\r?\n/);
console.log(`Loaded ${lines.length} lines.`);

const keywords = ['coupon', 'loyalty', 'points', 'redeem', 'discount', 'handlePrint', 'outletId'];
keywords.forEach(keyword => {
  console.log(`\n=== Matches for "${keyword}" ===`);
  let matchCount = 0;
  lines.forEach((line, index) => {
    if (line.toLowerCase().includes(keyword.toLowerCase())) {
      matchCount++;
      if (matchCount <= 40) {
        console.log(`${index + 1}: ${line.trim().substring(0, 120)}`);
      }
    }
  });
  if (matchCount > 40) {
    console.log(`... and ${matchCount - 40} more matches`);
  }
});
