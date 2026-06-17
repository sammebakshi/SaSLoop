const fs = require('fs');
const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/BillingScreen.kt';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);
let start = 0;
let end = 0;
lines.forEach((line, idx) => {
  if (line.includes('fun SplitBillDialog')) {
    start = idx + 1;
  }
  if (start > 0 && end === 0 && line.includes('fun ') && idx + 1 > start) {
    end = idx;
  }
});
if (end === 0) end = start + 300;
console.log(`SplitBillDialog is defined from ${start} to ${end}`);
