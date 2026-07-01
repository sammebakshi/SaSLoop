const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'locker_dial_splash_clean.jsx');
let code = fs.readFileSync(filePath, 'utf8');

// Insert a newline after every > character except inside certain tags, or just simple replacement
code = code.replace(/>/g, '>\n');
code = code.replace(/</g, '\n<');

// Clean up extra blank lines
const lines = code.split('\n').map(l => l.trim()).filter(l => l.length > 0);

fs.writeFileSync(path.join(__dirname, 'locker_dial_splash_formatted.jsx'), lines.join('\n'), 'utf8');
console.log('Formatted file written to locker_dial_splash_formatted.jsx');
