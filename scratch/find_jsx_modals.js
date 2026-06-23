const fs = require('fs');

const filePath = 'pos-app/src/App.jsx';
const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

const targetModalJSX = [
  'isSettingsModalOpen',
  'isPaymentModalOpen',
  'isExpenseModalOpen'
];

targetModalJSX.forEach(flag => {
  // We want to find where the flag is followed by && in the JSX render tree
  // A simple heuristic: find where it looks like `{isSettingsModalOpen && (`
  const regex = new RegExp(`{\\s*${flag}\\s*&&\\s*\\(?`);
  const matches = [...content.matchAll(new RegExp(flag, 'g'))];
  console.log(`=== Matches for ${flag} ===`);
  matches.forEach(m => {
    const idx = m.index;
    const surrounding = content.substring(Math.max(0, idx - 50), idx + 200);
    console.log(`Index ${idx}: ...${surrounding.replace(/\n/g, ' ')}...`);
  });
  console.log('\n');
});
