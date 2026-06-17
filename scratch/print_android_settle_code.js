const fs = require('fs');
const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/BillingScreen.kt';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

const ranges = [
  [2370, 2380],
  [2485, 2505],
  [3710, 3725],
  [3785, 3800],
  [4100, 4135]
];

ranges.forEach(([start, end]) => {
  console.log(`--- Lines ${start} to ${end} ---`);
  for (let i = start; i <= end; i++) {
    console.log(`${i}: ${lines[i - 1]}`);
  }
});
