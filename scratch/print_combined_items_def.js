const fs = require('fs');
const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/BillingScreen.kt';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);
const start = 3110;
const end = 3125;
for (let i = start; i <= end; i++) {
  console.log(`${i}: ${lines[i - 1]}`);
}
