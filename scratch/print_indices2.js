const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, 'apply_remaining_permissions.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');
const lines = scriptContent.split('\n');

for (let i = 865; i < lines.length; i++) {
    console.log(`${i}: "${lines[i]}"`);
}
