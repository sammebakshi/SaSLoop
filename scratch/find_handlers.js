const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(appPath, 'utf8');
const lines = content.split('\n');

const searchTerms = [
  'customerPhone',
  'customerName',
  'handleKOT',
  'handleSettle',
  'placeOrder',
  'submitOrder',
  'saveBill',
  'customer_details_mandatory'
];

searchTerms.forEach(term => {
  console.log(`\n=== Matches for "${term}": ===`);
  let count = 0;
  lines.forEach((line, idx) => {
    if (line.includes(term)) {
      count++;
      if (count <= 30) {
        console.log(`${idx + 1}: ${line.trim()}`);
      }
    }
  });
  if (count > 30) {
    console.log(`... and ${count - 30} more matches`);
  }
});
