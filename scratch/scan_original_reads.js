const fs = require('fs');
const path = require('path');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

async function main() {
    if (!fs.existsSync(logPath)) {
        console.log('Log does not exist:', logPath);
        return;
    }
    const rl = readline.createInterface({
        input: fs.createReadStream(logPath),
        crlfDelay: Infinity
    });

    let lineNum = 0;
    for await (const line of rl) {
        lineNum++;
        if (line.includes('BillingScreen.kt') && line.includes('view_file')) {
            try {
                const step = JSON.parse(line);
                console.log(`[Line ${lineNum}] Step ${step.step_index} (${step.type}):`);
                if (step.tool_calls) {
                    for (const tc of step.tool_calls) {
                        if (tc.name === 'view_file') {
                            console.log(`  Call args:`, tc.args);
                        }
                    }
                }
                if (step.status === 'DONE' && step.type === 'VIEW_FILE') {
                    console.log(`  Response length: ${step.content ? step.content.length : 0}`);
                }
            } catch (e) {
                // Ignore parse errors
            }
        }
    }
}

main();
