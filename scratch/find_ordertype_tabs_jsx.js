const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('subOrderType') && (line.includes('DELIVERY') || line.includes('PICKUP'))) {
      console.log(`Line ${i + 1}: ${line.trim()}`);
      for (let j = 1; j <= 5; j++) {
        console.log(`  +${j}: ${lines[i+j]}`);
      }
    }
  }
} catch (err) {
  console.error(err);
}
