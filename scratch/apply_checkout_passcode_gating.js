const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings
content = content.replace(/\r\n/g, '\n');

function replaceExact(find, replace, label) {
  if (content.includes(find)) {
    content = content.replace(find, replace);
    console.log(`[SUCCESS] Replaced: ${label}`);
  } else {
    console.error(`[FAILED] Target not found for: ${label}`);
  }
}

const findCheckoutTop = `  const handleCheckout = async (type = 'SETTLE', method = 'CASH', referenceNo = '', tip = 0, isDue = false) => {
    if (type === 'PRINT' && !checkBillingPermission('allow_draft_bill_printing')) {
      return toast.error("You do not have permission to print a draft bill.");
    }
    if (type === 'SETTLE' && !checkBillingPermission('settle_bill')) {
      return toast.error("You do not have permission to settle the bill.");
    }
    if (type === 'SAVE' && !checkBillingPermission('save_bill')) {
      return toast.error("You do not have permission to save the bill.");
    }
    if (type === 'SAVE_PRINT' && !checkBillingPermission('save_print_bill')) {
      return toast.error("You do not have permission to save and print the bill.");
    }`;

const replaceCheckoutTop = `  const handleCheckout = async (type = 'SETTLE', method = 'CASH', referenceNo = '', tip = 0, isDue = false) => {
    if (type === 'PRINT' && !checkBillingPermission('allow_draft_bill_printing')) {
      return toast.error("You do not have permission to print a draft bill.");
    }
    if (type === 'PRINT' && !checkBillingPasscode('allow_draft_bill_printing', "Enter Manager PIN to print draft bill:")) {
      return;
    }
    if (type === 'SETTLE' && !checkBillingPermission('settle_bill')) {
      return toast.error("You do not have permission to settle the bill.");
    }
    if (type === 'SETTLE' && !checkBillingPasscode('settle_bill', "Enter Manager PIN to settle bill:")) {
      return;
    }
    if (type === 'SAVE' && !checkBillingPermission('save_bill')) {
      return toast.error("You do not have permission to save the bill.");
    }
    if (type === 'SAVE' && !checkBillingPasscode('save_bill', "Enter Manager PIN to save bill:")) {
      return;
    }
    if (type === 'SAVE_PRINT' && !checkBillingPermission('save_print_bill')) {
      return toast.error("You do not have permission to save and print the bill.");
    }
    if (type === 'SAVE_PRINT' && !checkBillingPasscode('save_print_bill', "Enter Manager PIN to save and print bill:")) {
      return;
    }
    if (isDue && !checkBillingPermission('allowed_due_payment')) {
      return toast.error("Due payments are restricted.");
    }
    if (isDue && !checkBillingPasscode('allowed_due_payment', "Enter Manager PIN to authorize due payment:")) {
      return;
    }`;

replaceExact(findCheckoutTop, replaceCheckoutTop, 'Checkout Passcode Gating');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Checkout passcode gating script completed!');
