const fs = require('fs');
const content = fs.readFileSync('scratch/decompiled_original_BillingScreenKt.java', 'utf8');

// Match any double quoted strings containing letters
const regex = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
let match;
const strings = new Set();
while ((match = regex.exec(content)) !== null) {
    const s = match[1];
    if (s.length > 2 && s.length < 30) {
        strings.add(s);
    }
}

console.log("Unique double-quoted strings in original decompiled java:");
const sortedStrings = Array.from(strings).sort();
console.log(sortedStrings.filter(s => 
    s.toLowerCase().includes('menu') || 
    s.toLowerCase().includes('kot') || 
    s.toLowerCase().includes('billing') || 
    s.toLowerCase().includes('settle') ||
    s.toLowerCase().includes('order') ||
    s.toLowerCase().includes('tab')
));
