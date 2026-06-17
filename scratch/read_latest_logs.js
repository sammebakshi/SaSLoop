const fs = require('fs');
const readline = require('readline');
const path = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\a9c9d4d4-89c8-41c4-936e-e1a3f7a2ab0c\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
    input: fs.createReadStream(path),
    terminal: false
});

let lines = [];
rl.on('line', (line) => {
    lines.push(line);
});

rl.on('close', () => {
    console.log("Total lines in log:", lines.length);
    for (let i = 0; i < lines.length; i++) {
        try {
            const obj = JSON.parse(lines[i]);
            if (obj.source === 'MODEL' && obj.thinking) {
                const low = obj.thinking.toLowerCase();
                if (low.includes('image') || low.includes('screenshot') || low.includes('png') || low.includes('toggle')) {
                    console.log(`--- STEP ${obj.step_index} (MODEL THINKING) ---`);
                    console.log(obj.thinking);
                    console.log('\n');
                }
            }
        } catch (e) {}
    }
});
