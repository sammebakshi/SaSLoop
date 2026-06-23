const fs = require('fs');
const content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');

function searchSubstrings(queries) {
  queries.forEach(q => {
    let idx = -1;
    let occurrences = [];
    while ((idx = content.toLowerCase().indexOf(q.toLowerCase(), idx + 1)) !== -1) {
      occurrences.push(idx);
    }
    console.log(`\nQuery "${q}": found ${occurrences.length} occurrences.`);
    occurrences.slice(0, 5).forEach((pos, i) => {
      const lines = content.substring(0, pos).split('\n');
      const lineNum = lines.length;
      const fullLines = content.split('\n');
      console.log(`  Occur ${i + 1} at line ${lineNum}:`);
      for (let j = Math.max(1, lineNum - 1); j <= Math.min(fullLines.length, lineNum + 4); j++) {
        console.log(`    ${j}: ${fullLines[j - 1]}`);
      }
    });
  });
}

searchSubstrings([
  'splitPayment',
  'split_payment',
  'customerHistory',
  'customer_history',
  'fetchCustomer',
  'closeShift',
  'closeDay',
  'addExpense',
  'expense',
  'reports_list',
  'receiptSearchQuery',
  'resync',
  'reprint'
]);
