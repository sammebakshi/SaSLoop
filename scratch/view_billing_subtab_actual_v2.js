const fs = require('fs');

const content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');
const lines = content.split('\n');

console.log('Lines 9180 to 9262:');
for (let idx = 9180; idx <= 9262; idx++) {
    if (idx < lines.length) {
        console.log(`Line ${idx + 1}: ${lines[idx]}`);
    }
}
