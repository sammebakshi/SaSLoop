const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\pos-app\\dist\\assets\\index-BZBIpjTV.js';
if (!fs.existsSync(filePath)) {
  console.log('File does not exist:', filePath);
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');
const regex = /prompt/gi;
let match;
while ((match = regex.exec(content)) !== null) {
  const index = match.index;
  const start = Math.max(0, index - 100);
  const end = Math.min(content.length, index + 100);
  console.log(`Match at index ${index}:`);
  console.log('...', content.slice(start, end).replace(/\n/g, ' '), '...');
  console.log('-'.repeat(40));
}
