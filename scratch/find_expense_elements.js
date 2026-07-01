const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(appPath, 'utf8');
const lines = content.split('\n');

const searchTerms = [
  'Expense',
  'expense',
  'addExpense',
  'add_expense'
];

searchTerms.forEach(term => {
  console.log(`\n=== Matches for "${term}": ===`);
  let count = 0;
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes(term.toLowerCase())) {
      count++;
      if (count <= 25) {
        console.log(`${idx + 1}: ${line.trim()}`);
      }
    }
  });
  if (count > 25) {
    console.log(`... and ${count - 25} more matches`);
  }
});
