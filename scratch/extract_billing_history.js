const fs = require('fs');
const path = require('path');
const readline = require('readline');

const logs = [
    'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\e546bfa7-bc22-484d-95b1-d3920d26ba0c\\.system_generated\\logs\\transcript.jsonl',
    'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl'
];

async function scanLogs() {
    for (const logPath of logs) {
        if (!fs.existsSync(logPath)) {
            console.log('Log not found:', logPath);
            continue;
        }
        console.log('Scanning log:', logPath);
        const fileStream = fs.createReadStream(logPath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        let lineIndex = 0;
        for await (const line of rl) {
            lineIndex++;
            if (line.includes('BillingScreen.kt') && (line.includes('multi_replace_file_content') || line.includes('replace_file_content') || line.includes('write_to_file'))) {
                try {
                    const parsed = JSON.parse(line);
                    if (parsed.tool_calls) {
                        for (let tcIndex = 0; tcIndex < parsed.tool_calls.length; tcIndex++) {
                            const tc = parsed.tool_calls[tcIndex];
                            if (tc.name === 'multi_replace_file_content' || tc.name === 'replace_file_content' || tc.name === 'write_to_file') {
                                const target = tc.args.TargetFile || tc.args.Target || '';
                                if (target.includes('BillingScreen.kt')) {
                                    console.log(`[FOUND] Step ${parsed.step_index} (Line ${lineIndex}) in ${path.basename(logPath)}: Tool: ${tc.name}`);
                                    const outPath = `scratch/edit_${path.basename(logPath, '.jsonl')}_step_${parsed.step_index}_tc_${tcIndex}.json`;
                                    fs.writeFileSync(outPath, JSON.stringify({
                                        step_index: parsed.step_index,
                                        tool: tc.name,
                                        description: tc.args.Description || '',
                                        instruction: tc.args.Instruction || '',
                                        chunks: tc.args.ReplacementChunks || tc.args.ReplacementContent || ''
                                    }, null, 2), 'utf8');
                                    console.log(`  Wrote to ${outPath}`);
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.log(`  Failed parsing line ${lineIndex}:`, e.message);
                }
            }
        }
    }
    console.log('Finished scanning.');
}

scanLogs();
