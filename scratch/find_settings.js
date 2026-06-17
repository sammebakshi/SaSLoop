const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/BillingScreen.kt');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log('--- Searching for "Waiter" in BillingScreen.kt ---');
lines.forEach((line, index) => {
  if (line.toLowerCase().includes('waiter')) {
    console.log(`${index + 1}: ${line.trim()}`);
  }
});
