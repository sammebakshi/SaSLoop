const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

async function main() {
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        if (line.includes('BillingScreen.kt')) {
            try {
                const parsed = JSON.parse(line);
                let isWrite = false;
                let desc = '';
                let toolName = '';
                if (parsed.tool_calls) {
                    for (const tc of parsed.tool_calls) {
                        if (tc.name === 'write_to_file' || tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
                            const args = tc.args || {};
                            if (args.TargetFile && args.TargetFile.includes('BillingScreen.kt')) {
                                isWrite = true;
                                desc = args.Description || '';
                                toolName = tc.name;
                            }
                        }
                    }
                }
                if (isWrite) {
                    console.log(`Step ${parsed.step_index} at ${parsed.created_at}: ${toolName} - ${desc}`);
                }
            } catch (e) {}
        }
    }
}

main();
