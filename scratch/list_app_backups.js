const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\Sajad\\Desktop\\SaSLoop';
const scratchDir = path.join(projectDir, 'scratch');

function check() {
  const files = fs.readdirSync(scratchDir);
  console.log("Files in scratch containing 'app' or 'backup' or 'reconstruct' or 'pos' (case-insensitive):");
  files.forEach(f => {
    const fLower = f.toLowerCase();
    if (fLower.includes('app') || fLower.includes('backup') || fLower.includes('reconstruct') || fLower.includes('pos')) {
      const stats = fs.statSync(path.join(scratchDir, f));
      console.log(`- ${f} (${stats.size} bytes, modified: ${stats.mtime})`);
    }
  });
}

check();
