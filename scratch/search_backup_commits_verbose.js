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
    const contentBuf = execSync(`git show ${commit.hash}:pos-app/src/App.jsx`, { cwd: backupRepo, maxBuffer: 1024 * 1024 * 15 });
    
    // Check both encodings
    const contentUtf8 = contentBuf.toString('utf8');
    const contentUtf16 = contentBuf.toString('utf16le');
    
    const countUtf8 = (contentUtf8.match(/mergeCartItems/gi) || []).length;
    const countUtf16 = (contentUtf16.match(/mergeCartItems/gi) || []).length;
    
    if (countUtf8 > 0 || countUtf16 > 0) {
      console.log(`🎉 Found mergeCartItems in commit ${commit.hash} (${commit.msg})!`);
      console.log(`Occurrences: UTF8=${countUtf8}, UTF16=${countUtf16}`);
      fs.writeFileSync(`scratch/App_recovered_backup_${commit.hash}.jsx`, contentBuf);
      console.log(`Saved recovered file to scratch/App_recovered_backup_${commit.hash}.jsx`);
      break;
    }
  } catch (e) {
    if (!e.message.includes('exists on disk') && !e.message.includes('exists in')) {
      console.error(`Error at commit ${commit.hash}:`, e.message);
    }
  }
}
console.log('Search completed.');
