const fs = require('fs');

const content = fs.readFileSync('sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/BillingScreen.kt', 'utf8');
const lines = content.split('\n');

// Find the start index of "fun BillingScreen"
const searchStr = 'fun BillingScreen(';
const startIdx = content.indexOf(searchStr);
if (startIdx === -1) {
    console.error("Could not find start string");
    process.exit(1);
}

const openBraceIdx = content.indexOf('{', startIdx);
let braceCount = 1;
let i = openBraceIdx + 1;
let lineNum = content.slice(0, openBraceIdx).split('\n').length;

while (braceCount > 0 && i < content.length) {
    if (content[i] === '{') braceCount++;
    else if (content[i] === '}') braceCount--;
    
    if (content[i] === '\n') lineNum++;
    i++;
}

console.log(`fun BillingScreen starts at index ${openBraceIdx} (line ${content.slice(0, openBraceIdx).split('\n').length})`);
console.log(`It closes at index ${i} (line ${lineNum})`);
console.log(`Brace count at end: ${braceCount}`);
console.log(`Content at end:`, content.slice(i - 100, i));
