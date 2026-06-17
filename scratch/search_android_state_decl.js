const fs = require('fs');
const content = fs.readFileSync('sasloop-android/app/src/main/java/com/example/sasloopmanager/ViewModels.kt', 'utf8');
const lines = content.split('\n');
let count = 0;
lines.forEach((line, i) => {
  if (line.includes('MutableStateFlow') && count < 25) {
    count++;
    console.log(`Line ${i+1}: ${line.trim()}`);
  }
});
