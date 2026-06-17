const fs = require('fs');
const content = fs.readFileSync('scratch/decompiled_original_BillingScreenKt.java', 'utf8');
const lines = content.split('\n');

// Find LazyVerticalGrid calls and print surrounding lines
lines.forEach((line, idx) => {
    if (line.includes('LazyVerticalGrid(')) {
        console.log(`\n=== LazyVerticalGrid at Line ${idx + 1} ===`);
        const start = Math.max(0, idx - 40);
        const end = Math.min(lines.length - 1, idx + 10);
        for (let i = start; i <= end; i++) {
            console.log(`${i + 1}: ${lines[i]}`);
        }
        console.log("==========================================");
    }
});
