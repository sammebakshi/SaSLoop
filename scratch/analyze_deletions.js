const fs = require('fs');
const path = require('path');

const diffPath = path.join(__dirname, 'app_diff.diff');
let buf = fs.readFileSync(diffPath);

// Detect UTF-16 BOM
let diffText;
if (buf[0] === 0xFF && buf[1] === 0xFE) {
  diffText = buf.toString('utf16le');
} else if (buf[0] === 0xFE && buf[1] === 0xFF) {
  diffText = buf.toString('utf16be');
} else {
  // Check if it's utf16 without BOM
  if (buf.includes(0x00)) {
    diffText = buf.toString('utf16le');
  } else {
    diffText = buf.toString('utf8');
  }
}

const lines = diffText.split(/\r?\n/);
const deletions = [];

for (const line of lines) {
  if (line.startsWith('-') && !line.startsWith('---')) {
    deletions.push(line);
  }
}

fs.writeFileSync(path.join(__dirname, 'deletions.txt'), deletions.join('\n'), 'utf8');
console.log(`Extracted ${deletions.length} deleted lines to deletions.txt`);
