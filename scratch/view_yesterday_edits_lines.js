const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'yesterday_edits.txt');
if (!fs.existsSync(filePath)) {
  console.log('yesterday_edits.txt does not exist');
  process.exit(1);
}

const buf = fs.readFileSync(filePath);
let content = buf.toString('utf16le');
if (!content.includes('Instruction') && !content.includes('Edit')) {
  content = buf.toString('utf8');
}

const stepKey = 'Step 2291';
const idx = content.indexOf(stepKey);
if (idx > -1) {
  console.log(content.substring(idx - 100, idx + 3000));
} else {
  console.log('Step 2291 not found');
}
