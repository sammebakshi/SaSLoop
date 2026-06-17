const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const targets = [
  'HEAD',
  'cd047d6',
  'a3d37a5',
  '1d041b7',
  '4ae56a5c6156d4ef6a4473761c79f7bc2bbae3a0',
  '488a1fbb6d20695c606600465e5ab282e55a5a05',
  '50cc67dd0310121309cd6e2da7afcba9d548fc34'
];

targets.forEach(target => {
  console.log(`\n========================================`);
  console.log(`Inspecting target: ${target}`);
  try {
    const buf = execSync(`git show ${target}:pos-app/src/App.jsx`, { maxBuffer: 50 * 1024 * 1024 });
    console.log(`Raw buffer size: ${buf.length} bytes`);
    
    // Try decoding as UTF-16LE
    let content = buf.toString('utf16le');
    if (!content.includes('import') && !content.includes('function')) {
      content = buf.toString('utf8');
    }
    
    console.log(`Decoded string length: ${content.length} characters`);
    
    const keywords = [
      'logo',
      '8484089744',
      '8494089744',
      'mergeCartItems',
      'quickBillPrintKot',
      'Award'
    ];
    
    keywords.forEach(kw => {
      const regex = new RegExp(kw, 'gi');
      let count = 0;
      while (regex.exec(content)) count++;
      console.log(`  Keyword "${kw}": found ${count} times`);
    });
    
    // Save to scratch as backup if interesting
    if (content.includes('mergeCartItems')) {
      const dest = path.join(__dirname, `App_commit_${target}.jsx`);
      fs.writeFileSync(dest, content, 'utf8');
      console.log(`  Saved to ${dest}`);
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
});
