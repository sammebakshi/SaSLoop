const fs = require('fs');
const path = require('path');
const readline = require('readline');

const logs = [
    'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\e546bfa7-bc22-484d-95b1-d3920d26ba0c\\.system_generated\\logs\\transcript.jsonl',
    'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\1c6e8f20-aa98-4f94-8e42-a5256dcdb5cb\\.system_generated\\logs\\transcript.jsonl',
    'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl'
];

async function scanLog(logPath) {
    if (!fs.existsSync(logPath)) {
        console.log('Log does not exist:', logPath);
        return;
    }
    console.log('Scanning log:', logPath);
    const rl = readline.createInterface({
        input: fs.createReadStream(logPath),
        crlfDelay: Infinity
    });

    let lineNum = 0;
    for await (const line of rl) {
        lineNum++;
        if (line.includes('BillingScreen.kt') || line.includes('fun MenuSubTab')) {
            try {
                const step = JSON.parse(line);
                if (step.tool_calls) {
                    for (const tc of step.tool_calls) {
                        if (tc.name === 'write_to_file' || tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
                            const args = tc.args;
                            if (args.TargetFile && args.TargetFile.includes('BillingScreen.kt')) {
                                const code = args.CodeContent || args.ReplacementContent;
                                if (code) {
                                    console.log(`[Line ${lineNum}] Found write to BillingScreen.kt in step ${step.step_index}. Length: ${code.length}`);
                                    const outPath = `scratch/backup_billing_screen_step_${step.step_index}.kt`;
                                    fs.writeFileSync(outPath, code, 'utf8');
                                    console.log(`  Wrote to ${outPath}`);
                                } else if (args.ReplacementChunks) {
                                    console.log(`[Line ${lineNum}] Found multi_replace to BillingScreen.kt in step ${step.step_index}. Num chunks: ${args.ReplacementChunks.length}`);
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                // Parse errors
            }
        }
    }
}

async function main() {
    for (const log of logs) {
        await scanLog(log);
    }
    console.log('Scan completed.');
}

main();
