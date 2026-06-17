const fs = require('fs');
const readline = require('readline');

const logFilePath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

async function search() {
    const fileStream = fs.createReadStream(logFilePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        if (line.toLowerCase().includes('jadx')) {
            try {
                const parsed = JSON.parse(line);
                console.log(`Step ${parsed.step_index} [${parsed.type}]:`);
                if (parsed.tool_calls) {
                    parsed.tool_calls.forEach(tc => {
                        if (tc.name === 'run_command') {
                            console.log(`  Command: ${tc.args.CommandLine}`);
                        }
                    });
                }
                if (parsed.content) {
                    console.log(`  Content snippet: ${parsed.content.slice(0, 300)}`);
                }
            } catch (e) {
                // ignore
            }
        }
    }
}

search();
