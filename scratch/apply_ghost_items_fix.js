const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to \n
const originalLineEndings = content.includes('\r\n') ? '\r\n' : '\n';
content = content.replace(/\r\n/g, '\n');

// 1. Update selectPosTable logic
const selectPosTableTarget = `    if (pendingOrder) {
      setEditingOrder(pendingOrder);
      setCart(Array.isArray(pendingOrder.items) ? pendingOrder.items : JSON.parse(pendingOrder.items || '[]'));
      setCustomerName(pendingOrder.customer_name || 'POS Guest');
      setCustomerPhone(pendingOrder.customer_phone || '');
      setCustomerAddress(pendingOrder.address || '');
    } else {
      setEditingOrder(null);
      setCart(tableCarts[table.id] || []);
    }`;

const selectPosTableReplacement = `    if (pendingOrder) {
      setEditingOrder(pendingOrder);
      const parsedItems = Array.isArray(pendingOrder.items) ? pendingOrder.items : JSON.parse(pendingOrder.items || '[]');
      setTableBills(prev => ({ ...prev, [table.id]: mergeBillItems(parsedItems) }));
      setCart(tableCarts[table.id] || []);
      setCustomerName(pendingOrder.customer_name || 'POS Guest');
      setCustomerPhone(pendingOrder.customer_phone || '');
      setCustomerAddress(pendingOrder.address || '');
    } else {
      setEditingOrder(null);
      setCart(tableCarts[table.id] || []);
    }`;

if (content.includes(selectPosTableTarget)) {
  content = content.replace(selectPosTableTarget, selectPosTableReplacement);
  console.log("selectPosTable logic updated successfully!");
} else {
  console.error("selectPosTable target logic NOT found!");
}

// 2. Update handleCheckout logic for SAVE/PRINT/SAVE_PRINT
const handleCheckoutTarget = `    if (selectedTable) {
      if (type === 'SAVE') setTableStatuses(prev => ({ ...prev, [selectedTable.id]: 'BILL_SAVED' }));
      else if (type === 'PRINT') {
        setTableStatuses(prev => ({ ...prev, [selectedTable.id]: 'PRINTED' }));
        handlePrint(newOrder);
      }
      else if (type === 'SETTLE') {`;

const handleCheckoutReplacement = `    if (selectedTable) {
      if (type === 'SAVE' || type === 'PRINT' || type === 'SAVE_PRINT') {
        const consolidatedItems = mergeBillItems([...(tableBills[selectedTable.id] || []), ...cart]);
        setTableBills(prev => ({ ...prev, [selectedTable.id]: consolidatedItems }));
        setCart([]);
        setTableCarts(prev => ({ ...prev, [selectedTable.id]: [] }));
        setActiveTrayTab('Billing');
      }

      if (type === 'SAVE') setTableStatuses(prev => ({ ...prev, [selectedTable.id]: 'BILL_SAVED' }));
      else if (type === 'PRINT') {
        setTableStatuses(prev => ({ ...prev, [selectedTable.id]: 'PRINTED' }));
        handlePrint(newOrder);
      }
      else if (type === 'SETTLE') {`;

if (content.includes(handleCheckoutTarget)) {
  content = content.replace(handleCheckoutTarget, handleCheckoutReplacement);
  console.log("handleCheckout logic updated successfully!");
} else {
  console.error("handleCheckout target logic NOT found!");
}

// Restore line endings
if (originalLineEndings === '\r\n') {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("App.jsx updated!");
