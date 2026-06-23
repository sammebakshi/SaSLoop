const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const patterns = [
  /paymentModes/i,
  /allowed_due_payment/i,
  /due_payment/i,
  /duePayment/i,
  /CREDIT/i
];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  patterns.forEach(pattern => {
    if (pattern.test(line)) {
      console.log(`${i + 1}: ${line.trim().substring(0, 120)}`);
    }
  });
}
