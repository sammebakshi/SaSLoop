const fs = require('fs');
const path = require('path');

const managerPath = path.join(__dirname, '..', 'whatsappManager.js');
const content = fs.readFileSync(managerPath, 'utf8');
const lines = content.split('\n');

console.log("=== INSERTS INTO orders TABLE IN WHATSAPP MANAGER ===");
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('insert into orders')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
