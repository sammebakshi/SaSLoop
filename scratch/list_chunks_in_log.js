const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
    input: fs.createReadStream(logPath),
    crlfDelay: Infinity
});

let stepCount = 0;
rl.on('line', (line) => {
    stepCount++;
    if (line.includes('MenuSubTab') || line.includes('KotSubTab') || line.includes('BillingSubTab')) {
        try {
            const data = JSON.parse(line);
            console.log(`Line ${stepCount}: Step ${data.step_index} [${data.type || ''}] [${data.source || ''}]`);
            // Check if there are tool calls that might have the replacement content
            if (data.tool_calls) {
                data.tool_calls.forEach((tc, idx) => {
                    const argStr = JSON.stringify(tc.args);
                    if (argStr.includes('MenuSubTab') || argStr.includes('KotSubTab') || argStr.includes('BillingSubTab')) {
                        console.log(`  -> Found in tool call ${tc.name}!`);
                        if (tc.args.ReplacementContent) {
                            console.log(`    ReplacementContent length: ${tc.args.ReplacementContent.length}`);
                            fs.writeFileSync(`scratch/tool_replacement_${data.step_index}_${idx+1}.txt`, tc.args.ReplacementContent, 'utf8');
                            console.log(`    Wrote to scratch/tool_replacement_${data.step_index}_${idx+1}.txt`);
                        }
                        if (tc.args.ReplacementChunks) {
                            console.log(`    ReplacementChunks length: ${tc.args.ReplacementChunks.length}`);
                            fs.writeFileSync(`scratch/tool_chunks_${data.step_index}_${idx+1}.txt`, typeof tc.args.ReplacementChunks === 'string' ? tc.args.ReplacementChunks : JSON.stringify(tc.args.ReplacementChunks), 'utf8');
                            console.log(`    Wrote to scratch/tool_chunks_${data.step_index}_${idx+1}.txt`);
                        }
                    }
                });
            }
            if (data.content && (data.content.includes('MenuSubTab') || data.content.includes('KotSubTab') || data.content.includes('BillingSubTab'))) {
                console.log(`  -> Found in content! Length: ${data.content.length}`);
                fs.writeFileSync(`scratch/content_${data.step_index}.txt`, data.content, 'utf8');
                console.log(`  Wrote to scratch/content_${data.step_index}.txt`);
            }
        } catch (e) {
            // ignore
        }
    }
});
