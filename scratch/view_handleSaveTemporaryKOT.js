const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(filePath, 'utf8');

const term = 'const handleSaveTemporaryKOT =';
let idx = content.indexOf(term);
if (idx !== -1) {
  console.log(`Found term at index ${idx}:`);
  console.log(content.substring(idx + 1000, idx + 2800));
} else {
  console.log("Term not found!");
}
