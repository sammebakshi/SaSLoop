const fs = require('fs');

const content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');
const lines = content.split('\n');

console.log('Lines 16350 to 16420:');
for (let idx = 16350; idx <= 16420; idx++) {
    if (idx < lines.length) {
        console.log(`Line ${idx + 1}: ${lines[idx]}`);
    }
}
