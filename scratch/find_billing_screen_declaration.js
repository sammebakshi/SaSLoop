const fs = require('fs');

const file = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\clean_decompiled_BillingScreenKt.java';
if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        if (line.includes('public static final void BillingScreen(')) {
            console.log(`EXACT LINE: ${idx + 1}`);
        }
    });
} else {
    console.log('File not found');
}
