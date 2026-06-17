const fs = require('fs');
const lines = fs.readFileSync('pos-app/src/App.jsx', 'utf8').split('\n');
console.log('Line 17332:', JSON.stringify(lines[17332]));
console.log('Line 17807:', JSON.stringify(lines[17807]));
