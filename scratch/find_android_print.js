const fs = require('fs');
const path = require('path');

const files = [
  'c:/Users/Sajad/Desktop/SaSLoop/sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/BillingScreen.kt',
  'c:/Users/Sajad/Desktop/SaSLoop/sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/ViewModels.kt'
];

files.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`=== Matches in ${path.basename(filePath)} ===`);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);
    lines.forEach((line, idx) => {
      if (line.includes('print') || line.includes('Print') || line.includes('Printer') || line.includes('Bluetooth')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
      }
    });
  }
});
