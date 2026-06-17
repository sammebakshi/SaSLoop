const fs = require('fs');
const path = require('path');

const files = {
  'App.jsx (current)': path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx'),
  'App_reconstructed.jsx (yesterday)': path.join(__dirname, 'App_reconstructed.jsx')
};

for (const [name, filePath] of Object.entries(files)) {
  console.log(`\n=== Table selection triggers in ${name} ===`);
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist');
    continue;
  }
  
  const buf = fs.readFileSync(filePath);
  let content = buf.toString('utf16le');
  if (!content.includes('import') && !content.includes('function')) {
    content = buf.toString('utf8');
  }

  // Search for table modal triggers
  const terms = ['isTableModalOpen', 'setIsTableModalOpen', 'Table selector', 'select table', 'Select Table'];
  terms.forEach(term => {
    let idx = 0;
    let count = 0;
    while ((idx = content.indexOf(term, idx)) > -1) {
      count++;
      console.log(`  Term "${term}" Occurrence ${count} at index ${idx}:`);
      console.log(`    ...${content.substring(Math.max(0, idx - 100), Math.min(content.length, idx + 150)).replace(/\n/g, ' ')}...`);
      idx += term.length;
    }
  });
}
