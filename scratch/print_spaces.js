const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = '';

content = fs.readFileSync(filePath, 'utf8');
if (content.includes('\u0000')) {
  content = fs.readFileSync(filePath, 'utf16le');
}

const lines = content.split(/\r?\n/);

console.log("=== Chunk 1 exact line representations ===");
for (let i = 10219; i <= 10258; i++) {
  console.log(`${i}: [${lines[i - 1]}]`);
}

console.log("\n=== Chunk 2 exact line representations ===");
for (let i = 16120; i <= 16156; i++) {
  console.log(`${i}: [${lines[i - 1]}]`);
}
