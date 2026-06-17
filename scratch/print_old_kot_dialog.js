const fs = require('fs');
const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/BillingScreen.kt';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);
let start = 0;
let end = 0;
lines.forEach((line, idx) => {
  if (line.includes('fun OldKotDialog')) {
    start = idx + 1;
  }
  if (start > 0 && end === 0 && line.includes('fun ') && idx + 1 > start) {
    end = idx;
  }
});
if (end === 0) end = start + 150;
console.log(`Printing from ${start} to ${end}:`);
for (let i = start; i <= end; i++) {
  console.log(`${i}: ${lines[i - 1]}`);
}
