const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

async function main() {
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lineNum = 0;
    for await (const line of rl) {
        lineNum++;
        if (line.includes('BillingScreen.kt') && line.includes('run_command')) {
            try {
                const parsed = JSON.parse(line);
                if (parsed.tool_calls) {
                    parsed.tool_calls.forEach(tc => {
                        if (tc.name === 'run_command') {
                            console.log(`Step ${parsed.step_index}: run_command: ${tc.args.CommandLine}`);
                        }
                    });
                }
            } catch (e) {}
        }
    }
}

main();
