const { execSync } = require('child_process');
const fs = require('fs');

const backupRepo = 'C:\\Users\\Sajad\\Desktop\\SaSLoop_Backups';

// Get commit list
const commitsRaw = execSync('git log --oneline -n 100', { cwd: backupRepo }).toString('utf8');
const commits = commitsRaw.trim().split('\n').map(line => {
  const parts = line.split(' ');
  return { hash: parts[0], msg: parts.slice(1).join(' ') };
});

console.log(`Searching through ${commits.length} commits in backup repository...`);

for (const commit of commits) {
  try {
    // Show the file content at this commit
    const contentBuf = execSync(`git show ${commit.hash}:pos-app/src/App.jsx`, { cwd: backupRepo, maxBuffer: 1024 * 1024 * 20 });
    
    let content = contentBuf.toString('utf16le');
    if (!content.includes('import') && !content.includes('function')) {
      content = contentBuf.toString('utf8');
    }
    
    if (content.includes('mergeCartItems')) {
      console.log(`\n🎉 FOUND mergeCartItems in commit: ${commit.hash} - ${commit.msg}`);
      
      // Let's count occurrences
      const count = (content.match(/mergeCartItems/gi) || []).length;
      console.log(`Occurrences: ${count}`);
      
      // Write the recovered file to scratch
      fs.writeFileSync(`scratch/App_recovered_backup_${commit.hash}.jsx`, contentBuf);
      console.log(`Saved recovered file to: scratch/App_recovered_backup_${commit.hash}.jsx`);
      break; // Stop at the first (latest) commit that has it!
    }
  } catch (e) {
    // File might not exist in some old commits
  }
}
console.log('\nSearch completed.');
