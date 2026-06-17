const fs = require('fs');

const file = 'scratch/decompiled_5pm_BillingScreenKt.java';
if (!fs.existsSync(file)) {
    console.log("File not found");
    process.exit(1);
}

const content = fs.readFileSync(file, 'utf8');

// Find all occurrences of "activeSubTab" or "activeFlow"
let pos = 0;
while (true) {
    const idx = content.indexOf('activeSubTab', pos);
    if (idx === -1) break;
    console.log(`========================================`);
    console.log(`Found activeSubTab at index ${idx}`);
    // Print 800 characters before and after
    console.log(content.slice(Math.max(0, idx - 400), Math.min(content.length, idx + 600)).replace(/\n/g, ' '));
    pos = idx + 1;
}
