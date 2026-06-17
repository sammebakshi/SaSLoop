const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
    input: fs.createReadStream(logPath),
    crlfDelay: Infinity
});

let stepCount = 0;
rl.on('line', (line) => {
    stepCount++;
    try {
        const data = JSON.parse(line);
        if (data.type === 'PLANNER_RESPONSE' && data.tool_calls) {
            for (let tc of data.tool_calls) {
                if (tc.name === 'write_to_file') {
                    console.log(`Step ${stepCount} (Index ${data.step_index}): write_to_file to ${tc.args.TargetFile}`);
                }
            }
        }
    } catch (e) {
        // ignore
    }
});
