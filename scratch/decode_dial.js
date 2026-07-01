const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync(path.join(__dirname, 'locker_dial_splash.jsx'), 'utf8');

// If it starts and ends with double quotes, let's extract the inside
let content = raw.trim();
if (content.startsWith('"') && content.endsWith('"')) {
    content = content.substring(1, content.length - 1);
}

// Unescape basic characters
content = content.replace(/\\n/g, '\n');
content = content.replace(/\\"/g, '"');
content = content.replace(/\\'/g, "'");
content = content.replace(/\\\\/g, '\\');

fs.writeFileSync(path.join(__dirname, 'locker_dial_splash_clean.jsx'), content, 'utf8');
console.log('Cleaned file successfully written to locker_dial_splash_clean.jsx');
