const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = '';

content = fs.readFileSync(filePath, 'utf8');
if (content.includes('\u0000')) {
  console.log('Detected null bytes, re-reading as UTF-16LE...');
  content = fs.readFileSync(filePath, 'utf16le');
} else {
  console.log('Read successfully as UTF-8');
}

const lines = content.split(/\r?\n/);
console.log(`Loaded ${lines.length} lines.`);

const keywords = ['coupon', 'appliedCoupon', 'couponDiscountAmt', 'coupon_discount', 'couponCode', 'getPointsValueRate'];
keywords.forEach(keyword => {
  console.log(`\n=== Matches for "${keyword}" ===`);
  let count = 0;
  lines.forEach((line, index) => {
    if (line.toLowerCase().includes(keyword.toLowerCase())) {
      console.log(`${index + 1}: ${line.trim().substring(0, 150)}`);
      count++;
    }
  });
  console.log(`Total matches: ${count}`);
});
