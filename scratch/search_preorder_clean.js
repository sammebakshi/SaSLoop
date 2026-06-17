const fs = require('fs');

const file = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\clean_decompiled_BillingScreenKt.java';
if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    let found = 0;
    lines.forEach((line, idx) => {
        if (line.includes('preOrder') || line.includes('pre_order') || line.includes('preorder')) {
            console.log(`Line ${idx + 1}: ${line.trim()}`);
            found++;
        }
    });
    console.log(`Total found: ${found}`);
} else {
    console.log('File not found');
}
