const fs = require('fs');

const f1 = 'scratch/decompiled_original_BillingScreenKt.java';
const f2 = 'scratch/decompiled_5pm_BillingScreenKt.java';
const f3 = 'scratch/decompiled_BillingScreenKt_before.java';

[f1, f2, f3].forEach(f => {
    if (fs.existsSync(f)) {
        const stats = fs.statSync(f);
        console.log(`${f}: size=${stats.size} bytes, modified=${stats.mtime.toISOString()}`);
    } else {
        console.log(`${f}: NOT FOUND`);
    }
});
