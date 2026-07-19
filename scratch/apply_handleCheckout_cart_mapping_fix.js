const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to \n
const originalLineEndings = content.includes('\r\n') ? '\r\n' : '\n';
content = content.replace(/\r\n/g, '\n');

// Target handleCheckout save/print block
const target = `    if (selectedTable) {
      if (type === 'SAVE' || type === 'PRINT' || type === 'SAVE_PRINT') {
        const consolidatedItems = mergeBillItems([...(tableBills[selectedTable.id] || []), ...cart]);
        setTableBills(prev => ({ ...prev, [selectedTable.id]: consolidatedItems }));
        setCart([]);
        setTableCarts(prev => ({ ...prev, [selectedTable.id]: [] }));
        setActiveTrayTab('Billing');
      }`;

const replacement = `    if (selectedTable) {
      if (type === 'SAVE' || type === 'PRINT' || type === 'SAVE_PRINT') {
        const toCartFormat = (items) => (items || []).map(i => ({
          ...i,
          product_name: i.product_name || i.name || 'Item',
          quantity: parseFloat(i.quantity || i.qty || 1),
          price: parseFloat(i.price || 0),
          modifiers: i.modifiers || [],
          kot_category: i.kot_category || 'Main Kitchen'
        }));
        const consolidatedItems = mergeBillItems([
          ...toCartFormat(tableBills[selectedTable.id]),
          ...toCartFormat(cart)
        ]);
        setTableBills(prev => ({ ...prev, [selectedTable.id]: consolidatedItems }));
        setCart([]);
        setTableCarts(prev => ({ ...prev, [selectedTable.id]: [] }));
        setActiveTrayTab('Billing');
      }`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  console.log("handleCheckout save/print cart mapping fix applied successfully!");
} else {
  console.error("handleCheckout save/print target NOT found!");
}

// Restore line endings
if (originalLineEndings === '\r\n') {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("App.jsx updated!");
