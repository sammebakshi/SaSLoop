const fs = require('fs');
const readline = require('readline');
const path = require('path');

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
            const step = data.step_index || i;
            if (step >= 2000 && step <= 2700) {
                if (data.source === 'USER_EXPLICIT' && data.type === 'USER_INPUT') {
                    console.log(`\n--- STEP ${step} (USER) ---`);
                    console.log(data.content);
                } else if (data.source === 'MODEL' && data.type === 'PLANNER_RESPONSE') {
                    console.log(`\n--- STEP ${step} (MODEL) ---`);
                    if (data.content) console.log(data.content.slice(0, 500));
                    if (data.tool_calls) {
                        data.tool_calls.forEach(t => {
                            console.log(`Tool: ${t.name}`);
                            if (t.args && t.args.Instruction) console.log(`Instruction: ${t.args.Instruction}`);
                            if (t.args && t.args.CommandLine) console.log(`Command: ${t.args.CommandLine}`);
                        });
                    }
                }
            }
        } catch (e) {
            // ignore
        }
    }
});
