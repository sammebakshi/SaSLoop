const fs = require('fs');
const content = fs.readFileSync('scratch/decompiled_original_BillingScreenKt.java', 'utf8');
const lines = content.split('\n');

const out = [];
for (let i = 8679; i <= 8900; i++) {
    out.push(`${i + 1}: ${lines[i]}`);
}
fs.writeFileSync('scratch/view_tab_java.txt', out.join('\n'), 'utf8');
console.log("Written to scratch/view_tab_java.txt");
