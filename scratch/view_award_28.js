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

const idx = content.indexOf('size={28}');
if (idx > -1) {
  console.log(content.substring(idx - 400, idx + 800));
} else {
  console.log('size={28} not found');
}
