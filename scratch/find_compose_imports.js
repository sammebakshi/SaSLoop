const fs = require('fs');
const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/BillingScreen.kt';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);
lines.forEach((line, idx) => {
  if (line.includes('import androidx.compose') || line.includes('import java.text') || line.includes('import java.util')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
