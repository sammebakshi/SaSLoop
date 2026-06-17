const fs = require('fs');

const file = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\clean_decompiled_BillingScreenKt.java';
if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    let found = false;
    lines.forEach((line, idx) => {
        if (line.includes('ORDERING') && !found) {
            console.log(`Found ORDERING at line ${idx + 1}:`);
            console.log(lines.slice(idx - 10, idx + 100).join('\n'));
            found = true;
        }
    });
} else {
    console.log('File not found');
}
