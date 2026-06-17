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
        if (data.tool_calls) {
            data.tool_calls.forEach(tc => {
                if (tc.name === 'run_command') {
                    const cmd = tc.args.CommandLine;
                    if (cmd.includes('restore_billing_screen') || cmd.includes('extract_tabs') || cmd.includes('BillingScreen')) {
                        console.log(`Line ${stepCount}: Step ${data.step_index} model ran command: ${cmd}`);
                    }
                }
            });
        }
        if (data.type === 'RUN_COMMAND' && data.content && (data.content.includes('restore_billing_screen') || data.content.includes('extract_tabs'))) {
            console.log(`Line ${stepCount}: Step ${data.step_index} command output: ${data.content.slice(0, 300).replace(/\n/g, '\\n')}`);
        }
    } catch (e) {
        // ignore
    }
});
