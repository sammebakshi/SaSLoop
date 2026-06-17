const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

async function main() {
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const steps = [];
    for await (const line of rl) {
        steps.push(line);
    }

    console.log(`Total steps: ${steps.length}`);
    const last15 = steps.slice(-15);
    last15.forEach(line => {
        try {
            const parsed = JSON.parse(line);
            console.log(`Step ${parsed.step_index} [${parsed.type}] (${parsed.status}):`);
            if (parsed.content) {
                console.log(`  Content: ${parsed.content.substring(0, 300)}`);
            }
            if (parsed.tool_calls) {
                parsed.tool_calls.forEach(tc => {
                    console.log(`  Tool Call: ${tc.name}`);
                    if (tc.args && tc.args.Description) {
                        console.log(`    Desc: ${tc.args.Description}`);
                    }
                });
            }
            console.log('---');
        } catch (e) {}
    });
}

main();
