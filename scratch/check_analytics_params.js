const fs = require('fs');
const brandRoutes = fs.readFileSync('c:\\Users\\Sajad\\Desktop\\SaSLoop\\routes\\brandRoutes.js', 'utf8');

// Find all matches of router.get("/analytics/...
const lines = brandRoutes.split('\n');
lines.forEach((line, index) => {
    if (line.includes('router.get("/analytics/') || line.includes('router.get(\"/analytics/')) {
        console.log(`\n--- Line ${index + 1}: ${line.trim()} ---`);
        // Print the next 35 lines to see pool.query and params
        for (let i = 1; i <= 35; i++) {
            if (lines[index + i]) {
                const l = lines[index + i];
                if (l.includes('pool.query') || l.includes('params =') || l.includes('req.user.')) {
                    console.log(`  + Line ${index + i + 1}: ${l.trim()}`);
                }
            }
        }
    }
});
