const fs = require('fs');
const path = require('path');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

async function reconstruct() {
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const lines = {};
    let maxLine = 0;

    for await (const line of rl) {
        if (line.includes('VIEW_FILE') && line.includes('BillingScreen.kt')) {
            try {
                const parsed = JSON.parse(line);
                const content = parsed.content || '';
                // Parse lines like "123: original line"
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
            } catch (e) {
                // ignore
            }
        }
    }

    console.log(`Max line found: ${maxLine}`);
    const missing = [];
    for (let i = 1; i <= maxLine; i++) {
        if (lines[i] === undefined) {
            missing.push(i);
        }
    }
    console.log(`Missing lines count: ${missing.length}`);
    if (missing.length > 0) {
        console.log(`Missing lines: ${missing.slice(0, 50).join(', ')}...`);
    } else {
        console.log("Reconstructed 100% of BillingScreen.kt!");
        // Write the reconstructed file to scratch/reconstructed_original_BillingScreen.kt
        const fileContent = [];
        for (let i = 1; i <= maxLine; i++) {
            fileContent.push(lines[i]);
        }
        fs.writeFileSync('scratch/reconstructed_original_BillingScreen.kt', fileContent.join('\n'), 'utf8');
        console.log("Saved to scratch/reconstructed_original_BillingScreen.kt");
    }
}

reconstruct();
