const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

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
                    
                    if (totalLines === 4467 || totalLines === 4468) {
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

    console.log(`Max line found in views for 4467/4468: ${maxLine}`);
    
    // Check missing lines from 1 to 4467
    const missing = [];
    for (let i = 1; i <= 4467; i++) {
        if (lines[i] === undefined) {
            missing.push(i);
        }
    }

    console.log(`Missing lines in 4467/4468 version: ${missing.length}`);
    if (missing.length > 0) {
        console.log(`First 100 missing lines: ${missing.slice(0, 100).join(', ')}...`);
    } else {
        console.log("Successfully reconstructed 100% of the 4467 version!");
        const contentArray = [];
        for (let i = 1; i <= 4467; i++) {
            contentArray.push(lines[i]);
        }
        fs.writeFileSync('scratch/reconstructed_v4467.kt', contentArray.join('\n'), 'utf8');
        console.log("Saved reconstructed file to scratch/reconstructed_v4467.kt");
    }
}

main();
