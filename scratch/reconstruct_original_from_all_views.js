const fs = require('fs');
const path = require('path');
const readline = require('readline');

const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';

async function main() {
    const folders = fs.readdirSync(brainDir);
    const lines = {};
    let maxLineNum = 0;

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
                            // We only collect lines from versions of the file that represent the original state (around 4402 lines)
                            if (totalLines >= 4350 && totalLines <= 4425) {
                                const matches = content.match(/(\d+): (.*)/g);
                                if (matches) {
                                    for (const match of matches) {
                                        const idx = match.indexOf(':');
                                        const num = parseInt(match.slice(0, idx));
                                        const text = match.slice(idx + 2);
                                        lines[num] = text;
                                        if (num > maxLineNum) maxLineNum = num;
                                    }
                                }
                            }
                        }
                    } catch (e) {}
                }
            }
        }
    }

    console.log(`Max line found in views: ${maxLineNum}`);
    
    // Count missing lines from 1 to 4402
    const targetLineCount = 4402;
    const missing = [];
    for (let i = 1; i <= targetLineCount; i++) {
        if (lines[i] === undefined) {
            missing.push(i);
        }
    }

    console.log(`Missing lines out of ${targetLineCount}: ${missing.length}`);
    if (missing.length > 0) {
        console.log(`First 100 missing lines: ${missing.slice(0, 100).join(', ')}...`);
    } else {
        console.log("Successfully reconstructed 100% of the original BillingScreen.kt!");
        // Write the reconstructed file
        const fileContent = [];
        for (let i = 1; i <= targetLineCount; i++) {
            fileContent.push(lines[i]);
        }
        fs.writeFileSync('scratch/reconstructed_original_BillingScreen.kt', fileContent.join('\n'), 'utf8');
        console.log("Saved reconstructed original file to scratch/reconstructed_original_BillingScreen.kt");
    }
}

main();
