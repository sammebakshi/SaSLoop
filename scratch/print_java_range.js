const fs = require('fs');
const start = parseInt(process.argv[2]) || 250;
const end = parseInt(process.argv[3]) || 500;

const file = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\clean_decompiled_BillingScreenKt.java';
if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    console.log(lines.slice(start - 1, end).join('\n'));
} else {
    console.log('File not found');
}
