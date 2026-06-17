const fs = require('fs');

const content = fs.readFileSync('sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/BillingScreen.kt', 'utf8');
const lines = content.split('\n');

let stack = [];
let insideComment = false;

lines.forEach((line, idx) => {
    let trimmed = line.trim();
    if (trimmed.startsWith('/*')) insideComment = true;
    if (insideComment) {
        if (trimmed.endsWith('*/')) insideComment = false;
        return;
    }
    if (trimmed.startsWith('//')) return;

    // Look for signatures of fun/class/interface
    let funMatch = line.match(/(fun|class|interface)\s+([A-Za-z0-9_]+)/);
    
    for (let i = 0; i < line.length; i++) {
        let char = line[i];
        if (char === '{') {
            let label = `${idx + 1}: {`;
            if (funMatch) {
                label = `${idx + 1}: ${funMatch[1]} ${funMatch[2]} {`;
                funMatch = null; // consume
            }
            stack.push({ line: idx + 1, label: label, trimmed: line.trim() });
        } else if (char === '}') {
            if (stack.length === 0) {
                console.log(`Line ${idx + 1}: EXTRA closing brace } => ${line.trim()}`);
            } else {
                let popped = stack.pop();
                // If we popped a fun/class, print it
                if (popped.label.includes('fun') || popped.label.includes('class')) {
                    console.log(`Closed block from line ${popped.line}: ${popped.label}`);
                }
            }
        }
    }
});

console.log('\n--- Unclosed blocks at EOF: ---');
stack.forEach(item => {
    console.log(`Line ${item.line}: ${item.label} (${item.trimmed})`);
});
