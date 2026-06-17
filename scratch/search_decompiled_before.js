const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'decompiled_BillingScreenKt_before.java');
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
console.log('Searching for MenuSubTab definition...');
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('MenuSubTab')) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
    }
}
