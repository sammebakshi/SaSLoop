const fs = require('fs');
const path = require('path');

function searchFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'build' && file !== '.gradle') {
        searchFiles(fullPath);
      }
    } else if (file.toLowerCase().includes('preview')) {
      console.log('Found:', fullPath);
    }
  }
}

searchFiles('c:/Users/Sajad/Desktop/SaSLoop/sasloop-android');
