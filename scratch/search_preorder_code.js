const fs = require('fs');
const content = fs.readFileSync('scratch/decompiled_original_BillingScreenKt.java', 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
    if (idx >= 164 && idx < 9000) {
        if (line.includes('preOrderIdInput') || line.includes('advancePaidInput')) {
            console.log(`Line ${idx + 1}: ${line.trim()}`);
        }
    }
});
