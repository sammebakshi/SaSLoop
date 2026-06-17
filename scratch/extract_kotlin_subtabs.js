const fs = require('fs');
const path = require('path');
const readline = require('readline');

const logs = [
    'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\e546bfa7-bc22-484d-95b1-d3920d26ba0c\\.system_generated\\logs\\transcript.jsonl',
    'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl'
];

async function searchLog(logPath) {
    if (!fs.existsSync(logPath)) {
        console.log('Log path does not exist:', logPath);
        return;
    }
    console.log('Searching log:', logPath);
    
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let stepIndex = 0;
    for await (const line of rl) {
        stepIndex++;
        if (line.includes('fun MenuSubTab') || line.includes('fun KotSubTab') || line.includes('fun BillingSubTab')) {
            try {
                const step = JSON.parse(line);
                console.log(`Match at line ${stepIndex}, step ${step.step_index}, type ${step.type}`);
                
                // Inspect tool_calls
                if (step.tool_calls) {
                    for (const tc of step.tool_calls) {
                        if (tc.name === 'write_to_file' || tc.name === 'replace_file_content') {
                            const code = tc.args.CodeContent || tc.args.ReplacementContent;
                            if (code && (code.includes('fun MenuSubTab') || code.includes('fun KotSubTab') || code.includes('fun BillingSubTab'))) {
                                console.log(`  -> Found in tool call ${tc.name} arguments! Length: ${code.length}`);
                                if (code.length > 5000) {
                                    const outPath = `scratch/extracted_code_step_${step.step_index}_${tc.name}.kt`;
                                    fs.writeFileSync(outPath, code, 'utf8');
                                    console.log(`  Wrote to ${outPath}`);
                                }
                            }
                        }
                    }
                }
                
                // Inspect content
                if (step.content && step.content.length > 5000 && (step.content.includes('fun MenuSubTab') || step.content.includes('fun KotSubTab') || step.content.includes('fun BillingSubTab'))) {
                    console.log(`  -> Found in content! Length: ${step.content.length}`);
                    const outPath = `scratch/extracted_content_step_${step.step_index}.txt`;
                    fs.writeFileSync(outPath, step.content, 'utf8');
                    console.log(`  Wrote to ${outPath}`);
                }
            } catch (e) {
                // Ignore parse errors
            }
        }
    }
}

async function main() {
    for (const log of logs) {
        await searchLog(log);
    }
    console.log('Done searching logs.');
}

main();
