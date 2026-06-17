const fs = require('fs');
const path = require('path');
const readline = require('readline');

const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';

async function scan() {
    const folders = fs.readdirSync(brainDir);
    
    // We will group line collections by file length
    const versions = {};

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
                            if (totalMatch) {
                                const totalLines = parseInt(totalMatch[1]);
                                if (!versions[totalLines]) {
                                    versions[totalLines] = {};
                                }
                                const matches = content.match(/(\d+): (.*)/g);
                                if (matches) {
                                    for (const match of matches) {
                                        const idx = match.indexOf(':');
                                        const num = parseInt(match.slice(0, idx));
                                        const text = match.slice(idx + 2);
                                        versions[totalLines][num] = text;
                                    }
                                }
                            }
                        }
                    } catch (e) {}
                }
            }
        }
    }

    // Now check completeness for each version size > 3000
    Object.keys(versions).map(Number).sort((a, b) => b - a).forEach(totalLines => {
        if (totalLines < 2000) return;
        const lines = versions[totalLines];
        const lineNums = Object.keys(lines).map(Number);
        let maxLine = 0;
        lineNums.forEach(n => {
            if (n > maxLine) maxLine = n;
        });

        const missing = [];
        for (let i = 1; i <= totalLines; i++) {
            if (lines[i] === undefined) {
                missing.push(i);
            }
        }

        console.log(`Version size ${totalLines}: max line found = ${maxLine}, unique lines collected = ${lineNums.length}, missing = ${missing.length}`);
        if (missing.length === 0) {
            console.log(`  ==> 100% COMPLETE! Reconstructed size ${totalLines}`);
            const fileContent = [];
            for (let i = 1; i <= totalLines; i++) {
                fileContent.push(lines[i]);
            }
            fs.writeFileSync(`scratch/reconstructed_v${totalLines}.kt`, fileContent.join('\n'), 'utf8');
        }
    });
}

scan();
