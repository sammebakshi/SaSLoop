const fs = require('fs');
const path = require('path');

const files = {
  'App.jsx (current)': path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx'),
  'App_reconstructed.jsx (yesterday)': path.join(__dirname, 'App_reconstructed.jsx')
};

for (const [name, filePath] of Object.entries(files)) {
  console.log(`\n=== Sub-tabs rendering in ${name} ===`);
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist');
    continue;
  }
  
  const buf = fs.readFileSync(filePath);
  let content = buf.toString('utf16le');
  if (!content.includes('import') && !content.includes('function')) {
    content = buf.toString('utf8');
  }

  const idx = content.indexOf('Order/KOT');
  if (idx > -1) {
    // Look at 1000 characters before the first "Order/KOT" to see the enclosing container conditions
    const start = Math.max(0, idx - 500);
    const end = Math.min(content.length, idx + 1000);
    console.log(content.substring(start, end));
  } else {
    console.log('Order/KOT not found');
  }
}
