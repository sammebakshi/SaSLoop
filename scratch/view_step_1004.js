const fs = require('fs');
const readline = require('readline');
const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\e546bfa7-bc22-484d-95b1-d3920d26ba0c\\.system_generated\\logs\\transcript.jsonl';

async function main() {
    if (!fs.existsSync(logPath)) {
        console.log('No log path');
        return;
    }
    const rl = readline.createInterface({
        input: fs.createReadStream(logPath),
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        try {
            const step = JSON.parse(line);
            if (step.step_index === 1004) {
                console.log('Step 1004 keys in args:');
                if (step.tool_calls) {
                    step.tool_calls.forEach(tc => {
                        console.log(`  Tool: ${tc.name}`);
                        console.log('  Args keys:', Object.keys(tc.args));
                        console.log('  ReplacementChunks type:', typeof tc.args.ReplacementChunks);
                        if (typeof tc.args.ReplacementChunks === 'string') {
                            const parsed = JSON.parse(tc.args.ReplacementChunks);
                            console.log('  Parsed length:', parsed.length);
                            console.log('  First chunk:', parsed[0]);
                        } else if (Array.isArray(tc.args.ReplacementChunks)) {
                            console.log('  Array length:', tc.args.ReplacementChunks.length);
                            console.log('  First chunk:', tc.args.ReplacementChunks[0]);
                        }
                    });
                }
            }
        } catch (e) {
            console.log('Error parsing:', e);
        }
    }
}
main();
