const fs = require('fs');
const path = require('path');

function convertToUtf8(src, dest) {
  const content = fs.readFileSync(src, 'utf16le');
  fs.writeFileSync(dest, content, 'utf8');
}

convertToUtf8(path.join(__dirname, 'App_HEAD.jsx'), path.join(__dirname, 'App_HEAD_utf8.jsx'));
convertToUtf8(path.join(__dirname, 'App_backup_31c7593.jsx'), path.join(__dirname, 'App_backup_31c7593_utf8.jsx'));
console.log("Converted both files to UTF-8!");
