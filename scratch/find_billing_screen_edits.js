const fs = require('fs');
const readline = require('readline');

const logFilePath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

async function search() {
    const fileStream = fs.createReadStream(logFilePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lineNum = 0;
    for await (const line of rl) {
        lineNum++;
        if (line.includes('BillingScreen.kt') && (line.includes('replace_file_content') || line.includes('multi_replace_file_content') || line.includes('write_to_file'))) {
            try {
                const parsed = JSON.parse(line);
                console.log(`Line ${lineNum}: Step Index ${parsed.step_index}, Source: ${parsed.source}, Type: ${parsed.type}`);
                
                if (parsed.tool_calls) {
                    for (const tc of parsed.tool_calls) {
                        if (tc.name.includes('replace_file_content') || tc.name.includes('write_to_file')) {
                            console.log(`Tool: ${tc.name}`);
                            if (tc.args.TargetFile && tc.args.TargetFile.includes('BillingScreen.kt')) {
                                console.log(`TargetFile: ${tc.args.TargetFile}`);
                                console.log(`Instruction: ${tc.args.Instruction}`);
                                console.log(`Description: ${tc.args.Description}`);
                                // Write target/replacement chunks to temporary files so we can read them
                                const chunksFile = `scratch/edit_step_${parsed.step_index}.json`;
                                fs.writeFileSync(chunksFile, JSON.stringify(tc.args, null, 2), 'utf8');
                                console.log(`Wrote edit args to ${chunksFile}`);
                            }
                        }
                    }
                }
                console.log('--------------------------------------------------');
            } catch (e) {
                // ignore
            }
        }
    }
}

search();
