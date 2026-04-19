const fs = require('fs');
const path = require('path');

const walk = dir => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    if(file.includes('node_modules') || file.includes('.git')) return;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      results.push(file);
    }
  });
  return results;
}

const files = walk(__dirname);
let totalReplaced = 0;

files.forEach(f => {
  // Only target typical text files
  if (f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.html') || f.endsWith('.json')) {
    let content = fs.readFileSync(f, 'utf8');
    let hasChanges = false;
    
    if (content.includes('SaSLoop') || content.includes('SaSLoop')) {
      // Replaces UI occurences
      content = content.replace(/SaSLoop/g, 'SaSLoop');
      content = content.replace(/SaSLoop/g, 'SaSLoop');
      hasChanges = true;
    }

    if (hasChanges) {
      fs.writeFileSync(f, content);
      totalReplaced++;
      console.log('Replaced in:', f);
    }
  }
});
console.log('Total files replaced: ' + totalReplaced);
