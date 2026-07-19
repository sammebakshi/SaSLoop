const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(filePath, 'utf8');

const term = '.filter(t => t.id !== selectedTable?.id)';
let idx = content.indexOf(term);
if (idx !== -1) {
  console.log(`Found term at index ${idx}:`);
  console.log(content.substring(idx - 1500, idx + 100));
} else {
  console.log("Term not found!");
}
