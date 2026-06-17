const fs = require('fs');

const file = 'scratch/decompiled_BillingScreenKt.java';
if (!fs.existsSync(file)) {
    console.error("File does not exist:", file);
    process.exit(1);
}

const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

console.log("File size:", content.length);
console.log("Line count:", lines.length);

// Print the first 50 lines
console.log("--- First 50 lines ---");
console.log(lines.slice(0, 50).join('\n'));

// Let's search for some methods
console.log("--- Search for BillingScreen method ---");
lines.forEach((line, idx) => {
    if (line.includes('void BillingScreen') && !line.includes('class')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
});
