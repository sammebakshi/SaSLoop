const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
if (!fs.existsSync(filePath)) {
  console.log('App.jsx does not exist');
  process.exit(1);
}

const buf = fs.readFileSync(filePath);
let content = buf.toString('utf16le');
if (!content.includes('import') && !content.includes('function')) {
  content = buf.toString('utf8');
}

const lines = content.split('\n');
console.log('=== Lines 18450 to 18520 ===');
const start = Math.max(0, 18449);
const end = Math.min(lines.length, 18519);

for (let i = start; i < end; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
