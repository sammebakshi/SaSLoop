const fs = require('fs');
const path = require('path');

const distAssetsDir = path.join(__dirname, '../pos-app/dist/assets');

try {
  const files = fs.readdirSync(distAssetsDir);
  files.forEach(file => {
    if (file.endsWith('.js')) {
      const filePath = path.join(distAssetsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      console.log(`Checking file: ${file}`);
      
      const containsPointsRate = content.includes('getPointsValueRate');
      const containsCoupon = content.includes('couponDiscountAmt');
      
      console.log(`- Contains 'getPointsValueRate': ${containsPointsRate}`);
      console.log(`- Contains 'couponDiscountAmt': ${containsCoupon}`);
      
      // Let's do a case insensitive check for coupon modal as well
      const containsCouponCI = content.toLowerCase().includes('coupon');
      console.log(`- Contains 'coupon' (case insensitive): ${containsCouponCI}`);
    }
  });
} catch (e) {
  console.error("Error reading dist/assets:", e);
}
