const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
let found = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('if (selectedTable) {') && i > 8614 && i < 9100) {
    console.log(`Found selectedTable block in handleCheckout at line ${i + 1}`);
    for (let j = i - 5; j < i + 40; j++) {
      console.log(`${j + 1}: ${lines[j]}`);
    }
    found = true;
    break;
  }
}
if (!found) {
  console.log("Not found!");
}
