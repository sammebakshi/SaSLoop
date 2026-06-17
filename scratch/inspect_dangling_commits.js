const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const commits = [
  '4ae56a5c6156d4ef6a4473761c79f7bc2bbae3a0',
  '488a1fbb6d20695c606600465e5ab282e55a5a05',
  '50cc67dd0310121309cd6e2da7afcba9d548fc34',
  '9f0c3eab7903f96fce3d12be7da27e2518eb4524',
  'd5aeb461138dd674a3f1d8b484bd9ebf7d97255c',
  '2df6c1a6320361006e81990db9694e6c94e8a452'
];

commits.forEach(commit => {
  console.log(`\n========================================`);
  console.log(`Commit: ${commit}`);
  try {
    const showHeader = execSync(`git show --quiet --pretty=format:"%h - %an, %ar : %s" ${commit}`).toString().trim();
    console.log(`Header: ${showHeader}`);
    
    // Let's see if this commit modified App.jsx
    const showFiles = execSync(`git diff-tree --no-commit-id --name-only -r ${commit}`).toString().trim();
    console.log(`Files modified:\n${showFiles}`);
    
    if (showFiles.includes('App.jsx')) {
      console.log(`--> This commit modified App.jsx! Let's check keywords.`);
      const content = execSync(`git show ${commit}:pos-app/src/App.jsx`, { maxBuffer: 10 * 1024 * 1024 }).toString('utf8');
      
      const keywords = ['logo', '8484089744', '8494089744', 'mergeCartItems', 'quickBillPrintKot', 'Award'];
      const results = {};
      keywords.forEach(kw => {
        results[kw] = content.includes(kw);
      });
      console.log('    Keywords status:', results);
      
      // Save to scratch as backup if it has interesting features
      if (content.includes('mergeCartItems')) {
        const dest = path.join(__dirname, `App_dangling_${commit.substring(0, 8)}.jsx`);
        fs.writeFileSync(dest, content, 'utf8');
        console.log(`    SAVED to ${dest}`);
      }
    }
  } catch (e) {
    console.log(`Error showing commit: ${e.message}`);
  }
});
