const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');
const isCRLF = content.includes('\r\n');
let n = content.replace(/\r\n/g, '\n');

const lines = n.split('\n');

// Find the exact line numbers
// Line 21726 (1-indexed) = index 21725 should be "         )}"  
// Line 21728 (1-indexed) = index 21727 should contain "isSettingsModalOpen"

console.log("Line 21726:", JSON.stringify(lines[21725]));
console.log("Line 21727:", JSON.stringify(lines[21726]));
console.log("Line 21728:", JSON.stringify(lines[21727]));

// Insert "</AnimatePresence>" as new line after index 21725 (line 21726)
lines.splice(21726, 0, '         </AnimatePresence>');

console.log("After insertion:");
console.log("Line 21726:", JSON.stringify(lines[21725]));
console.log("Line 21727:", JSON.stringify(lines[21726]));
console.log("Line 21728:", JSON.stringify(lines[21727]));
console.log("Line 21729:", JSON.stringify(lines[21728]));

let result = lines.join('\n');
if (isCRLF) result = result.replace(/\n/g, '\r\n');
fs.writeFileSync(appPath, result, 'utf8');
console.log("🎉 Inserted </AnimatePresence> closing tag!");
