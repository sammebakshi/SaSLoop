const fs = require('fs');
const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/BillingScreen.kt';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);
lines.forEach((line, idx) => {
  if (line.includes('if (showSplitBillDialog)')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
    // print 5 lines before and after
    for (let i = Math.max(0, idx - 5); i <= Math.min(lines.length - 1, idx + 5); i++) {
      console.log(`  ${i + 1}: ${lines[i]}`);
    }
  }
});
