const fs = require('fs');

const f1 = fs.readFileSync('scratch/App_working_backup_v2.jsx', 'utf8');

function showMatches(content, filename, kw) {
  console.log(`\n--- ${filename} matches for "${kw}" ---`);
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes(kw.toLowerCase())) {
      console.log(`${idx + 1}: ${line.trim()}`);
    }
  });
}

showMatches(f1, 'App_working_backup_v2.jsx', 'coupon');
