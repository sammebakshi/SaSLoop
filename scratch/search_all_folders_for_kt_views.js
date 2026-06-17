const fs = require('fs');
const path = require('path');
const readline = require('readline');

const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';

async function scan() {
    const folders = fs.readdirSync(brainDir);
    for (const folder of folders) {
        const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
        if (fs.existsSync(logPath)) {
            const fileStream = fs.createReadStream(logPath);
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            let viewCount = 0;
            const lineCounts = new Set();
            for await (const line of rl) {
                if (line.includes('BillingScreen.kt') && line.includes('VIEW_FILE')) {
                    try {
                        const parsed = JSON.parse(line);
                        if (parsed.type === 'VIEW_FILE' && parsed.status === 'DONE') {
                            const content = parsed.content || '';
                            const totalMatch = content.match(/Total Lines: (\d+)/);
                            if (totalMatch) {
                                lineCounts.add(parseInt(totalMatch[1]));
                            }
                            viewCount++;
                        }
                    } catch (e) {}
                }
            }
            if (viewCount > 0) {
                console.log(`Folder ${folder}: ${viewCount} views, line counts in views: ${Array.from(lineCounts).join(', ')}`);
            }
        }
    }
}

scan();
