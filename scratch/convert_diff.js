const fs = require('fs');
const path = require('path');

try {
  const src = path.join(__dirname, 'whatsapp_diff.diff');
  const dest = path.join(__dirname, 'whatsapp_diff_utf8.txt');
  if (fs.existsSync(src)) {
    const text = fs.readFileSync(src, 'utf16le');
    fs.writeFileSync(dest, text, 'utf8');
    console.log('Successfully converted diff to UTF-8!');
  } else {
    console.log('Source file does not exist');
  }
} catch (e) {
  console.error(e);
}
