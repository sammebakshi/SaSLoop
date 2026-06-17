const fs = require('fs');
const readline = require('readline');
const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

async function main() {
    if (!fs.existsSync(logPath)) {
        console.log('No log path');
        return;
    }
    const rl = readline.createInterface({
        input: fs.createReadStream(logPath),
        crlfDelay: Infinity
    });
    let count = 0;
    for await (const line of rl) {
        count++;
        const step = JSON.parse(line);
        if (step.tool_calls) {
            for (const tc of step.tool_calls) {
                console.log(`Step ${step.step_index}: Call ${tc.name} with args:`, tc.args);
            }
        }
        if (count >= 100) break;
    }
}
main();
