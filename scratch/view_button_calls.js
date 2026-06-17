const fs = require('fs');
const path = require('path');

const managerPath = path.join(__dirname, '..', 'whatsappManager.js');
const content = fs.readFileSync(managerPath, 'utf8');
const lines = content.split('\n');

const callLines = [526, 596, 644, 700, 724, 776, 804, 966, 998, 1101, 1126, 1218, 1416, 1595];

callLines.forEach(lineNum => {
  console.log(`\n=== CONTEXT AROUND LINE ${lineNum} ===`);
  const start = Math.max(0, lineNum - 5);
  const end = Math.min(lines.length - 1, lineNum + 5);
  for (let i = start; i <= end; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
});
