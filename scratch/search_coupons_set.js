const fs = require('fs');
const content = fs.readFileSync('scratch/App_reconstructed_parsed.jsx', 'utf8');
const lines = content.split('\n');

console.log('Matches for setIsCouponModalOpen in App_reconstructed_parsed.jsx:');
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('setiscouponmodalopen')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
