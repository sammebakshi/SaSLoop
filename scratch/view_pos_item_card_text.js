const fs = require('fs');
const content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');
const lines = content.split('\n');
for (let j = 7610; j < 7650; j++) {
  console.log(`Line ${j+1}: ${lines[j]}`);
}
