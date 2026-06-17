const fs = require('fs');
const filepath = "c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx";
const content = fs.readFileSync(filepath, 'utf8');
const lines = content.split('\n');

const keywords = [
  'change_item_price', 'changeItemPrice',
  'add_discount', 'addDiscount',
  'allow_draft_bill_printing', 'draftBill',
  'cancel_kot', 'cancelKot',
  'reprint_bill', 'reprintBill',
  'due_payment', 'duePayment',
  'item_as_complementary',
  'modify_bill_after_save',
  'change_table'
];

console.log("Searching for permission keywords in App.jsx...");
for (let idx = 0; idx < lines.length; idx++) {
  const line = lines[idx];
  keywords.forEach(keyword => {
    if (line.includes(keyword)) {
      console.log(`${idx + 1} (${keyword}): ${line.trim().substring(0, 120)}`);
    }
  });
}
