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
console.log('Searching for "Order/KOT" in App.jsx...');
lines.forEach((line, idx) => {
  if (line.includes('Order/KOT')) {
    console.log(`\nFound "Order/KOT" at line ${idx + 1}:`);
    const start = Math.max(0, idx - 15);
    const end = Math.min(lines.length, idx + 25);
    for (let i = start; i < end; i++) {
      console.log(`${i + 1}: ${lines[i]}`);
    }
  }
});
