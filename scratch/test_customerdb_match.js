const fs = require('fs');
let content = fs.readFileSync('pos-app/src/App.jsx', 'utf8').replace(/\r\n/g, '\n');

const handleCheckoutIdx = content.indexOf('const handleCheckout =');
console.log('Index of handleCheckout:', handleCheckoutIdx);

if (handleCheckoutIdx !== -1) {
  const idx = content.indexOf('setCustomerDb(prev => {', handleCheckoutIdx);
  console.log('Index of setCustomerDb inside handleCheckout:', idx);
  if (idx !== -1) {
    const actualText = content.substring(idx, idx + 1000);
    console.log('--- ACTUAL TEXT ---');
    console.log(actualText);
    console.log('--- END ACTUAL ---');
  }
}
