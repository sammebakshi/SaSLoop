const fs = require('fs');
const content = fs.readFileSync('sasloop-android/app/src/main/java/com/example/sasloopmanager/ViewModels.kt', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('catalog') || line.includes('Catalog')) {
    console.log(`Line ${i+1}: ${line.trim()}`);
  }
});
