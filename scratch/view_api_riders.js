const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/services/api.js');
try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('getRiders')) {
      console.log(`Line ${i + 1}: ${lines[i].trim()}`);
    }
  }
} catch (err) {
  console.error(err);
}
