const fs = require('fs');
const path = require('path');

const managerPath = path.join(__dirname, '..', 'whatsappManager.js');
const content = fs.readFileSync(managerPath, 'utf8');
const lines = content.split('\n');

console.log("=== INSERTS INTO customers TABLE IN WHATSAPP MANAGER ===");
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('insert into customers') || line.toLowerCase().includes('customers (')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
