const fs = require('fs');
const content = fs.readFileSync('scratch/decompiled_original_BillingScreenKt.java', 'utf8');
const lines = content.split('\n');

for (let i = 8680; i <= 10200; i++) {
    const line = lines[i - 1];
    if (line.includes('TextKt.m3069TextNvy7gAk') || line.includes('ButtonKt.Button') || line.includes('OutlinedTextField') || line.includes('TextField') || line.includes('IconButton') || line.includes('m8420ReceiptRow6jMSoI')) {
        console.log(`${i}: ${line.trim()}`);
    }
}
