const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings
const normalized = content.replace(/\r\n/g, '\n');
let updated = normalized;

// We target the Separate View Table grid map function block:
const targetStartPattern = "{/* TABLE GRID - green buttons matching TMBill */}\n                          <div className=\"flex-1 overflow-y-auto p-3 no-scrollbar\">\n                            <div className=\"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3\">\n                              {tables.filter(t => !(t.is_temporary && t.original_order_type === 'PRE_ORDER')";

const targetIndex = updated.indexOf(targetStartPattern);
if (targetIndex === -1) {
  console.error("ERROR: Cannot find the starting pattern of Separate View table grid!");
  process.exit(1);
}

// We find the next statusColors definition and button render
const statusColorsPattern = "const statusColors = {";
const statusColorsIndex = updated.indexOf(statusColorsPattern, targetIndex);

const buttonPattern = "<button key={table.id} onClick={() => selectPosTable(table)} className={`h-24 w-full rounded-md ${statusColors[status] || statusColors.AVAILABLE}";
const buttonIndex = updated.indexOf(buttonPattern, targetIndex);

if (statusColorsIndex === -1 || buttonIndex === -1) {
  console.error("ERROR: Cannot find statusColors or button pattern within Separate View grid!");
  process.exit(1);
}

// Let's do a safe replacement of the whole map block inside the map function:
// We locate the map callback start:
const mapCallbackStart = "map(table => {";
const mapCallbackStartIndex = updated.indexOf(mapCallbackStart, targetIndex);

// And we locate the return button statement:
const buttonEndIndex = updated.indexOf("}>", buttonIndex);

if (mapCallbackStartIndex === -1 || buttonEndIndex === -1) {
  console.error("ERROR: Map callback or button end not found!");
  process.exit(1);
}

const originalBlock = updated.substring(mapCallbackStartIndex + mapCallbackStart.length, buttonEndIndex + 2);

const replacementBlock = `
                                 let status = tableStatuses[table.id] || 'AVAILABLE';
                                 const activeBillCount = (tableBills[table.id] || []).filter(item => !item.isCancelled).length;
                                 const hasCartItems = tableCarts[table.id]?.length > 0;

                                 if (activeBillCount > 0 && status === 'AVAILABLE') {
                                     status = 'SAVED';
                                 }
                                 if (activeBillCount === 0 && !['ORDERING', 'RESERVED', 'DRAFT_PRINTED', 'BILL_SAVED', 'PRINTED'].includes(status)) {
                                     status = 'AVAILABLE';
                                 }
                                 if (hasCartItems) {
                                     status = 'ITEMS_IN_KOT';
                                 }

                                 const statusColors = {
                                   AVAILABLE: 'bg-[#10ac84] hover:bg-[#0da07b]',
                                   ORDERING: 'bg-[#3498db] hover:bg-[#2980b9]',
                                   ITEMS_IN_KOT: 'bg-[#00d2d3] hover:bg-[#00b5b6]',
                                   SAVED: 'bg-[#3498db] hover:bg-[#2980b9]',
                                   BILL_SAVED: 'bg-[#ff7675] hover:bg-[#ef5f5f]',
                                   PRINTED: 'bg-[#2d3436] hover:bg-[#1e2224]',
                                   DRAFT_PRINTED: 'bg-[#8d6e63] hover:bg-[#73564d]',
                                   RESERVED: 'bg-[#ffb142] hover:bg-[#ff9f43]'
                                 };
                                 const isSelected = selectedTable?.id === table.id;
                                 
                                 const billItems = tableBills[table.id] || [];
                                 const cartItems = tableCarts[table.id] || [];
                                 const items = billItems.length > 0 ? billItems : cartItems;
                                 const total = calculateTotals(items).total;

                                 const tTime = tableActiveTimestamps[table.id];
                                 const tMin = tTime ? Math.max(1, Math.floor((Date.now() - tTime) / 60000)) : null;

                                 return (
                                   <button key={table.id} onClick={() => selectPosTable(table)} className={\`h-24 w-full rounded-md \${statusColors[status] || statusColors.AVAILABLE} text-white font-bold text-xs cursor-pointer transition-all active:scale-[0.98] relative shadow-sm flex flex-col justify-between p-3 \${isSelected ? 'ring-2 ring-offset-2 ring-[#ff9f43] border-2 border-[#ff9f43]' : 'border-0'}\`}>`;

updated = updated.replace(originalBlock, replacementBlock);

const finalContent = content.includes('\r\n') ? updated.replace(/\n/g, '\r\n') : updated;
fs.writeFileSync(filePath, finalContent, 'utf8');
console.log("SUCCESS: Replaced Separate View table grid map block successfully!");
