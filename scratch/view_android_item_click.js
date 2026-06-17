const fs = require('fs');
const content = fs.readFileSync('sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/BillingScreen.kt', 'utf8');
const lines = content.split('\n');
for (let j = 3850; j < 4010; j++) {
  console.log(`Line ${j+1}: ${lines[j]}`);
}
