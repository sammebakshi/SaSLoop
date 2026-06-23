const { execSync } = require('child_process');
const fs = require('fs');

const backupRepo = 'C:/Users/Sajad/Desktop/SaSLoop_Backups';
const commitHash = 'b4f48d8';

try {
  console.log("Fetching App.jsx from backup git commit b4f48d8...");
  const cmd = `git show ${commitHash}:pos-app/src/App.jsx`;
  const fileContent = execSync(cmd, { cwd: backupRepo, maxBuffer: 1024 * 1024 * 20, encoding: 'utf8' });
  
  console.log("File content fetched. Size:", fileContent.length);
  
  const lines = fileContent.split(/\r?\n/);
  let startLine = -1;
  let endLine = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const TransitionSplashScreen =')) {
      startLine = i;
      break;
    }
  }
  
  if (startLine !== -1) {
    for (let i = startLine; i < lines.length; i++) {
      if (lines[i].includes('const SidebarIcon =') || lines[i].includes('// --- HELPER COMPONENTS ---')) {
        endLine = i;
        break;
      }
    }
  }
  
  if (startLine !== -1 && endLine !== -1) {
    const splashCode = lines.slice(startLine, endLine).join('\n');
    fs.writeFileSync('c:/Users/Sajad/Desktop/SaSLoop/scratch/dial_from_git_b4f48d8.jsx', splashCode, 'utf8');
    console.log(`Successfully extracted dial splash code to scratch/dial_from_git_b4f48d8.jsx`);
  } else {
    console.log(`Failed to find lines. startLine: ${startLine}, endLine: ${endLine}`);
  }
  
} catch (e) {
  console.error("Error executing git show:", e);
}
