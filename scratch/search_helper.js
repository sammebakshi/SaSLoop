const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/BillingScreen.kt');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

for (let idx = 0; idx < lines.length; idx++) {
    if (lines[idx].includes('fun ')) {
        console.log(`Line ${idx + 1}: ${lines[idx].trim()}`);
    }
}
