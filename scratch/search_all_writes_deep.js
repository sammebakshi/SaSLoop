const fs = require('fs');
const path = require('path');
const readline = require('readline');

const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';

async function main() {
    const folders = fs.readdirSync(brainDir);
    for (const folder of folders) {
        const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
        if (!fs.existsSync(logPath)) continue;
        
        const fileStream = fs.createReadStream(logPath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of rl) {
            try {
                const data = JSON.parse(line);
                if (data.tool_calls) {
                    data.tool_calls.forEach(tc => {
                        if (tc.name === 'write_to_file' || tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
                            const code = tc.args.CodeContent || tc.args.ReplacementContent || '';
                            if (code.includes('fun MenuItemCard') || code.includes('fun TableCard') || code.includes('fun ReceiptRow')) {
                                console.log(`Folder: ${folder}, Step: ${data.step_index}, Tool: ${tc.name}, Length: ${code.length}`);
                                // Find where fun MenuItemCard starts
                                const idx = code.indexOf('fun MenuItemCard');
                                if (idx !== -1) {
                                    console.log(`  MenuItemCard snippet: ${code.slice(idx, idx + 400).replace(/\n/g, '\\n')}`);
                                }
                                const idxTable = code.indexOf('fun TableCard');
                                if (idxTable !== -1) {
                                    console.log(`  TableCard snippet: ${code.slice(idxTable, idxTable + 400).replace(/\n/g, '\\n')}`);
                                }
                            }
                        }
                    });
                }
            } catch (e) {}
        }
    }
}

main();
