const fs = require('fs');
const content = fs.readFileSync('sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/BillingScreen.kt', 'utf8');
const lines = content.split('\n');

const lineNumbers = [874, 920, 1094, 1455, 1489, 1730, 1779, 1791, 1822];
lineNumbers.forEach(ln => {
    console.log(`Line ${ln}:`);
    for (let i = ln - 1; i <= ln + 2; i++) {
        if (lines[i]) {
            console.log(`  ${i + 1}: ${lines[i].trim()}`);
        }
    }
});
