const fs = require('fs');
const content = fs.readFileSync('scratch/decompiled_original_BillingScreenKt.java', 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
    if (line.includes('void MenuItemCard') && !line.includes('class')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
        console.log("--- Context ---");
        const start = Math.max(0, idx - 5);
        const end = Math.min(lines.length - 1, idx + 15);
        for (let i = start; i <= end; i++) {
            console.log(`${i + 1}: ${lines[i]}`);
        }
        console.log("========================");
    }
});
