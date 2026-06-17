const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to LF to simplify matching
const normalized = content.replace(/\r\n/g, '\n');
let updated = normalized;

// 1. Combined View Grid status override
const combinedTarget = `                                    let status = tableStatuses[table.id] || 'AVAILABLE';\n                                    const activeBillCount = (tableBills[table.id] || []).filter(item => !item.isCancelled).length;\n                                    if (activeBillCount > 0 && status === 'AVAILABLE') {\n                                      status = 'SAVED';\n                                    }`;

const combinedReplacement = `                                    let status = tableStatuses[table.id] || 'AVAILABLE';\n                                    const activeBillCount = (tableBills[table.id] || []).filter(item => !item.isCancelled).length;\n                                    if (activeBillCount > 0 && status === 'AVAILABLE') {\n                                      status = 'SAVED';\n                                    }\n                                    if (activeBillCount === 0 && status !== 'ORDERING') {\n                                      status = 'AVAILABLE';\n                                    }`;

if (updated.includes(combinedTarget)) {
  updated = updated.replace(combinedTarget, combinedReplacement);
  console.log("Combined grid pattern found and replaced!");
} else {
  console.log("WARNING: Combined grid pattern NOT found!");
}

// 2. Separate View Grid status override
const separateTarget = `                                 let status = tableStatuses[table.id] || 'AVAILABLE';\n                                 const activeBillCount = (tableBills[table.id] || []).filter(item => !item.isCancelled).length;\n\n                                 if (activeBillCount > 0 && status === 'AVAILABLE') {\n\n                                   status = 'SAVED';\n\n                                 }`;

const separateReplacement = `                                 let status = tableStatuses[table.id] || 'AVAILABLE';\n                                 const activeBillCount = (tableBills[table.id] || []).filter(item => !item.isCancelled).length;\n\n                                 if (activeBillCount > 0 && status === 'AVAILABLE') {\n\n                                   status = 'SAVED';\n\n                                 }\n                                 if (activeBillCount === 0 && status !== 'ORDERING') {\n                                   status = 'AVAILABLE';\n                                 }`;

if (updated.includes(separateTarget)) {
  updated = updated.replace(separateTarget, separateReplacement);
  console.log("Separate grid pattern found and replaced!");
} else {
  console.log("WARNING: Separate grid pattern NOT found!");
}

// 3. Temporary Table Grid status override
const tempTarget = `            const billItems = tableBills[table.id] || [];\n            const cartItems = tableCarts[table.id] || [];\n            const items = billItems.length > 0 ? billItems : cartItems;\n            const total = calculateTotals(items).total;\n            const status = tableStatuses[table.id] || 'AVAILABLE';`;

const tempReplacement = `            const billItems = tableBills[table.id] || [];\n            const activeBillCount = billItems.filter(item => !item.isCancelled).length;\n            const cartItems = tableCarts[table.id] || [];\n            const items = billItems.length > 0 ? billItems : cartItems;\n            const total = calculateTotals(items).total;\n            const statusVal = tableStatuses[table.id] || 'AVAILABLE';\n            const status = (activeBillCount === 0 && statusVal !== 'ORDERING') ? 'AVAILABLE' : statusVal;`;

if (updated.includes(tempTarget)) {
  updated = updated.replace(tempTarget, tempReplacement);
  console.log("Temporary table pattern found and replaced!");
} else {
  console.log("WARNING: Temporary table pattern NOT found!");
}

// Write the file back
if (updated !== normalized) {
  const finalContent = content.includes('\r\n') ? updated.replace(/\n/g, '\r\n') : updated;
  fs.writeFileSync(filePath, finalContent, 'utf8');
  console.log("SUCCESS: Replaced all grid overrides successfully!");
} else {
  console.log("ERROR: No modifications made to App.jsx!");
}
