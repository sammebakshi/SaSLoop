const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\e546bfa7-bc22-484d-95b1-d3920d26ba0c\\.system_generated\\logs\\transcript.jsonl';

async function main() {
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lineNum = 0;
    for await (const line of rl) {
        lineNum++;
        try {
            const data = JSON.parse(line);
            if (data.tool_calls) {
                data.tool_calls.forEach(tc => {
                    if (tc.name === 'write_to_file' || tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
                        const target = tc.args.TargetFile || tc.args.AbsolutePath || '';
                        if (target.includes('BillingScreen')) {
                            console.log(`Step ${data.step_index}: tool call ${tc.name}`);
                            console.log(`  Description: ${tc.args.Description}`);
                            console.log(`  Instruction: ${tc.args.Instruction}`);
                        }
                    }
                });
            }
        } catch (e) {}
    }
}

main();
