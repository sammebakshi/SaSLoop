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
        if (obj.source === 'MODEL' && obj.thinking) {
            const low = obj.thinking.toLowerCase();
            if (low.includes('image') || low.includes('screenshot') || low.includes('permission')) {
                matches.push({
                    step_index: obj.step_index,
                    thinking: obj.thinking
                });
            }
        }
    } catch (e) {}
});

rl.on('close', () => {
    matches.forEach(m => {
        console.log(`--- MODEL THINKING STEP ${m.step_index} ---`);
        console.log(m.thinking.slice(0, 1000));
        console.log('\n');
    });
});
