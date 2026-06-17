const fs = require('fs');
const content = fs.readFileSync('sasloop-android/app/src/main/java/com/example/sasloopmanager/ViewModels.kt', 'utf8');
const lines = content.split('\n');
let start = 0;
lines.forEach((line, i) => {
  if (line.includes('fun addToCart') || line.includes('fun updateCartQty')) {
    start = i;
    console.log(`Found function at line ${i+1}: ${line.trim()}`);
    for (let j = i; j < i + 30; j++) {
      console.log(`  Line ${j+1}: ${lines[j]}`);
    }
  }
});
