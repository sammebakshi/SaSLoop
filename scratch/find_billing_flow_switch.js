const fs = require('fs');
const content = fs.readFileSync('scratch/decompiled_original_BillingScreenKt.java', 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
    if (line.includes('BillingFlowState') || line.includes('SELECT_FLOW') || line.includes('SELECT_TABLE')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
