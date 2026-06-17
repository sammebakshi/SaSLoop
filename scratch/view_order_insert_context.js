const fs = require('fs');
const path = require('path');

const managerPath = path.join(__dirname, '..', 'whatsappManager.js');
const content = fs.readFileSync(managerPath, 'utf8');
const lines = content.split('\n');

console.log("=== CONTEXT AROUND LINE 815 ===");
for (let i = 800; i <= 830; i++) {
  if (lines[i]) console.log(`${i + 1}: ${lines[i]}`);
}
