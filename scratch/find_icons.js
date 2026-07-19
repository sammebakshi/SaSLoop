const fs = require('fs');
const path = require('path');

const appJsxPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(appJsxPath, 'utf8');

const searchTerms = ['CreditCard', 'Bell', 'Monitor', 'liveIcon', 'notificationIcon', 'transactionsIcon'];
const lines = content.split(/\r?\n/);

lines.forEach((line, index) => {
  searchTerms.forEach(term => {
    if (line.includes(term)) {
      console.log(`Line ${index + 1}: ${line.trim()}`);
    }
  });
});
