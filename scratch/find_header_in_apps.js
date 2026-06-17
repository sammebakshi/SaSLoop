const fs = require('fs');
const path = require('path');

const files = {
  'App.jsx (current)': path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx'),
  'App_reconstructed.jsx (yesterday)': path.join(__dirname, 'App_reconstructed.jsx')
};

for (const [name, filePath] of Object.entries(files)) {
  console.log(`\n=== Header area of ${name} ===`);
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist');
    continue;
  }
  
  const buf = fs.readFileSync(filePath);
  let content = buf.toString('utf16le');
  if (!content.includes('import') && !content.includes('function')) {
    content = buf.toString('utf8');
  }

  // Look for title bar content, typically has "Need quick support?" or "no-drag"
  const anchor = 'Need quick support?';
  const idx = content.indexOf(anchor);
  if (idx > -1) {
    const start = Math.max(0, idx - 1000);
    const end = Math.min(content.length, idx + 1000);
    console.log(content.substring(start, end));
  } else {
    // Try another anchor, like "no-drag"
    const idx2 = content.indexOf('no-drag');
    if (idx2 > -1) {
      const start = Math.max(0, idx2 - 500);
      const end = Math.min(content.length, idx2 + 1500);
      console.log(content.substring(start, end));
    } else {
      console.log('Anchor not found');
    }
  }
}
