const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  console.log('Running git diff --cached...');
  const diff = execSync('git diff --cached pos-app/src/App.jsx', { maxBuffer: 50 * 1024 * 1024 }).toString('utf8');
  console.log('Diff length in characters:', diff.length);

  const lines = diff.split('\n');
  const addedLines = lines.filter(line => line.startsWith('+') && !line.startsWith('+++'));
  console.log('Total added lines in staged diff:', addedLines.length);

  // Search for keywords in added lines
  const keywords = ['logo', 'logo.png', '8494089744', 'quick bill', 'pre-order', 'ribbon', 'award', 'table', 'merge', 'mergeCartItems', 'quickBillPrintKot'];
  const matches = {};
  
  keywords.forEach(kw => {
    matches[kw] = [];
    addedLines.forEach((line, idx) => {
      if (line.toLowerCase().includes(kw.toLowerCase())) {
        matches[kw].push({ lineNumInDiff: idx, content: line.trim() });
      }
    });
  });

  for (const [kw, list] of Object.entries(matches)) {
    console.log(`\nKeyword "${kw}": found ${list.length} times in added lines:`);
    list.slice(0, 10).forEach(item => {
      console.log(`  - ${item.content}`);
    });
    if (list.length > 10) console.log('  ... truncated ...');
  }

  // Save the diff to a scratch file for inspection
  fs.writeFileSync(path.join(__dirname, 'staged_diff.diff'), diff, 'utf8');
  console.log('\nSaved cached diff to scratch/staged_diff.diff');

} catch (e) {
  console.error('Error running git diff:', e);
}
