const fs = require('fs');
const content = fs.readFileSync('dbInit.js', 'utf8');
const lines = content.split('\n');
for (let j = 750; j < 795; j++) {
  console.log(`Line ${j+1}: ${lines[j]}`);
}
