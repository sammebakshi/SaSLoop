const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../pos-app/src/App.jsx');
const lines = fs.readFileSync(file, 'utf8').split('\n');

for (let i = 8520; i < 8680; i++) {
  if (lines[i].toLowerCase().includes('kot')) {
    console.log(`Line ${i + 1}: ${lines[i].trim()}`);
  }
}
