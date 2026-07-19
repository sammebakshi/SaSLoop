const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'yesterday_edits.txt');
if (fs.existsSync(filePath)) {
  const buf = fs.readFileSync(filePath);
  const content = buf.toString('utf16le');
  
  const targetEdit = 'Edit #78';
  const startIdx = content.indexOf(targetEdit);
  if (startIdx !== -1) {
    // Find the end of this edit block (next edit block or end of file)
    let endIdx = content.indexOf('Edit #', startIdx + targetEdit.length);
    if (endIdx === -1) endIdx = content.length;
    
    console.log(content.substring(startIdx, endIdx));
  } else {
    console.log(`${targetEdit} not found`);
  }
} else {
  console.log('yesterday_edits.txt not found');
}
