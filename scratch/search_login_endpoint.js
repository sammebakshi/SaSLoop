const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../routes/authRoutes.js');
console.log('Reading file:', filePath);

try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let insideLogin = false;
  let linesToPrint = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('/login')) {
      insideLogin = true;
      linesToPrint = 30;
    }
    if (insideLogin && linesToPrint > 0) {
      console.log(`Line ${i + 1}: ${lines[i]}`);
      linesToPrint--;
      if (linesToPrint === 0) {
        insideLogin = false;
      }
    }
  }
} catch (err) {
  console.error('Error:', err);
}
