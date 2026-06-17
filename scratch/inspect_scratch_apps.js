const fs = require('fs');
const path = require('path');

const scratchDir = path.join(__dirname);
const files = [
  'App_working_backup_v2.jsx',
  'App_staged.jsx',
  'App_git_staged.jsx',
  'App_clean.jsx',
  'App_reconstructed.jsx',
  'App_reconstructed_context.jsx',
  'App_reconstructed_parsed.jsx'
].map(file => path.join(scratchDir, file));

console.log(`Analyzing files in scratch:`);

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`\nFile does not exist: ${path.basename(filePath)}`);
    return;
  }
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
  
  // Check truncation
  const hasTruncated = content.includes('truncated');
  console.log(`- Contains word 'truncated': ${hasTruncated}`);
  if (hasTruncated) {
    // find index and lines containing it
    const lines = content.split('\n');
    lines.forEach((l, li) => {
      if (l.includes('truncated')) {
        console.log(`  Line ${li + 1}: ${l.trim()}`);
      }
    });
  }

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
  const hasTableSelectorDineInOnly = content.includes("orderType === 'DineIn'") || content.includes("orderType === 'Dine In'");
  console.log(`- Has 'DineIn' restricted table condition:`, hasTableSelectorDineInOnly);
});
