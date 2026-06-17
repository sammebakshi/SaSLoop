const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

for (let i = 19600; i < 19625; i++) {
  console.log(`${i}: [${lines[i]}]`);
}
