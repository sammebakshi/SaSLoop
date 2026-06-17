const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase().includes('retail invoice') || lines[i].toLowerCase().includes('retail_invoice')) {
      console.log(`Line ${i + 1}: ${lines[i].trim()}`);
      for (let j = 1; j <= 3; j++) {
        console.log(`  +${j}: ${lines[i+j]}`);
      }
    }
  }
} catch (err) {
  console.error(err);
}
