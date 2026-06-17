const fs = require('fs');
const content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');
const lines = content.split('\n');
for (let j = 7850; j < 7950; j++) {
  console.log(`Line ${j+1}: ${lines[j]}`);
}
