const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let matchCount = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('orderType') || line.includes('setOrderType')) {
      matchCount++;
      if (matchCount <= 40) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
      }
    }
  }
  console.log('Total matches for orderType:', matchCount);
} catch (err) {
  console.error(err);
}
