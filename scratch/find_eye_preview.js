const fs = require('fs');
const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/BillingScreen.kt';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('preview') || line.toLowerCase().includes('eye') || line.toLowerCase().includes('visibility')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
