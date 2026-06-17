const fs = require('fs');

const cleanContent = fs.readFileSync('scratch/App_clean.jsx', 'utf8').replace(/\r\n/g, '\n');
const dirtyContent = fs.readFileSync('scratch/App_dirty.jsx', 'utf8').replace(/\r\n/g, '\n');

// Find a block from startMarker to endMarker
function getRangeBlock(content, startMarker, endMarker) {
  const startIdx = content.indexOf(startMarker);
  if (startIdx === -1) return null;
  const endIdx = content.indexOf(endMarker, startIdx);
  if (endIdx === -1) return null;
  return content.substring(startIdx, endIdx + endMarker.length);
}

const startMarker = 'const handleGenerateIRN =';
const endMarker = '}, [recentOrders, receiptSearchQuery, receiptsSortField, receiptsSortDirection]);';

const cleanBlock = getRangeBlock(cleanContent, startMarker, endMarker);
const dirtyBlock = getRangeBlock(dirtyContent, startMarker, endMarker);

let healedContent = dirtyContent;

if (cleanBlock && dirtyBlock) {
  console.log('Healing handleGenerateIRN + filteredOrders range...');
  healedContent = healedContent.replace(dirtyBlock, cleanBlock);
} else {
  console.error('Could not find range in clean or dirty file');
}

// Also heal exportToExcel
function extractFunctionBlock(content, searchStr) {
  const startIndex = content.indexOf(searchStr);
  if (startIndex === -1) return null;
  const braceStart = content.indexOf('{', startIndex);
  if (braceStart === -1) return null;
  let braceCount = 1;
  let index = braceStart + 1;
  while (braceCount > 0 && index < content.length) {
    const char = content[index];
    if (char === '{') braceCount++;
    else if (char === '}') braceCount--;
    index++;
  }
  return content.substring(startIndex, index);
}

const cleanExcel = extractFunctionBlock(cleanContent, 'const exportToExcel =');
const dirtyExcel = extractFunctionBlock(dirtyContent, 'const exportToExcel =');

if (cleanExcel && dirtyExcel) {
  console.log('Healing exportToExcel block...');
  healedContent = healedContent.replace(dirtyExcel, cleanExcel);
}

fs.writeFileSync('pos-app/src/App.jsx', healedContent, 'utf8');
console.log('Finished healing App.jsx. Saved to pos-app/src/App.jsx');
