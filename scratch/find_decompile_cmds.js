const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\e546bfa7-bc22-484d-95b1-d3920d26ba0c\\.system_generated\\logs\\transcript.jsonl';

async function main() {
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        if (line.includes('run_command')) {
            try {
                const parsed = JSON.parse(line);
                if (parsed.tool_calls) {
                    for (const tc of parsed.tool_calls) {
                        if (tc.name === 'run_command' && tc.args.CommandLine.includes('jadx')) {
                            console.log(`Step ${parsed.step_index}: ${tc.args.CommandLine}`);
                        }
                    }
                }
            } catch (e) {}
        }
    }
}

main();
