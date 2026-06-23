const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
const content = fs.readFileSync(filePath, 'utf16le');
const lines = content.split(/\r?\n/);

console.log(`Loaded ${lines.length} lines.`);

const keywords = ['coupon', 'appliedCoupon', 'couponDiscountAmt', 'coupon_discount', 'couponCode'];
keywords.forEach(keyword => {
  console.log(`\n=== Matches for "${keyword}" ===`);
  lines.forEach((line, index) => {
    if (line.toLowerCase().includes(keyword.toLowerCase())) {
      console.log(`${index + 1}: ${line.trim().substring(0, 150)}`);
    }
  });
});
