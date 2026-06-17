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

console.log('Loaded yesterday_edits.txt. Chars:', content.length);

// Let's find "Step 2291" or "Edit #78"
const stepKey = 'Step 2291';
const idx = content.indexOf(stepKey);

if (idx > -1) {
  console.log(`\nFound "${stepKey}" at index ${idx}. Extracting surrounding text:`);
  
  // Find the start of Edit #78 (usually before Step 2291)
  const start = Math.max(0, content.lastIndexOf('Edit #', idx));
  
  // Find the end of this edit block, which usually starts before the next Edit #
  let end = content.indexOf('Edit #', idx + 10);
  if (end === -1) end = content.length;
  
  console.log(content.substring(start, end));
} else {
  console.log(`"${stepKey}" not found in yesterday_edits.txt`);
  
  // Let's search for "Step 22" to see what step numbers are in there
  const regex = /Step \d+/g;
  const matches = content.match(regex) || [];
  console.log('Unique Step Numbers present in yesterday_edits.txt:', [...new Set(matches)].slice(0, 30));
}
