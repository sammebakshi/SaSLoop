const { execSync } = require('child_process');

const backupRepo = 'C:\\Users\\Sajad\\Desktop\\SaSLoop_Backups';

const commitsRaw = execSync('git log --oneline -n 100', { cwd: backupRepo }).toString('utf8');
const commits = commitsRaw.trim().split('\n').map(line => {
  const parts = line.split(' ');
  return { hash: parts[0], msg: parts.slice(1).join(' ') };
});

console.log(`Commit History of pos-app/src/App.jsx in backup repository:`);

for (const commit of commits) {
  try {
    const fileShow = execSync(`git show --name-only ${commit.hash}`, { cwd: backupRepo }).toString('utf8');
    if (fileShow.includes('pos-app/src/App.jsx')) {
      const stats = execSync(`git show ${commit.hash}:pos-app/src/App.jsx`, { cwd: backupRepo, maxBuffer: 1024 * 1024 * 15 });
      console.log(`Commit ${commit.hash} (${commit.msg}) - App.jsx size: ${stats.length} bytes`);
    }
  } catch (e) {
    // Ignore errors
  }
}
