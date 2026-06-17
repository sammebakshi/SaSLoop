const fs = require('fs');
const content = fs.readFileSync('sasloop-android/app/src/main/java/com/example/sasloopmanager/ViewModels.kt', 'utf8');
const lines = content.split('\n');
for (let j = 238; j < 270; j++) {
  console.log(`Line ${j+1}: ${lines[j]}`);
}
