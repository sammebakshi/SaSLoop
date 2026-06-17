const fs = require('fs');
const path = require('path');
const readline = require('readline');

const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';

async function scan() {
    const folders = fs.readdirSync(brainDir);
    console.log(`Found ${folders.length} conversation folders.`);

    for (const folder of folders) {
        const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
        if (!fs.existsSync(logPath)) continue;

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
                    // Check if it's a tool call
                    if (parsed.tool_calls) {
                        for (const tc of parsed.tool_calls) {
                            if (tc.name === 'write_to_file' || tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
                                const args = tc.args || {};
                                if (args.TargetFile && args.TargetFile.includes('BillingScreen.kt')) {
                                    console.log(`WRITE FOUND in ${folder} (line ${lineNum}, step ${parsed.step_index}):`);
                                    console.log(`  Tool: ${tc.name}`);
                                    console.log(`  Description: ${args.Description || 'None'}`);
                                    if (tc.name === 'write_to_file') {
                                        console.log(`  CodeContent Length: ${args.CodeContent ? args.CodeContent.length : 0}`);
                                    } else if (tc.name === 'replace_file_content') {
                                        console.log(`  Replacement Length: ${args.ReplacementContent ? args.ReplacementContent.length : 0}`);
                                        console.log(`  TargetContent Length: ${args.TargetContent ? args.TargetContent.length : 0}`);
                                        console.log(`  Lines: ${args.StartLine} - ${args.EndLine}`);
                                    } else if (tc.name === 'multi_replace_file_content') {
                                        console.log(`  Chunks count: ${args.ReplacementChunks ? args.ReplacementChunks.length : 0}`);
                                    }
                                    console.log('---');
                                }
                            }
                        }
                    }
                } catch (e) {
                    // ignore
                }
            }
        }
    }
    console.log('Done scanning.');
}

scan();
