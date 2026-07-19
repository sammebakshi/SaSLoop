const fs = require('fs');
const path = require('path');

const filesToCheck = [
  'all_app_edits.json',
  'all_app_edits_from_transcript.json',
  'yesterday_edits.txt'
];

filesToCheck.forEach(filename => {
  const filePath = path.join(__dirname, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`${filename} does not exist`);
    return;
  }
  
  console.log(`Checking ${filename}...`);
  const encoding = filename.endsWith('.txt') ? 'utf16le' : 'utf8';
  const content = fs.readFileSync(filePath, encoding);
  if (content.includes('quickBillPrint')) {
    console.log(`  Found "quickBillPrint" in ${filename}!`);
    // Let's print some surrounding context
    const idx = content.indexOf('quickBillPrint');
    console.log(content.substring(idx - 200, idx + 500));
  } else {
    console.log(`  "quickBillPrint" not found in ${filename}`);
  }
});
