const fs = require('fs');
const content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');
const lines = content.split('\n');

console.log('Matches for isChargesModalOpen modal in App.jsx:');
lines.forEach((line, idx) => {
  if (line.includes('isChargesModalOpen') && line.includes('&& (')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
