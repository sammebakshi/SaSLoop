const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to \n
const originalLineEndings = content.includes('\r\n') ? '\r\n' : '\n';
content = content.replace(/\r\n/g, '\n');

// Target selectPosTable pendingOrder items loading
const target = `    if (pendingOrder) {
      setEditingOrder(pendingOrder);
      const parsedItems = Array.isArray(pendingOrder.items) ? pendingOrder.items : JSON.parse(pendingOrder.items || '[]');
      setTableBills(prev => ({ ...prev, [table.id]: mergeBillItems(parsedItems) }));
      setCart(tableCarts[table.id] || []);
      setCustomerName(pendingOrder.customer_name || 'POS Guest');
      setCustomerPhone(pendingOrder.customer_phone || '');
      setCustomerAddress(pendingOrder.address || '');
    } else {`;

const replacement = `    if (pendingOrder) {
      setEditingOrder(pendingOrder);
      const parsedItems = Array.isArray(pendingOrder.items) ? pendingOrder.items : JSON.parse(pendingOrder.items || '[]');
      const mappedItems = parsedItems.map(i => ({
        ...i,
        product_name: i.product_name || i.name || 'Item',
        quantity: parseFloat(i.quantity || i.qty || 1),
        price: parseFloat(i.price || 0),
        modifiers: i.modifiers || [],
        kot_category: i.kot_category || 'Main Kitchen'
      }));
      setTableBills(prev => ({ ...prev, [table.id]: mergeBillItems(mappedItems) }));
      setCart(tableCarts[table.id] || []);
      setCustomerName(pendingOrder.customer_name || 'POS Guest');
      setCustomerPhone(pendingOrder.customer_phone || '');
      setCustomerAddress(pendingOrder.address || '');
    } else {`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  console.log("selectPosTable mapping fix applied successfully!");
} else {
  console.error("selectPosTable mapping target NOT found!");
}

// Restore line endings
if (originalLineEndings === '\r\n') {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("App.jsx updated!");
