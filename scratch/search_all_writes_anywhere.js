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
                if (tc.name === 'write_to_file' || tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
                    const target = tc.args.TargetFile || tc.args.AbsolutePath || '';
                    if (target.includes('BillingScreen')) {
                        console.log(`Line ${stepCount}: Step ${data.step_index} model call ${tc.name} target: ${target}`);
                    }
                }
            });
        }
    } catch (e) {
        // ignore
    }
});
