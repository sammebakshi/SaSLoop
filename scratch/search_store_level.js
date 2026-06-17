const fs = require('fs');
const readline = require('readline');
const path = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\a9c9d4d4-89c8-41c4-936e-e1a3f7a2ab0c\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
    input: fs.createReadStream(path),
    terminal: false
});

let matches = [];
rl.on('line', (line) => {
    try {
        const obj = JSON.parse(line);
        const str = JSON.stringify(obj);
        if (str.toLowerCase().includes('store level access') || str.toLowerCase().includes('store-level access')) {
            matches.push(obj);
        }
    } catch (e) {}
});

rl.on('close', () => {
    matches.forEach(m => {
        console.log(`--- MATCH STEP ${m.step_index} (${m.source} - ${m.type}) ---`);
        if (m.content) console.log(m.content.slice(0, 1000));
        if (m.tool_calls) console.log(JSON.stringify(m.tool_calls));
    });
});
