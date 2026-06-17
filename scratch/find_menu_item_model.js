const fs = require('fs');
const content = fs.readFileSync('sasloop-android/app/src/main/java/com/example/sasloopmanager/data/Models.kt', 'utf8');
const lines = content.split('\n');
let start = 0;
lines.forEach((line, i) => {
  if (line.includes('data class MenuItem(')) {
    start = i;
  }
});
if (start > 0) {
  for (let j = start; j < start + 35; j++) {
    console.log(`Line ${j+1}: ${lines[j]}`);
  }
}
