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
        if (line.includes('"step_index":2356,') || line.includes('"step_index": 2356,')) {
            try {
                const parsed = JSON.parse(line);
                console.log(`Step ${parsed.step_index}: source = ${parsed.source}, type = ${parsed.type}`);
                if (parsed.tool_calls) {
                    parsed.tool_calls.forEach(tc => {
                        console.log(`  Tool call: ${tc.name}`);
                        console.log(`  Instruction: ${tc.args.Instruction}`);
                        console.log(`  Description: ${tc.args.Description}`);
                        console.log(`  TargetContent length: ${tc.args.TargetContent ? tc.args.TargetContent.length : 0}`);
                        console.log(`  ReplacementContent length: ${tc.args.ReplacementContent ? tc.args.ReplacementContent.length : 0}`);
                    });
                }
            } catch (e) {
                console.error("Error parsing JSON:", e.message);
            }
            break;
        }
    }
}

main();
