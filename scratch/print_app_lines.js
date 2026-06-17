const fs = require('fs');
const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);
const start = 14880;
const end = 14930;
for (let i = start; i <= end; i++) {
  console.log(`${i}: ${lines[i - 1]}`);
}
