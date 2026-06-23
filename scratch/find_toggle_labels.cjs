const fs = require('fs');

const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

lines.forEach((line, idx) => {
  if (line.includes('PickUp') && line.includes('Delivery')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  } else if (line.includes('orderDetails') || line.includes('toggle') || line.includes('Switch')) {
    if (line.includes('PickUp') || line.includes('Delivery')) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
