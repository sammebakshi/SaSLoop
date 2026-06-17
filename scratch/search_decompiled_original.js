const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'decompiled_original_BillingScreenKt.java');
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
console.log('Searching decompiled original for SubTab...');
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('SubTab')) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
    }
}
