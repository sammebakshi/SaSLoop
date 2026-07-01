const { execSync } = require('child_process');

console.log("Searching git commit messages and diffs for 'temp' and 'pickup' or 'delivery'...");

try {
  const commits = execSync('git log -n 50 --oneline', { encoding: 'utf8' }).trim().split('\n');
  
  for (const commit of commits) {
    const hash = commit.split(' ')[0];
    const subject = commit.substring(hash.length + 1);
    
    const diff = execSync(`git show ${hash} -- pos-app/src/App.jsx`, { maxBuffer: 10 * 1024 * 1024, encoding: 'utf8' });
    if (diff.toLowerCase().includes('is_temporary') && (diff.toLowerCase().includes('pickup') || diff.toLowerCase().includes('delivery'))) {
      console.log(`Commit: ${hash} - ${subject} MATCHED`);
    }
  }
} catch (e) {
  console.error("Error searching git history:", e);
}
