const fs = require('fs');
const content = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx', 'utf8');
const lines = content.split('\n');
const names = ['isModuleAllowed', 'isTabAllowed', 'getDashboardAccess', 'checkPosAccess'];
lines.slice(900, 2995).forEach((line, idx) => {
  const lineNum = idx + 901;
  names.forEach(name => {
    if (line.includes(name)) {
      console.log(`Line ${lineNum}: ${line.trim()}`);
    }
  });
});
