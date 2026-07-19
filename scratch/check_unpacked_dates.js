const fs = require('fs');
const path = require('path');

const releasePath = path.join(__dirname, '..', 'pos-app', 'release-v2');
if (fs.existsSync(releasePath)) {
  const dirs = fs.readdirSync(releasePath);
  dirs.forEach(d => {
    const fullPath = path.join(releasePath, d);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      console.log(`Directory: ${d}`);
      try {
        const files = fs.readdirSync(fullPath);
        const exes = files.filter(f => f.endsWith('.exe'));
        exes.forEach(e => {
          const exeStat = fs.statSync(path.join(fullPath, e));
          console.log(`  File: ${e} | Modified: ${exeStat.mtime.toISOString()} | Size: ${exeStat.size} bytes`);
        });
      } catch (err) {
        console.log(`  Error: ${err.message}`);
      }
    }
  });
} else {
  console.log('release-v2 directory not found');
}
