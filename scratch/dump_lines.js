const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(appPath, 'utf8').replace(/\r\n/g, '\n');
const lines = content.split('\n');

for (let i = 23176; i <= 23198; i++) {
   console.log((i + 1) + ': ' + JSON.stringify(lines[i]));
}
