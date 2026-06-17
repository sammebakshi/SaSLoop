const fs = require('fs');

const file = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\decompiled_dex\\sources\\com\\example\\sasloopmanager\\BillingScreenKt.java';
if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    console.log(`Scanning ${file}...`);
    lines.forEach((line, idx) => {
        if (line.toLowerCase().includes('subtab') || line.toLowerCase().includes('tabrow')) {
            console.log(`Line ${idx + 1}: ${line.trim()}`);
        }
    });
} else {
    console.log('File not found');
}
