const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to \n
const originalLineEndings = content.includes('\r\n') ? '\r\n' : '\n';
content = content.replace(/\r\n/g, '\n');

// Target selectPosTable save current state block
const target = `    if (selectedTable) {
      setTableWaiters(prev => ({ ...prev, [selectedTable.id]: selectedWaiter }));
      setTableDiscounts(prev => ({ ...prev, [selectedTable.id]: discount }));`;

const replacement = `    if (selectedTable) {
      setTableCarts(prev => ({ ...prev, [selectedTable.id]: cart }));
      setTableWaiters(prev => ({ ...prev, [selectedTable.id]: selectedWaiter }));
      setTableDiscounts(prev => ({ ...prev, [selectedTable.id]: discount }));`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  console.log("selectPosTable tableCarts saving fix applied successfully!");
} else {
  console.error("selectPosTable target NOT found!");
}

// Restore line endings
if (originalLineEndings === '\r\n') {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("App.jsx updated!");
