const fs = require('fs');
const path = require('path');

const managerPath = path.join(__dirname, '..', 'whatsappManager.js');
const content = fs.readFileSync(managerPath, 'utf8');
const lines = content.split('\n');

console.log("=== SEARCHING FOR finalizeOrder ===");
lines.forEach((line, idx) => {
  if (line.includes('finalizeOrder') || line.includes('finalizeConversationalOrder')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
