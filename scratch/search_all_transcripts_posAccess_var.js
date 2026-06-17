const fs = require('fs');
const path = require('path');
const readline = require('readline');

const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';

async function scan() {
    const folders = fs.readdirSync(brainDir);
    const results = [];

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
                            if (tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
                                const args = tc.args || {};
                                const contentStr = JSON.stringify(args);
                                if (contentStr.includes('posAccess =') || contentStr.includes('posAccess?') || contentStr.includes('const [posAccess')) {
                                    results.push({
                                        folder: folder,
                                        step: parsed.step_index,
                                        time: parsed.created_at,
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

    results.sort((a, b) => new Date(a.time) - new Date(b.time));
    console.log(`Found ${results.length} occurrences of posAccess variable:`);
    results.forEach(r => {
        console.log(`[${r.time}] Folder: ${r.folder}, Step: ${r.step}, Desc: ${r.desc}`);
    });
}

scan();
