const fs = require('fs');
const path = require('path');

const editsPath = path.join(__dirname, 'all_app_edits_from_transcript.json');
if (!fs.existsSync(editsPath)) {
  console.log('Edits file does not exist');
  process.exit(1);
}

const edits = JSON.parse(fs.readFileSync(editsPath, 'utf8'));
console.log(`Loaded ${edits.length} total edits.`);

const keywords = {
  logo: ['logo', 'top-left', 'top left'],
  phone: ['8484', '8494', 'phone', 'support', 'number'],
  quickBillTabs: ['quick bill', 'quickbill', 'subtab', 'sub-tab', 'tabs', 'order/kot', 'billing tab'],
  preOrder: ['pre-order', 'pre order', 'preorder'],
  icons: ['ribbon', 'file', 'award', 'gift', '+icon'],
  tableIcon: ['table icon', 'table-icon', 'order type', 'order-type', 'table selector', 'table button'],
  mergeItems: ['merge', 'merged', 'same items', 'kot save']
};

for (const [key, patterns] of Object.entries(keywords)) {
  console.log(`\n========================================`);
  console.log(`Matching edits for category: ${key} (patterns: ${patterns.join(', ')})`);
  
  const matches = edits.filter(edit => {
    const text = (edit.description + ' ' + edit.instruction).toLowerCase();
    return patterns.some(p => text.includes(p));
  });
  
  console.log(`Found ${matches.length} matches:`);
  matches.forEach(m => {
    console.log(`  - Step ${m.stepIndex} (Edit #${edits.indexOf(m) + 1}): "${m.description}"`);
  });
}
