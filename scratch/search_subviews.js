const fs = require('fs');
const content = fs.readFileSync('scratch/decompiled_original_BillingScreenKt.java', 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
    if ((line.includes('Row') || line.includes('weight') || line.includes('Column')) && idx >= 8000 && idx <= 10500) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
