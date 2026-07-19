const fs = require('fs');
const path = require('path');

const appJsxPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(appJsxPath, 'utf8');

const lines = content.split(/\r?\n/);
const start = 20135;
const end = 20145;

for (let i = start; i <= end; i++) {
  const line = lines[i - 1];
  console.log(`Line ${i}: length=${line.length}, spaces=${line.search(/\S/)}, content=${JSON.stringify(line)}`);
}
