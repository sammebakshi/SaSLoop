const fs = require('fs');
try {
    const stats = fs.statSync('scratch/decompiled_BillingScreenKt.java');
    console.log(`Decompiled file stats:`);
    console.log(`  Size: ${stats.size} bytes`);
    console.log(`  Modified: ${stats.mtime}`);
} catch (e) {
    console.error("Error statting decompiled file:", e.message);
}
