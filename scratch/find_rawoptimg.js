const fs = require('fs');

const appPath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
const content = fs.readFileSync(appPath, 'utf8');

const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('let rawOptImg')) {
        console.log(`Line ${idx + 1}: ${line}`);
        for (let i = idx; i <= idx + 25 && i < lines.length; i++) {
            console.log(`${i + 1}: ${lines[i]}`);
        }
    }
});
