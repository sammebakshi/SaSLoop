const fs = require('fs');

const content = fs.readFileSync('scratch/App_reconstructed_parsed.jsx', 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('<truncated')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
