const fs = require('fs');
const readline = require('readline');
const path = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\a9c9d4d4-89c8-41c4-936e-e1a3f7a2ab0c\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
    input: fs.createReadStream(path),
    terminal: false
});

let found = [];
rl.on('line', (line) => {
    try {
        const obj = JSON.parse(line);
        if (obj.step_index >= 2013 && obj.step_index <= 2018) {
            found.push(obj);
        }
    } catch (e) {}
});

rl.on('close', () => {
    found.forEach(f => {
        console.log(`--- STEP ${f.step_index} (${f.source} - ${f.type}) ---`);
        if (f.thinking) console.log(`[THINKING]: ${f.thinking.slice(0, 500)}...`);
        if (f.content) console.log(`[CONTENT]: ${f.content.slice(0, 1000)}...`);
        if (f.tool_calls) console.log(`[TOOL CALLS]: ${JSON.stringify(f.tool_calls)}`);
    });
});
