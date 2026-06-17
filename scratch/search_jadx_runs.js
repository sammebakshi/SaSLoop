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
        if (line.includes('jadx') || line.includes('decompiled_original')) {
            try {
                const parsed = JSON.parse(line);
                console.log(`Step ${parsed.step_index}:`);
                if (parsed.tool_calls) {
                    for (const tc of parsed.tool_calls) {
                        console.log(`  Tool call: ${tc.name}`);
                        if (tc.args && tc.args.CommandLine) {
                            console.log(`    Cmd: ${tc.args.CommandLine}`);
                        }
                    }
                }
                if (parsed.content) {
                    console.log(`  Content snippet: ${parsed.content.substring(0, 200)}...`);
                }
            } catch (e) {}
        }
    }
}

main();
