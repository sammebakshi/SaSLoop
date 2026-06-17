const fs = require('fs');
const content = fs.readFileSync('scratch/decompiled_original_BillingScreenKt.java', 'utf8');

const matches = content.match(/\/\* JADX/g);
console.log(`Number of JADX comments: ${matches ? matches.length : 0}`);

const lines = content.split('\n');
console.log("Lines with decompilation comments:");
lines.forEach((line, idx) => {
    if (line.includes('failed to decompile') || line.includes('skipped') || line.includes('JADX INFO') || line.includes('JADX WARN')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
});
