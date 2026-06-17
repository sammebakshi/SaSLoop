const fs = require('fs');
const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/BillingScreen.kt';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);
lines.forEach((line, idx) => {
  if (line.includes('billNo') || line.includes('bill_no') || line.includes('BillNo')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
