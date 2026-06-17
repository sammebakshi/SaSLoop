const fs = require('fs');
const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/BillingScreen.kt';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);
const start = 2740;
const end = 2760;
for (let i = start; i <= end; i++) {
  console.log(`${i}: ${lines[i - 1]}`);
}
