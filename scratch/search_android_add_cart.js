const fs = require('fs');
const content = fs.readFileSync('sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/BillingScreen.kt', 'utf8');
const lines = content.split('\n');
let count = 0;
lines.forEach((line, i) => {
  if (line.includes('addToCart') || line.includes('addCart') || line.includes('addItem') || line.includes('updateCart') || line.includes('selectItem')) {
    count++;
    if (count < 20) {
      console.log(`Line ${i+1}: ${line.trim()}`);
    }
  }
});
console.log(`Total occurrences: ${count}`);
