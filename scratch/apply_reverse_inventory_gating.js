const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings
content = content.replace(/\r\n/g, '\n');

function replaceExact(find, replace, label) {
  if (content.includes(find)) {
    content = content.replace(find, replace);
    console.log(`[SUCCESS] Replaced: ${label}`);
  } else {
    console.error(`[FAILED] Target not found for: ${label}`);
  }
}

const findReduceInventory = `  const handleReduceInventory = () => {
    if (!selectedReceipt) {
      toast.warning("Please select a bill first to reduce inventory stock.");
      return;
    }`;

const replaceReduceInventory = `  const handleReduceInventory = () => {
    const access = getStaffPermissions()?.pos_access?.Receipts;
    if (access?.reverse_inventory === false) {
      toast.error("Reversing/reducing inventory is restricted.");
      return;
    }
    if (access?.reverse_inventory_passcode === true) {
      const pin = prompt("Enter Manager PIN to authorize inventory modification:");
      if (pin === null) return;
      if (!verifyManagerPin(pin)) {
         toast.error("Invalid Manager PIN/Passcode!");
         return;
      }
    }
    if (!selectedReceipt) {
      toast.warning("Please select a bill first to reduce inventory stock.");
      return;
    }`;

replaceExact(findReduceInventory, replaceReduceInventory, 'Reduce/Reverse Inventory Gating');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Reduce/Reverse Inventory gating script completed!');
