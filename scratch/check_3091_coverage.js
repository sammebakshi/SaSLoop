const fs = require('fs');
const path = require('path');
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
        if (line.includes('VIEW_FILE') && line.includes('BillingScreen.kt')) {
            try {
                const parsed = JSON.parse(line);
                if (parsed.type === 'VIEW_FILE' && parsed.status === 'DONE') {
                    const content = parsed.content || '';
                    const totalMatch = content.match(/Total Lines: (\d+)/);
                    const totalLines = totalMatch ? parseInt(totalMatch[1]) : 0;
                    
                    if (totalLines === 3091) {
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

    console.log(`Max line found: ${maxLine}`);
    const missing = [];
    for (let i = 1; i <= 3091; i++) {
        if (lines[i] === undefined) {
            missing.push(i);
        }
    }
    console.log(`Missing lines in 3091 version: ${missing.length}`);
    if (missing.length > 0) {
        console.log(`First 100 missing: ${missing.slice(0, 100).join(', ')}...`);
    } else {
        console.log("Successfully reconstructed 100% of the 3091-line BillingScreen.kt!");
        const fileContent = [];
        for (let i = 1; i <= 3091; i++) {
            fileContent.push(lines[i]);
        }
        fs.writeFileSync('sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/BillingScreen.kt', fileContent.join('\n'), 'utf8');
        console.log("Restored BillingScreen.kt to sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/BillingScreen.kt");
    }
}

main();
