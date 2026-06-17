const fs = require('fs');
const content = fs.readFileSync('scratch/decompiled_original_BillingScreenKt.java', 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
    if (line.includes('public static final') && line.includes('(')) {
        // clean up signature for readability
        const sig = line.trim().split('{')[0].replace('public static final ', '');
        console.log(`${idx + 1}: ${sig}`);
    }
});
