const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('scratch').filter(f => f.startsWith('chunk_step_')).sort((a, b) => {
    const na = parseInt(a.match(/\d+/)[0]);
    const nb = parseInt(b.match(/\d+/)[0]);
    return na - nb;
});

files.forEach(f => {
    const raw = fs.readFileSync('scratch/' + f, 'utf8');
    const firstLines = raw.split('\n').slice(0, 5).join('\n');
    console.log(`=== File: ${f} (size: ${raw.length}) ===`);
    console.log(firstLines);
    console.log('----------------------------------------');
});
