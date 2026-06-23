const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
const lines = content.split('\n');

for (let i = 9452; i <= 9460; i++) {
  console.log(`${i}: length=${lines[i - 1].length}, leadingSpaceCount=${lines[i - 1].match(/^\s*/)[0].length}, content=${lines[i - 1].trim()}`);
}
