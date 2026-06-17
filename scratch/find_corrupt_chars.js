const fs = require('fs');

const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
let foundCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Check for presence of character code 65533 (\uFFFD) or any other character that is not standard ASCII/Unicode printable
  let hasSpecial = false;
  for (let j = 0; j < line.length; j++) {
    const code = line.charCodeAt(j);
    if (code === 65533) {
      hasSpecial = true;
      break;
    }
  }
  if (hasSpecial) {
    foundCount++;
    console.log(`${i + 1}: ${line.trim()}`);
  }
}

console.log(`Total lines with replacement character (65533): ${foundCount}`);
