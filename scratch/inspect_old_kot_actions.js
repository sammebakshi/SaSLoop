const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log('=== Handlers in App.jsx ===');
for (let i = 7900; i <= 8060; i++) {
  console.log(`${i}: ${lines[i - 1]}`);
}

console.log('=== Buttons in App.jsx ===');
for (let i = 18220; i <= 18260; i++) {
  console.log(`${i}: ${lines[i - 1]}`);
}
