const fs = require('fs');
const content = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop-new/backend/SaSLoop-dashboard/src/pages/MasterAdminPanel.jsx', 'utf8');

let braces = 0;
let parens = 0;
let line = 1;

for (let i = 0; i < content.length; i++) {
  const char = content[i];
  if (char === '\n') line++;
  if (char === '{') braces++;
  if (char === '}') braces--;
  if (char === '(') parens++;
  if (char === ')') parens--;
}

console.log('Braces:', braces);
console.log('Parens:', parens);
