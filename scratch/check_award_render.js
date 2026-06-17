const fs = require('fs');
const path = require('path');

const files = {
  'App.jsx (current)': path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx'),
  'App_reconstructed.jsx (yesterday)': path.join(__dirname, 'App_reconstructed.jsx')
};

for (const [name, filePath] of Object.entries(files)) {
  console.log(`\n=== Award usage in ${name} ===`);
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist');
    continue;
  }
  
  const buf = fs.readFileSync(filePath);
  let content = buf.toString('utf16le');
  if (!content.includes('import') && !content.includes('function')) {
    content = buf.toString('utf8');
  }

  // Look for <Award
  let idx = 0;
  let count = 0;
  while ((idx = content.indexOf('<Award', idx)) > -1) {
    count++;
    console.log(`Occurrence ${count} at index ${idx}:`);
    console.log(content.substring(idx - 100, idx + 100).replace(/\n/g, ' '));
    idx += 6;
  }
  console.log(`Total usages of <Award: ${count}`);
}
