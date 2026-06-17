const fs = require('fs');
const path = require('path');

function search(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullpath = path.join(dir, file);
    if (fs.statSync(fullpath).isDirectory()) {
      search(fullpath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      const content = fs.readFileSync(fullpath, 'utf8');
      if (content.includes('function isModuleAllowed') || content.includes('const isModuleAllowed')) {
        console.log(`Found in: ${fullpath}`);
      }
    }
  });
}

console.log("Searching for isModuleAllowed definition...");
search("c:/Users/Sajad/Desktop/SaSLoop/pos-app/src");
