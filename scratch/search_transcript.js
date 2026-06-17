const fs = require('fs');
const readline = require('readline');
const path = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\a9c9d4d4-89c8-41c4-936e-e1a3f7a2ab0c\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
    input: fs.createReadStream(path),
    output: process.stdout,
    terminal: false
});

let lines = [];
rl.on('line', (line) => {
    try {
        const obj = JSON.parse(line);
        if (obj.step_index >= 2010 && obj.step_index <= 2025) {
            lines.push(obj);
        }
    } catch (e) {}
});

rl.on('close', () => {
    console.log(JSON.stringify(lines, null, 2));
});
