const fs = require('fs');

const file = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\clean_decompiled_BillingScreenKt.java';
if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    let startLine = 684;
    console.log(`Scanning starting at line ${startLine}...`);
    // Let's search for case 3 or enum mapping check
    for (let i = startLine; i < startLine + 1000; i++) {
        const line = lines[i];
        if (line.includes('case 3') || line.includes('FlowState') || line.includes('ORDERING')) {
            console.log(`Line ${i + 1}: ${line.trim()}`);
            console.log(lines.slice(i - 5, i + 35).join('\n'));
            console.log('---');
        }
    }
} else {
    console.log('File not found');
}
