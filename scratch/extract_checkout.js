const fs = require('fs');
const content = fs.readFileSync('pos-app/src/App.jsx', 'utf8').replace(/\r\n/g, '\n');

const idx = content.indexOf('handleCheckout = async');
if (idx !== -1) {
  const chunk = content.substring(idx, idx + 8000);
  console.log('--- handleCheckout extract ---');
  console.log(chunk.split('\n').slice(0, 160).join('\n'));
} else {
  console.log('handleCheckout NOT found!');
}
