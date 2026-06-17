const fs = require('fs');
const path = require('path');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\e546bfa7-bc22-484d-95b1-d3920d26ba0c\\.system_generated\\logs\\transcript.jsonl';

async function main() {
    if (!fs.existsSync(logPath)) {
        console.error('Log file not found');
        return;
    }

    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lineNum = 0;
    for await (const line of rl) {
        lineNum++;
        if (line.includes('BillingScreen.kt')) {
            try {
                const parsed = JSON.parse(line);
                if (parsed.type === 'VIEW_FILE' && parsed.status === 'DONE') {
                    const content = parsed.content || '';
                    const totalMatch = content.match(/Total Lines: (\d+)/);
                    const totalLines = totalMatch ? parseInt(totalMatch[1]) : 0;
                    console.log(`VIEW_FILE at line ${lineNum}, step ${parsed.step_index}: Total Lines = ${totalLines}`);
                }
                if (parsed.tool_calls) {
                    for (const tc of parsed.tool_calls) {
                        if (tc.name === 'write_to_file' || tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
                            const args = tc.args || {};
                            if (args.TargetFile && args.TargetFile.includes('BillingScreen.kt')) {
                                console.log(`WRITE at line ${lineNum}, step ${parsed.step_index}: Tool = ${tc.name}, Description = ${args.Description || ''}`);
                            }
                        }
                    }
                }
            } catch (e) {}
        }
    }
}

main();
