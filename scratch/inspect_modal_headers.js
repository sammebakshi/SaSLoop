const fs = require('fs');
const content = fs.readFileSync('pos-app/src/App.jsx', 'utf8').replace(/\r\n/g, '\n');

const indices = {
  isSplitModalOpen: 827611,
  isDiscountModalOpen: 877173,
  isPaymentModalOpen: 909695,
  isPayDueModalOpen: 949063,
  isWaiterModalOpen: 973951,
  isRiderModalOpen: 979446,
  isCouponModalOpen: 984550,
  isSettingsModalOpen: 1077785,
  isAddCustomerModalOpen: 1248739
};

Object.entries(indices).forEach(([name, idx]) => {
  console.log(`\n========================================`);
  console.log(`CODE DUMP FOR MODAL: ${name} (index: ${idx})`);
  console.log(`========================================`);
  console.log(content.substring(idx, idx + 1200));
});
