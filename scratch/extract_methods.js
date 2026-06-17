const fs = require('fs');

const file = 'scratch/decompiled_5pm_BillingScreenKt.java';
if (!fs.existsSync(file)) {
    console.log("File not found:", file);
    process.exit(1);
}

const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

console.log("Method declarations in decompiled_5pm_BillingScreenKt.java:");
lines.forEach((line, idx) => {
    if (line.includes('public static final') && (line.includes('void') || line.includes('Object') || line.includes('Compose'))) {
        // Clean up the line for readability
        console.log(`Line ${idx + 1}: ${line.trim().slice(0, 150)}`);
    }
});
