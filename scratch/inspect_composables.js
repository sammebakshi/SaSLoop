const fs = require('fs');
const readline = require('readline');

const filePath = 'sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/BillingScreen.kt';
const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity
});

let lineNum = 0;
rl.on('line', (line) => {
    lineNum++;
    if (line.includes('@Composable') || (line.trim().startsWith('fun ') && !line.includes('='))) {
        console.log(`Line ${lineNum}: ${line.trim()}`);
    }
});
