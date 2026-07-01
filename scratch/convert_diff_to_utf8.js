const fs = require('fs');
const content = fs.readFileSync('scratch/pos_app_diff.diff');
// Detect UTF-16LE BOM (ff fe)
let str;
if (content[0] === 0xff && content[1] === 0xfe) {
  str = content.toString('utf16le');
} else {
  str = content.toString('utf8');
}
fs.writeFileSync('scratch/pos_app_diff_utf8.diff', str, 'utf8');
console.log("Converted to scratch/pos_app_diff_utf8.diff");
