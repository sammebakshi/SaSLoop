const fs = require('fs');
const path = require('path');

const files = {
  'App.jsx (current)': path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx'),
  'App_reconstructed.jsx (yesterday)': path.join(__dirname, 'App_reconstructed.jsx')
};

for (const [name, filePath] of Object.entries(files)) {
  console.log(`\n=== Customer Info Header Toolbar in ${name} ===`);
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist');
    continue;
  }
  
  const buf = fs.readFileSync(filePath);
  let content = buf.toString('utf16le');
  if (!content.includes('import') && !content.includes('function')) {
    content = buf.toString('utf8');
  }

  // Look for Customer Info Header Toolbar comment
  const comment = 'Customer Info Header Toolbar';
  const idx = content.indexOf(comment);
  if (idx > -1) {
    console.log(content.substring(idx - 100, idx + 1200));
  } else {
    // Try search for Gift icon or customerPhone
    const idx2 = content.indexOf('customerPhone');
    if (idx2 > -1) {
      console.log(content.substring(idx2 - 200, idx2 + 1000));
    } else {
      console.log('Toolbar markers not found');
    }
  }
}
