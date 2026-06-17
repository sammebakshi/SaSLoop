const fs = require('fs');
const path = require('path');

const files = {
  'App.jsx (current)': path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx'),
  'App_reconstructed.jsx (yesterday)': path.join(__dirname, 'App_reconstructed.jsx')
};

for (const [name, filePath] of Object.entries(files)) {
  console.log(`\n=== Sidebar logo area of ${name} ===`);
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist');
    continue;
  }
  
  const buf = fs.readFileSync(filePath);
  let content = buf.toString('utf16le');
  if (!content.includes('import') && !content.includes('function')) {
    content = buf.toString('utf8');
  }

  const idx = content.indexOf('w-[38px] h-[38px] object-contain rounded-xl');
  if (idx > -1) {
    const start = Math.max(0, idx - 400);
    const end = Math.min(content.length, idx + 800);
    console.log(content.substring(start, end));
  } else {
    console.log('w-[38px] logo class not found');
  }
}
