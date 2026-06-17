const fs = require('fs');
const path = require('path');
const dir = "c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/services";

function search(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullpath = path.join(dir, file);
    if (fs.statSync(fullpath).isDirectory()) {
      search(fullpath);
    } else {
      const content = fs.readFileSync(fullpath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.includes('getProfile') || line.includes('profile')) {
          console.log(`${file}:${idx + 1}: ${line.trim()}`);
        }
      });
    }
  });
}
search(dir);
