const { execSync } = require('child_process');

const searchWord = 'metallicSteel';
try {
  const commits = execSync('git log --oneline', { cwd: 'c:/Users/Sajad/Desktop/SaSLoop/pos-app' }).toString().split('\n');
  console.log(`Found ${commits.length} commits in git log`);
  
  for (let commit of commits) {
    if (!commit.trim()) continue;
    const sha = commit.split(' ')[0];
    try {
      const diff = execSync(`git show ${sha}`, { cwd: 'c:/Users/Sajad/Desktop/SaSLoop/pos-app' }).toString();
      if (diff.includes(searchWord)) {
        console.log(`FOUND in commit: ${commit}`);
        // print a few lines around
        const lines = diff.split('\n');
        lines.forEach((line, idx) => {
          if (line.includes(searchWord)) {
            console.log(`Line ${idx}: ${line.slice(0, 100)}`);
          }
        });
      }
    } catch (e) {
      // ignore
    }
  }
} catch (e) {
  console.error("Git log failed:", e);
}
