const fs = require('fs');

const files = [
    'scratch/reconstructed_original_BillingScreen.kt',
    'scratch/reconstructed_v4467.kt',
    'scratch/reconstructed_helpers.kt',
    'scratch/reconstructed_v4402.kt',
    'scratch/clean_decompiled_BillingScreenKt.java'
];

for (const file of files) {
    if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        console.log(`EXISTS: ${file} (${stats.size} bytes)`);
    } else {
        console.log(`NOT FOUND: ${file}`);
    }
}
