const fs = require('fs');
const content = fs.readFileSync('scratch/decompiled_original_BillingScreenKt.java', 'utf8');
const lines = content.split('\n');
const start = parseInt(process.argv[2]) || 8680;
const end = parseInt(process.argv[3]) || 9000;

for (let i = start; i <= end && i <= lines.length; i++) {
    console.log(`${i}: ${lines[i - 1]}`);
}
