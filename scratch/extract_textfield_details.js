const fs = require('fs');
const content = fs.readFileSync('scratch/decompiled_original_BillingScreenKt.java', 'utf8');
const lines = content.split('\n');

// Search for OutlinedTextField calls
lines.forEach((line, idx) => {
    if (line.includes('OutlinedTextField(')) {
        console.log(`\n=== TextField at Line ${idx + 1} ===`);
        // Print 30 lines before the call to see labels/parameters
        const start = Math.max(0, idx - 30);
        for (let i = start; i <= idx; i++) {
            console.log(`${i + 1}: ${lines[i]}`);
        }
        console.log("====================================");
    }
});
