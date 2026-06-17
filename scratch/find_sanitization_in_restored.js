const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'App_backup_before_restoration.jsx');
if (!fs.existsSync(filePath)) {
  console.log('App_backup_before_restoration.jsx does not exist');
  process.exit(1);
}

const buf = fs.readFileSync(filePath);
let content = buf.toString('utf16le');
if (!content.includes('import') && !content.includes('function')) {
  content = buf.toString('utf8');
}

const lines = content.split('\n');
console.log('=== Lines with "1.0.1" or "19.02" or "localStorage" in backup ===');
lines.forEach((line, idx) => {
  if (line.includes('1.0.1') || (line.includes('19.02') && line.includes('localStorage')) || line.includes('sanit')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
