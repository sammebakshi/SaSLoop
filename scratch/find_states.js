const fs = require('fs');
const path = require('path');

const appJsxPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(appJsxPath, 'utf8');
const lines = content.split('\n');

console.log("Searching for 'backendQrs':");
lines.forEach((line, idx) => {
    if (line.includes('backendQrs')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});

console.log("\nSearching for 'settingsActiveTab':");
lines.forEach((line, idx) => {
    if (line.includes('settingsActiveTab') && (line.includes('const') || line.includes('let') || line.includes('var') || line.includes('useState'))) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
