const fs = require('fs');
const path = require('path');

const files = {
  'App_git_staged.jsx (staged)': path.join(__dirname, 'App_git_staged.jsx'),
  'App.jsx (current working)': path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx'),
  'App_working_backup_v2.jsx (backup v2)': path.join(__dirname, 'App_working_backup_v2.jsx'),
  'App_backup_before_restoration.jsx': path.join(__dirname, 'App_backup_before_restoration.jsx')
};

const keywords = [
  'logo',
  '8484089744',
  '8494089744',
  '9469697216',
  'Order/KOT',
  'Billing',
  'Ribbon',
  'Gift',
  'table',
  'merged'
];

for (const [name, filePath] of Object.entries(files)) {
  console.log(`\n=== Analyzing ${name} ===`);
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist!');
    continue;
  }
  const buf = fs.readFileSync(filePath);
  let content = buf.toString('utf16le');
  if (!content.includes('import') && !content.includes('function')) {
    content = buf.toString('utf8');
  }
  console.log('File length in characters:', content.length);
  
  keywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'gi');
    let count = 0;
    while (regex.exec(content)) {
      count++;
    }
    console.log(`  Keyword "${keyword}": found ${count} times`);
  });
}
