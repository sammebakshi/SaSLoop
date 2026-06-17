const fs = require('fs');
const path = require('path');

const files = [
  'App_dirty.jsx',
  'App_corrupted_current.jsx',
  'App_reconstructed.jsx',
  'App_reconstructed_context.jsx',
  'App_working_backup.jsx',
  'App_backup_before_restoration.jsx'
];

const keywords = ['availableCoupons', 'isCouponModalOpen', 'appliedCoupon', 'pointsHistoryModal', 'pointsHistory'];

files.forEach(f => {
  const filePath = path.join(__dirname, f);
  if (!fs.existsSync(filePath)) {
    console.log(`${f} does not exist`);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  console.log(`\n=== File: ${f} ===`);
  keywords.forEach(kw => {
    let count = 0;
    lines.forEach((line, idx) => {
      if (line.includes(kw)) {
        count++;
        if (count <= 10) {
          console.log(`    ${idx + 1}: ${line.trim()}`);
        }
      }
    });
    if (count > 10) {
      console.log(`    ... and ${count - 10} more matches`);
    }
  });
});
