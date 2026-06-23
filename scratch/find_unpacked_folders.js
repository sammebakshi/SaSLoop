const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\Sajad\\Desktop\\SaSLoop';

function searchDirectory(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      let stat;
      try {
        stat = fs.statSync(fullPath);
      } catch (e) {
        return; // Skip broken symlinks or locked files
      }

      if (stat.isDirectory()) {
        if (file.toLowerCase() === 'win-unpacked' || file.toLowerCase() === 'unpacked') {
          results.push({ type: 'directory', path: fullPath });
        }
        // Don't recurse into node_modules or .git
        if (file !== 'node_modules' && file !== '.git') {
          results = results.concat(searchDirectory(fullPath));
        }
      } else {
        if (file.toLowerCase() === 'app.asar') {
          results.push({ type: 'file', path: fullPath, size: stat.size });
        }
      }
    });
  } catch (e) {
    // Ignore permissions or missing errors
  }
  return results;
}

console.log('Searching for unpacked folders and app.asar files...');
const found = searchDirectory(rootDir);
console.log(`Found ${found.length} items:`);
found.forEach(item => {
  console.log(`- [${item.type}] ${item.path} (${item.size ? (item.size / 1024 / 1024).toFixed(2) + ' MB' : ''})`);
});
