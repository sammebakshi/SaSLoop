const fs = require('fs');

const files = fs.readdirSync('scratch').filter(f => f.startsWith('chunk_step_')).sort((a, b) => {
    const na = parseInt(a.match(/\d+/)[0]);
    const nb = parseInt(b.match(/\d+/)[0]);
    return na - nb;
});

files.forEach(f => {
    const raw = fs.readFileSync('scratch/' + f, 'utf8');
    const lines = raw.split('\n');
    let startLine = null;
    let endLine = null;
    
    // Find the first and last line number in format "<num>: "
    lines.forEach(l => {
        const match = l.match(/^\s*(\d+):/);
        if (match) {
            const num = parseInt(match[1]);
            if (startLine === null || num < startLine) startLine = num;
            if (endLine === null || num > endLine) endLine = num;
        }
    });
    
    console.log(`${f}: Lines ${startLine} to ${endLine}`);
});
