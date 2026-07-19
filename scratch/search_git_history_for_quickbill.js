const { execSync } = require('child_process');
const fs = require('fs');

console.log('Fetching list of all commits...');
const commits = execSync('git log --pretty=format:%H').toString().trim().split('\n');
console.log(`Found ${commits.length} commits. Scanning...`);

for (let i = 0; i < commits.length; i++) {
  const commit = commits[i];
  try {
    const showHeader = execSync(`git show --quiet --pretty=format:"%h - %an : %s" ${commit}`).toString().trim();
    
    // Check if App.jsx exists in this commit
    const hasApp = execSync(`git diff-tree --no-commit-id --name-only -r ${commit}`).toString().includes('pos-app/src/App.jsx');
    if (!hasApp) continue;
    
    const content = execSync(`git show ${commit}:pos-app/src/App.jsx`, { maxBuffer: 50 * 1024 * 1024 }).toString('utf8');
    if (content.includes('quickBillPrintKot') || content.includes('quickBillPrintBill') || content.includes('quickBillPrint')) {
      console.log(`🌟 FOUND in commit ${showHeader}`);
      fs.writeFileSync(`scratch/App_found_${commit.substring(0, 8)}.jsx`, content, 'utf8');
      console.log(`Saved to scratch/App_found_${commit.substring(0, 8)}.jsx`);
      break;
    }
  } catch (e) {
    // ignore missing files in very old commits
  }
}
console.log('Scan complete.');
