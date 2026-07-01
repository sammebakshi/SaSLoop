const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, 'apply_remaining_permissions.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');
const lines = scriptContent.split('\n');

for (let i = 520; i < 600; i++) {
    console.log(`${i}: "${lines[i]}"`);
}
