const fs = require('fs');
const path = require('path');

function searchFile(dir, fileName) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'build' && file !== '.gradle') {
        const found = searchFile(fullPath, fileName);
        if (found) return found;
      }
    } else if (file === fileName) {
      return fullPath;
    }
  }
  return null;
}

const foundPath = searchFile('c:/Users/Sajad/Desktop/SaSLoop/sasloop-android', 'ViewModels.kt');
console.log('Found ViewModels.kt at:', foundPath);
