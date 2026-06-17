const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'pos-app', 'src');
const files = fs.readdirSync(srcDir)
  .filter(file => file.toLowerCase().includes('app') && file.endsWith('.jsx'))
  .map(file => path.join(srcDir, file));

console.log(`Analyzing ${files.length} files in pos-app/src:`);

files.forEach(filePath => {
  const stats = fs.statSync(filePath);
  const buf = fs.readFileSync(filePath);
  
  // Try UTF-16LE, fallback to UTF-8
  let content = buf.toString('utf16le');
  if (!content.includes('import') && !content.includes('function')) {
    content = buf.toString('utf8');
  }
  
  console.log(`\n========================================`);
  console.log(`File: ${path.basename(filePath)}`);
  console.log(`Size: ${stats.size} bytes`);
  console.log(`Modified: ${stats.mtime.toISOString()}`);

  // 1. Logo
  const logoMatches = [];
  const logoRegex = /logo\.png/gi;
  let match;
  while ((match = logoRegex.exec(content))) {
    const start = Math.max(0, match.index - 50);
    const end = Math.min(content.length, match.index + 50);
    logoMatches.push(content.substring(start, end).replace(/\n/g, ' '));
  }
  console.log(`- Logo.png references (${logoMatches.length}):`);
  logoMatches.forEach(m => console.log(`  ...${m}...`));

  // 2. Phone numbers
  const phoneRegex = /(?:\+91|91)?\s*[7-9]\d{9}/g;
  const phones = content.match(phoneRegex) || [];
  const uniquePhones = [...new Set(phones)];
  console.log(`- Phone numbers found:`, uniquePhones);

  // 3. Quick bill subtabs
  const quickBillSubtabs = content.includes('quickBillPrintKot') || content.includes('quickBillPrintBill');
  console.log(`- Has Quick Bill checkboxes/state:`, quickBillSubtabs);
  
  // 4. Merge
  const hasMergeCartItems = content.includes('mergeCartItems');
  console.log(`- Has mergeCartItems function:`, hasMergeCartItems);
  
  // 5. Ribbon/Award
  const hasRibbon = content.includes('Award') || content.includes('ribbon');
  console.log(`- Has Award/Ribbon icon:`, hasRibbon);

  // 6. Table icon selector
  // Let's check where the table icon selector is enabled in all order types
  // The table icon is typically rendered conditionally, e.g. activeOrderType === 'DineIn'
  // Let's see if the file has any changes to this condition
  const hasTableSelectorDineInOnly = content.includes("orderType === 'DineIn'") || content.includes("orderType === 'Dine In'");
  console.log(`- Has 'DineIn' restricted table condition:`, hasTableSelectorDineInOnly);
});
