const fs = require('fs');
const content = fs.readFileSync('scratch/decompiled_original_BillingScreenKt.java', 'utf8');
const lines = content.split('\n');

function searchUsage(keyword) {
    console.log(`\n=== Usage of ${keyword} ===`);
    lines.forEach((line, idx) => {
        if (line.includes(keyword)) {
            console.log(`Line ${idx + 1}: ${line.trim()}`);
            console.log("--- Surrounding lines ---");
            const start = Math.max(0, idx - 10);
            const end = Math.min(lines.length - 1, idx + 10);
            for (let i = start; i <= end; i++) {
                console.log(`${i + 1}: ${lines[i]}`);
            }
            console.log("========================");
        }
    });
}

searchUsage('preOrderIdInput');
searchUsage('advancePaidInput');
