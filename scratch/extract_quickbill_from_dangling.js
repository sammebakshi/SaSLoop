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
  try {
    const showHeader = execSync(`git show --quiet --pretty=format:"%h - %an : %s" ${commit}`).toString().trim();
    console.log(`Commit ${commit.substring(0, 8)} | ${showHeader}`);
    
    // Check if App.jsx content in this commit has quickBillPrint
    const content = execSync(`git show ${commit}:pos-app/src/App.jsx`, { maxBuffer: 15 * 1024 * 1024 }).toString('utf8');
    if (content.includes('quickBillPrintKot') || content.includes('quickBillPrintBill') || content.includes('mergeCartItems')) {
      console.log(`  🌟 FOUND IN COMMIT ${commit.substring(0, 8)}!`);
      // Let's write this App.jsx content to a file to be able to diff it or restore it!
      const destPath = path.join(__dirname, `App_dangling_found_${commit.substring(0, 8)}.jsx`);
      fs.writeFileSync(destPath, content, 'utf8');
      console.log(`  Saved to scratch/${path.basename(destPath)}`);
    }
  } catch (e) {
    console.log(`Commit ${commit.substring(0, 8)}: error: ${e.message}`);
  }
});
