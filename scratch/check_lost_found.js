const fs = require('fs');
const path = require('path');

const lostFoundDir = path.join(__dirname, '..', '.git', 'lost-found', 'other');

if (!fs.existsSync(lostFoundDir)) {
  console.log('lost-found/other directory does not exist yet.');
  process.exit(0);
}

const files = fs.readdirSync(lostFoundDir);
console.log(`Found ${files.length} dangling blobs in lost-found/other:`);

const matchingFiles = [];

files.forEach(file => {
  const filePath = path.join(lostFoundDir, file);
  const stats = fs.statSync(filePath);
  
  // App.jsx is typically between 1.1MB and 1.3MB
  if (stats.size > 1000000 && stats.size < 1500000) {
    matchingFiles.push({
      file,
      size: stats.size,
      mtime: stats.mtime
    });
  }
});

matchingFiles.sort((a, b) => b.mtime - a.mtime);

console.log(`\nFound ${matchingFiles.length} blobs matching App.jsx size:`);
matchingFiles.forEach(info => {
  console.log(`Blob: ${info.file}, Size: ${info.size} bytes, Modified: ${info.mtime.toISOString()}`);
  
  // Let's check some keywords in this blob
  const buf = fs.readFileSync(path.join(lostFoundDir, info.file));
  let content = buf.toString('utf16le');
  if (!content.includes('import') && !content.includes('function')) {
    content = buf.toString('utf8');
  }
  
  const keywords = ['logo', '8484089744', '8494089744', 'mergeCartItems', 'quickBillPrintKot', 'Award'];
  const results = {};
  keywords.forEach(kw => {
    results[kw] = content.includes(kw);
  });
  console.log('  Keywords status:', results);
});
