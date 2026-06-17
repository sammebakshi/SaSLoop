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
        if (obj.step_index >= 1330 && obj.step_index <= 1540) {
            matches.push(obj);
        }
    } catch (e) {}
});

rl.on('close', () => {
    matches.forEach(m => {
        if (m.type === 'USER_INPUT' || m.type === 'PLANNER_RESPONSE') {
            console.log(`--- STEP ${m.step_index} (${m.source} - ${m.type}) ---`);
            if (m.thinking) console.log(`[THINK]: ${m.thinking.slice(0, 300)}...`);
            if (m.content) console.log(`[CONTENT]: ${m.content.slice(0, 500)}...`);
        }
    });
});
