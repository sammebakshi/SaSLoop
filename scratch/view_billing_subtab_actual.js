const fs = require('fs');

const content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');
const lines = content.split('\n');

console.log('Lines 9200 to 9350:');
for (let idx = 9200; idx <= 9350; idx++) {
    if (idx < lines.length) {
        console.log(`Line ${idx + 1}: ${lines[idx]}`);
    }
}
