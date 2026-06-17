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

    for await (const line of rl) {
        try {
            const step = JSON.parse(line);
            if (step.tool_calls) {
                for (const tc of step.tool_calls) {
                    if (tc.name === 'view_file' && tc.args.AbsolutePath && tc.args.AbsolutePath.includes('BillingScreen.kt')) {
                        console.log(`Step ${step.step_index}: StartLine=${tc.args.StartLine}, EndLine=${tc.args.EndLine}`);
                    }
                }
            }
        } catch (e) {
            // Ignore parse errors
        }
    }
}
main();
