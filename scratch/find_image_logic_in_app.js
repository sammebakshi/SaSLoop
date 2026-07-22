const fs = require('fs');

const appPath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
const content = fs.readFileSync(appPath, 'utf8');

const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('image_url') || line.includes('rawOptImg') || line.includes('matchedById') || line.includes('item.image')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
});
