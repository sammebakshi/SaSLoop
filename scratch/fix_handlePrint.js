const fs = require('fs');

// Read both files
const cleanFile = fs.readFileSync('pos-app/src/App_restored.jsx', 'utf8');
const dirtyFile = fs.readFileSync('pos-app/src/App.jsx', 'utf8');

const cleanLines = cleanFile.split('\n');
const dirtyLines = dirtyFile.split('\n');

// In App_restored.jsx: handlePrint starts at line 6858, handlePrintKOT at line 7315
// Extract the clean handlePrint function (lines 6858 through 7314, 1-indexed)
const cleanHandlePrint = cleanLines.slice(6857, 7314).join('\n');

// In App.jsx: handlePrint starts at line 6623, handlePrintKOT at line 7193
// Replace lines 6623 through 7192 (1-indexed) with the clean version
const before = dirtyLines.slice(0, 6622).join('\n');
const after = dirtyLines.slice(7192).join('\n');

const fixedContent = before + '\n' + cleanHandlePrint + '\n' + after;

fs.writeFileSync('pos-app/src/App.jsx', fixedContent, 'utf8');

console.log('handlePrint function replaced successfully.');
console.log(`Clean handlePrint: ${cleanLines.slice(6857, 7314).length} lines`);
console.log(`Dirty handlePrint was: ${dirtyLines.slice(6622, 7192).length} lines`);
