const fs = require('fs');
const filePath = 'C:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
const content = fs.readFileSync(filePath, 'utf8');

const targetFlags = [
  'isAccessLevelModalOpen',
  'isSettingsModalOpen',
  'isPaymentModalOpen',
  'isPayDueModalOpen',
  'isTableManagementModalOpen',
  'isUserManagementModalOpen',
  'isCaptainAppModalOpen',
  'isFeedbackModalOpen',
  'isInventoryModalOpen',
  'isReservationModalOpen',
  'isOldKOTModalOpen',
  'isTransferModalOpen',
  'isAddCustomerModalOpen',
  'isRejectionModalOpen',
  'isCustomerHistoryModalOpen',
  'isWaiterModalOpen',
  'isRiderModalOpen',
  'isExpenseModalOpen',
  'isOpenPriceModalOpen',
  'isDiscountModalOpen',
  'isChargesModalOpen',
  'isCouponModalOpen',
  'isSplitModalOpen'
];

targetFlags.forEach(flag => {
  let idx = content.indexOf(flag);
  let found = false;
  while (idx !== -1) {
    const context = content.substring(Math.max(0, idx - 10), idx + 800);
    // Try to find if it is a JSX condition
    if (context.includes('&&') && (context.includes('<div') || context.includes('<motion') || context.includes('return') || context.includes('(() =>'))) {
      console.log(`MODAL_FLAG: ${flag}`);
      
      // Print the next 1500 chars to cover the container and header
      const start = idx - 50;
      const end = idx + 1800;
      console.log(content.substring(start, end));
      console.log('\n================================================================================\n');
      found = true;
      break;
    }
    idx = content.indexOf(flag, idx + 1);
  }
  if (!found) {
    console.log(`MODAL_FLAG: ${flag} - NOT FOUND AS JSX CONDITION`);
    console.log('\n================================================================================\n');
  }
});
