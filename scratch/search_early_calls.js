const fs = require('fs');
const content = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx', 'utf8');
const lines = content.split('\n');
const names = ['isModuleAllowed', 'isTabAllowed', 'getDashboardAccess', 'checkPosAccess'];
lines.slice(0, 2995).forEach((line, idx) => {
  const lineNum = idx + 1;
  // Ignore declarations (lines where the function is defined: const isModuleAllowed = ...)
  if (line.includes('const isModuleAllowed') || line.includes('const isTabAllowed') || line.includes('const getDashboardAccess') || line.includes('const checkPosAccess')) {
    return;
  }
  names.forEach(name => {
    if (line.includes(name)) {
      console.log(`Line ${lineNum}: ${line.trim()}`);
    }
  });
});
