const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(filePath, 'utf8');

const term = 'Found cart.map(item at index: 592539';
let idx = 592539;
console.log(content.substring(idx - 1500, idx + 1500));
