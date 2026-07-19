const fs = require('fs');
const path = require('path');

const scratchDir = __dirname;

const files = fs.readdirSync(scratchDir);

const terms = ['mergeCartItems', 'mergeItems', 'saveKOT', 'saveBill', 'empty column', 'already saved', 'kot_merg', 'saved bill'];

files.forEach(file => {
  const filePath = path.join(scratchDir, file);
  if (!fs.statSync(filePath).isFile()) return;

  const buf = fs.readFileSync(filePath);
  
  // Try UTF-8
  const contentUtf8 = buf.toString('utf8');
  // Try UTF-16LE
  const contentUtf16 = buf.toString('utf16le');

  terms.forEach(term => {
    const countUtf8 = (contentUtf8.match(new RegExp(term, 'gi')) || []).length;
    const countUtf16 = (contentUtf16.match(new RegExp(term, 'gi')) || []).length;

    if (countUtf8 > 0) {
      console.log(`[UTF-8] Match for "${term}" in ${file}: ${countUtf8} occurrences`);
    }
    if (countUtf16 > 0) {
      console.log(`[UTF-16LE] Match for "${term}" in ${file}: ${countUtf16} occurrences`);
    }
  });
});
