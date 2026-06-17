const fs = require('fs');
const path = require('path');

const appJsxPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(appJsxPath, 'utf8');
const lines = content.split('\n');

// Find lines containing "settingsActiveTab === '"
lines.forEach((line, idx) => {
    if (line.includes('settingsActiveTab === \'')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
});
