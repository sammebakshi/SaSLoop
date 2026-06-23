const fs = require('fs');

const filePath = 'pos-app/src/App.jsx';
const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

const startIdx = content.indexOf('isPaymentModalOpen && (() => {');
if (startIdx !== -1) {
  // Find where it returns JSX (returns something like `return (`)
  const returnIdx = content.indexOf('return (', startIdx);
  if (returnIdx !== -1) {
    const chunk = content.substring(returnIdx, returnIdx + 2000);
    console.log(chunk.split('\n').slice(0, 40).join('\n'));
  }
}
