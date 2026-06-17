const fs = require('fs');

const content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');
const lines = content.split('\n');

console.log('Lines 8520 to 8680:');
for (let idx = 8520; idx <= 8680; idx++) {
    if (idx < lines.length) {
        console.log(`Line ${idx + 1}: ${lines[idx]}`);
    }
}
