const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(filePath, 'utf8');

const term = 'handleChangeTable';
let idx = -1;
while ((idx = content.indexOf(term, idx + 1)) !== -1) {
  console.log(`Found '${term}' at index ${idx}:`);
  console.log(content.substring(idx - 100, idx + 600));
}
