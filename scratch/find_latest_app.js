const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, '..', 'pos-app', 'src'),
  __dirname
];

const appFiles = [];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    if (file.toLowerCase().includes('app') && file.endsWith('.jsx')) {
      appFiles.push(path.join(dir, file));
    }
  });
});

console.log(`Found ${appFiles.length} App JSX files to analyze:`);

appFiles.forEach(filePath => {
  const stats = fs.statSync(filePath);
  const buf = fs.readFileSync(filePath);
  
  // Try UTF-16LE, fallback to UTF-8
  let content = buf.toString('utf16le');
  if (!content.includes('import') && !content.includes('function')) {
    content = buf.toString('utf8');
  }
  
  console.log(`\n========================================`);
  console.log(`File: ${filePath}`);
  console.log(`Size: ${stats.size} bytes`);
  console.log(`Modified: ${stats.mtime.toISOString()}`);
  console.log(`Chars: ${content.length}`);

  // 1. Logo
  // Let's search for "logo"
  const logoMatches = [];
  const logoRegex = /logo/gi;
  let match;
  while ((match = logoRegex.exec(content))) {
    const start = Math.max(0, match.index - 50);
    const end = Math.min(content.length, match.index + 50);
    logoMatches.push(content.substring(start, end).replace(/\n/g, ' '));
  }
  console.log(`- Logo references (${logoMatches.length}):`);
  logoMatches.slice(0, 5).forEach(m => console.log(`  ...${m}...`));

  // 2. Phone numbers: 8484089744, 8494089744 or other number?
  // Let's find any 10-digit numbers starting with 8 or 9
  const phoneRegex = /(?:\+91|91)?\s*[7-9]\d{9}/g;
  const phones = content.match(phoneRegex) || [];
  const uniquePhones = [...new Set(phones)];
  console.log(`- Phone numbers found:`, uniquePhones);

  // 3. Quick bill subtabs: check if subtabs are removed or present
  const quickBillSubtabs = content.includes('quickBillPrintKot') || content.includes('quickBillPrintBill');
  console.log(`- Has Quick Bill checkboxes/state:`, quickBillSubtabs);
  const kotTabInQuickBill = content.includes('Order/KOT') && content.includes('Quick Bill');
  console.log(`- Order/KOT tab present:`, content.includes('Order/KOT'));
  
  // Let's check if the file contains the merge function
  const hasMergeCartItems = content.includes('mergeCartItems');
  console.log(`- Has mergeCartItems function:`, hasMergeCartItems);
  
  // Let's check if there is ribbon or award icon
  const hasRibbon = content.includes('Award') || content.includes('ribbon');
  console.log(`- Has Award/Ribbon icon:`, hasRibbon);
});
