const fs = require('fs');
const path = require('path');
const readline = require('readline');

const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';

async function main() {
    const folders = fs.readdirSync(brainDir);
    const lines = {};
    let maxLine = 0;

    for (const folder of folders) {
        const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
        if (fs.existsSync(logPath)) {
            const fileStream = fs.createReadStream(logPath);
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            for await (const line of rl) {
                if (line.includes('BillingScreen.kt') && line.includes('VIEW_FILE')) {
                    try {
                        const parsed = JSON.parse(line);
                        if (parsed.type === 'VIEW_FILE' && parsed.status === 'DONE') {
                            const content = parsed.content || '';
                            const totalMatch = content.match(/Total Lines: (\d+)/);
                            const totalLines = totalMatch ? parseInt(totalMatch[1]) : 0;
                            
                            // We combine versions between 4400 and 4610
                            if (totalLines >= 4400 && totalLines <= 4610) {
                                const matches = content.match(/(\d+): (.*)/g);
                                if (matches) {
                                    for (const match of matches) {
                                        const idx = match.indexOf(':');
                                        const num = parseInt(match.slice(0, idx));
                                        const text = match.slice(idx + 2);
                                        lines[num] = text;
                                        if (num > maxLine) maxLine = num;
                                    }
                                }
                            }
                        }
                    } catch (e) {}
                }
            }
        }
    }

    console.log(`Max line found: ${maxLine}`);
    const missing = [];
    for (let i = 1; i <= 4467; i++) {
        if (lines[i] === undefined) {
            missing.push(i);
        }
    }
    console.log(`Missing lines in combined: ${missing.length}`);
    if (missing.length > 0) {
        console.log(`First 50 missing: ${missing.slice(0, 50).join(', ')}`);
    }
}

main();
