const fs = require('fs');

const content = fs.readFileSync('sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/BillingScreen.kt', 'utf8');
const lines = content.split('\n');

let openBraces = [];
let insideComment = false;

lines.forEach((line, idx) => {
    let trimmed = line.trim();
    if (trimmed.startsWith('/*')) insideComment = true;
    if (insideComment) {
        if (trimmed.endsWith('*/')) insideComment = false;
        return;
    }
    if (trimmed.startsWith('//')) return;
    
    // Check for braces in this line
    for (let i = 0; i < line.length; i++) {
        let char = line[i];
        if (char === '{') {
            openBraces.push({ line: idx + 1, col: i + 1, text: line.trim() });
        } else if (char === '}') {
            if (openBraces.length === 0) {
                console.log(`Extra closing brace } on line ${idx + 1}: ${line.trim()}`);
            } else {
                openBraces.pop();
            }
        }
    }
});

console.log('Unclosed braces at EOF:', openBraces.length);
openBraces.forEach(ob => {
    console.log(`  Line ${ob.line}: ${ob.text}`);
});
