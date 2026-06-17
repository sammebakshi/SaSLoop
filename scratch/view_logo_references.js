const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'App_reconstructed.jsx');
if (!fs.existsSync(filePath)) {
  console.log('App_reconstructed.jsx does not exist');
  process.exit(1);
}

const buf = fs.readFileSync(filePath);
let content = buf.toString('utf16le');
if (!content.includes('import') && !content.includes('function')) {
  content = buf.toString('utf8');
}

const regex = /logo/gi;
let match;
let count = 0;
console.log(`Logo occurrences in App_reconstructed.jsx:`);
while ((match = regex.exec(content))) {
  count++;
  const start = Math.max(0, match.index - 80);
  const end = Math.min(content.length, match.index + 80);
  console.log(`${count}. [Pos ${match.index}]: ...${content.substring(start, end).replace(/\n/g, ' ')}...`);
}
