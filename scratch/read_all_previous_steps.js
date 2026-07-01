const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\869abdd3-0e6d-4369-aae8-a14c86e78045\\.system_generated\\logs\\transcript.jsonl';

if (!fs.existsSync(logPath)) {
    console.error(`Log file does not exist at: ${logPath}`);
    process.exit(1);
}

const rl = readline.createInterface({
    input: fs.createReadStream(logPath),
    crlfDelay: Infinity
});

let steps = [];
rl.on('line', (line) => {
    try {
        const data = JSON.parse(line);
        steps.push(data);
    } catch(e) {}
});

rl.on('close', () => {
    console.log(`Total steps: ${steps.length}`);
    steps.forEach((data, i) => {
        const step = data.step_index || i;
        if (data.source === 'USER_EXPLICIT' && data.type === 'USER_INPUT') {
            console.log(`\n--- STEP ${step} (USER) ---`);
            console.log(data.content);
        } else if (data.source === 'MODEL' && data.type === 'PLANNER_RESPONSE') {
            console.log(`\n--- STEP ${step} (MODEL) ---`);
            if (data.content) console.log(data.content.slice(0, 300));
        }
    });
});
