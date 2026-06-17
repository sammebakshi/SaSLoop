const fs = require('fs');
const content = fs.readFileSync('scratch/decompiled_original_BillingScreenKt.java', 'utf8');
const lines = content.split('\n');

// Find occurrences of tab indicators in the decompiled Java file
lines.forEach((line, idx) => {
    if (line.includes('activeSubTab') || line.includes('setValue("MENU")') || line.includes('setValue("KOT")') || line.includes('setValue("BILLING")')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
