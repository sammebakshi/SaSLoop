const fs = require('fs');
const content = fs.readFileSync('scratch/clean_decompiled_BillingScreenKt.java', 'utf8');

const keywords = [
    '"MENU"', '"KOT"', '"BILLING"',
    'preOrderDate', 'preOrderTime',
    'preOrderIdInput', 'advancePaidInput',
    'Fulfill', 'TabRow', 'activeSubTab'
];

console.log("Searching in clean_decompiled_BillingScreenKt.java:");
keywords.forEach(kw => {
    let count = 0;
    let index = content.indexOf(kw);
    while (index !== -1) {
        count++;
        index = content.indexOf(kw, index + 1);
    }
    console.log(`Keyword ${kw}: found ${count} times`);
});
