const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\c128cc3f-394c-4d5f-8471-2201f6e29d9e\\.system_generated\\logs\\transcript.jsonl';

async function search() {
    if (!fs.existsSync(logPath)) {
        console.log("Yesterday's log file does not exist at " + logPath);
        return;
    }
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        try {
            const parsed = JSON.parse(line);
            if (parsed.tool_calls) {
                for (const tc of parsed.tool_calls) {
                    if (tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content' || tc.name === 'write_to_file') {
                        const args = tc.args || {};
                        const file = args.TargetFile || args.targetFile || '';
                        if (file.includes('App.jsx')) {
                            console.log(`Step: ${parsed.step_index}, Time: ${parsed.created_at}, Tool: ${tc.name}`);
                            console.log(`  Desc: ${args.Description || args.description}`);
                        }
                    }
                }
            }
        } catch (e) {}
    }
    console.log("Done searching yesterday's transcript.");
}

search();
