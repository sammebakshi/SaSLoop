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
console.log('Searching for Customer Info Header Toolbar...');
lines.forEach((line, idx) => {
  if (line.includes('Customer Info Header Toolbar')) {
    console.log(`Found header toolbar comment at line ${idx + 1}:`);
    for (let i = idx - 2; i < idx + 20; i++) {
      console.log(`${i + 1}: ${lines[i]}`);
    }
  }
});
