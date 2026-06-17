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
        if (obj.step_index >= 2150 && obj.step_index <= 2200) {
            found.push(obj);
        }
    } catch (e) {}
});

rl.on('close', () => {
    found.forEach(f => {
        console.log(`--- STEP ${f.step_index} (${f.source} - ${f.type}) ---`);
        if (f.thinking) console.log(`[THINK]: ${f.thinking.slice(0, 300)}...`);
        if (f.content) console.log(`[CONTENT]: ${f.content.slice(0, 800)}...`);
    });
});
