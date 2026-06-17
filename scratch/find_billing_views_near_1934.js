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
                if (parsed.step_index >= 1700 && parsed.step_index <= 2200) {
                    if (parsed.type === 'VIEW_FILE' && parsed.status === 'DONE') {
                        const content = parsed.content || '';
                        const totalMatch = content.match(/Total Lines: (\d+)/);
                        console.log(`Step ${parsed.step_index}: VIEW_FILE - Total Lines = ${totalMatch ? totalMatch[1] : 0}`);
                    }
                    if (parsed.tool_calls) {
                        for (const tc of parsed.tool_calls) {
                            if (tc.name === 'write_to_file' || tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
                                const args = tc.args || {};
                                if (args.TargetFile && args.TargetFile.includes('BillingScreen.kt')) {
                                    console.log(`Step ${parsed.step_index}: WRITE - Tool = ${tc.name}, Description = ${args.Description}`);
                                }
                            }
                        }
                    }
                }
            } catch (e) {}
        }
    }
}

main();
