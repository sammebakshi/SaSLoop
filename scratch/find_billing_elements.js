const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(appPath, 'utf8');
const lines = content.split('\n');

const searchTerms = [
  'Preview',
  'Send Bill',
  'modify_bill_status',
  'restrict_reprint_bill',
  'order_note',
  'Order Note'
];

searchTerms.forEach(term => {
  console.log(`\n=== Matches for "${term}": ===`);
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes(term.toLowerCase())) {
      console.log(`${idx + 1}: ${line.trim()}`);
    }
  });
});
