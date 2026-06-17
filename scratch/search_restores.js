const fs = require('fs');
const path = require('path');
const readline = require('readline');

const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';

async function searchTranscripts() {
    const folders = fs.readdirSync(brainDir);
    for (const folder of folders) {
        const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
        if (fs.existsSync(logPath)) {
            const fileStream = fs.createReadStream(logPath);
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            let lineNum = 0;
            for await (const line of rl) {
                lineNum++;
                if (line.includes('restore_billing_screen.js') || line.includes('decompiled_BillingScreenKt') || line.includes('recover_billing_screen.js')) {
                    try {
                        const parsed = JSON.parse(line);
                        console.log(`Folder: ${folder}, Step: ${parsed.step_index}, Line: ${lineNum}`);
                        if (parsed.content) {
                            console.log(`  Content:`, parsed.content.slice(0, 400).replace(/\n/g, '\\n'));
                        }
                        if (parsed.tool_calls) {
                            console.log(`  Tool calls:`, parsed.tool_calls.map(tc => tc.name).join(', '));
                        }
                    } catch (e) {
                        // ignore
                    }
                }
            }
        }
    }
}

searchTranscripts();
