const fs = require('fs');

const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

for (let idx = 9700; idx < 10100; idx++) {
  const line = lines[idx];
  if (line.includes('PickUp') || line.includes('Delivery') || line.includes('toggle') || line.includes('switch')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
}
