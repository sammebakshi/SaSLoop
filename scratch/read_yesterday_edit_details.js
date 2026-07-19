const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'yesterday_edits.txt');
const buf = fs.readFileSync(filePath);
const content = buf.toString('utf16le');

// Let's extract Edit #37 to Edit #55 inclusive
for (let i = 37; i <= 40; i++) {
  const startTerm = `Edit #${i}`;
  const endTerm = `Edit #${i + 1}`;
  
  const startIdx = content.indexOf(startTerm);
  if (startIdx === -1) continue;
  
  let endIdx = content.indexOf(endTerm);
  if (endIdx === -1) {
    endIdx = content.length;
  }
  
  console.log(`\n================================================================================`);
  console.log(`DETAILS FOR ${startTerm}`);
  console.log(`================================================================================`);
  console.log(content.substring(startIdx, endIdx).trim());
}
