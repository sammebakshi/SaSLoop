const fs = require('fs');
const path = require('path');

const files = [
  'check_lost_found.js',
  'find_latest_app.js',
  'inspect_commit_app_utf16.js',
  'inspect_dangling_commits.js',
  'inspect_git_diff.js',
  'inspect_scratch_apps.js'
];

files.forEach(filename => {
  const filePath = path.join(__dirname, filename);
  if (!fs.existsSync(filePath)) return;
  console.log(`\n=== File: ${filename} ===`);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, lineNum) => {
    if (line.toLowerCase().includes('quickbillprint')) {
      console.log(`Line ${lineNum + 1}: ${line.trim()}`);
    }
  });
});
