const fs = require('fs');

const filePath = 'pos-app/src/App.jsx';
const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

const modalSpecs = [
  { flag: 'isAccessLevelModalOpen', pattern: 'isAccessLevelModalOpen && (' },
  { flag: 'isSettingsModalOpen', pattern: 'isSettingsModalOpen && (' },
  { flag: 'isPaymentModalOpen', pattern: 'isPaymentModalOpen && (() => {' },
  { flag: 'isPayDueModalOpen', pattern: 'isPayDueModalOpen && (() => {' },
  { flag: 'isTableManagementModalOpen', pattern: 'isTableManagementModalOpen && (' },
  { flag: 'isUserManagementModalOpen', pattern: 'isUserManagementModalOpen && (' },
  { flag: 'isCaptainAppModalOpen', pattern: 'isCaptainAppModalOpen && (' },
  { flag: 'isFeedbackModalOpen', pattern: 'isFeedbackModalOpen && (' },
  { flag: 'isInventoryModalOpen', pattern: 'isInventoryModalOpen && (' },
  { flag: 'isReservationModalOpen', pattern: 'isReservationModalOpen && (' },
  { flag: 'isOldKOTModalOpen', pattern: 'isOldKOTModalOpen && (' },
  { flag: 'isTransferModalOpen', pattern: 'isTransferModalOpen && (' },
  { flag: 'isAddCustomerModalOpen', pattern: 'isAddCustomerModalOpen && (' },
  { flag: 'isRejectionModalOpen', pattern: 'isRejectionModalOpen && (' },
  { flag: 'isCustomerHistoryModalOpen', pattern: 'isCustomerHistoryModalOpen && (' },
  { flag: 'isWaiterModalOpen', pattern: 'isWaiterModalOpen && (' },
  { flag: 'isRiderModalOpen', pattern: 'isRiderModalOpen && (' },
  { flag: 'isExpenseModalOpen', pattern: 'isExpenseModalOpen && (' },
  { flag: 'isOpenPriceModalOpen', pattern: 'isOpenPriceModalOpen &&' },
  { flag: 'isDiscountModalOpen', pattern: 'isDiscountModalOpen && (' },
  { flag: 'isChargesModalOpen', pattern: 'isChargesModalOpen && (' },
  { flag: 'isCouponModalOpen', pattern: 'isCouponModalOpen && (' },
  { flag: 'isSplitModalOpen', pattern: 'isSplitModalOpen && (' }
];

let output = '';

modalSpecs.forEach(spec => {
  const startIdx = content.indexOf(spec.pattern);
  if (startIdx !== -1) {
    const chunk = content.substring(startIdx, startIdx + 3000);
    output += `=== FLAG: ${spec.flag} ===\n`;
    
    const lines = chunk.split('\n').slice(0, 45);
    lines.forEach((line, i) => {
      output += `${String(i+1).padStart(2, ' ')}: ${line}\n`;
    });
    output += '\n';
  } else {
    output += `=== FLAG: ${spec.flag} (PATTERN NOT FOUND: ${spec.pattern}) ===\n\n`;
  }
});

fs.writeFileSync('scratch/modals_extracted.txt', output, 'utf8');
console.log('Done writing scratch/modals_extracted.txt in UTF-8');
