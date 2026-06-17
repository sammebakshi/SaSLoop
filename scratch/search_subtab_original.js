const fs = require('fs');

const file = 'scratch/decompiled_5pm_BillingScreenKt.java';
if (!fs.existsSync(file)) {
    console.log("File not found");
    process.exit(1);
}

const content = fs.readFileSync(file, 'utf8');
console.log("File length:", content.length);

const terms = ['subtab', 'menusubtab', 'kotsubtab', 'billingsubtab', 'billingScreen', 'receiptrow'];
terms.forEach(term => {
    const idx = content.toLowerCase().indexOf(term.toLowerCase());
    if (idx !== -1) {
        console.log(`Term '${term}' found at index ${idx}`);
        // print a snippet of 150 chars around it
        console.log(`Snippet:`, content.slice(idx - 50, idx + 100).replace(/\n/g, ' '));
    } else {
        console.log(`Term '${term}' NOT found`);
    }
});
