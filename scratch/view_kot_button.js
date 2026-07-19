const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(filePath, 'utf8');

let idx = -1;
while ((idx = content.indexOf('handleKOT', idx + 1)) !== -1) {
  console.log(`Found handleKOT at index ${idx}:`);
  console.log(content.substring(idx - 100, idx + 150));
}
