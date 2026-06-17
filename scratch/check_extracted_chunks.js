const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('scratch').filter(f => f.startsWith('chunk_step_') && f.endsWith('.txt'));
console.log(`Found ${files.length} chunk files.`);

files.forEach(f => {
    const filePath = path.join('scratch', f);
    const content = fs.readFileSync(filePath, 'utf8');
    const rangeMatch = content.match(/Showing lines (\d+) to (\d+)/);
    if (rangeMatch) {
        console.log(`${f}: lines ${rangeMatch[1]} to ${rangeMatch[2]} (Total lines matched: ${content.split('\n').length})`);
    } else {
        console.log(`${f}: no range found`);
    }
});
