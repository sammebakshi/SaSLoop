const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'yesterday_edits.txt');
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf16le');
  const idx = content.indexOf('Edit #78');
  if (idx !== -1) {
    console.log(content.substring(idx, idx + 10000));
  } else {
    console.log('Edit #78 not found');
  }
}
