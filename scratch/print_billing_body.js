const fs = require('fs');

const file = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\clean_decompiled_BillingScreenKt.java';
if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    console.log(lines.slice(683, 1000).join('\n'));
} else {
    console.log('File not found');
}
