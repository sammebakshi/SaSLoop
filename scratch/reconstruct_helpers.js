const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\e546bfa7-bc22-484d-95b1-d3920d26ba0c\\.system_generated\\logs\\transcript.jsonl';

async function main() {
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const lines = {};
    let maxLine = 0;

    for await (const line of rl) {
        if (line.includes('BillingScreen.kt') && line.includes('VIEW_FILE')) {
            try {
                const parsed = JSON.parse(line);
                if (parsed.type === 'VIEW_FILE' && parsed.status === 'DONE') {
                    const content = parsed.content || '';
                    const totalMatch = content.match(/Total Lines: (\d+)/);
                    const totalLines = totalMatch ? parseInt(totalMatch[1]) : 0;
                    
                    // We target the 3822-line or 3823-line versions of the file
                    if (totalLines === 3822 || totalLines === 3823) {
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

    console.log(`Max line found in views: ${maxLine}`);
    
    // Check missing lines from 2450 to 3822
    const missing = [];
    for (let i = 2450; i <= 3822; i++) {
        if (lines[i] === undefined) {
            missing.push(i);
        }
    }

    console.log(`Missing lines in helper functions range (2450-3822): ${missing.length}`);
    if (missing.length > 0) {
        console.log(`First 50 missing lines: ${missing.slice(0, 50).join(', ')}...`);
    } else {
        console.log("Successfully reconstructed 100% of the helper functions!");
        const helpersContent = [];
        for (let i = 2450; i <= 3822; i++) {
            helpersContent.push(lines[i]);
        }
        fs.writeFileSync('scratch/reconstructed_helpers.kt', helpersContent.join('\n'), 'utf8');
        console.log("Saved helper functions to scratch/reconstructed_helpers.kt");
    }
}

main();
