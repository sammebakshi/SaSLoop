const fs = require('fs');

const file = 'scratch/decompiled_dex/sources/com/example/sasloopmanager/BillingScreenKt.java';
if (!fs.existsSync(file)) {
    console.error("File does not exist:", file);
    process.exit(1);
}

const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

console.log("File size:", content.length);
console.log("Line count:", lines.length);

console.log("Searching for public static methods:");
lines.forEach((line, idx) => {
    if (line.includes('public static final void') || line.includes('public static void')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
});
