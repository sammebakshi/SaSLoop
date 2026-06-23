const fs = require('fs');

const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

lines.forEach((line, idx) => {
  if (line.includes('TransitionSplashScreen')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
