const fs = require('fs');
const filePath = 'C:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
const content = fs.readFileSync(filePath, 'utf8');

const targetFlags = [
  'isSettingsModalOpen',
  'isPayDueModalOpen',
  'isOldKOTModalOpen',
  'isExpenseModalOpen',
  'isOpenPriceModalOpen',
  'isCouponModalOpen',
  'isSplitModalOpen',
  'isAddCustomerModalOpen',
  'isWaiterModalOpen',
  'isRiderModalOpen',
  'isDiscountModalOpen',
  'isChargesModalOpen'
];

targetFlags.forEach(flag => {
  // Find index of flag followed by JSX
  let idx = content.indexOf(flag);
  while (idx !== -1) {
    const context = content.substring(Math.max(0, idx - 10), idx + 800);
    if (context.includes('&&') && (context.includes('<div') || context.includes('<motion') || context.includes('return'))) {
      console.log(`=== FOUND JSX FOR ${flag} ===`);
      console.log(content.substring(idx - 50, idx + 1200));
      console.log('\n======================================\n');
      break;
    }
    idx = content.indexOf(flag, idx + 1);
  }
});
