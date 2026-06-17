const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\832fe37e-cc6a-4502-a268-fc8186b73341\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
    input: fs.createReadStream(logPath),
    crlfDelay: Infinity
});

let lines = [];
rl.on('line', (line) => {
    lines.push(line);
});

rl.on('close', () => {
    console.log(`Total steps: ${lines.length}`);
    for (let i = 0; i < lines.length; i++) {
        try {
            const data = JSON.parse(lines[i]);
            const step = data.step_index !== undefined ? data.step_index : i;
            if (data.source === 'USER_EXPLICIT' && data.type === 'USER_INPUT') {
                console.log(`\n--- STEP ${step} (USER) ---`);
                console.log(data.content);
            }
        } catch (e) {
            // ignore
        }
    }
});
