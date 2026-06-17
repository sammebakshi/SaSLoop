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
                    
                    if (totalLines === 2455) {
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
    
    // Check missing lines from 1 to 2455
    const missing = [];
    for (let i = 1; i <= 2455; i++) {
        if (lines[i] === undefined) {
            missing.push(i);
        }
    }

    console.log(`Missing lines in 2455 version: ${missing.length}`);
    if (missing.length > 0) {
        console.log(`First 100 missing lines: ${missing.slice(0, 100).join(', ')}...`);
    } else {
        console.log("Successfully reconstructed 100% of the 2455 version!");
        const contentArray = [];
        for (let i = 1; i <= 2455; i++) {
            contentArray.push(lines[i]);
        }
        fs.writeFileSync('scratch/reconstructed_2455.kt', contentArray.join('\n'), 'utf8');
        console.log("Saved reconstructed file to scratch/reconstructed_2455.kt");
    }
}

main();
