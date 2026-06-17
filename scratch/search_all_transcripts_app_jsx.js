const fs = require('fs');
const path = require('path');
const readline = require('readline');

const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';

async function scan() {
    const folders = fs.readdirSync(brainDir);
    const edits = [];

    for (const folder of folders) {
        const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
        if (fs.existsSync(logPath)) {
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
                                    edits.push({
                                        folder: folder,
                                        step: parsed.step_index,
                                        time: parsed.created_at,
                                        tool: tc.name,
                                        desc: args.Description || args.description || ''
                                    });
                                }
                            }
                        }
                    }
                } catch (e) {}
            }
        }
    }

    // Sort edits by time
    edits.sort((a, b) => new Date(a.time) - new Date(b.time));

    console.log(`Found ${edits.length} edits to App.jsx across all conversations:`);
    edits.forEach(e => {
        console.log(`[${e.time}] Folder: ${e.folder}, Step: ${e.step}, Tool: ${e.tool}`);
        console.log(`  Desc: ${e.desc}`);
    });
}

scan();
