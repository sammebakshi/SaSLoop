
const fs = require('fs');
const path = 'c:/Users/Sajad/Desktop/SaSLoop/backend/SaSLoop-dashboard/src/pages/DigitalCatalog.jsx';
let content = fs.readFileSync(path, 'utf8');

const lines = content.split('\n');
// We want to remove the handleAiScan that starts with FormData
// It's the one that has /api/catalog/ai-scan
let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const handleAiScan = async (file) =>') && lines[i+4] && lines[i+4].includes('const formData = new FormData()')) {
        startIndex = i;
    }
    if (startIndex !== -1 && lines[i].includes('};') && i > startIndex) {
        endIndex = i;
        break;
    }
}

if (startIndex !== -1 && endIndex !== -1) {
    lines.splice(startIndex, endIndex - startIndex + 1);
    fs.writeFileSync(path, lines.join('\n'));
    console.log("Removed old handleAiScan!");
} else {
    console.log("Could not find old handleAiScan");
}
