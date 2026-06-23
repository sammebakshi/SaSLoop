const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../pos-app/src/App.jsx');
const lines = fs.readFileSync(file, 'utf8').split('\n');

function findContext(kw) {
  console.log(`\n=== Matches for "${kw}" ===`);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase().includes(kw.toLowerCase())) {
      console.log(`Line ${i+1}: ${lines[i].trim()}`);
    }
  }
}

findContext('whatsapp');
findContext('sendWhatsAppMessage');
findContext('Printer');
