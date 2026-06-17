const fs = require('fs');

const content = fs.readFileSync('scratch/App_working_backup_v2.jsx', 'utf8');
const lines = content.split('\n');

function printContext(kw, count = 2) {
  console.log(`\n================ Context for "${kw}" ================`);
  lines.forEach((line, idx) => {
    if (line.includes(kw)) {
      console.log(`\nLine ${idx + 1}:`);
      const start = Math.max(0, idx - count);
      const end = Math.min(lines.length - 1, idx + count);
      for (let i = start; i <= end; i++) {
        const marker = (i === idx) ? '=> ' : '   ';
        console.log(`${marker}${i + 1}: ${lines[i]}`);
      }
    }
  });
}

printContext('appliedCoupon', 2);
printContext('isCouponModalOpen', 2);
