const fs = require('fs');

const file = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\clean_decompiled_BillingScreenKt.java';
if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    console.log(`Scanning ${file}...`);
    let found = 0;
    lines.forEach((line, idx) => {
        if (line.toLowerCase().includes('subtab') || line.toLowerCase().includes('tabrow')) {
            console.log(`Line ${idx + 1}: ${line.trim()}`);
            found++;
        }
    });
    console.log(`Total occurrences found: ${found}`);
} else {
    console.log('File not found yet.');
}
