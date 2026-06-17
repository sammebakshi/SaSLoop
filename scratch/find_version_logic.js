const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
if (!fs.existsSync(filePath)) {
  console.log('App.jsx does not exist');
  process.exit(1);
}

const buf = fs.readFileSync(filePath);
let content = buf.toString('utf16le');
if (!content.includes('import') && !content.includes('function')) {
  content = buf.toString('utf8');
}

const lines = content.split('\n');

console.log('=== Default version or greeting config lines ===');
lines.forEach((line, idx) => {
  if (line.includes('19.02') || line.includes('version:') || line.includes('versionConfig') || line.includes('1.0.1')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
