const fs = require('fs');
const path = require('path');

const managerPath = path.join(__dirname, '..', 'whatsappManager.js');
const content = fs.readFileSync(managerPath, 'utf8');
const lines = content.split('\n');

console.log("=== LOYALTY REGISTRATION CODE ===");
for (let i = 900; i <= 1050; i++) {
  if (lines[i]) console.log(`${i + 1}: ${lines[i]}`);
}
