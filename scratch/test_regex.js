const fs = require('fs');
const content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');

// Check customer name input class
const nameIdx = content.indexOf('newCustomerForm.name');
if (nameIdx !== -1) {
  console.log('Customer name input surrounding:');
  console.log(content.substring(nameIdx - 100, nameIdx + 300));
} else {
  console.log('Customer name input NOT found!');
}

// Check checkout function
const checkoutIdx = content.indexOf('handleCheckout = async');
if (checkoutIdx !== -1) {
  console.log('handleCheckout surrounding:');
  console.log(content.substring(checkoutIdx, checkoutIdx + 500));
}
