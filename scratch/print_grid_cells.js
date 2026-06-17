const fs = require('fs');
const content = fs.readFileSync('scratch/decompiled_original_BillingScreenKt.java', 'utf8');
const lines = content.split('\n');

console.log("=== Grid at line 3377 ===");
for (let i = 3365; i <= 3385; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
}

console.log("\n=== Grid at line 7452 ===");
for (let i = 7440; i <= 7460; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
}
