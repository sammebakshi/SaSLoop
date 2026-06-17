const fs = require('fs');

const content = fs.readFileSync('sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/BillingScreen.kt', 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
    if (line.includes('BillingFlowState.')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
});
