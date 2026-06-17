const fs = require('fs');
const content = fs.readFileSync('scratch/decompiled_original_BillingScreenKt.java', 'utf8');
const lines = content.split('\n');

const start = 6300;
const end = 6650;
for (let i = start; i <= end; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
}
