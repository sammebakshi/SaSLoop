const fs = require('fs');

const filePath = 'pos-app/src/App.jsx';
const content = fs.readFileSync(filePath, 'utf8');

const modalFlags = [
  'isSplitModalOpen',
  'isExpenseModalOpen',
  'isOpenPriceModalOpen',
  'isDiscountModalOpen',
  'isChargesModalOpen',
  'isPaymentModalOpen',
  'isPayDueModalOpen',
  'isOldKOTModalOpen',
  'isTransferModalOpen',
  'isWaiterModalOpen',
  'isRiderModalOpen',
  'isCouponModalOpen',
  'isCustomerHistoryModalOpen',
  'isAccessLevelModalOpen',
  'isTableManagementModalOpen',
  'isUserManagementModalOpen',
  'isCaptainAppModalOpen',
  'isFeedbackModalOpen',
  'isInventoryModalOpen',
  'isReservationModalOpen',
  'isSettingsModalOpen',
  'isRejectionModalOpen',
  'isAddCustomerModalOpen'
];

modalFlags.forEach(flag => {
  const regexSearch = new RegExp(`{?\\s*${flag}\\s*&&`);
  const match = content.match(regexSearch);
  
  if (match) {
    const idx = match.index;
    const substring = content.substring(idx, idx + 1500);
    console.log(`=== Modal: ${flag} ===`);
    console.log(substring.substring(0, 600));
    console.log('====================================\n');
  } else {
    console.log(`=== Modal: ${flag} - Not Found ===\n`);
  }
});
